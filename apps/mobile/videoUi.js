import { VIDEO_LAYOUT } from './constants.js';
import { formatSecondsLabel, formatVideoMeta } from './utils.js';

export function getVideoMetaLines(el) {
  const overrideLines = (el.videoMetaOverride?.value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (overrideLines.length) return overrideLines;

  return formatVideoMeta(el.videoDate.value, el.videoOpponentTeam.value)
    .split('\n')
    .filter(Boolean);
}

export function getVideoTitleLines(el) {
  return (el.videoTitleInput.value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getVideoTrimTimes(el, out) {
  const video = out.videoPreviewElement;
  const start = Math.max(0, Number(el.videoStartTime.value) || 0);
  const rawEnd = Number(el.videoEndTime.value);
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const end = rawEnd > start ? rawEnd : duration;
  return {
    start,
    end: end > start ? end : start
  };
}

export function updateTrimSelectedBar(el, out) {
  const max = Number(el.videoTrimStartRange.max) || 0;
  const start = Number(el.videoTrimStartRange.value) || 0;
  const end = Number(el.videoTrimEndRange.value) || 0;
  const startPercent = max > 0 ? (start / max) * 100 : 0;
  const endPercent = max > 0 ? (end / max) * 100 : 0;
  out.videoTrimSelected.style.left = `${startPercent}%`;
  out.videoTrimSelected.style.width = `${Math.max(0, endPercent - startPercent)}%`;
}

export function updateVideoPlaybackUi(el, out) {
  const video = out.videoPreviewElement;
  const { end } = getVideoTrimTimes(el, out);
  const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
  const max = Math.max(0, end);
  const clamped = Math.max(0, Math.min(current, max));

  el.videoPlaybackRange.max = String(max);
  el.videoPlaybackRange.value = String(clamped);
  el.videoPlaybackTime.textContent = `${formatSecondsLabel(clamped)} / ${formatSecondsLabel(max)}`;
  el.videoPlayToggle.textContent = video.paused ? '▶️' : '⏸️';
}

export function setVideoPreviewMode(el, videoState, enabled) {
  videoState.previewMode = enabled;
  el.videoPoster.classList.toggle('preview-frame-mode', enabled);
  el.videoPreviewToggleBtn.textContent = enabled ? '영상으로 돌아가기' : '미리보기';
}

export function setVideoSaveProgress(el, progress, label) {
  const percent = Math.max(0, Math.min(100, Math.round(progress)));
  el.videoSaveProgress.classList.add('active');
  el.videoSaveProgressFill.style.width = `${percent}%`;
  el.videoSaveProgressText.textContent = label || `${percent}%`;
}

export function hideVideoSaveProgress(el) {
  el.videoSaveProgress.classList.remove('active');
  el.videoSaveProgressFill.style.width = '0%';
  el.videoSaveProgressText.textContent = '0%';
}

export function updateVideoPreviewToggleVisibility(el, activeTab, isMobilePreviewMode, setPreviewModeOff) {
  const visible = activeTab === 'video' && isMobilePreviewMode();
  el.videoPreviewToggleBtn.classList.toggle('mobile-video-only', visible);
  if (!visible) {
    setPreviewModeOff();
  }
}

export function syncVideoTrimInputs(el, out, source = 'start-range') {
  const duration = Number.isFinite(out.videoPreviewElement.duration) ? out.videoPreviewElement.duration : 0;
  let start = Number(el.videoStartTime.value) || 0;
  let end = Number(el.videoEndTime.value) || duration;

  if (source === 'start-range') start = Number(el.videoTrimStartRange.value) || 0;
  if (source === 'end-range') end = Number(el.videoTrimEndRange.value) || duration;
  if (source === 'start-input') start = Number(el.videoStartTime.value) || 0;
  if (source === 'end-input') end = Number(el.videoEndTime.value) || duration;

  start = Math.max(0, Math.min(start, duration));
  end = Math.max(0, Math.min(end, duration || end));

  if (start > end) {
    if (source === 'start-range' || source === 'start-input') {
      end = start;
    } else {
      start = end;
    }
  }

  el.videoStartTime.value = start.toFixed(1).replace(/\.0$/, '');
  el.videoEndTime.value = end.toFixed(1).replace(/\.0$/, '');
  el.videoTrimStartRange.value = String(start);
  el.videoTrimEndRange.value = String(end);
  updateTrimSelectedBar(el, out);
}

export function syncVideoTrimDraftInput(el, out, source = 'start-input') {
  const duration = Number.isFinite(out.videoPreviewElement.duration) ? out.videoPreviewElement.duration : 0;
  const rawStart = el.videoStartTime.value.trim();
  const rawEnd = el.videoEndTime.value.trim();
  const parsedStart = Number(rawStart);
  const parsedEnd = Number(rawEnd);

  let start = Number(el.videoTrimStartRange.value) || 0;
  let end = Number(el.videoTrimEndRange.value) || duration;

  if (source === 'start-input' && rawStart !== '' && Number.isFinite(parsedStart)) {
    start = Math.max(0, Math.min(parsedStart, duration));
    if (start > end) end = start;
  }

  if (source === 'end-input' && rawEnd !== '' && Number.isFinite(parsedEnd)) {
    end = Math.max(0, Math.min(parsedEnd, duration || parsedEnd));
    if (end < start) start = end;
  }

  el.videoTrimStartRange.value = String(start);
  el.videoTrimEndRange.value = String(end);
  updateTrimSelectedBar(el, out);
}

export function configureVideoTrimRange(el, out, duration, updatePlaybackUi) {
  const safeDuration = Math.max(0, duration || 0);
  const maxValue = safeDuration.toFixed(1);
  el.videoTrimStartRange.max = maxValue;
  el.videoTrimEndRange.max = maxValue;
  if (!el.videoEndTime.value || Number(el.videoEndTime.value) === 0) {
    el.videoEndTime.value = safeDuration.toFixed(1).replace(/\.0$/, '');
  }
  syncVideoTrimInputs(el, out);
  updatePlaybackUi();
}

export function getVideoLayoutValues(el) {
  const frameScale = (Number(el.videoFrameScaleInput.value) || VIDEO_LAYOUT.frame.scale) / 100;
  const titleSize = Number(el.videoTitleSizeInput.value) || VIDEO_LAYOUT.title.size;
  const metaSize = Number(el.videoMetaSizeInput.value) || VIDEO_LAYOUT.meta.size;
  const titleLetterSpacing = Number(el.videoTitleSpacingInput.value);
  const titleLineHeight = Number(el.videoTitleLineHeightInput.value) || VIDEO_LAYOUT.title.lineHeight;
  const frameWidth = Math.round(VIDEO_LAYOUT.frame.width * frameScale);
  const frameHeight = Math.round(VIDEO_LAYOUT.frame.height * frameScale);
  const metaLineHeight = Math.round(metaSize * 1.36);
  return {
    frame: {
      ...VIDEO_LAYOUT.frame,
      x: Number(el.videoFrameXInput.value) || VIDEO_LAYOUT.frame.x,
      y: Number(el.videoFrameYInput.value) || VIDEO_LAYOUT.frame.y,
      scale: frameScale,
      width: frameWidth,
      height: frameHeight,
      renderX: Math.round((Number(el.videoFrameXInput.value) || VIDEO_LAYOUT.frame.x) - (frameWidth - VIDEO_LAYOUT.frame.width) / 2),
      renderY: Math.round((Number(el.videoFrameYInput.value) || VIDEO_LAYOUT.frame.y) - (frameHeight - VIDEO_LAYOUT.frame.height) / 2)
    },
    title: {
      ...VIDEO_LAYOUT.title,
      x: Number(el.videoTitleXInput.value) || VIDEO_LAYOUT.title.x,
      y: Number(el.videoTitleYInput.value) || VIDEO_LAYOUT.title.y,
      size: titleSize,
      lineHeight: titleLineHeight,
      letterSpacing: Number.isFinite(titleLetterSpacing) ? titleLetterSpacing : VIDEO_LAYOUT.title.letterSpacing
    },
    meta: {
      ...VIDEO_LAYOUT.meta,
      x: Number(el.videoMetaXInput.value) || VIDEO_LAYOUT.meta.x,
      y: Number(el.videoMetaYInput.value) || VIDEO_LAYOUT.meta.y,
      size: metaSize,
      lineHeight: metaLineHeight
    }
  };
}

export function configureVideoLoop(out, videoState, getTrimTimes, updatePlaybackUi) {
  const video = out.videoPreviewElement;
  if (videoState.loopHandler) {
    video.removeEventListener('timeupdate', videoState.loopHandler);
    videoState.loopHandler = null;
  }

  if (!video.getAttribute('src')) return;

  videoState.loopHandler = () => {
    const { start, end } = getTrimTimes();
    if (!end || video.currentTime < start) {
      video.currentTime = start;
      return;
    }
    if (video.currentTime >= end) {
      video.currentTime = end;
      video.pause();
      updatePlaybackUi();
    }
  };

  video.addEventListener('timeupdate', videoState.loopHandler);
}

export function updateVideoPoster({
  el,
  out,
  videoState,
  previewTarget = 'keep',
  getOverlaySnapshot,
  getTrimTimes,
  configureLoop,
  updatePlaybackUi,
  invalidateOverlayCache,
  primeOverlayCache
}) {
  const video = out.videoPreviewElement;
  const wasPlaying = !video.paused;
  const { layout, titleLines, metaLines, titleTop, metaTop } = getOverlaySnapshot();
  out.videoTitleText.textContent = titleLines.join('\n');
  out.videoMetaText.textContent = metaLines.join('\n');
  out.videoTitleText.style.left = `${layout.title.x}px`;
  out.videoTitleText.style.top = `${titleTop}px`;
  out.videoTitleText.style.fontSize = `${layout.title.size}px`;
  out.videoTitleText.style.lineHeight = `${layout.title.lineHeight}px`;
  out.videoTitleText.style.letterSpacing = `${layout.title.letterSpacing}px`;
  out.videoMetaText.style.left = `${layout.meta.x}px`;
  out.videoMetaText.style.top = `${metaTop}px`;
  out.videoMetaText.style.fontSize = `${layout.meta.size}px`;
  out.videoMetaText.style.lineHeight = `${layout.meta.lineHeight}px`;
  out.videoPreviewElement.style.left = `${layout.frame.renderX}px`;
  out.videoPreviewElement.style.top = `${layout.frame.renderY}px`;
  out.videoPreviewElement.style.width = `${layout.frame.width}px`;
  out.videoPreviewElement.style.height = `${layout.frame.height}px`;

  configureLoop();

  if (!video.getAttribute('src')) return;
  const { start, end } = getTrimTimes();
  let nextTime = Number.isFinite(video.currentTime) ? video.currentTime : start;
  if (previewTarget === 'start') nextTime = start;
  if (previewTarget === 'end') nextTime = end;
  nextTime = Math.max(start, Math.min(nextTime, end));
  if (Math.abs(video.currentTime - nextTime) > 0.15) {
    video.currentTime = nextTime;
  }
  video.muted = false;
  video.volume = 1;
  if (wasPlaying) {
    const playPromise = video.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }
  updatePlaybackUi();

  invalidateOverlayCache();
  primeOverlayCache().catch(() => {});
}
