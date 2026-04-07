import { BACKGROUND_BY_RESULT, RESULT_LAYOUT } from './constants.js';
import {
  formatDate,
  formatDisplayName,
  getPlayerPhotoPath,
  parseScoreInput,
  selectedValue,
  setSelectedRadioValue
} from './utils.js';

function teamLogoFile(code, side, result) {
  if (side === 'away') return `assets/logo/${code}1.png`;
  if (result === 'lose') return `assets/logo/${code}3.png`;
  return `assets/logo/${code}2.png`;
}

export function getAutoResultValue(el) {
  const side = selectedValue(el.kiaSide);
  const homeScore = parseScoreInput(el.homeScore.value);
  const awayScore = parseScoreInput(el.awayScore.value);
  const kiaScore = side === 'home' ? homeScore : awayScore;
  const opponentScore = side === 'home' ? awayScore : homeScore;

  if (kiaScore > opponentScore) return 'win';
  if (kiaScore < opponentScore) return 'lose';
  return 'draw';
}

export function syncAutoResultSelection(el, resultManualOverride) {
  if (resultManualOverride) return selectedValue(el.result) || 'win';
  const autoResult = getAutoResultValue(el);
  setSelectedRadioValue(el.result, autoResult);
  return autoResult;
}

export function getResultCaptionText(el, resultManualOverride) {
  const teamName = (el.opponentTeam.value || '').trim();
  const resultMap = { win: '승리', draw: '무승부', lose: '패배' };
  const resultLabel = resultMap[syncAutoResultSelection(el, resultManualOverride)] || '승리';
  const homeScore = el.homeScore.value || '0';
  const awayScore = el.awayScore.value || '0';
  return [
    `𝐅𝐈𝐍𝐀𝐋 vs ${teamName}`,
    `${awayScore} - ${homeScore} ${resultLabel}`
  ].join('\n');
}

export function updateResultPoster({
  el,
  out,
  resultManualOverride,
  selectedTeamInfo,
  applyText,
  applyTextAfterAnchor,
  applyBadge,
  scheduleMobilePreviewRender
}) {
  const result = syncAutoResultSelection(el, resultManualOverride);
  const side = selectedValue(el.kiaSide);
  const team = selectedTeamInfo(el.opponentTeam);

  out.backgroundLayer.src = BACKGROUND_BY_RESULT[result];
  el.resultPoster.style.setProperty('--global-letter-spacing', '-1px');

  out.dateText.textContent = formatDate(el.gameDate.value);
  out.opponentText.textContent = `vs ${team.name}`;
  out.stadiumText.textContent = el.stadiumName.value;
  out.homeScoreText.textContent = el.awayScore.value || '0';
  out.awayScoreText.textContent = el.homeScore.value || '0';

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
  out.mvpNameText.textContent = formatDisplayName(el.mvpName.value);
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
  const mvpRecordGap = Number(el.mvpRecordGapInput?.value);

  applyText(out.dateText, RESULT_LAYOUT.dateText);
  applyTextAfterAnchor(out.opponentText, RESULT_LAYOUT.opponentText, out.dateText, RESULT_LAYOUT.dateText, RESULT_LAYOUT.opponentText.x);
  applyText(out.stadiumText, RESULT_LAYOUT.stadiumText);
  applyText(out.homeScoreText, RESULT_LAYOUT.homeScoreText);
  applyText(out.awayScoreText, RESULT_LAYOUT.awayScoreText);
  applyText(out.winnerText, RESULT_LAYOUT.winnerText);
  applyText(out.loserText, RESULT_LAYOUT.loserText);
  applyText(out.saveText, RESULT_LAYOUT.saveText);
  applyText(out.mvpNameText, RESULT_LAYOUT.mvpNameText);
  applyTextAfterAnchor(
    out.mvpRecordText,
    RESULT_LAYOUT.mvpRecordText,
    out.mvpNameText,
    RESULT_LAYOUT.mvpNameText,
    Number.isFinite(mvpRecordGap) ? mvpRecordGap : RESULT_LAYOUT.mvpRecordText.x
  );
  applyBadge(out.badgeWin, RESULT_LAYOUT.badgeWin);
  applyBadge(out.badgeLose, RESULT_LAYOUT.badgeLose);
  applyBadge(out.badgeSave, RESULT_LAYOUT.badgeSave);
  scheduleMobilePreviewRender();
}
