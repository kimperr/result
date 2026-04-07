const STORAGE_KEY = 'kboProxyOrigin';
const LOCAL_PROXY_ORIGIN = 'https://kbo-roster-proxy.kimperr.workers.dev';

function sanitizeOrigin(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

export function getKboProxyOrigin() {
  const runtimeOrigin = sanitizeOrigin(globalThis.__KBO_PROXY_ORIGIN__);
  if (runtimeOrigin) return runtimeOrigin;

  try {
    const savedOrigin = sanitizeOrigin(globalThis.localStorage?.getItem(STORAGE_KEY));
    if (savedOrigin) return savedOrigin;
  } catch (error) {
    // Ignore localStorage access issues and fall back to the local proxy.
  }

  return LOCAL_PROXY_ORIGIN;
}

export function setKboProxyOrigin(value) {
  const normalized = sanitizeOrigin(value) || LOCAL_PROXY_ORIGIN;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, normalized);
  } catch (error) {
    // Ignore localStorage access issues and let the current page session continue.
  }
  return normalized;
}

function buildProxyUrl(pathname, params) {
  const url = new URL(pathname, getKboProxyOrigin());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

function getErrorMessage(payload, fallbackMessage) {
  if (payload && typeof payload === 'object' && typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error.trim();
  }
  return fallbackMessage;
}

export async function fetchKboRosterMovesByDate({
  dateValue,
  team = 'KIA',
  fetchImpl = fetch
}) {
  if (!dateValue) {
    throw new Error('등말소 날짜를 먼저 선택해 주세요.');
  }

  const url = buildProxyUrl('/api/kbo/roster-moves', {
    date: dateValue,
    team
  });

  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });
  } catch (error) {
    throw new Error(`KBO API에 연결하지 못했습니다. 현재 주소: ${getKboProxyOrigin()}`);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    if (!response.ok) {
      throw new Error(`KBO 응답을 읽지 못했습니다. (${response.status})`);
    }
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `KBO 불러오기에 실패했습니다. (${response.status})`));
  }

  return payload;
}

export async function fetchKboPlayerStats({
  name,
  section,
  dateValue,
  fetchImpl = fetch
}) {
  const trimmedName = String(name || '').trim();
  if (!trimmedName) {
    throw new Error('선수 이름을 먼저 입력해 주세요.');
  }

  const url = buildProxyUrl('/api/kbo/player-stats', {
    name: trimmedName,
    section,
    date: dateValue
  });

  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });
  } catch (error) {
    throw new Error(`KBO API에 연결하지 못했습니다. 현재 주소: ${getKboProxyOrigin()}`);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    if (!response.ok) {
      throw new Error(`KBO 응답을 읽지 못했습니다. (${response.status})`);
    }
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `선수 성적 불러오기에 실패했습니다. (${response.status})`));
  }

  return payload;
}
