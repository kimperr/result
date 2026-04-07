export function switchTab({
  target,
  el,
  out,
  isMobilePreviewMode,
  setVideoPreviewMode,
  updateVideoPreviewToggleVisibility,
  updateDownloadButtonLabel,
  updateSecondaryActionButtons
}) {
  const isResult = target === 'result';
  const isLineup = target === 'lineup';
  const isVideo = target === 'video';
  const isRosterMoves = target === 'rosterMoves';
  el.tabResult.classList.toggle('active', isResult);
  el.tabLineup.classList.toggle('active', isLineup);
  el.tabVideo.classList.toggle('active', isVideo);
  el.tabRosterMoves.classList.toggle('active', isRosterMoves);
  el.resultControls.classList.toggle('active', isResult);
  el.lineupControls.classList.toggle('active', isLineup);
  el.videoControls.classList.toggle('active', isVideo);
  el.rosterMovesControls.classList.toggle('active', isRosterMoves);
  el.resultPoster.classList.toggle('active', isResult);
  el.lineupPoster.classList.toggle('active', isLineup);
  el.videoPoster.classList.toggle('active', isVideo);
  el.rosterMovesPoster.classList.toggle('active', isRosterMoves);
  out.resultMobilePreview.classList.toggle('active', isResult);
  out.lineupMobilePreview.classList.toggle('active', isLineup);
  out.rosterMovesMobilePreview.classList.toggle('active', isRosterMoves);
  el.previewScale.classList.toggle('video-mobile-plain', isVideo && isMobilePreviewMode());
  if (!isVideo) setVideoPreviewMode(false);
  updateVideoPreviewToggleVisibility();
  updateDownloadButtonLabel();
  updateSecondaryActionButtons();
}

export function waitForImageElement(img) {
  if (!img) return Promise.resolve();
  if (img instanceof HTMLVideoElement) {
    if (img.readyState >= 2) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => {
        img.removeEventListener('loadeddata', done);
        img.removeEventListener('error', done);
        resolve();
      };
      img.addEventListener('loadeddata', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }
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

export async function downloadImage({
  activeTab,
  el,
  exportVideo,
  waitForImageElement
}) {
  if (activeTab === 'video') {
    await exportVideo();
    return;
  }
  await document.fonts.ready;
  const poster = activeTab === 'result'
    ? el.resultPoster
    : activeTab === 'lineup'
      ? el.lineupPoster
      : el.rosterMovesPoster;
  const images = Array.from(poster.querySelectorAll('img, video'));
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

export function populateTeamSelect(selectEl, teamDb) {
  teamDb.forEach((team) => {
    const option = document.createElement('option');
    option.value = team.name;
    option.textContent = team.name;
    selectEl.appendChild(option);
  });
}

export function populatePlayerNameOptions(el, playerInfoList) {
  if (!el.playerNameOptions) return;
  el.playerNameOptions.innerHTML = '';
  playerInfoList.forEach((player) => {
    const option = document.createElement('option');
    option.value = player.name;
    el.playerNameOptions.appendChild(option);
  });
}

export function bindEvents({
  el,
  out,
  videoState,
  activeTab,
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
}) {
  syncFineTunePair(el.videoFrameXInput, el.videoFrameXRange);
  syncFineTunePair(el.videoFrameYInput, el.videoFrameYRange);
  syncFineTunePair(el.videoFrameScaleInput, el.videoFrameScaleRange);
  syncFineTunePair(el.videoTitleXInput, el.videoTitleXRange);
  syncFineTunePair(el.videoTitleYInput, el.videoTitleYRange);
  syncFineTunePair(el.videoTitleSizeInput, el.videoTitleSizeRange);
  syncFineTunePair(el.videoTitleSpacingInput, el.videoTitleSpacingRange);
  syncFineTunePair(el.videoTitleLineHeightInput, el.videoTitleLineHeightRange);
  syncFineTunePair(el.videoMetaXInput, el.videoMetaXRange);
  syncFineTunePair(el.videoMetaYInput, el.videoMetaYRange);
  syncFineTunePair(el.videoMetaSizeInput, el.videoMetaSizeRange);
  syncFineTunePair(el.callUpBoxXInput, el.callUpBoxXRange);
  syncFineTunePair(el.callUpBoxYInput, el.callUpBoxYRange);
  syncFineTunePair(el.sendDownBoxXInput, el.sendDownBoxXRange);
  syncFineTunePair(el.sendDownBoxYInput, el.sendDownBoxYRange);
  syncFineTunePair(el.callUpCardXInput, el.callUpCardXRange);
  syncFineTunePair(el.callUpCardYInput, el.callUpCardYRange);
  syncFineTunePair(el.sendDownCardXInput, el.sendDownCardXRange);
  syncFineTunePair(el.sendDownCardYInput, el.sendDownCardYRange);
  syncFineTunePair(el.callUpNameXInput, el.callUpNameXRange);
  syncFineTunePair(el.callUpNameYInput, el.callUpNameYRange);
  syncFineTunePair(el.callUpNameSizeInput, el.callUpNameSizeRange);
  syncFineTunePair(el.callUpNameSpacingInput, el.callUpNameSpacingRange);
  syncFineTunePair(el.callUpNameLineHeightInput, el.callUpNameLineHeightRange);
  syncFineTunePair(el.callUpMetaXInput, el.callUpMetaXRange);
  syncFineTunePair(el.callUpMetaYInput, el.callUpMetaYRange);
  syncFineTunePair(el.callUpMetaSizeInput, el.callUpMetaSizeRange);
  syncFineTunePair(el.callUpMetaSpacingInput, el.callUpMetaSpacingRange);
  syncFineTunePair(el.callUpMetaLineHeightInput, el.callUpMetaLineHeightRange);
  syncFineTunePair(el.sendDownNameXInput, el.sendDownNameXRange);
  syncFineTunePair(el.sendDownNameYInput, el.sendDownNameYRange);
  syncFineTunePair(el.sendDownNameSizeInput, el.sendDownNameSizeRange);
  syncFineTunePair(el.sendDownNameSpacingInput, el.sendDownNameSpacingRange);
  syncFineTunePair(el.sendDownNameLineHeightInput, el.sendDownNameLineHeightRange);
  syncFineTunePair(el.sendDownMetaXInput, el.sendDownMetaXRange);
  syncFineTunePair(el.sendDownMetaYInput, el.sendDownMetaYRange);
  syncFineTunePair(el.sendDownMetaSizeInput, el.sendDownMetaSizeRange);
  syncFineTunePair(el.sendDownMetaSpacingInput, el.sendDownMetaSpacingRange);
  syncFineTunePair(el.sendDownMetaLineHeightInput, el.sendDownMetaLineHeightRange);

  const resultInputs = [
    ...el.result, ...el.kiaSide, el.gameDate, el.opponentTeam,
    el.stadiumName, el.homeScore, el.awayScore, el.mvpName, el.mvpRecord,
    el.winnerName, el.loserName, el.saveName
  ].filter(Boolean);
  resultInputs.forEach((input) => {
    input.addEventListener('input', updateResultPoster);
    input.addEventListener('change', updateResultPoster);
    input.addEventListener('input', updateSecondaryActionButtons);
    input.addEventListener('change', updateSecondaryActionButtons);
  });
  el.result.forEach((input) => {
    input.addEventListener('change', () => {
      updateResultPoster(true);
      updateSecondaryActionButtons();
    });
  });
  el.kiaSide.forEach((input) => {
    input.addEventListener('change', () => {
      applySharedKiaSide(selectedValue(el.kiaSide));
    });
  });

  el.opponentTeam.addEventListener('change', () => {
    applySharedOpponent(el.opponentTeam.value);
  });

  const lineupInputs = [
    el.lineupDate,
    el.lineupOpponentTeam,
    el.lineupStadiumName,
    el.lineupPitcherName,
    el.lineupGameTime,
    el.lineupGameTimeCustom,
    el.lineupBroadcaster,
    el.lineupTerrestrial
  ].filter(Boolean);
  const lineupSideInputs = [...el.lineupKiaSide];
  lineupInputs.forEach((input) => {
    input.addEventListener('input', updateLineupPoster);
    input.addEventListener('change', updateLineupPoster);
    input.addEventListener('input', updateSecondaryActionButtons);
    input.addEventListener('change', updateSecondaryActionButtons);
  });
  el.lineupGameTime?.addEventListener('input', () => updateLineupGameTimeCustomVisibility(el));
  el.lineupGameTime?.addEventListener('change', () => updateLineupGameTimeCustomVisibility(el));
  lineupSideInputs.forEach((input) => {
    input.addEventListener('input', updateLineupPoster);
    input.addEventListener('change', updateLineupPoster);
  });
  el.lineupKiaSide.forEach((input) => {
    input.addEventListener('change', () => {
      applySharedKiaSide(selectedValue(el.lineupKiaSide));
    });
  });

  el.lineupInputGrid.addEventListener('input', updateLineupPoster);
  el.lineupInputGrid.addEventListener('input', updateSecondaryActionButtons);
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
    applySharedOpponent(el.lineupOpponentTeam.value);
  });

  [
    el.rosterMovesDate,
    el.rosterMovesOpponentTeam,
    el.rosterMovesStadiumName,
    el.callUpCount,
    el.sendDownCount
  ].filter(Boolean).forEach((input) => {
    input.addEventListener('input', () => {
      refreshRosterGroupEditors('callUp');
      refreshRosterGroupEditors('sendDown');
      updateRosterMovesPoster();
    });
    input.addEventListener('change', () => {
      refreshRosterGroupEditors('callUp');
      refreshRosterGroupEditors('sendDown');
      updateRosterMovesPoster();
    });
  });

  el.rosterMovesOpponentTeam.addEventListener('change', () => {
    applySharedOpponent(el.rosterMovesOpponentTeam.value);
  });
  el.rosterMovesImportBtn?.addEventListener('click', importRosterMovesByDate);
  el.rosterMovesStatsBtn?.addEventListener('click', refreshRosterMoveStats);
  [el.gameDate, el.lineupDate, el.videoDate, el.rosterMovesDate].filter(Boolean).forEach((input) => {
    input.addEventListener('change', () => {
      if (input.value) autoFillScheduleByDate(input.value);
    });
  });

  const videoInputs = [
    el.videoTitleInput,
    el.videoDate,
    el.videoOpponentTeam,
    el.videoMetaOverride,
    el.videoStartTime,
    el.videoEndTime,
    el.videoFrameXInput,
    el.videoFrameYInput,
    el.videoFrameXRange,
    el.videoFrameYRange,
    el.videoFrameScaleInput,
    el.videoFrameScaleRange,
    el.videoTitleXInput,
    el.videoTitleYInput,
    el.videoTitleXRange,
    el.videoTitleYRange,
    el.videoTitleSizeInput,
    el.videoTitleSizeRange,
    el.videoTitleSpacingInput,
    el.videoTitleSpacingRange,
    el.videoTitleLineHeightInput,
    el.videoTitleLineHeightRange,
    el.videoMetaXInput,
    el.videoMetaYInput,
    el.videoMetaXRange,
    el.videoMetaYRange,
    el.videoMetaSizeInput,
    el.videoMetaSizeRange
  ];
  videoInputs.forEach((input) => {
    input.addEventListener('input', updateVideoPoster);
    input.addEventListener('change', updateVideoPoster);
  });

  el.videoTrimStartRange.addEventListener('input', () => {
    syncVideoTrimInputs('start-range');
    updateVideoPoster('start');
  });
  el.videoTrimEndRange.addEventListener('input', () => {
    syncVideoTrimInputs('end-range');
    updateVideoPoster('end');
  });
  el.videoStartTime.addEventListener('input', () => {
    syncVideoTrimDraftInput('start-input');
    updateVideoPoster('start');
  });
  el.videoEndTime.addEventListener('input', () => {
    syncVideoTrimDraftInput('end-input');
    updateVideoPoster('end');
  });
  el.videoStartTime.addEventListener('change', () => {
    syncVideoTrimInputs('start-input');
    updateVideoPoster('start');
  });
  el.videoEndTime.addEventListener('change', () => {
    syncVideoTrimInputs('end-input');
    updateVideoPoster('end');
  });

  el.videoPlayToggle.addEventListener('click', async () => {
    const video = out.videoPreviewElement;
    if (!video.getAttribute('src')) return;
    if (video.paused) {
      const { start, end } = getVideoTrimTimes();
      if (video.currentTime < start || video.currentTime > end) {
        video.currentTime = start;
      }
      const playPromise = video.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    } else {
      video.pause();
    }
    updateVideoPlaybackUi();
  });

  el.videoPreviewToggleBtn.addEventListener('click', async () => {
    if (videoState.previewMode) {
      setVideoPreviewMode(false);
      return;
    }
    await renderVideoPreviewFrameImage();
  });

  el.videoPlaybackRange.addEventListener('input', () => {
    const video = out.videoPreviewElement;
    const nextTime = Number(el.videoPlaybackRange.value) || 0;
    video.currentTime = nextTime;
    updateVideoPlaybackUi();
  });

  el.videoFileInput.addEventListener('change', () => {
    const file = el.videoFileInput.files?.[0];
    if (videoState.objectUrl) {
      URL.revokeObjectURL(videoState.objectUrl);
      videoState.objectUrl = '';
    }
    if (!file) {
      videoState.sourceBytes = null;
      videoState.sourceExt = 'mp4';
      setVideoPreviewMode(false);
      out.videoPreviewElement.removeAttribute('src');
      out.videoPreviewElement.load();
      el.videoStartTime.value = '0';
      el.videoEndTime.value = '0';
      configureVideoTrimRange(0);
      updateVideoPoster();
      return;
    }
    videoState.sourceExt = getFileExtension(file.name, 'mp4');
    videoState.objectUrl = URL.createObjectURL(file);
    out.videoPreviewElement.src = videoState.objectUrl;
    out.videoPreviewElement.load();
    setVideoPreviewMode(false);
    file.arrayBuffer().then((buffer) => {
      videoState.sourceBytes = new Uint8Array(buffer);
    }).catch(() => {
      videoState.sourceBytes = null;
    });
  });

  out.videoPreviewElement.addEventListener('loadedmetadata', () => {
    out.videoPreviewElement.muted = false;
    out.videoPreviewElement.volume = 1;
    configureVideoTrimRange(out.videoPreviewElement.duration);
    updateVideoPoster();
  });

  out.videoPreviewElement.addEventListener('timeupdate', updateVideoPlaybackUi);
  out.videoPreviewElement.addEventListener('play', updateVideoPlaybackUi);
  out.videoPreviewElement.addEventListener('pause', updateVideoPlaybackUi);
  out.videoPreviewElement.addEventListener('seeked', updateVideoPlaybackUi);

  out.videoBgImage.addEventListener('error', () => {
    out.videoBgImage.style.display = 'none';
    el.videoPoster.querySelector('.video-canvas')?.classList.remove('has-bg-image');
    invalidateVideoOverlayCache();
  });

  out.videoBgImage.addEventListener('load', () => {
    out.videoBgImage.style.display = 'block';
    el.videoPoster.querySelector('.video-canvas')?.classList.add('has-bg-image');
    invalidateVideoOverlayCache();
    primeVideoOverlayCache().catch(() => {});
  });

  el.videoOpponentTeam.addEventListener('change', () => {
    applySharedOpponent(el.videoOpponentTeam.value);
  });

  el.tabResult.addEventListener('click', () => switchTab('result'));
  el.tabLineup.addEventListener('click', () => switchTab('lineup'));
  el.tabVideo.addEventListener('click', () => switchTab('video'));
  el.tabRosterMoves.addEventListener('click', () => switchTab('rosterMoves'));
  el.downloadBtn.addEventListener('click', downloadImage);
  el.followDownloadBtn.addEventListener('click', downloadFollowImage);
  el.copyCaptionBtn?.addEventListener('click', copyGeneratedCaption);
  window.addEventListener('resize', () => {
    el.previewScale.classList.toggle('video-mobile-plain', activeTab() === 'video' && isMobilePreviewMode());
    updateVideoPreviewToggleVisibility();
    updateSecondaryActionButtons();
    scheduleMobilePreviewRender();
  });

  bindNudgeButtons();
}

export function setToday(target) {
  const now = new Date();
  target.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function init({
  el,
  out,
  teamDb,
  playerInfoList,
  kiaHomeStadium,
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
  isResultManualOverride,
  updateResultPoster,
  updateLineupPoster,
  updateVideoPoster,
  updateVideoPreviewToggleVisibility,
  updateDownloadButtonLabel,
  updateSecondaryActionButtons
}) {
  buildLineupInputs(el);
  buildLineupTextLayer(out, lineupTextRefs);
  populateTeamSelect(el.opponentTeam, teamDb);
  populateTeamSelect(el.lineupOpponentTeam, teamDb);
  populateTeamSelect(el.videoOpponentTeam, teamDb);
  populateTeamSelect(el.rosterMovesOpponentTeam, teamDb);
  populatePlayerNameOptions(el, playerInfoList);
  initializeRosterMovesUi({
    el,
    out,
    rosterMoveEditors,
    rosterMovePreviewGroups,
    onVisibilityChange: updateRosterMovesFormVisibility,
    onPosterUpdate: updateRosterMovesPoster
  });

  el.opponentTeam.value = 'LG 트윈스';
  el.lineupOpponentTeam.value = 'LG 트윈스';
  el.videoOpponentTeam.value = 'LG 트윈스';
  el.rosterMovesOpponentTeam.value = 'LG 트윈스';
  el.stadiumName.value = kiaHomeStadium;
  el.lineupStadiumName.value = kiaHomeStadium;
  el.rosterMovesStadiumName.value = kiaHomeStadium;

  setToday(el.gameDate);
  setToday(el.lineupDate);
  setToday(el.videoDate);
  setToday(el.rosterMovesDate);

  if (out.videoBgImage.complete) {
    out.videoBgImage.style.display = out.videoBgImage.naturalWidth > 0 ? 'block' : 'none';
    el.videoPoster.querySelector('.video-canvas')?.classList.toggle('has-bg-image', out.videoBgImage.naturalWidth > 0);
  }

  bindEvents();
  configureVideoTrimRange(0);
  updateLineupGameTimeCustomVisibility(el);
  refreshRosterGroupEditors('callUp');
  refreshRosterGroupEditors('sendDown');
  applySharedKiaSide('home');
  syncAutoResultSelection(el, isResultManualOverride());
  updateResultPoster();
  updateLineupPoster();
  updateVideoPoster();
  updateRosterMovesPoster();
  updateVideoPreviewToggleVisibility();
  updateDownloadButtonLabel();
  updateSecondaryActionButtons();
}

export function initializeApp({
  el,
  init,
  applySharedOpponent,
  switchTab
}) {
  document.querySelector('.tab-row')?.prepend(el.tabLineup);
  init();
  applySharedOpponent('LG 트윈스');
  switchTab('lineup');
}
