import {
  KIA_HOME_STADIUM,
  MAX_ROSTER_GROUPS,
  PLAYER_INFO_LIST,
  TEAM_DB
} from './constants.js';
import {
  escapeDrawtext,
  formatDate,
  getFileExtension,
  getPlayerPhotoPath,
  normalizeInningsValue,
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
  applyTextAfterAnchor,
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
import {
  fetchKboRosterMovesByDate,
  fetchKboScheduleByDate,
  fetchKboPlayerStats,
  getKboProxyOrigin,
  setKboProxyOrigin
} from './kboRosterSync.js';


let activeTab = 'result';
const lineupTextRefs = { names: {}, positions: {} };
const rosterMoveEditors = { callUp: [], sendDown: [] };
const rosterMovePreviewGroups = { callUp: [], sendDown: [] };
let mobilePreviewTimer = null;
const copyToastState = { timer: null };
const rosterImportState = { isLoading: false, isRefreshingStats: false };
const rosterAutoFetchState = {};
const scheduleAutoFillState = { requestId: 0, lastDateValue: '', lastAutoPitcherName: '' };
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
    applyTextAfterAnchor,
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
    applyTextAfterAnchor,
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
    applyTextAfterAnchor,
    applyAdvancedText,
    applyPositionOnly,
    scheduleMobilePreviewRender
  });
}

function setRosterImportStatus(message, tone = 'neutral') {
  if (!el.rosterMovesImportStatus) return;
  const nextMessage = typeof message === 'string' ? message.trim() : '';
  el.rosterMovesImportStatus.textContent = nextMessage;
  el.rosterMovesImportStatus.classList.toggle('has-message', Boolean(nextMessage));
  el.rosterMovesImportStatus.classList.remove('is-loading', 'is-success', 'is-error');
  if (!nextMessage) return;
  if (tone === 'loading') el.rosterMovesImportStatus.classList.add('is-loading');
  if (tone === 'success') el.rosterMovesImportStatus.classList.add('is-success');
  if (tone === 'error') el.rosterMovesImportStatus.classList.add('is-error');
}

function clearRosterEditor(editorRefs) {
  if (!editorRefs) return;
  editorRefs.nameInput.value = '';
  clearRosterStats(editorRefs);
}

function clearRosterStats(editorRefs) {
  if (!editorRefs) return;
  editorRefs.pitcherGames.value = '';
  editorRefs.pitcherWins.value = '';
  editorRefs.pitcherLosses.value = '';
  editorRefs.pitcherSaves.value = '';
  editorRefs.pitcherHolds.value = '';
  editorRefs.pitcherInnings.value = '';
  editorRefs.pitcherInnings.dataset.lastValidInnings = '0';
  editorRefs.pitcherEra.value = '';
  editorRefs.pitcherWhip.value = '';
  editorRefs.hitterGames.value = '';
  editorRefs.hitterHomeRuns.value = '';
  editorRefs.hitterRbi.value = '';
  editorRefs.hitterSteals.value = '';
  editorRefs.hitterAvg.value = '';
  editorRefs.hitterOps.value = '';
}

function getRosterAutoFetchKey(section, index) {
  return `${section}:${index}`;
}

function getRosterAutoFetchState(section, index) {
  const key = getRosterAutoFetchKey(section, index);
  if (!rosterAutoFetchState[key]) {
    rosterAutoFetchState[key] = {
      pendingName: '',
      lastAppliedName: '',
      requestId: 0
    };
  }
  return rosterAutoFetchState[key];
}

function applyImportedPlayer(editorRefs, player) {
  clearRosterEditor(editorRefs);
  if (!editorRefs || !player) return;

  editorRefs.nameInput.value = player.name || '';

  if (player.statsType === 'pitcher') {
    editorRefs.pitcherGames.value = String(player.stats?.games ?? '');
    editorRefs.pitcherWins.value = String(player.stats?.wins ?? '');
    editorRefs.pitcherLosses.value = String(player.stats?.losses ?? '');
    editorRefs.pitcherSaves.value = String(player.stats?.saves ?? '');
    editorRefs.pitcherHolds.value = String(player.stats?.holds ?? '');
    const normalizedInnings = normalizeInningsValue(player.stats?.innings ?? '');
    editorRefs.pitcherInnings.value = normalizedInnings;
    editorRefs.pitcherInnings.dataset.lastValidInnings = normalizedInnings || '0';
    editorRefs.pitcherEra.value = String(player.stats?.era ?? '');
    editorRefs.pitcherWhip.value = String(player.stats?.whip ?? '');
    return;
  }

  editorRefs.hitterGames.value = String(player.stats?.games ?? '');
  editorRefs.hitterHomeRuns.value = String(player.stats?.homeRuns ?? '');
  editorRefs.hitterRbi.value = String(player.stats?.rbi ?? '');
  editorRefs.hitterSteals.value = String(player.stats?.steals ?? '');
  editorRefs.hitterAvg.value = String(player.stats?.avg ?? '');
  editorRefs.hitterOps.value = String(player.stats?.ops ?? '');
}

function applyImportedRosterSection(section, players) {
  const safePlayers = Array.isArray(players) ? players.slice(0, MAX_ROSTER_GROUPS) : [];
  const countInput = section === 'callUp' ? el.callUpCount : el.sendDownCount;
  if (countInput) countInput.value = String(safePlayers.length);

  rosterMoveEditors[section].forEach((editorRefs, index) => {
    applyImportedPlayer(editorRefs, safePlayers[index] || null);
    updateRosterMovesFormVisibility(section, index);
  });
  refreshRosterGroupEditors(section);
}

function buildRosterImportSummary(data) {
  const callUpCount = Array.isArray(data.callUp) ? data.callUp.length : 0;
  const sendDownCount = Array.isArray(data.sendDown) ? data.sendDown.length : 0;
  const warnings = Array.isArray(data.warnings) ? data.warnings : [];
  const parts = [
    `${data.date} KIA 이동 현황을 불러왔습니다.`,
    `CALL-UP ${Math.min(callUpCount, MAX_ROSTER_GROUPS)}명`,
    `SEND-DOWN ${Math.min(sendDownCount, MAX_ROSTER_GROUPS)}명`
  ];

  if (callUpCount > MAX_ROSTER_GROUPS || sendDownCount > MAX_ROSTER_GROUPS) {
    parts.push('포스터 슬롯 제한으로 초과 선수는 자동 생략했습니다.');
  }
  if (warnings.length) {
    parts.push(warnings[0]);
  }
  return parts.join(' ');
}

function setSharedDateValue(dateValue) {
  [el.gameDate, el.lineupDate, el.videoDate, el.rosterMovesDate].forEach((input) => {
    if (input) input.value = dateValue;
  });
}

function setLineupGameTimeValue(gameTime) {
  if (!el.lineupGameTime) return;
  const normalized = String(gameTime || '').trim();
  if (!normalized) return;

  const hasExactOption = Array.from(el.lineupGameTime.options).some((option) => option.value === normalized);
  if (hasExactOption) {
    el.lineupGameTime.value = normalized;
    if (el.lineupGameTimeCustom) el.lineupGameTimeCustom.value = '';
    updateLineupGameTimeCustomVisibility(el);
    return;
  }

  el.lineupGameTime.value = 'custom';
  if (el.lineupGameTimeCustom) el.lineupGameTimeCustom.value = normalized;
  updateLineupGameTimeCustomVisibility(el);
}

function setLineupBroadcasterValue(broadcaster) {
  if (!el.lineupBroadcaster) return;
  const normalized = String(broadcaster || '').trim();
  if (!normalized) return;

  const terrestrialMap = {
    KBS2: 'KBS N SPORTS',
    SBS: 'SBS SPORTS',
    MBC: 'MBC SPORTS+'
  };
  const isTerrestrial = Object.prototype.hasOwnProperty.call(terrestrialMap, normalized);
  const targetValue = terrestrialMap[normalized] || normalized;

  let option = Array.from(el.lineupBroadcaster.options).find((item) => item.value === targetValue);
  if (!option) {
    option = new Option(targetValue, targetValue);
    el.lineupBroadcaster.add(option);
  }
  el.lineupBroadcaster.value = targetValue;
  if (el.lineupTerrestrial) el.lineupTerrestrial.checked = isTerrestrial;
}

function setLineupStartingPitcher(name, force = false) {
  if (!el.lineupPitcherName) return;
  const nextName = String(name || '').trim();
  const currentName = String(el.lineupPitcherName.value || '').trim();
  const canOverwrite = force || !currentName || currentName === scheduleAutoFillState.lastAutoPitcherName;

  if (!nextName) {
    if (currentName && currentName === scheduleAutoFillState.lastAutoPitcherName) {
      el.lineupPitcherName.value = '';
      scheduleAutoFillState.lastAutoPitcherName = '';
    }
    return;
  }

  if (!canOverwrite) return;
  el.lineupPitcherName.value = nextName;
  scheduleAutoFillState.lastAutoPitcherName = nextName;
}

async function autoFillScheduleByDate(dateValue, options = {}) {
  const { syncDates = true, silent = false, force = false } = options;
  const normalizedDate = String(dateValue || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) return false;
  if (!force && scheduleAutoFillState.lastDateValue === normalizedDate) return true;

  const requestId = scheduleAutoFillState.requestId + 1;
  scheduleAutoFillState.requestId = requestId;

  try {
    const schedule = await fetchKboScheduleByDate({ dateValue: normalizedDate });
    if (scheduleAutoFillState.requestId !== requestId) return false;
    if (!schedule?.found) {
      scheduleAutoFillState.lastDateValue = normalizedDate;
      return false;
    }

    if (syncDates) setSharedDateValue(schedule.date || normalizedDate);
    applySharedKiaSide(schedule.kiaSide === 'away' ? 'away' : 'home');
    if (schedule.opponentTeam) applySharedOpponent(schedule.opponentTeam);
    setLineupGameTimeValue(schedule.gameTime);
    setLineupBroadcasterValue(schedule.broadcaster);
    setLineupStartingPitcher(schedule.startingPitcher, force);
    scheduleAutoFillState.lastDateValue = normalizedDate;
    updateResultPoster();
    updateLineupPoster();
    updateVideoPoster();
    updateRosterMovesPoster();
    updateSecondaryActionButtons();
    return true;
  } catch (error) {
    if (scheduleAutoFillState.requestId !== requestId) return false;
    if (!silent) {
      console.warn('KBO schedule auto-fill failed:', error);
    }
    return false;
  }
}

async function autoFetchRosterPlayerStats(section, index, options = {}) {
  const editorRefs = rosterMoveEditors[section]?.[index];
  if (!editorRefs) return;
  const { force = false } = options;

  const playerName = (editorRefs.nameInput?.value || '').trim();
  const state = getRosterAutoFetchState(section, index);
  state.pendingName = playerName;

  if (!playerName) {
    state.lastAppliedName = '';
    clearRosterEditor(editorRefs);
    updateRosterMovesFormVisibility(section, index);
    updateRosterMovesPoster();
    return;
  }

  if (!force && state.lastAppliedName === playerName) return false;

  const requestId = state.requestId + 1;
  state.requestId = requestId;

  try {
    const data = await fetchKboPlayerStats({
      name: playerName,
      section,
      dateValue: el.rosterMovesDate?.value || ''
    });
    if (state.requestId !== requestId) return;
    if ((editorRefs.nameInput?.value || '').trim() !== playerName) return;
    applyImportedPlayer(editorRefs, data.player || { name: playerName, statsType: data.statsType, stats: {} });
    state.lastAppliedName = playerName;
    updateRosterMovesFormVisibility(section, index);
    updateRosterMovesPoster();
    return Boolean(data.player);
  } catch (error) {
    if (state.requestId !== requestId) return;
    state.lastAppliedName = '';
    if (force) {
      clearRosterStats(editorRefs);
      editorRefs.nameInput.value = playerName;
    }
    updateRosterMovesFormVisibility(section, index);
    updateRosterMovesPoster();
    return false;
  }
}

async function refreshRosterMoveStats() {
  if (rosterImportState.isLoading || rosterImportState.isRefreshingStats) return;

  const dateValue = el.rosterMovesDate?.value || '';
  if (!dateValue) {
    setRosterImportStatus('등말소 날짜를 먼저 선택한 뒤 선수 성적을 불러와 주세요.', 'error');
    return;
  }

  const targets = [];
  ['callUp', 'sendDown'].forEach((section) => {
    rosterMoveEditors[section].forEach((editorRefs, index) => {
      const playerName = (editorRefs.nameInput?.value || '').trim();
      if (!playerName) return;
      targets.push({ section, index, playerName });
    });
  });

  if (!targets.length) {
    setRosterImportStatus('성적을 불러올 선수 이름이 아직 없습니다.', 'error');
    return;
  }

  rosterImportState.isRefreshingStats = true;
  if (el.rosterMovesImportBtn) el.rosterMovesImportBtn.disabled = true;
  if (el.rosterMovesStatsBtn) el.rosterMovesStatsBtn.disabled = true;
  setRosterImportStatus(`${targets.length}명 선수 성적을 다시 불러오는 중입니다...`, 'loading');

  try {
    let successCount = 0;
    for (const target of targets) {
      const applied = await autoFetchRosterPlayerStats(target.section, target.index, {
        force: true
      });
      if (applied) successCount += 1;
    }

    const failedCount = targets.length - successCount;
    if (successCount) {
      const message = failedCount
        ? `선수 성적 ${successCount}명을 채웠고 ${failedCount}명은 기록을 찾지 못했습니다.`
        : `선수 성적 ${successCount}명을 모두 다시 채웠습니다.`;
      setRosterImportStatus(message, failedCount ? 'error' : 'success');
    } else {
      setRosterImportStatus('입력된 이름으로는 선수 성적을 찾지 못했습니다.', 'error');
    }
  } finally {
    rosterImportState.isRefreshingStats = false;
    if (el.rosterMovesImportBtn) el.rosterMovesImportBtn.disabled = false;
    if (el.rosterMovesStatsBtn) el.rosterMovesStatsBtn.disabled = false;
  }
}

function initializeRosterProxyOrigin() {
  if (!el.rosterMovesApiOrigin) return;
  el.rosterMovesApiOrigin.value = getKboProxyOrigin();
  const persist = () => {
    const nextOrigin = setKboProxyOrigin(el.rosterMovesApiOrigin.value);
    el.rosterMovesApiOrigin.value = nextOrigin;
    setRosterImportStatus(`KBO API 주소를 ${nextOrigin} 로 설정했습니다.`, 'success');
  };
  el.rosterMovesApiOrigin.addEventListener('change', persist);
  el.rosterMovesApiOrigin.addEventListener('blur', persist);
}

async function importRosterMovesByDate() {
  if (rosterImportState.isLoading) return;

  const dateValue = el.rosterMovesDate?.value || '';
  if (!dateValue) {
    setRosterImportStatus('등말소 날짜를 먼저 선택해 주세요.', 'error');
    return;
  }

  rosterImportState.isLoading = true;
  if (el.rosterMovesImportBtn) el.rosterMovesImportBtn.disabled = true;
  if (el.rosterMovesStatsBtn) el.rosterMovesStatsBtn.disabled = true;
  setRosterImportStatus(`${dateValue} KIA 이동 현황을 불러오는 중입니다...`, 'loading');

  try {
    const data = await fetchKboRosterMovesByDate({ dateValue });
    applyImportedRosterSection('callUp', data.callUp);
    applyImportedRosterSection('sendDown', data.sendDown);
    updateRosterMovesPoster();
    setRosterImportStatus(buildRosterImportSummary(data), 'success');
  } catch (error) {
    setRosterImportStatus(
      error instanceof Error ? error.message : 'KBO 등말소 불러오기에 실패했습니다.',
      'error'
    );
  } finally {
    rosterImportState.isLoading = false;
    if (el.rosterMovesImportBtn) el.rosterMovesImportBtn.disabled = false;
    if (el.rosterMovesStatsBtn) el.rosterMovesStatsBtn.disabled = false;
  }
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
    importRosterMovesByDate,
    refreshRosterMoveStats,
    autoFillScheduleByDate,
    autoFetchRosterPlayerStats,
    syncFineTunePair,
    bindNudgeButtons,
    updateLineupGameTimeCustomVisibility
  });
}

function init() {
  initializeRosterProxyOrigin();
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
    onAutoStatsFetch: autoFetchRosterPlayerStats,
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
  void autoFillScheduleByDate(el.lineupDate?.value || '', { syncDates: true, silent: true, force: true });
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







