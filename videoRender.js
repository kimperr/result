import { VIDEO_BG_FALLBACK, VIDEO_LAYOUT } from './constants.js';

export function getCenteredTextTop(baseTop, baseSize, baseLineHeight, nextSize, nextLineHeight, lineCount) {
  const safeCount = Math.max(1, lineCount);
  const baseHeight = baseSize + (safeCount - 1) * baseLineHeight;
  const nextHeight = nextSize + (safeCount - 1) * nextLineHeight;
  return Math.round(baseTop - (nextHeight - baseHeight) / 2);
}

export function drawCenteredSpacedText(ctx, text, centerX, baselineY, letterSpacing) {
  const chars = Array.from(text || '');
  if (chars.length === 0) return;
  if (!letterSpacing) {
    const prevAlign = ctx.textAlign;
    ctx.textAlign = 'center';
    ctx.fillText(text, centerX, baselineY);
    ctx.textAlign = prevAlign;
    return;
  }

  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  const widths = chars.map((char) => ctx.measureText(char).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, chars.length - 1) * letterSpacing;
  let cursorX = centerX - totalWidth / 2;

  chars.forEach((char, index) => {
    ctx.fillText(char, cursorX, baselineY);
    cursorX += widths[index] + letterSpacing;
  });
  ctx.textAlign = prevAlign;
}

export function drawCoverImage(ctx, source, dx, dy, dWidth, dHeight) {
  const sourceWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const sourceHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  if (!sourceWidth || !sourceHeight) return;

  const sourceRatio = sourceWidth / sourceHeight;
  const destRatio = dWidth / dHeight;
  let sx = 0;
  let sy = 0;
  let sWidth = sourceWidth;
  let sHeight = sourceHeight;

  if (sourceRatio > destRatio) {
    sWidth = sourceHeight * destRatio;
    sx = (sourceWidth - sWidth) / 2;
  } else {
    sHeight = sourceWidth / destRatio;
    sy = (sourceHeight - sHeight) / 2;
  }

  ctx.drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

export function getVideoOverlaySnapshot(getVideoLayoutValues, getVideoTitleLines, getVideoMetaLines) {
  const layout = getVideoLayoutValues();
  const titleLines = getVideoTitleLines();
  const metaLines = getVideoMetaLines();
  const titleTop = getCenteredTextTop(
    layout.title.y,
    VIDEO_LAYOUT.title.size,
    VIDEO_LAYOUT.title.lineHeight,
    layout.title.size,
    layout.title.lineHeight,
    titleLines.length
  );
  const metaTop = getCenteredTextTop(
    layout.meta.y,
    VIDEO_LAYOUT.meta.size,
    VIDEO_LAYOUT.meta.lineHeight,
    layout.meta.size,
    layout.meta.lineHeight,
    metaLines.length
  );

  return { layout, titleLines, metaLines, titleTop, metaTop };
}

export function getVideoOverlayKey(snapshot, out) {
  return JSON.stringify({
    layout: snapshot.layout,
    titleLines: snapshot.titleLines,
    metaLines: snapshot.metaLines,
    titleTop: snapshot.titleTop,
    metaTop: snapshot.metaTop,
    bgVisible: Boolean(out.videoBgImage.complete && out.videoBgImage.naturalWidth > 0)
  });
}

export function waitForVideoEvent(video, eventName) {
  return new Promise((resolve) => {
    const done = () => {
      video.removeEventListener(eventName, done);
      video.removeEventListener('error', done);
      resolve();
    };
    video.addEventListener(eventName, done, { once: true });
    video.addEventListener('error', done, { once: true });
  });
}

export async function prepareExportVideo(sourceVideo, startTime) {
  const exportVideo = document.createElement('video');
  exportVideo.src = sourceVideo.currentSrc || sourceVideo.src;
  exportVideo.preload = 'auto';
  exportVideo.muted = false;
  exportVideo.volume = 1;
  exportVideo.playsInline = true;
  exportVideo.crossOrigin = 'anonymous';
  exportVideo.style.position = 'fixed';
  exportVideo.style.left = '-99999px';
  exportVideo.style.top = '0';
  exportVideo.style.width = '1px';
  exportVideo.style.height = '1px';
  document.body.appendChild(exportVideo);

  try {
    if (exportVideo.readyState < 2) {
      exportVideo.load();
      await waitForVideoEvent(exportVideo, 'loadeddata');
    }
    exportVideo.currentTime = startTime;
    await waitForVideoEvent(exportVideo, 'seeked');
    return exportVideo;
  } catch (error) {
    exportVideo.remove();
    throw error;
  }
}

export async function buildVideoOverlayPng(out, layout, titleLines, metaLines, titleTop, metaTop) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('브라우저에서 캔버스를 만들 수 없습니다.');

  const bgImage = out.videoBgImage;
  if (bgImage.complete && bgImage.naturalWidth > 0) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, VIDEO_BG_FALLBACK.top);
    gradient.addColorStop(0.48, VIDEO_BG_FALLBACK.mid);
    gradient.addColorStop(1, VIDEO_BG_FALLBACK.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = '#111';
  ctx.font = `400 ${layout.title.size}px 'boldfont'`;
  const titleBaseY = titleTop + Math.round(layout.title.size * 0.95);
  titleLines.forEach((line, index) => {
    drawCenteredSpacedText(
      ctx,
      line,
      layout.title.x + layout.title.width / 2,
      titleBaseY + index * layout.title.lineHeight,
      layout.title.letterSpacing
    );
  });

  ctx.fillStyle = '#111';
  ctx.font = `400 ${layout.meta.size}px 'mediumfont'`;
  metaLines.forEach((line, index) => {
    drawCenteredSpacedText(
      ctx,
      line,
      layout.meta.x + layout.meta.width / 2,
      metaTop + Math.round(layout.meta.size * 0.96) + index * layout.meta.lineHeight,
      0
    );
  });

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('브라우저에서 이미지를 만들 수 없습니다.'));
    }, 'image/png');
  });
}

export function invalidateVideoOverlayCache(videoState) {
  videoState.overlayPromise = null;
  videoState.overlayKey = '';
  videoState.overlayBitmapPromise = null;
}

export function primeVideoOverlayCache(videoState, out, getSnapshot) {
  const snapshot = getSnapshot();
  const key = getVideoOverlayKey(snapshot, out);
  if (videoState.overlayPromise && videoState.overlayKey === key) {
    return videoState.overlayPromise;
  }

  videoState.overlayKey = key;
  videoState.overlayPromise = buildVideoOverlayPng(
    out,
    snapshot.layout,
    snapshot.titleLines,
    snapshot.metaLines,
    snapshot.titleTop,
    snapshot.metaTop
  ).catch((error) => {
    videoState.overlayPromise = null;
    videoState.overlayKey = '';
    throw error;
  });

  return videoState.overlayPromise;
}

async function createOverlayBitmapFromBlob(blob) {
  if ('createImageBitmap' in window) {
    return await createImageBitmap(blob);
  }

  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('브라우저에서 이미지를 읽을 수 없습니다.'));
    };
    image.src = url;
  });
}

export function primeVideoOverlayBitmapCache(videoState, primeOverlayCache) {
  if (videoState.overlayBitmapPromise) return videoState.overlayBitmapPromise;
  videoState.overlayBitmapPromise = primeOverlayCache()
    .then((blob) => createOverlayBitmapFromBlob(blob))
    .catch((error) => {
      videoState.overlayBitmapPromise = null;
      throw error;
    });
  return videoState.overlayBitmapPromise;
}

export function drawVideoCompositeFrame(ctx, video, layout, overlayBitmap) {
  ctx.clearRect(0, 0, 1080, 1350);
  ctx.drawImage(overlayBitmap, 0, 0, 1080, 1350);
  drawCoverImage(ctx, video, layout.frame.renderX, layout.frame.renderY, layout.frame.width, layout.frame.height);
}

export async function renderVideoPreviewFrameImage({
  out,
  getTrimTimes,
  getSnapshot,
  prepareVideo,
  primeOverlayBitmapCache,
  drawCompositeFrame,
  setPreviewMode
}) {
  const video = out.videoPreviewElement;
  if (!video.getAttribute('src')) {
    window.alert('먼저 영상 파일을 업로드해 주세요.');
    return;
  }

  const { start } = getTrimTimes();
  const { layout } = getSnapshot();
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const previewVideo = await prepareVideo(video, start);
  const overlayBitmap = await primeOverlayBitmapCache();

  try {
    drawCompositeFrame(ctx, previewVideo, layout, overlayBitmap);
    const dataUrl = canvas.toDataURL('image/png', 1);
    out.videoFramePreviewImage.src = dataUrl;
    setPreviewMode(true);
  } finally {
    previewVideo.pause();
    previewVideo.removeAttribute('src');
    previewVideo.load();
    previewVideo.remove();
  }
}
