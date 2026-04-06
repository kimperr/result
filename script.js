const TEAM_DB = [
  { name: 'LG 트윈스', stadium: '잠실 야구장', code: 'lg' },
  { name: '두산 베어스', stadium: '잠실 야구장', code: 'doo' },
  { name: '키움 히어로즈', stadium: '고척 스카이돔', code: 'kiw' },
  { name: 'SSG 랜더스', stadium: '인천 SSG 랜더스필드', code: 'ssg' },
  { name: 'KT 위즈', stadium: '수원 KT위즈파크', code: 'kt' },
  { name: '한화 이글스', stadium: '대전 한화생명 볼파크', code: 'han' },
  { name: '롯데 자이언츠', stadium: '사직 야구장', code: 'lot' },
  { name: 'NC 다이노스', stadium: '창원 NC파크', code: 'nc' },
  { name: '삼성 라이온즈', stadium: '대구 삼성 라이온즈파크', code: 'sam' }
];

const BACKGROUND_BY_RESULT = {
  win: 'assets/bg-win.png',
  lose: 'assets/bg-lose.png',
  draw: 'assets/bg-draw.png'
};

const PLAYER_NUMBER_BY_NAME = {
  '곽도규': 0, '박정우': 1, '박민': 2, '김선빈': 3, '유지성': 4, '김도영': 5,
  '이창진': 8, '정해원': 9, '김태형': 10, '조상우': 11, '정현창': 12, '윤영철': 13,
  '김규성': 14, '박재현': 15, '윤도현': 16, '김현수(17)': 17, '윤중현': 19, '이준영': 20,
  '김사윤': 21, '주효상': 22, '최정용': 23, '한준수': 25, '카스트로': 26, '김호령': 27,
  '이형범': 28, '변우혁': 29, '한승연': 31, '데일': 32, '올러': 33, '황대인': 34,
  '김석환': 35, '이호연': 36, '김민규': 37, '장재혁': 38, '최지민': 39,
  '네일': 40, '황동하': 41, '김태군': 42, '김건국': 43, '이태양': 44, '정찬화': 45,
  '김정엽': 46, '나성범': 47, '이의리': 48, '김범수': 49, '박상준': 50, '전상현': 51,
  '홍건희': 52, '김기훈': 53, '양현종': 54, '한재승': 55, '오선우': 56, '고종욱': 57,
  '이성원': 58, '김도현': 60, '김시훈': 61, '정해영': 62, '이호민': 63, '김현수(64)': 64,
  '성영탁': 65, '이도현': 66, '홍민규': 67, '김대유': 69
};

const KIA_HOME_STADIUM = '광주 기아 챔피언스필드';

const RESULT_LAYOUT = {
  dateText: { x: 66, y: 354, size: 29 },
  opponentText: { x: 215, y: 354, size: 28 },
  stadiumText: { x: 66, y: 391, size: 29 },
  homeScoreText: { x: 285, y: 532, size: 140 },
  awayScoreText: { x: 285, y: 715, size: 140 },
  winnerText: { x: 127, y: 959, size: 33 },
  loserText: { x: 127, y: 1011, size: 33 },
  saveText: { x: 127, y: 1062, size: 33 },
  badgeWin: { x: 68, y: 957, size: 42, font: 31 },
  badgeLose: { x: 68, y: 1008, size: 42, font: 31 },
  badgeSave: { x: 68, y: 1059, size: 42, font: 31 },
  mvpNameText: { x: 252, y: 1120, size: 39 },
  mvpRecordText: { x: 359, y: 1135, size: 20 }
};

const LINEUP_LAYOUT = {
  dateText: { x: 66, y: 354, size: 29 },
  opponentText: { x: 228, y: 354, size: 28 },
  stadiumText: { x: 66, y: 391, size: 29 },
  names: {},
  positions: {},
  pitcher: { x: 135, y: 1144, size: 45 }
};
const LINEUP_FIXED = {
  nameX: 167,
  nameSize: 47,
  posX: 399,
  posSize: 49
};
const LINEUP_Y_VALUES = [
  480, 475,
  553, 548,
  624, 619,
  695, 690,
  768, 763,
  840, 835,
  912, 907,
  985, 980,
  1056, 1051
];

for (let i = 1; i <= 9; i += 1) {
  LINEUP_LAYOUT.names[i] = { x: LINEUP_FIXED.nameX, y: LINEUP_Y_VALUES[(i - 1) * 2], size: LINEUP_FIXED.nameSize };
  LINEUP_LAYOUT.positions[i] = { x: LINEUP_FIXED.posX, y: LINEUP_Y_VALUES[(i - 1) * 2 + 1], size: LINEUP_FIXED.posSize };
}

const el = {
  tabResult: document.getElementById('tabResult'),
  tabLineup: document.getElementById('tabLineup'),
  resultControls: document.getElementById('resultControls'),
  lineupControls: document.getElementById('lineupControls'),
  resultPoster: document.getElementById('resultPoster'),
  lineupPoster: document.getElementById('lineupPoster'),

  result: document.querySelectorAll('input[name="result"]'),
  kiaSide: document.querySelectorAll('input[name="kiaSide"]'),
  gameDate: document.getElementById('gameDate'),
  opponentTeam: document.getElementById('opponentTeam'),
  opponentName: document.getElementById('opponentName'),
  stadiumName: document.getElementById('stadiumName'),
  homeScore: document.getElementById('homeScore'),
  awayScore: document.getElementById('awayScore'),
  mvpName: document.getElementById('mvpName'),
  mvpRecord: document.getElementById('mvpRecord'),
  winnerName: document.getElementById('winnerName'),
  loserName: document.getElementById('loserName'),
  saveName: document.getElementById('saveName'),
  globalLetterSpacing: document.getElementById('globalLetterSpacing'),
  opponentXInput: document.getElementById('opponentXInput'),
  opponentYInput: document.getElementById('opponentYInput'),
  opponentXRange: document.getElementById('opponentXRange'),
  opponentYRange: document.getElementById('opponentYRange'),
  mvpRecordXInput: document.getElementById('mvpRecordXInput'),
  mvpRecordYInput: document.getElementById('mvpRecordYInput'),
  mvpRecordXRange: document.getElementById('mvpRecordXRange'),
  mvpRecordYRange: document.getElementById('mvpRecordYRange'),

  lineupDate: document.getElementById('lineupDate'),
  lineupKiaSide: document.querySelectorAll('input[name="lineupKiaSide"]'),
  lineupOpponentTeam: document.getElementById('lineupOpponentTeam'),
  lineupOpponentName: document.getElementById('lineupOpponentName'),
  lineupStadiumName: document.getElementById('lineupStadiumName'),
  lineupPitcherName: document.getElementById('lineupPitcherName'),
  lineupLetterSpacing: document.getElementById('lineupLetterSpacing'),
  lineupOpponentXInput: document.getElementById('lineupOpponentXInput'),
  lineupOpponentYInput: document.getElementById('lineupOpponentYInput'),
  lineupOpponentXRange: document.getElementById('lineupOpponentXRange'),
  lineupOpponentYRange: document.getElementById('lineupOpponentYRange'),
  lineupInputGrid: document.getElementById('lineupInputGrid'),

  downloadBtn: document.getElementById('downloadBtn')
};

const out = {
  backgroundLayer: document.getElementById('backgroundLayer'),
  playerPhoto: document.getElementById('playerPhoto'),
  kiaLogo: document.getElementById('kiaLogo'),
  oppLogo: document.getElementById('oppLogo'),
  dateText: document.getElementById('dateText'),
  opponentText: document.getElementById('opponentText'),
  stadiumText: document.getElementById('stadiumText'),
  homeScoreText: document.getElementById('homeScoreText'),
  awayScoreText: document.getElementById('awayScoreText'),
  winnerText: document.getElementById('winnerText'),
  loserText: document.getElementById('loserText'),
  saveText: document.getElementById('saveText'),
  badgeWin: document.getElementById('badgeWin'),
  badgeLose: document.getElementById('badgeLose'),
  badgeSave: document.getElementById('badgeSave'),
  mvpNameText: document.getElementById('mvpNameText'),
  mvpRecordText: document.getElementById('mvpRecordText'),

  lineupBgLayer: document.getElementById('lineupBgLayer'),
  lineupPlayerPhoto: document.getElementById('lineupPlayerPhoto'),
  lineupDateText: document.getElementById('lineupDateText'),
  lineupOpponentText: document.getElementById('lineupOpponentText'),
  lineupStadiumText: document.getElementById('lineupStadiumText'),
  lineupTextLayer: document.getElementById('lineupTextLayer'),
  lineupPitcherText: document.getElementById('lineupPitcherText'),
  resultMobilePreview: document.getElementById('resultMobilePreview'),
  lineupMobilePreview: document.getElementById('lineupMobilePreview')
};

let activeTab = 'result';
const lineupTextRefs = { names: {}, positions: {} };
let mobilePreviewTimer = null;

function selectedValue(radios) {
  return Array.from(radios).find((radio) => radio.checked)?.value;
}

function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${y}.${m}.${d}`;
}

function normalizeName(name) {
  return (name || '').replace(/\s+/g, '');
}

function getPlayerPhotoPath(name) {
  if (!normalizeName(name)) return '';
  const normalized = normalizeName(name);
  const matched = Object.keys(PLAYER_NUMBER_BY_NAME).find((key) => normalizeName(key) === normalized);
  return matched ? `assets/player/${PLAYER_NUMBER_BY_NAME[matched]}.png` : '';
}

function selectedTeamInfo(selectEl) {
  return TEAM_DB.find((team) => team.name === selectEl.value) || TEAM_DB[0];
}

function teamLogoFile(code, side, result) {
  if (side === 'away') return `assets/${code}1.png`;
  if (result === 'lose') return `assets/${code}3.png`;
  return `assets/${code}2.png`;
}

function applyText(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.fontSize = `${cfg.size}px`;
}

function applyBadge(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = `${cfg.size}px`;
  node.style.height = `${cfg.size}px`;
  node.style.lineHeight = `${cfg.size}px`;
  node.style.fontSize = `${cfg.font}px`;
}

function syncFineTunePair(numberInput, rangeInput) {
  if (!numberInput || !rangeInput) return;
  const syncFromNumber = () => {
    rangeInput.value = numberInput.value || rangeInput.min || '0';
  };
  const syncFromRange = () => {
    numberInput.value = rangeInput.value;
  };
  const clearTextFocus = () => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    if (active === rangeInput || active === numberInput) return;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
      active.blur();
    }
  };
  rangeInput.addEventListener('pointerdown', clearTextFocus);
  rangeInput.addEventListener('touchstart', clearTextFocus, { passive: true });
  numberInput.addEventListener('input', syncFromNumber);
  rangeInput.addEventListener('input', syncFromRange);
  syncFromNumber();
}

function isMobilePreviewMode() {
  return window.matchMedia('(max-width: 768px)').matches;
}

async function renderMobilePreview(tabName) {
  if (!window.html2canvas || !isMobilePreviewMode()) return;

  const poster = tabName === 'result' ? el.resultPoster : el.lineupPoster;
  const preview = tabName === 'result' ? out.resultMobilePreview : out.lineupMobilePreview;
  const posterCanvas = poster.querySelector('.poster-canvas');
  const images = tabName === 'result'
    ? [out.backgroundLayer, out.playerPhoto, out.kiaLogo, out.oppLogo]
    : [out.lineupBgLayer, out.lineupPlayerPhoto];

  const wasActive = poster.classList.contains('active');
  if (!wasActive) poster.classList.add('active');

  const prevPosterWidth = poster.style.width;
  const prevPosterHeight = poster.style.height;
  const prevPosterTransform = poster.style.transform;
  const prevCanvasPosition = posterCanvas?.style.position || '';
  const prevCanvasInset = posterCanvas?.style.inset || '';
  const prevCanvasWidth = posterCanvas?.style.width || '';
  const prevCanvasHeight = posterCanvas?.style.height || '';
  const prevCanvasTransform = posterCanvas?.style.transform || '';

  try {
    await document.fonts.ready;
    await Promise.all(images.map(waitForImageElement));

    // Capture from the full-size poster, not the mobile-scaled preview layout.
    poster.style.width = '1080px';
    poster.style.height = '1350px';
    poster.style.transform = 'none';
    if (posterCanvas) {
      posterCanvas.style.position = 'relative';
      posterCanvas.style.inset = 'auto';
      posterCanvas.style.width = '1080px';
      posterCanvas.style.height = '1350px';
      posterCanvas.style.transform = 'none';
    }

    const canvas = await html2canvas(poster, {
      useCORS: true,
      scale: 1,
      backgroundColor: null
    });
    preview.src = canvas.toDataURL('image/png', 1);
  } finally {
    poster.style.width = prevPosterWidth;
    poster.style.height = prevPosterHeight;
    poster.style.transform = prevPosterTransform;
    if (posterCanvas) {
      posterCanvas.style.position = prevCanvasPosition;
      posterCanvas.style.inset = prevCanvasInset;
      posterCanvas.style.width = prevCanvasWidth;
      posterCanvas.style.height = prevCanvasHeight;
      posterCanvas.style.transform = prevCanvasTransform;
    }
    if (!wasActive) poster.classList.remove('active');
  }
}

function scheduleMobilePreviewRender() {
  if (mobilePreviewTimer) clearTimeout(mobilePreviewTimer);
  mobilePreviewTimer = setTimeout(async () => {
    if (!isMobilePreviewMode()) return;
    await renderMobilePreview('result');
    await renderMobilePreview('lineup');
  }, 80);
}

function buildLineupInputs() {
  for (let i = 1; i <= 9; i += 1) {
    const row = document.createElement('div');
    row.className = 'lineup-input-row';
    row.innerHTML = `
      <span>${i}</span>
      <input id="lineupName${i}" type="text" placeholder="${i}번 타자" />
      <input id="lineupPos${i}" type="text" placeholder="포지션" />
    `;
    el.lineupInputGrid.appendChild(row);
  }
}

function buildLineupTextLayer() {
  for (let i = 1; i <= 9; i += 1) {
    const nameNode = document.createElement('div');
    nameNode.id = `lineupNameText${i}`;
    nameNode.className = 'lineup-name-text';

    const posNode = document.createElement('div');
    posNode.id = `lineupPosText${i}`;
    posNode.className = 'lineup-pos-text';

    out.lineupTextLayer.append(nameNode, posNode);
    lineupTextRefs.names[i] = nameNode;
    lineupTextRefs.positions[i] = posNode;
  }
}

function updateResultPoster() {
  const result = selectedValue(el.result);
  const side = selectedValue(el.kiaSide);
  const team = selectedTeamInfo(el.opponentTeam);

  el.stadiumName.value = side === 'home' ? KIA_HOME_STADIUM : team.stadium;

  out.backgroundLayer.src = BACKGROUND_BY_RESULT[result];
  el.resultPoster.style.setProperty('--global-letter-spacing', `${Number(el.globalLetterSpacing.value) || 0}px`);

  out.dateText.textContent = formatDate(el.gameDate.value);
  out.opponentText.textContent = `vs ${el.opponentName.value || team.name}`;
  out.stadiumText.textContent = el.stadiumName.value;
  out.homeScoreText.textContent = el.homeScore.value || '0';
  out.awayScoreText.textContent = el.awayScore.value || '0';

  out.homeScoreText.classList.remove('kia', 'opp');
  out.awayScoreText.classList.remove('kia', 'opp');
  if (side === 'home') {
    out.homeScoreText.classList.add('opp');
    out.awayScoreText.classList.add('kia');
  } else {
    out.homeScoreText.classList.add('kia');
    out.awayScoreText.classList.add('opp');
  }

  out.winnerText.textContent = el.winnerName.value;
  out.loserText.textContent = el.loserName.value;
  out.saveText.textContent = el.saveName.value;
  out.mvpNameText.textContent = el.mvpName.value || '';
  out.mvpRecordText.textContent = el.mvpRecord.value ? `(${el.mvpRecord.value})` : '';
  const playerPhotoPath = getPlayerPhotoPath(el.mvpName.value);
  out.playerPhoto.classList.toggle('is-hidden', !playerPhotoPath);
  if (playerPhotoPath) out.playerPhoto.src = playerPhotoPath;

  const hasWinner = Boolean(el.winnerName.value.trim());
  const hasLoser = Boolean(el.loserName.value.trim());
  const hasSave = Boolean(el.saveName.value.trim());
  out.badgeWin.style.display = hasWinner ? 'block' : 'none';
  out.winnerText.style.display = hasWinner ? 'block' : 'none';
  out.badgeLose.style.display = hasLoser ? 'block' : 'none';
  out.loserText.style.display = hasLoser ? 'block' : 'none';
  out.badgeSave.style.display = hasSave ? 'block' : 'none';
  out.saveText.style.display = hasSave ? 'block' : 'none';

  out.kiaLogo.src = teamLogoFile('kia', side, result);
  out.oppLogo.src = teamLogoFile(team.code, side === 'home' ? 'away' : 'home', result);

  RESULT_LAYOUT.opponentText.x = Number(el.opponentXInput.value) || RESULT_LAYOUT.opponentText.x;
  RESULT_LAYOUT.opponentText.y = Number(el.opponentYInput.value) || RESULT_LAYOUT.opponentText.y;
  RESULT_LAYOUT.mvpRecordText.x = Number(el.mvpRecordXInput.value) || RESULT_LAYOUT.mvpRecordText.x;
  RESULT_LAYOUT.mvpRecordText.y = Number(el.mvpRecordYInput.value) || RESULT_LAYOUT.mvpRecordText.y;

  applyText(out.dateText, RESULT_LAYOUT.dateText);
  applyText(out.opponentText, RESULT_LAYOUT.opponentText);
  applyText(out.stadiumText, RESULT_LAYOUT.stadiumText);
  applyText(out.homeScoreText, RESULT_LAYOUT.homeScoreText);
  applyText(out.awayScoreText, RESULT_LAYOUT.awayScoreText);
  applyText(out.winnerText, RESULT_LAYOUT.winnerText);
  applyText(out.loserText, RESULT_LAYOUT.loserText);
  applyText(out.saveText, RESULT_LAYOUT.saveText);
  applyText(out.mvpNameText, RESULT_LAYOUT.mvpNameText);
  applyText(out.mvpRecordText, RESULT_LAYOUT.mvpRecordText);
  applyBadge(out.badgeWin, RESULT_LAYOUT.badgeWin);
  applyBadge(out.badgeLose, RESULT_LAYOUT.badgeLose);
  applyBadge(out.badgeSave, RESULT_LAYOUT.badgeSave);
  scheduleMobilePreviewRender();
}

function updateLineupPoster() {
  const team = selectedTeamInfo(el.lineupOpponentTeam);
  const side = selectedValue(el.lineupKiaSide);
  el.lineupStadiumName.value = side === 'home' ? KIA_HOME_STADIUM : team.stadium;

  out.lineupDateText.textContent = formatDate(el.lineupDate.value);
  LINEUP_LAYOUT.opponentText.x = Number(el.lineupOpponentXInput.value) || LINEUP_LAYOUT.opponentText.x;
  LINEUP_LAYOUT.opponentText.y = Number(el.lineupOpponentYInput.value) || LINEUP_LAYOUT.opponentText.y;
  out.lineupOpponentText.textContent = `vs ${el.lineupOpponentName.value || team.name}`;
  out.lineupStadiumText.textContent = el.lineupStadiumName.value;
  out.lineupPitcherText.textContent = el.lineupPitcherName.value;
  const lineupPhotoPath = getPlayerPhotoPath(el.lineupPitcherName.value);
  out.lineupPlayerPhoto.classList.toggle('is-hidden', !lineupPhotoPath);
  if (lineupPhotoPath) out.lineupPlayerPhoto.src = lineupPhotoPath;
  const spacing = Number(el.lineupLetterSpacing.value);
  el.lineupPoster.style.setProperty('--global-letter-spacing', `${Number.isFinite(spacing) ? spacing : -1}px`);

  applyText(out.lineupDateText, LINEUP_LAYOUT.dateText);
  applyText(out.lineupOpponentText, LINEUP_LAYOUT.opponentText);
  applyText(out.lineupStadiumText, LINEUP_LAYOUT.stadiumText);
  applyText(out.lineupPitcherText, LINEUP_LAYOUT.pitcher);

  for (let i = 1; i <= 9; i += 1) {
    const name = document.getElementById(`lineupName${i}`)?.value || '';
    const pos = document.getElementById(`lineupPos${i}`)?.value || '';

    LINEUP_LAYOUT.names[i].x = LINEUP_FIXED.nameX;
    LINEUP_LAYOUT.names[i].size = LINEUP_FIXED.nameSize;
    LINEUP_LAYOUT.positions[i].x = LINEUP_FIXED.posX;
    LINEUP_LAYOUT.positions[i].size = LINEUP_FIXED.posSize;

    lineupTextRefs.names[i].textContent = name;
    lineupTextRefs.positions[i].textContent = pos;
    applyText(lineupTextRefs.names[i], LINEUP_LAYOUT.names[i]);
    applyText(lineupTextRefs.positions[i], LINEUP_LAYOUT.positions[i]);
  }
  scheduleMobilePreviewRender();
}

function switchTab(target) {
  activeTab = target;
  const isResult = target === 'result';
  el.tabResult.classList.toggle('active', isResult);
  el.tabLineup.classList.toggle('active', !isResult);
  el.resultControls.classList.toggle('active', isResult);
  el.lineupControls.classList.toggle('active', !isResult);
  el.resultPoster.classList.toggle('active', isResult);
  el.lineupPoster.classList.toggle('active', !isResult);
  out.resultMobilePreview.classList.toggle('active', isResult);
  out.lineupMobilePreview.classList.toggle('active', !isResult);
}

function waitForImageElement(img) {
  if (!img) return Promise.resolve();
  if (img.classList?.contains('is-hidden')) return Promise.resolve();
  if (!img.getAttribute('src')) return Promise.resolve();
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
      resolve();
    };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}

async function downloadImage() {
  await document.fonts.ready;
  const poster = activeTab === 'result' ? el.resultPoster : el.lineupPoster;
  const images = activeTab === 'result'
    ? [out.backgroundLayer, out.playerPhoto, out.kiaLogo, out.oppLogo]
    : [out.lineupBgLayer, out.lineupPlayerPhoto];
  await Promise.all(images.map(waitForImageElement));

  const prevTransform = poster.style.transform;
  const prevOrigin = poster.style.transformOrigin;
  poster.style.transform = 'none';
  poster.style.transformOrigin = 'top left';

  try {
    const canvas = await html2canvas(poster, { useCORS: true, scale: 3, backgroundColor: null });
    const link = document.createElement('a');
    link.download = `${activeTab}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1);
    link.click();
  } finally {
    poster.style.transform = prevTransform;
    poster.style.transformOrigin = prevOrigin;
  }
}

function populateTeamSelect(selectEl) {
  TEAM_DB.forEach((team) => {
    const option = document.createElement('option');
    option.value = team.name;
    option.textContent = team.name;
    selectEl.appendChild(option);
  });
}

function bindEvents() {
  syncFineTunePair(el.opponentXInput, el.opponentXRange);
  syncFineTunePair(el.opponentYInput, el.opponentYRange);
  syncFineTunePair(el.mvpRecordXInput, el.mvpRecordXRange);
  syncFineTunePair(el.mvpRecordYInput, el.mvpRecordYRange);
  syncFineTunePair(el.lineupOpponentXInput, el.lineupOpponentXRange);
  syncFineTunePair(el.lineupOpponentYInput, el.lineupOpponentYRange);

  const resultInputs = [
    ...el.result, ...el.kiaSide, el.gameDate, el.opponentTeam, el.opponentName,
    el.stadiumName, el.homeScore, el.awayScore, el.mvpName, el.mvpRecord,
    el.winnerName, el.loserName, el.saveName, el.globalLetterSpacing,
    el.opponentXInput, el.opponentYInput, el.opponentXRange, el.opponentYRange,
    el.mvpRecordXInput, el.mvpRecordYInput, el.mvpRecordXRange, el.mvpRecordYRange
  ];
  resultInputs.forEach((input) => {
    input.addEventListener('input', updateResultPoster);
    input.addEventListener('change', updateResultPoster);
  });

  el.opponentTeam.addEventListener('change', () => {
    const team = selectedTeamInfo(el.opponentTeam);
    el.opponentName.value = team.name;
    el.stadiumName.value = selectedValue(el.kiaSide) === 'home' ? KIA_HOME_STADIUM : team.stadium;
    updateResultPoster();
  });

  const lineupInputs = [
    el.lineupDate,
    el.lineupOpponentTeam,
    el.lineupOpponentName,
    el.lineupStadiumName,
    el.lineupPitcherName,
    el.lineupLetterSpacing,
    el.lineupOpponentXInput,
    el.lineupOpponentYInput,
    el.lineupOpponentXRange,
    el.lineupOpponentYRange
  ];
  const lineupSideInputs = [...el.lineupKiaSide];
  lineupInputs.forEach((input) => {
    input.addEventListener('input', updateLineupPoster);
    input.addEventListener('change', updateLineupPoster);
  });
  lineupSideInputs.forEach((input) => {
    input.addEventListener('input', updateLineupPoster);
    input.addEventListener('change', updateLineupPoster);
  });

  el.lineupInputGrid.addEventListener('input', updateLineupPoster);
  el.lineupInputGrid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const nameMatch = target.id.match(/^lineupName(\d)$/);
    const posMatch = target.id.match(/^lineupPos(\d)$/);
    if (!nameMatch && !posMatch) return;

    event.preventDefault();
    const current = Number((nameMatch || posMatch)[1]);
    const next = current + 1;
    if (next > 9) return;
    const nextId = nameMatch ? `lineupName${next}` : `lineupPos${next}`;
    document.getElementById(nextId)?.focus();
  });

  el.lineupOpponentTeam.addEventListener('change', () => {
    const team = selectedTeamInfo(el.lineupOpponentTeam);
    el.lineupOpponentName.value = team.name;
    el.lineupStadiumName.value = selectedValue(el.lineupKiaSide) === 'home' ? KIA_HOME_STADIUM : team.stadium;
    updateLineupPoster();
  });

  el.tabResult.addEventListener('click', () => switchTab('result'));
  el.tabLineup.addEventListener('click', () => switchTab('lineup'));
  el.downloadBtn.addEventListener('click', downloadImage);
  window.addEventListener('resize', scheduleMobilePreviewRender);
}

function setToday(target) {
  const now = new Date();
  target.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function init() {
  buildLineupInputs();
  buildLineupTextLayer();
  populateTeamSelect(el.opponentTeam);
  populateTeamSelect(el.lineupOpponentTeam);

  el.opponentTeam.value = 'LG 트윈스';
  el.lineupOpponentTeam.value = 'LG 트윈스';
  el.opponentName.value = 'LG 트윈스';
  el.lineupOpponentName.value = 'LG 트윈스';
  el.stadiumName.value = KIA_HOME_STADIUM;
  el.lineupStadiumName.value = KIA_HOME_STADIUM;

  setToday(el.gameDate);
  setToday(el.lineupDate);

  bindEvents();
  updateResultPoster();
  updateLineupPoster();
}

init();
