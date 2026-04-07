export async function exportVideo({
  el,
  out,
  getTrimTimes,
  getOverlaySnapshot,
  waitForImageElement,
  exportFast
}) {
  const sourceVideo = out.videoPreviewElement;
  const sourceFile = el.videoFileInput.files?.[0];
  if (!sourceVideo.getAttribute('src') || !sourceFile) {
    window.alert('먼저 영상 파일을 업로드해 주세요.');
    return;
  }

  await document.fonts.ready;
  await waitForImageElement(sourceVideo);
  await waitForImageElement(out.videoBgImage);

  const { start, end } = getTrimTimes();
  const { layout, titleLines, metaLines, titleTop, metaTop } = getOverlaySnapshot();
  await exportFast(sourceVideo, start, end, layout, titleLines, metaLines, titleTop, metaTop);
}

export async function exportVideoFast({
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
}) {
  const TARGET_EXPORT_FPS = 60;
  const TARGET_VIDEO_BITS_PER_SECOND = 24_000_000;
  const TARGET_AUDIO_BITS_PER_SECOND = 192_000;
  const duration = Math.max(0.1, end - start);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    window.alert('브라우저에서 영상 캔버스를 만들 수 없습니다.');
    return;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const formats = [
    { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4' },
    { mimeType: 'video/mp4', ext: 'mp4' },
    { mimeType: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mimeType: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mimeType: 'video/webm', ext: 'webm' }
  ];
  const selectedFormat = formats.find((format) => MediaRecorder.isTypeSupported(format.mimeType)) || formats[formats.length - 1];
  const stream = canvas.captureStream(TARGET_EXPORT_FPS);
  const exportVideo = await prepareVideoExport(sourceVideo, start);
  const overlayBitmap = await primeVideoOverlayBitmapCache();
  setVideoSaveProgress(0, '以鍮꾩쨷 0%');

  try {
    const exportStream = typeof exportVideo.captureStream === 'function' ? exportVideo.captureStream() : null;
    if (exportStream) {
      exportStream.getAudioTracks().forEach((track) => stream.addTrack(track));
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: selectedFormat.mimeType,
      videoBitsPerSecond: TARGET_VIDEO_BITS_PER_SECOND,
      audioBitsPerSecond: TARGET_AUDIO_BITS_PER_SECOND
    });
    const chunks = [];
    recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    });

    const stopped = new Promise((resolve) => {
      recorder.addEventListener('stop', resolve, { once: true });
    });

    let stopRequested = false;
    let frameRequestId = null;
    let rafId = null;

    const stopRecording = () => {
      if (stopRequested) return;
      stopRequested = true;
      if (frameRequestId !== null && typeof exportVideo.cancelVideoFrameCallback === 'function') {
        exportVideo.cancelVideoFrameCallback(frameRequestId);
      }
      if (rafId !== null) cancelAnimationFrame(rafId);
      exportVideo.pause();
      if (recorder.state !== 'inactive') recorder.stop();
    };

    const renderLoop = () => {
      drawVideoCompositeFrame(ctx, exportVideo, layout, overlayBitmap);
      const progress = ((exportVideo.currentTime - start) / duration) * 100;
      setVideoSaveProgress(progress, `저장중 ${Math.max(0, Math.min(100, Math.round(progress)))}%`);
      if (exportVideo.currentTime >= end || exportVideo.ended) {
        stopRecording();
        return;
      }
      if (typeof exportVideo.requestVideoFrameCallback === 'function') {
        frameRequestId = exportVideo.requestVideoFrameCallback(() => {
          frameRequestId = null;
          renderLoop();
        });
      } else {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          renderLoop();
        });
      }
    };

    exportVideo.addEventListener('ended', stopRecording, { once: true });

    recorder.start(250);
    drawVideoCompositeFrame(ctx, exportVideo, layout, overlayBitmap);
    setVideoSaveProgress(1, '저장중 1%');
    const playPromise = exportVideo.play();
    if (playPromise?.catch) playPromise.catch(() => {});
    renderLoop();

    await new Promise((resolve) => {
      const safetyTimer = window.setTimeout(() => {
        stopRecording();
        resolve();
      }, Math.ceil(duration * 1000) + 3000);

      recorder.addEventListener('stop', () => {
        window.clearTimeout(safetyTimer);
        resolve();
      }, { once: true });
    });

    await stopped;

    const blob = new Blob(chunks, { type: selectedFormat.mimeType });
    setVideoSaveProgress(100, '저장 완료');
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `video-${Date.now()}.${selectedFormat.ext}`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  } finally {
    exportVideo.pause();
    exportVideo.removeAttribute('src');
    exportVideo.load();
    exportVideo.remove();
    window.setTimeout(() => hideVideoSaveProgress(), 600);
    updateVideoPoster();
  }
}
