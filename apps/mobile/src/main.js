import { DEFAULT_VIDEO_LAYOUT, getPlayerPhotoUrl } from '@kia-maker/shared';
import './styles.css';

const state = {
  serverUrl: localStorage.getItem('serverUrl') || 'http://localhost:8787',
  playerName: '아데를린',
  title: 'KIA TIGERS',
  meta: 'VIDEO MAKER',
  videoFile: null,
  overlayBlob: null,
  resultUrl: ''
};

const app = document.querySelector('#app');

function render() {
  app.innerHTML = `
    <section class="shell">
      <header>
        <h1>KIA Maker</h1>
        <p>사진은 GitHub에서 가져오고, 영상만 서버에서 렌더링합니다.</p>
      </header>

      <label>영상 서버
        <input id="serverUrl" value="${state.serverUrl}" />
      </label>

      <label>선수
        <input id="playerName" value="${state.playerName}" />
      </label>

      <label>제목
        <input id="title" value="${state.title}" />
      </label>

      <label>메타
        <input id="meta" value="${state.meta}" />
      </label>

      <label>원본 영상
        <input id="videoFile" type="file" accept="video/*" />
      </label>

      <div class="preview">
        <canvas id="overlayCanvas" width="1080" height="1350"></canvas>
      </div>

      <div class="actions">
        <button id="drawOverlay" type="button">오버레이 만들기</button>
        <button id="renderVideo" type="button">서버 렌더링</button>
      </div>

      <p id="status"></p>
      ${state.resultUrl ? `<video class="result" src="${state.resultUrl}" controls></video>` : ''}
    </section>
  `;

  bind();
  drawOverlay();
}

function bind() {
  app.querySelector('#serverUrl').addEventListener('input', (event) => {
    state.serverUrl = event.target.value.trim();
    localStorage.setItem('serverUrl', state.serverUrl);
  });
  app.querySelector('#playerName').addEventListener('input', (event) => {
    state.playerName = event.target.value.trim();
    drawOverlay();
  });
  app.querySelector('#title').addEventListener('input', (event) => {
    state.title = event.target.value;
    drawOverlay();
  });
  app.querySelector('#meta').addEventListener('input', (event) => {
    state.meta = event.target.value;
    drawOverlay();
  });
  app.querySelector('#videoFile').addEventListener('change', (event) => {
    state.videoFile = event.target.files?.[0] || null;
  });
  app.querySelector('#drawOverlay').addEventListener('click', drawOverlay);
  app.querySelector('#renderVideo').addEventListener('click', renderVideoOnServer);
}

async function drawOverlay() {
  const canvas = app.querySelector('#overlayCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b80f22';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const photoUrl = getPlayerPhotoUrl(state.playerName, Date.now());
  if (photoUrl) {
    const image = await loadImage(photoUrl);
    const imageHeight = 880;
    const ratio = image.naturalWidth / image.naturalHeight;
    ctx.drawImage(image, 540 - (imageHeight * ratio) / 2, 290, imageHeight * ratio, imageHeight);
  }

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '800 78px system-ui, sans-serif';
  ctx.fillText(state.title, 540, 160);
  ctx.font = '600 44px system-ui, sans-serif';
  ctx.fillText(state.meta, 540, 1240);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  const frame = DEFAULT_VIDEO_LAYOUT.frame;
  ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);

  state.overlayBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function renderVideoOnServer() {
  const status = app.querySelector('#status');
  if (!state.videoFile) {
    status.textContent = '원본 영상을 선택해 주세요.';
    return;
  }
  if (!state.overlayBlob) await drawOverlay();

  status.textContent = '서버로 전송 중...';
  const body = new FormData();
  body.append('video', state.videoFile);
  body.append('overlay', state.overlayBlob, 'overlay.png');
  body.append('layout', JSON.stringify(DEFAULT_VIDEO_LAYOUT));

  const response = await fetch(`${state.serverUrl}/api/render-video`, {
    method: 'POST',
    body
  });
  if (!response.ok) {
    status.textContent = `렌더링 실패 (${response.status})`;
    return;
  }

  const payload = await response.json();
  state.resultUrl = `${state.serverUrl}${payload.videoUrl}`;
  status.textContent = '완료';
  render();
}

render();

