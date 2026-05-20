import { CANCELED_LOGO_LAYOUT, CANCELED_MESSAGE_LAYOUT, RESULT_LAYOUT } from './constants.js';
import {
  formatDate,
  formatOpponentLabel,
  isTravelDayOpponent,
  selectedValue
} from './utils.js';

function teamLogoFile(code, side) {
  return `assets/logo/${code}${side === 'away' ? '1' : '2'}.png`;
}

function numberValue(input, fallback) {
  const value = Number(input?.value);
  return Number.isFinite(value) ? value : fallback;
}

function logoLayout(fallback) {
  return {
    x: fallback.x,
    y: fallback.y,
    scale: fallback.scale
  };
}

function messageLayout(el) {
  return {
    x: numberValue(el.canceledMessageXInput, CANCELED_MESSAGE_LAYOUT.x),
    y: numberValue(el.canceledMessageYInput, CANCELED_MESSAGE_LAYOUT.y),
    size: numberValue(el.canceledMessageSizeInput, CANCELED_MESSAGE_LAYOUT.size),
    letterSpacing: numberValue(el.canceledMessageSpacingInput, CANCELED_MESSAGE_LAYOUT.letterSpacing),
    lineHeight: numberValue(el.canceledMessageLineHeightInput, CANCELED_MESSAGE_LAYOUT.lineHeight)
  };
}

function selectedCustomValue(select, customInput, fallback) {
  if (select?.value === 'custom') {
    return (customInput?.value || '').trim() || fallback;
  }
  return select?.value || fallback;
}

function withReasonPostposition(reason) {
  if (!reason) return '우천으로';
  const lastChar = reason.trim().at(-1);
  if (!lastChar) return '우천으로';
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return `${reason}로`;
  const jong = (code - 0xac00) % 28;
  return jong && jong !== 8 ? `${reason}으로` : `${reason}로`;
}

function updateCustomFieldVisibility(select, customInput) {
  const field = customInput?.closest('label');
  if (field) field.style.display = select?.value === 'custom' ? '' : 'none';
}

function getCanceledTextParts(el) {
  const reason = selectedCustomValue(el.canceledReasonSelect, el.canceledReasonCustom, '우천');
  const schedule = selectedCustomValue(el.canceledScheduleSelect, el.canceledScheduleCustom, '추후 편성');
  return {
    reasonText: withReasonPostposition(reason),
    scheduleText: schedule
  };
}

function applyLogoLayout(node, cfg) {
  const scale = Math.max(Number(cfg.scale) || 100, 1) / 100;
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = `${1080 * scale}px`;
  node.style.height = `${1350 * scale}px`;
}

function applyMessageLayout(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = `${CANCELED_MESSAGE_LAYOUT.width}px`;
  node.style.fontSize = `${cfg.size}px`;
  node.style.letterSpacing = `${cfg.letterSpacing}px`;
  node.style.lineHeight = `${cfg.lineHeight}px`;
}

export function getCanceledCaptionText(el) {
  const opponentLabel = formatOpponentLabel(
    (el.canceledOpponentTeam?.value || '').trim(),
    isTravelDayOpponent(el.canceledOpponentTeam)
  );
  const { reasonText, scheduleText } = getCanceledTextParts(el);
  return [
    `𝐆𝐚𝐦𝐞 𝐂𝐚𝐧𝐜𝐞𝐥𝐞𝐝 ${opponentLabel}`,
    `오늘 경기는 ${reasonText} 취소되었습니다.`,
    `취소된 경기는 ${scheduleText} 됩니다.`
  ].join('\n');
}

export function updateCanceledPoster({
  el,
  out,
  selectedTeamInfo,
  applyText,
  applyTextAfterAnchor,
  scheduleMobilePreviewRender
}) {
  const side = selectedValue(el.canceledKiaSide);
  const team = selectedTeamInfo(el.canceledOpponentTeam);
  const isTravelDay = isTravelDayOpponent(el.canceledOpponentTeam);
  const kiaIsHome = side === 'home';
  const homeLogoLayout = logoLayout(CANCELED_LOGO_LAYOUT.homeLogo);
  const awayLogoLayout = logoLayout(CANCELED_LOGO_LAYOUT.awayLogo);
  const { reasonText, scheduleText } = getCanceledTextParts(el);

  el.canceledPoster.style.setProperty('--global-letter-spacing', '-1px');
  out.canceledDateText.textContent = formatDate(el.canceledDate.value);
  out.canceledOpponentText.textContent = formatOpponentLabel(team.name, isTravelDay);
  out.canceledStadiumText.textContent = el.canceledStadiumName.value;
  updateCustomFieldVisibility(el.canceledReasonSelect, el.canceledReasonCustom);
  updateCustomFieldVisibility(el.canceledScheduleSelect, el.canceledScheduleCustom);
  out.canceledMessageText.textContent = `오늘 경기는 ${reasonText} 취소되었습니다.\n취소된 경기는 ${scheduleText} 됩니다.`;

  out.canceledHomeLogo.src = teamLogoFile('kia', kiaIsHome ? 'home' : 'away');
  out.canceledAwayLogo.src = teamLogoFile(team.code, kiaIsHome ? 'away' : 'home');

  applyText(out.canceledDateText, RESULT_LAYOUT.dateText);
  applyTextAfterAnchor(
    out.canceledOpponentText,
    RESULT_LAYOUT.opponentText,
    out.canceledDateText,
    RESULT_LAYOUT.dateText,
    RESULT_LAYOUT.opponentText.x
  );
  applyText(out.canceledStadiumText, RESULT_LAYOUT.stadiumText);
  applyLogoLayout(out.canceledHomeLogo, kiaIsHome ? homeLogoLayout : awayLogoLayout);
  applyLogoLayout(out.canceledAwayLogo, kiaIsHome ? awayLogoLayout : homeLogoLayout);
  applyMessageLayout(out.canceledMessageText, messageLayout(el));
  scheduleMobilePreviewRender();
}
