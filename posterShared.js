export function selectedTeamInfo(teamDb, selectEl) {
  return teamDb.find((team) => team.name === selectEl.value) || teamDb[0];
}

export function selectedTeamInfoByName(teamDb, teamName) {
  return teamDb.find((team) => team.name === teamName) || teamDb[0];
}

export function applyText(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.fontSize = `${cfg.size}px`;
}

export function applyBadge(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = `${cfg.size}px`;
  node.style.height = `${cfg.size}px`;
  node.style.lineHeight = `${cfg.size}px`;
  node.style.fontSize = `${cfg.font}px`;
}

export function applyAdvancedText(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.fontSize = `${cfg.size}px`;
  if (cfg.letterSpacing != null) node.style.letterSpacing = `${cfg.letterSpacing}px`;
  if (cfg.lineHeight != null) node.style.lineHeight = `${cfg.lineHeight}px`;
}

export function applyScaledImage(node, cfg, baseWidth, baseHeight) {
  const scale = (Number(cfg.scale) || 100) / 100;
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = `${baseWidth * scale}px`;
  node.style.height = `${baseHeight * scale}px`;
}

export function applyPositionOnly(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = '';
  node.style.height = '';
}

export function isMobilePreviewMode() {
  return window.matchMedia('(max-width: 768px)').matches;
}

export async function renderMobilePreview({
  tabName,
  el,
  out,
  waitForImageElement,
  isMobilePreviewMode
}) {
  if (!window.html2canvas || !isMobilePreviewMode()) return;

  const poster = tabName === 'result'
    ? el.resultPoster
    : tabName === 'lineup'
      ? el.lineupPoster
      : el.rosterMovesPoster;
  const preview = tabName === 'result'
    ? out.resultMobilePreview
    : tabName === 'lineup'
      ? out.lineupMobilePreview
      : out.rosterMovesMobilePreview;
  const posterCanvas = poster.querySelector('.poster-canvas');
  const images = Array.from(poster.querySelectorAll('img, video'));

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
