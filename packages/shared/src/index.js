export * from './constants.js';
import { PLAYER_NUMBER_BY_NAME } from './constants.js';

export const GITHUB_ASSET_BASE =
  'https://raw.githubusercontent.com/kimperr/result/main';

export const DEFAULT_VIDEO_LAYOUT = {
  width: 1080,
  height: 1350,
  frame: {
    x: 90,
    y: 516,
    width: 900,
    height: 506
  }
};

export function getPlayerPhotoUrl(numberOrName, version = '') {
  const number = Number.isFinite(Number(numberOrName))
    ? Number(numberOrName)
    : PLAYER_NUMBER_BY_NAME[String(numberOrName)] || '';
  if (!number) return '';
  const suffix = version ? `?v=${encodeURIComponent(version)}` : '';
  return `${GITHUB_ASSET_BASE}/assets/player/${number}.png${suffix}`;
}
