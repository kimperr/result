import { LINEUP_FIXED, LINEUP_LAYOUT } from './constants.js';
import { formatDate, formatDisplayName, formatLineupPosition, getPlayerPhotoPath } from './utils.js';

export function getLineupBroadcastLabel(el) {
  const broadcaster = el.lineupBroadcaster?.value || 'KBS N SPORTS';
  if (!el.lineupTerrestrial?.checked) return broadcaster;
  const terrestrialMap = {
    'KBS N SPORTS': 'KBS2',
    'SBS SPORTS': 'SBS',
    'MBC SPORTS+': 'MBC'
  };
  return terrestrialMap[broadcaster] || broadcaster;
}

export function getLineupGameTimeLabel(el) {
  const selected = el.lineupGameTime?.value || '18:30';
  if (selected === 'custom') {
    return (el.lineupGameTimeCustom?.value || '').trim() || '직접입력';
  }
  return selected;
}

export function updateLineupGameTimeCustomVisibility(el) {
  const customField = el.lineupGameTimeCustom?.closest('label');
  if (!customField) return;
  customField.style.display = el.lineupGameTime?.value === 'custom' ? '' : 'none';
}

export function getLineupCaptionText(el) {
  const teamName = (el.lineupOpponentTeam.value || '').trim();
  const timeLabel = getLineupGameTimeLabel(el);
  const broadcasterLabel = getLineupBroadcastLabel(el);
  return [
    `𝐖𝐈𝐍𝐍𝐈𝐍𝐆 𝐋𝐈𝐍𝐄𝐔𝐏 vs ${teamName}`,
    `⏰️ ${timeLabel} / 📺 ${broadcasterLabel}`
  ].join('\n');
}

export function buildLineupInputs(el) {
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

export function buildLineupTextLayer(out, lineupTextRefs) {
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

export function updateLineupPoster({
  el,
  out,
  lineupTextRefs,
  selectedTeamInfo,
  applyText,
  applyTextAfterAnchor,
  scheduleMobilePreviewRender
}) {
  const team = selectedTeamInfo(el.lineupOpponentTeam);

  out.lineupDateText.textContent = formatDate(el.lineupDate.value);
  LINEUP_LAYOUT.opponentText.x = Number(el.lineupOpponentXInput.value) || LINEUP_LAYOUT.opponentText.x;
  LINEUP_LAYOUT.opponentText.y = Number(el.lineupOpponentYInput.value) || LINEUP_LAYOUT.opponentText.y;
  out.lineupOpponentText.textContent = `vs ${team.name}`;
  out.lineupStadiumText.textContent = el.lineupStadiumName.value;
  out.lineupPitcherText.textContent = formatDisplayName(el.lineupPitcherName.value);
  const lineupPhotoPath = getPlayerPhotoPath(el.lineupPitcherName.value);
  out.lineupPlayerPhoto.classList.toggle('is-hidden', !lineupPhotoPath);
  if (lineupPhotoPath) out.lineupPlayerPhoto.src = lineupPhotoPath;
  const spacing = Number(el.lineupLetterSpacing.value);
  el.lineupPoster.style.setProperty('--global-letter-spacing', `${Number.isFinite(spacing) ? spacing : -1}px`);

  applyText(out.lineupDateText, LINEUP_LAYOUT.dateText);
  applyTextAfterAnchor(out.lineupOpponentText, LINEUP_LAYOUT.opponentText, out.lineupDateText, LINEUP_LAYOUT.dateText, LINEUP_LAYOUT.opponentText.x);
  applyText(out.lineupStadiumText, LINEUP_LAYOUT.stadiumText);
  applyText(out.lineupPitcherText, LINEUP_LAYOUT.pitcher);

  for (let i = 1; i <= 9; i += 1) {
    const name = document.getElementById(`lineupName${i}`)?.value || '';
    const pos = formatLineupPosition(document.getElementById(`lineupPos${i}`)?.value || '');

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
