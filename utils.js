import {
  LINEUP_POSITION_MAP,
  PLAYER_INFO_BY_NAME,
  PLAYER_INFO_LIST,
  PLAYER_NUMBER_BY_NAME
} from './constants.js';

export function selectedValue(radios) {
  return Array.from(radios).find((radio) => radio.checked)?.value;
}

export function setSelectedRadioValue(radios, value) {
  Array.from(radios).forEach((radio) => {
    radio.checked = radio.value === value;
  });
}

export function syncNumberRangeValues(numberInput, rangeInput, value) {
  if (numberInput) numberInput.value = String(value);
  if (rangeInput) rangeInput.value = String(value);
}

export function parseScoreInput(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${y}.${m}.${d}`;
}

export function formatVideoMeta(dateValue, opponentName) {
  const lines = [];
  if (dateValue) lines.push(formatDate(dateValue));
  if (opponentName) lines.push(`vs ${opponentName}`);
  return lines.join('\n');
}

export function formatLineupPosition(value) {
  const raw = (value || '').trim();
  if (!raw) return '';
  const upper = raw.toUpperCase();
  return LINEUP_POSITION_MAP[upper] || upper;
}

export function formatSecondsLabel(value) {
  return (Number(value) || 0).toFixed(1);
}

export function escapeDrawtext(text) {
  return String(text || '')
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/,/g, '\\,')
    .replace(/%/g, '\\%');
}

export function getFileExtension(name, fallback = 'mp4') {
  const ext = String(name || '').split('.').pop()?.toLowerCase();
  return ext && ext !== name ? ext : fallback;
}

export function normalizeName(name) {
  return (name || '').replace(/\s+/g, '');
}

export function formatDisplayName(name) {
  return (name || '').replace(/\s*\(\d+\)\s*$/, '').trim();
}

export function getPlayerPhotoPath(name) {
  if (!normalizeName(name)) return '';
  const normalized = normalizeName(name);
  const matched = Object.keys(PLAYER_NUMBER_BY_NAME).find((key) => normalizeName(key) === normalized);
  return matched ? `assets/player/${PLAYER_NUMBER_BY_NAME[matched]}.png` : '';
}

export function getPlayerMiniPhotoPath(name) {
  if (!normalizeName(name)) return '';
  const normalized = normalizeName(name);
  const matched = Object.keys(PLAYER_NUMBER_BY_NAME).find((key) => normalizeName(key) === normalized);
  return matched ? `assets/player_mini/${PLAYER_NUMBER_BY_NAME[matched]}.png` : '';
}

export function getPlayerInfo(name) {
  if (!normalizeName(name)) return null;
  const normalized = normalizeName(name);
  const matched = Object.keys(PLAYER_INFO_BY_NAME).find((key) => normalizeName(key) === normalized);
  return matched ? PLAYER_INFO_BY_NAME[matched] : null;
}

export function formatRosterNumber(value, decimals = 0) {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw === 0) return '';
  if (decimals <= 0) return String(raw);
  return raw.toFixed(decimals).replace(/\.?0+$/, '');
}

export function formatOutsToInningsValue(outs) {
  const safeOuts = Math.max(0, Math.round(Number(outs) || 0));
  const innings = Math.floor(safeOuts / 3);
  const remainder = safeOuts % 3;
  return remainder ? `${innings}.${remainder}` : String(innings);
}

export function normalizePitcherInningsInput(input) {
  if (!(input instanceof HTMLInputElement)) return;
  const rawValue = input.value.trim();
  if (!rawValue) {
    input.dataset.lastValidInnings = '0';
    return;
  }

  const numericValue = Number(rawValue);
  const lastValidDisplay = input.dataset.lastValidInnings || '0';
  const lastValidValue = Number(lastValidDisplay);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    input.value = lastValidDisplay;
    return;
  }

  const whole = Math.trunc(numericValue);
  const decimalDigit = Math.round((numericValue - whole) * 10);
  const isIncreasing = numericValue >= lastValidValue;

  let outs = whole * 3;
  if (decimalDigit <= 0) {
    outs += 0;
  } else if (decimalDigit === 1) {
    outs += 1;
  } else if (decimalDigit === 2) {
    outs += 2;
  } else {
    outs = isIncreasing ? (whole + 1) * 3 : (whole * 3) + 2;
  }

  const normalizedValue = formatOutsToInningsValue(outs);
  input.value = normalizedValue;
  input.dataset.lastValidInnings = normalizedValue;
}

export function normalizeIntegerInput(input) {
  if (!(input instanceof HTMLInputElement)) return;
  const rawValue = input.value.trim();
  if (!rawValue) return;
  const numericValue = Math.max(0, Math.trunc(Number(rawValue) || 0));
  input.value = String(numericValue);
}

export function normalizeDecimalInput(input) {
  if (!(input instanceof HTMLInputElement)) return;
  const rawValue = input.value.trim();
  if (!rawValue) return;
  if (rawValue.endsWith('.')) return;
  const numericValue = Number(rawValue);
  if (!Number.isFinite(numericValue) || numericValue < 0) return;
  input.value = String(numericValue);
}

export function getMatchingPlayerNames(query) {
  const normalizedQuery = normalizeName(query);
  const names = PLAYER_INFO_LIST.map((player) => player.name);
  if (!normalizedQuery) return names.slice(0, 12);
  return names
    .filter((name) => normalizeName(name).includes(normalizedQuery))
    .sort((a, b) => {
      const aNormalized = normalizeName(a);
      const bNormalized = normalizeName(b);
      const aStarts = aNormalized.startsWith(normalizedQuery);
      const bStarts = bNormalized.startsWith(normalizedQuery);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;
      return a.localeCompare(b, 'ko');
    })
    .slice(0, 12);
}
