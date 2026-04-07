import {
  KIA_HOME_STADIUM,
  PLAYER_INFO_LIST,
  TEAM_DB
} from './constants.js';
import {
  escapeDrawtext,
  formatDate,
  getFileExtension,
  getPlayerPhotoPath,
  selectedValue,
  setSelectedRadioValue,
  syncNumberRangeValues
} from './utils.js';
import { el, out } from './dom.js';
import {
  buildLineupInputs,
  buildLineupTextLayer,
  getLineupCaptionText,
  updateLineupGameTimeCustomVisibility,
  updateLineupPoster as renderLineupPoster
} from './lineup.js';
import {
  buildRosterMovesUi as initializeRosterMovesUi,
  getRosterSectionCount as getRosterSectionCountImpl,
  refreshRosterGroupEditors as refreshRosterGroupEditorsImpl,
  updateRosterMovesFormVisibility as updateRosterMovesFormVisibilityImpl,
  updateRosterMovesPoster as renderRosterMovesPoster
} from './rosterMoves.js';
import {
  getResultCaptionText,
  syncAutoResultSelection,
  updateResultPoster as renderResultPoster
} from './result.js';
import {
  bindNudgeButtons as initializeNudgeButtons,
  copyGeneratedCaption as copyCaptionText,
  downloadFollowImage,
  showCopyToast as showCopyToastMessage,
  syncFineTunePair,
  updateDownloadButtonLabel as setDownloadButtonLabel
} from './ui.js';
import {
  configureVideoLoop as setupVideoLoop,
  configureVideoTrimRange as setupVideoTrimRange,
  getVideoLayoutValues as getVideoLayoutValuesImpl,
  getVideoMetaLines as getVideoMetaLinesImpl,
  getVideoTitleLines as getVideoTitleLinesImpl,
  getVideoTrimTimes as getVideoTrimTimesImpl,
  setVideoPreviewMode as setPreviewMode,
  setVideoSaveProgress as setVideoProgress,
  syncVideoTrimDraftInput as syncVideoTrimDraftInputImpl,
  syncVideoTrimInputs as syncVideoTrimInputsImpl,
  updateVideoPlaybackUi as refreshVideoPlaybackUi,
  updateVideoPoster as renderVideoPoster,
  updateVideoPreviewToggleVisibility as toggleVideoPreviewButton,
  hideVideoSaveProgress as resetVideoProgress
} from './videoUi.js';
import {
  drawVideoCompositeFrame as renderCompositeFrame,
  getVideoOverlaySnapshot as buildVideoOverlaySnapshot,
  invalidateVideoOverlayCache as clearVideoOverlayCache,
  prepareExportVideo as prepareVideoExport,
  primeVideoOverlayBitmapCache as primeOverlayBitmapCacheImpl,
  primeVideoOverlayCache as primeOverlayCacheImpl,
  renderVideoPreviewFrameImage as renderPreviewFrameImage
} from './videoRender.js';
import {
  exportVideo as exportCurrentVideo,
  exportVideoFast as exportVideoFrames
} from './videoExport.js';
import {
  bindEvents as bindAppEvents,
  downloadImage as downloadPosterImage,
  init as initAppShell,
  initializeApp as bootstrapApp,
  populatePlayerNameOptions,
  populateTeamSelect,
  setToday,
  switchTab as switchAppTab,
  waitForImageElement
} from './appShell.js';
import {
  applyAdvancedText,
  applyBadge,
  applyPositionOnly,
  applyScaledImage,
  applyText,
  isMobilePreviewMode,
  renderMobilePreview as renderPosterMobilePreview,
  selectedTeamInfo as resolveSelectedTeamInfo,
  selectedTeamInfoByName as resolveSelectedTeamInfoByName
} from './posterShared.js';
import {
  applySharedKiaSide as applySharedKiaSideState,
  applySharedOpponent as applySharedOpponentState,
  applySharedOpponentFineTune as applySharedOpponentFineTuneState
} from './sharedState.js';


let activeTab = 'result';
const lineupTextRefs = { names: {}, positions: {} };
const rosterMoveEditors = { callUp: [], sendDown: [] };
const rosterMovePreviewGroups = { callUp: [], sendDown: [] };
let mobilePreviewTimer = null;
const copyToastState = { timer: null };
const videoState = {
  objectUrl: '',
  loopHandler: null,
  sourceBytes: null,
  sourceExt: 'mp4',
  overlayPromise: null,
  overlayKey: '',
  overlayBitmapPromise: null,
  previewMode: false
};
let resultManualOverride = false;

function getRosterSectionCount(section) {
  return getRosterSectionCountImpl(el, section);
}

function refreshRosterGroupEditors(section) {
  return refreshRosterGroupEditorsImpl(el, rosterMoveEditors, section);
}

function updateRosterMovesFormVisibility(section, index) {
  return updateRosterMovesFormVisibilityImpl(rosterMoveEditors, section, index);
}

function getVideoMetaLines() {
  return getVideoMetaLinesImpl(el);
}

function getVideoTitleLines() {
  return getVideoTitleLinesImpl(el);
}

function getVideoTrimTimes() {
  return getVideoTrimTimesImpl(el, out);
}

function getVideoLayoutValues() {
  return getVideoLayoutValuesImpl(el);
}

function getGeneratedCaptionText() {
  if (activeTab === 'lineup') {
    return getLineupCaptionText(el);
  }

  if (activeTab === 'result') {
    return getResultCaptionText(el, resultManualOverride);
  }

  return '';
}

function updateVideoPlaybackUi() {
  refreshVideoPlaybackUi(el, out);
}

function setVideoPreviewMode(enabled) {
  setPreviewMode(el, videoState, enabled);
}

function setVideoSaveProgress(progress, label) {
  setVideoProgress(el, progress, label);
}

function hideVideoSaveProgress() {
  resetVideoProgress(el);
}

function updateVideoPreviewToggleVisibility() {
  toggleVideoPreviewButton(
    el,
    activeTab,
    isMobilePreviewMode,
    () => setVideoPreviewMode(false)
  );
}

function syncVideoTrimInputs(source = 'start-range') {
  syncVideoTrimInputsImpl(el, out, source);
}

function syncVideoTrimDraftInput(source = 'start-input') {
  syncVideoTrimDraftInputImpl(el, out, source);
}

function configureVideoTrimRange(duration) {
  setupVideoTrimRange(el, out, duration, updateVideoPlaybackUi);
}

function updateSecondaryActionButtons() {
  el.followDownloadBtn.style.display = activeTab === 'video' ? 'block' : 'none';
  if (el.lineupCaptionSettings) {
    el.lineupCaptionSettings.style.display = activeTab === 'lineup' ? 'block' : 'none';
  }
  const showCaptionTools = activeTab === 'lineup' || activeTab === 'result';
  if (el.captionTools) {
    el.captionTools.style.display = showCaptionTools ? 'grid' : 'none';
  }
  if (el.copyCaptionBtn) {
    el.copyCaptionBtn.style.display = showCaptionTools ? 'block' : 'none';
  }
  if (el.captionOutput) {
    el.captionOutput.value = showCaptionTools ? getGeneratedCaptionText() : '';
  }
}


function getVideoOverlaySnapshot() {
  return buildVideoOverlaySnapshot(getVideoLayoutValues, getVideoTitleLines, getVideoMetaLines);
}

function invalidateVideoOverlayCache() {
  clearVideoOverlayCache(videoState);
}

function primeVideoOverlayCache() {
  return primeOverlayCacheImpl(videoState, out, getVideoOverlaySnapshot);
}

function primeVideoOverlayBitmapCache() {
  return primeOverlayBitmapCacheImpl(videoState, primeVideoOverlayCache);
}

function drawVideoCompositeFrame(ctx, video, layout, overlayBitmap) {
  renderCompositeFrame(ctx, video, layout, overlayBitmap);
}

async function renderVideoPreviewFrameImage() {
  await renderPreviewFrameImage({
    out,
    getTrimTimes: getVideoTrimTimes,
    getSnapshot: getVideoOverlaySnapshot,
    prepareVideo: prepareVideoExport,
    primeOverlayBitmapCache: primeVideoOverlayBitmapCache,
    drawCompositeFrame: drawVideoCompositeFrame,
    setPreviewMode: setVideoPreviewMode
  });
}

function selectedTeamInfo(selectEl) {
  return resolveSelectedTeamInfo(TEAM_DB, selectEl);
}

function selectedTeamInfoByName(teamName) {
  return resolveSelectedTeamInfoByName(TEAM_DB, teamName);
}

function applySharedOpponent(teamName) {
  applySharedOpponentState({
    teamName,
    el,
    kiaHomeStadium: KIA_HOME_STADIUM,
    selectedValue,
    selectedTeamInfoByName,
    updateResultPoster,
    updateLineupPoster,
    updateVideoPoster,
    updateRosterMovesPoster,
    updateSecondaryActionButtons
  });
}

function applySharedKiaSide(side) {
  applySharedKiaSideState({
    side,
    el,
    kiaHomeStadium: KIA_HOME_STADIUM,
    setSelectedRadioValue,
    selectedTeamInfo,
    updateResultPoster,
    updateLineupPoster,
    updateRosterMovesPoster
  });
}

function applySharedOpponentFineTune(x, y) {
  applySharedOpponentFineTuneState({
    x,
    y,
    el,
    syncNumberRangeValues,
    updateResultPoster,
    updateLineupPoster,
    updateRosterMovesPoster
  });
}

function bindNudgeButtons() {
  initializeNudgeButtons(syncNumberRangeValues);
}

function updateDownloadButtonLabel() {
  setDownloadButtonLabel(el, activeTab);
}

function showCopyToast(message) {
  showCopyToastMessage(el, copyToastState, message);
}

async function copyGeneratedCaption() {
  await copyCaptionText(el, getGeneratedCaptionText, showCopyToast);
}

function configureVideoLoop() {
  setupVideoLoop(out, videoState, getVideoTrimTimes, updateVideoPlaybackUi);
}

function updateVideoPoster(previewTarget = 'keep') {
  renderVideoPoster({
    el,
    out,
    videoState,
    previewTarget,
    getOverlaySnapshot: getVideoOverlaySnapshot,
    getTrimTimes: getVideoTrimTimes,
    configureLoop: configureVideoLoop,
    updatePlaybackUi: updateVideoPlaybackUi,
    invalidateOverlayCache: invalidateVideoOverlayCache,
    primeOverlayCache: primeVideoOverlayCache
  });
}

async function exportVideo() {
  await exportCurrentVideo({
    el,
    out,
    getTrimTimes: getVideoTrimTimes,
    getOverlaySnapshot: getVideoOverlaySnapshot,
    waitForImageElement,
    exportFast: (sourceVideo, start, end, layout, titleLines, metaLines, titleTop, metaTop) =>
      exportVideoFast(sourceVideo, start, end, layout, titleLines, metaLines, titleTop, metaTop)
  });
}

async function exportVideoFast(sourceVideo, start, end, layout, titleLines, metaLines, titleTop, metaTop) {
  await exportVideoFrames({
    sourceVideo,
    start,
    end,
    layout,
    titleLines,
    metaLines,
    titleTop,
    metaTop,
    prepareVideoExport,
    primeVideoOverlayBitmapCache,
    setVideoSaveProgress,
    hideVideoSaveProgress,
    drawVideoCompositeFrame,
    updateVideoPoster
  });
}

async function renderMobilePreview(tabName) {
  await renderPosterMobilePreview({
    tabName,
    el,
    out,
    waitForImageElement,
    isMobilePreviewMode
  });
}

function scheduleMobilePreviewRender() {
  if (mobilePreviewTimer) clearTimeout(mobilePreviewTimer);
  mobilePreviewTimer = setTimeout(async () => {
    if (!isMobilePreviewMode()) return;
    await renderMobilePreview('result');
    await renderMobilePreview('lineup');
    await renderMobilePreview('rosterMoves');
  }, 80);
}

function updateResultPoster(markManualOverride = false) {
  if (markManualOverride === true) resultManualOverride = true;
  renderResultPoster({
    el,
    out,
    resultManualOverride,
    selectedTeamInfo,
    applyText,
    applyBadge,
    scheduleMobilePreviewRender
  });
}

function updateLineupPoster() {
  renderLineupPoster({
    el,
    out,
    lineupTextRefs,
    selectedTeamInfo,
    applyText,
    scheduleMobilePreviewRender
  });
}

function updateRosterMovesPoster() {
  renderRosterMovesPoster({
    el,
    out,
    rosterMoveEditors,
    rosterMovePreviewGroups,
    selectedTeamInfo,
    formatDate,
    applyText,
    applyAdvancedText,
    applyPositionOnly,
    scheduleMobilePreviewRender
  });
}

function switchTab(target) {
  activeTab = target;
  switchAppTab({
    target,
    el,
    out,
    isMobilePreviewMode,
    setVideoPreviewMode,
    updateVideoPreviewToggleVisibility,
    updateDownloadButtonLabel,
    updateSecondaryActionButtons
  });
}

async function downloadImage() {
  await downloadPosterImage({
    activeTab,
    el,
    exportVideo,
    waitForImageElement
  });
}

function bindEvents() {
  bindAppEvents({
    el,
    out,
    videoState,
    activeTab: () => activeTab,
    isMobilePreviewMode,
    getVideoTrimTimes,
    updateVideoPoster,
    updateVideoPlaybackUi,
    setVideoPreviewMode,
    renderVideoPreviewFrameImage,
    syncVideoTrimInputs,
    syncVideoTrimDraftInput,
    configureVideoTrimRange,
    getFileExtension,
    updateVideoPreviewToggleVisibility,
    updateSecondaryActionButtons,
    scheduleMobilePreviewRender,
    applySharedKiaSide,
    applySharedOpponent,
    applySharedOpponentFineTune,
    selectedValue,
    updateResultPoster,
    updateLineupPoster,
    refreshRosterGroupEditors,
    updateRosterMovesPoster,
    invalidateVideoOverlayCache,
    primeVideoOverlayCache,
    switchTab,
    downloadImage,
    downloadFollowImage,
    copyGeneratedCaption,
    syncFineTunePair,
    bindNudgeButtons,
    updateLineupGameTimeCustomVisibility
  });
}

function init() {
  initAppShell({
    el,
    out,
    teamDb: TEAM_DB,
    playerInfoList: PLAYER_INFO_LIST,
    kiaHomeStadium: KIA_HOME_STADIUM,
    lineupTextRefs,
    rosterMoveEditors,
    rosterMovePreviewGroups,
    buildLineupInputs,
    buildLineupTextLayer,
    populateTeamSelect,
    populatePlayerNameOptions,
    initializeRosterMovesUi,
    updateRosterMovesFormVisibility,
    updateRosterMovesPoster,
    setToday,
    bindEvents,
    configureVideoTrimRange,
    updateLineupGameTimeCustomVisibility,
    refreshRosterGroupEditors,
    applySharedKiaSide,
    applySharedOpponentFineTune,
    syncAutoResultSelection,
    isResultManualOverride: () => resultManualOverride,
    updateResultPoster,
    updateLineupPoster,
    updateVideoPoster,
    updateVideoPreviewToggleVisibility,
    updateDownloadButtonLabel,
    updateSecondaryActionButtons
  });
}

function initializeApp() {
  bootstrapApp({
    el,
    init,
    applySharedOpponent,
    switchTab
  });
}

initializeApp();







