const KBO_BASE = 'https://www.koreabaseball.com';
const REGISTER_URL = `${KBO_BASE}/Player/Register.aspx`;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36';

const KIA_KOR = '\uae30\uc544';
const KIA_TIGERS_KOR = '\uae30\uc544 \ud0c0\uc774\uac70\uc988';
const PITCHER_KOR = '\ud22c\uc218';
const CATCHER_KOR = '\ud3ec\uc218';
const INFIELDER_KOR = '\ub0b4\uc57c\uc218';
const OUTFIELDER_KOR = '\uc678\uc57c\uc218';

const TEAM_CODES = {
  KIA: 'HT',
  [KIA_KOR]: 'HT',
  [KIA_TIGERS_KOR]: 'HT',
  'KIA Tigers': 'HT'
};

const TEAM_ALIASES = {
  KIA: 'KIA',
  [KIA_KOR]: 'KIA',
  [KIA_TIGERS_KOR]: 'KIA',
  'KIA Tigers': 'KIA'
};
const SCHEDULE_TEAM_NAMES = {
  KIA: 'KIA 타이거즈',
  [KIA_KOR]: 'KIA 타이거즈',
  LG: 'LG 트윈스',
  '두산': '두산 베어스',
  '키움': '키움 히어로즈',
  SSG: 'SSG 랜더스',
  KT: 'KT 위즈',
  '한화': '한화 이글스',
  '롯데': '롯데 자이언츠',
  NC: 'NC 다이노스',
  '삼성': '삼성 라이온즈'
};
const TV_BROADCASTERS = {
  'KN-T': 'KBS N SPORTS',
  'K-T': 'KBS',
  'K-2T': 'KBS2',
  'SBS-T': 'SBS SPORTS',
  'S-T': 'SBS',
  'SS-T': 'SBS SPORTS',
  'M-T': 'MBC',
  'MS-T': 'MBC SPORTS+',
  'SPO-T': 'SPOTV',
  'SPO-2T': 'SPOTV2'
};

const PLAYER_GROUP_HEADERS = new Set([PITCHER_KOR, CATCHER_KOR, INFIELDER_KOR, OUTFIELDER_KOR]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'Content-Type'
    }
  });
}

function text(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'Content-Type'
    }
  });
}

function normalizeTeamName(team) {
  return TEAM_ALIASES[(team || '').trim()] || (team || '').trim().toUpperCase();
}

function normalizeTeamCode(team) {
  const normalized = (team || '').trim();
  return TEAM_CODES[normalized] || TEAM_CODES[normalized.toUpperCase()] || normalized.toUpperCase();
}

function normalizeScheduleTeamName(team) {
  const normalized = cleanHtmlText(team);
  return SCHEDULE_TEAM_NAMES[normalized] || normalized;
}

function cleanHtmlText(value) {
  return (value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2f;/gi, '/')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanScheduleMediaText(value) {
  return cleanHtmlText(String(value || '').replace(/<br\s*\/?>/gi, ' / ')).replace(/ \/ \/ /g, ' / ');
}

function normalizeBroadcasterName(value) {
  return String(value || '')
    .split('/')
    .map((part) => part.trim())
    .filter((part) => Boolean(part) && part !== 'TVING')
    .map((part) => TV_BROADCASTERS[part] || part)
    .join(' / ');
}

function extractHiddenValue(html, fieldName) {
  const pattern = new RegExp(`name="${fieldName.replace(/\$/g, '\\$')}"[^>]*value="([^"]*)"`);
  const match = html.match(pattern);
  return match ? match[1] : '';
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`KBO request failed with ${response.status}`);
  }

  return await response.text();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json;q=0.9,*/*;q=0.8',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`KBO request failed with ${response.status}`);
  }

  return await response.json();
}

async function fetchRegisterSnapshotHtml(dateValue, teamCode) {
  const initialHtml = await fetchText(REGISTER_URL);
  const body = new URLSearchParams({
    __EVENTTARGET: '',
    __EVENTARGUMENT: '',
    __LASTFOCUS: '',
    __VIEWSTATE: extractHiddenValue(initialHtml, '__VIEWSTATE'),
    __VIEWSTATEGENERATOR: extractHiddenValue(initialHtml, '__VIEWSTATEGENERATOR'),
    __EVENTVALIDATION: extractHiddenValue(initialHtml, '__EVENTVALIDATION'),
    'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchTeam': teamCode,
    'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchDate': dateValue.replaceAll('-', ''),
    'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$btnCalendarSelect': ''
  });

  return await fetchText(REGISTER_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      referer: REGISTER_URL
    },
    body
  });
}

function parseRegisterSnapshot(html) {
  const players = {};
  const tablePattern = /<table class="tNData".*?<thead>(.*?)<\/thead>.*?<tbody>(.*?)<\/tbody>.*?<\/table>/gs;

  for (const match of html.matchAll(tablePattern)) {
    const headers = [...match[1].matchAll(/<th[^>]*>(.*?)<\/th>/gs)].map((item) => cleanHtmlText(item[1]));
    if (headers.length < 2) continue;

    const groupHeader = headers[1];
    if (!PLAYER_GROUP_HEADERS.has(groupHeader)) continue;

    for (const rowMatch of match[2].matchAll(/<tr>(.*?)<\/tr>/gs)) {
      const cells = [...rowMatch[1].matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map((item) => item[1]);
      if (cells.length < 2) continue;

      const nameCell = cells[1];
      const linkMatch = nameCell.match(/href="([^"]+)"/);
      const link = linkMatch ? linkMatch[1] : '';
      const playerIdMatch = link.match(/playerId=(\d+)/);
      const playerId = playerIdMatch ? playerIdMatch[1] : cleanHtmlText(nameCell);
      const name = cleanHtmlText(nameCell);
      if (!name) continue;

      players[playerId] = {
        playerId,
        name,
        position: groupHeader,
        link
      };
    }
  }

  return players;
}

function findPlayerInSnapshot(snapshot, name) {
  const normalizedName = String(name || '').replace(/\s+/g, '');
  for (const player of Object.values(snapshot)) {
    if (String(player.name || '').replace(/\s+/g, '') === normalizedName) {
      return player;
    }
  }
  return null;
}

function extractStatsTables(html) {
  const startIndex = html.indexOf('<div class="player_records">');
  if (startIndex < 0) return [];

  const section = html.slice(startIndex);
  const tablePattern = /<table[^>]*class="tbl tt[^"]*"[^>]*>.*?<thead>.*?<tr>(.*?)<\/tr>.*?<\/thead>.*?<tbody>\s*<tr>(.*?)<\/tr>\s*<\/tbody>.*?<\/table>/gs;
  const tables = [];

  for (const match of section.matchAll(tablePattern)) {
    const headers = [...match[1].matchAll(/<th[^>]*>(.*?)<\/th>/gs)].map((item) => cleanHtmlText(item[1]));
    const values = [...match[2].matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gs)].map((item) => cleanHtmlText(item[1]));
    if (headers.length && headers.length === values.length) {
      tables.push(Object.fromEntries(headers.map((header, index) => [header, values[index]])));
    }
    if (tables.length >= 2) break;
  }

  return tables;
}

function buildFuturesLink(player) {
  if (!player?.playerId) return '';
  if (player.position === PITCHER_KOR) {
    return `/Futures/Player/PitcherDetail.aspx?playerId=${player.playerId}`;
  }
  return `/Futures/Player/HitterDetail.aspx?playerId=${player.playerId}`;
}

function formatOps(obp, slg) {
  const obpValue = Number(obp);
  const slgValue = Number(slg);
  if (!Number.isFinite(obpValue) || !Number.isFinite(slgValue)) return '';
  return (obpValue + slgValue).toFixed(3);
}

function parseInningsToOuts(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const normalized = raw
    .replace(/\u2153/g, ' 1/3')
    .replace(/\u2154/g, ' 2/3')
    .replace(/\s+/g, ' ')
    .trim();
  const fractionMatch = normalized.match(/^(\d+)\s+([12])\/3$/);
  if (fractionMatch) {
    return (Number(fractionMatch[1]) * 3) + Number(fractionMatch[2]);
  }
  const decimalMatch = normalized.match(/^(\d+)(?:\.(\d))?$/);
  if (decimalMatch) {
    const whole = Number(decimalMatch[1]) || 0;
    const remainder = Number(decimalMatch[2] || '0');
    if (remainder <= 2) {
      return (whole * 3) + remainder;
    }
  }
  return null;
}

function calculateWhip(hits, walks, innings) {
  const outs = parseInningsToOuts(innings);
  const hitsValue = Number(hits);
  const walksValue = Number(walks);
  if (!outs || !Number.isFinite(hitsValue) || !Number.isFinite(walksValue)) return '';
  return ((hitsValue + walksValue) / (outs / 3)).toFixed(2);
}

async function fetchSearchPlayer(name) {
  const body = new URLSearchParams({ name });
  const response = await fetch(`${KBO_BASE}/ws/Controls.asmx/GetSearchPlayer`, {
    method: 'POST',
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json;q=0.9,*/*;q=0.8',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      referer: REGISTER_URL
    },
    body
  });

  if (!response.ok) {
    throw new Error(`KBO search request failed with ${response.status}`);
  }

  return await response.json();
}

function chooseSearchPlayer(searchResult, name) {
  const nowPlayers = Array.isArray(searchResult.now) ? searchResult.now : [];
  const normalizedName = String(name || '').replace(/\s+/g, '');
  for (const player of nowPlayers) {
    const playerName = String(player.P_NM || '').replace(/\s+/g, '');
    if (playerName === normalizedName && String(player.P_LINK || '').includes('/Record/Player/')) {
      return player;
    }
  }
  for (const player of nowPlayers) {
    if (String(player.P_LINK || '').includes('/Record/Player/')) {
      return player;
    }
  }
  return nowPlayers[0] || null;
}

async function parsePlayerStats(link, positionHint, league = 'major') {
  const html = await fetchText(new URL(link, KBO_BASE).toString());
  const tables = extractStatsTables(html);
  const isPitcher = link.includes('PitcherDetail') || positionHint === PITCHER_KOR;

  if (isPitcher) {
    const first = tables[0] || {};
    const second = tables[1] || {};
    if (!first.G) {
      return {
        statsType: 'pitcher',
        stats: {}
      };
    }
    return {
      statsType: 'pitcher',
      stats: {
        games: first.G || '0',
        wins: first.W || '0',
        losses: first.L || '0',
        saves: first.SV || '0',
        holds: first.HLD || '0',
        innings: first.IP || '0',
        era: first.ERA || '0',
        whip: second.WHIP || calculateWhip(first.H, first.BB, first.IP)
      }
    };
  }

  const first = tables[0] || {};
  const second = tables[1] || {};
  if (!first.G) {
    return {
      statsType: 'hitter',
      stats: {}
    };
  }
  return {
    statsType: 'hitter',
    stats: {
      games: first.G || '0',
      homeRuns: first.HR || '0',
      rbi: first.RBI || '0',
      steals: first.SB || '0',
      avg: first.AVG || '0',
      ops: league === 'futures' ? formatOps(first.OBP, first.SLG) : (second.OPS || '0')
    }
  };
}

async function enrichSnapshotPlayer(player, warnings, recordSource) {
  let statsType = player.position === PITCHER_KOR ? 'pitcher' : 'hitter';
  let stats = {};
  const statsLink = recordSource === 'futures' ? buildFuturesLink(player) : player.link;

  if (statsLink) {
    try {
      const parsed = await parsePlayerStats(statsLink, player.position, recordSource);
      statsType = parsed.statsType;
      stats = parsed.stats;
    } catch (error) {
      if (recordSource === 'major') {
        warnings.push(`Could not parse season stats for ${player.name}. Filled name only.`);
      }
    }
  }

  return {
    playerId: player.playerId,
    name: player.name,
    position: player.position,
    statsType,
    stats,
    link: statsLink || player.link,
    recordSource
  };
}

async function buildSinglePlayerPayload(name, section, dateValue) {
  let player = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const teamCode = normalizeTeamCode('KIA');
    const previousDate = minusDays(dateValue, 1);
    const currentSnapshot = parseRegisterSnapshot(await fetchRegisterSnapshotHtml(dateValue, teamCode));
    const previousSnapshot = parseRegisterSnapshot(await fetchRegisterSnapshotHtml(previousDate, teamCode));
    player = findPlayerInSnapshot(section === 'callUp' ? currentSnapshot : previousSnapshot, name);
  }

  if (!player) {
    const searchResult = await fetchSearchPlayer(name);
    const searchedPlayer = chooseSearchPlayer(searchResult, name);
    if (searchedPlayer) {
      player = {
        playerId: String(searchedPlayer.P_ID || ''),
        name: String(searchedPlayer.P_NM || name),
        position: String(searchedPlayer.POS_NO || ''),
        link: String(searchedPlayer.P_LINK || '')
      };
    }
  }

  if (!player) {
    throw new Error('Could not find an active player with that name.');
  }

  const recordSource = section === 'callUp' ? 'futures' : 'major';
  const warnings = [];
  return {
    name,
    section,
    date: dateValue,
    player: await enrichSnapshotPlayer(player, warnings, recordSource),
    warnings
  };
}

function minusDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

async function buildRosterPayload(dateValue, team) {
  const teamCode = normalizeTeamCode(team);
  const previousDate = minusDays(dateValue, 1);

  const currentHtml = await fetchRegisterSnapshotHtml(dateValue, teamCode);
  const previousHtml = await fetchRegisterSnapshotHtml(previousDate, teamCode);

  const currentSnapshot = parseRegisterSnapshot(currentHtml);
  const previousSnapshot = parseRegisterSnapshot(previousHtml);

  const callUpIds = Object.keys(currentSnapshot).filter((playerId) => !(playerId in previousSnapshot));
  const sendDownIds = Object.keys(previousSnapshot).filter((playerId) => !(playerId in currentSnapshot));

  const warnings = [];
  const callUp = [];
  const sendDown = [];

  for (const playerId of callUpIds) {
    callUp.push(await enrichSnapshotPlayer(currentSnapshot[playerId], warnings, 'futures'));
  }

  for (const playerId of sendDownIds) {
    sendDown.push(await enrichSnapshotPlayer(previousSnapshot[playerId], warnings, 'major'));
  }

  return {
    date: dateValue,
    previousDate,
    team: normalizeTeamName(team),
    teamCode,
    callUp,
    sendDown,
    warnings,
    snapshotCounts: {
      current: Object.keys(currentSnapshot).length,
      previous: Object.keys(previousSnapshot).length
    },
    source: 'KBO register snapshot diff'
  };
}

async function fetchScheduleRows(dateValue) {
  const [year, month] = dateValue.split('-');
  const body = new URLSearchParams({
    leId: '1',
    srIdList: '0,9',
    seasonId: year,
    gameMonth: month,
    teamId: ''
  });

  const payload = await fetchJson(`${KBO_BASE}/ws/Schedule.asmx/GetScheduleList`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      referer: `${KBO_BASE}/Schedule/Schedule.aspx`
    },
    body
  });

  return Array.isArray(payload.rows) ? payload.rows : [];
}

async function fetchGameList(dateValue) {
  const body = new URLSearchParams({
    leId: '1',
    srId: '0,1,3,4,5,6,7,8,9',
    date: dateValue.replaceAll('-', '')
  });

  const payload = await fetchJson(`${KBO_BASE}/ws/Main.asmx/GetKboGameList`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      referer: `${KBO_BASE}/Schedule/GameCenter/Main.aspx?gameDate=${dateValue.replaceAll('-', '')}`
    },
    body
  });

  return Array.isArray(payload.game) ? payload.game : [];
}

function parseScheduleGameHtml(gameHtml) {
  const match = String(gameHtml || '').match(/<span>(.*?)<\/span>\s*<em>[\s\S]*?<\/em>\s*<span>(.*?)<\/span>/);
  if (match) {
    return [cleanHtmlText(match[1]), cleanHtmlText(match[2])];
  }
  const spans = [...String(gameHtml || '').matchAll(/<span>(.*?)<\/span>/g)].map((item) => cleanHtmlText(item[1]));
  return [spans[0] || '', spans[spans.length - 1] || ''];
}

async function buildSchedulePayload(dateValue, team) {
  const rows = await fetchScheduleRows(dateValue);
  const games = await fetchGameList(dateValue);
  const [, month, day] = dateValue.split('-');
  const targetDay = `${month}.${day}`;
  const targetTeam = normalizeTeamName(team);
  let currentDay = '';

  for (const entry of rows) {
    const cells = Array.isArray(entry?.row) ? entry.row : [];
    if (!cells.length) continue;

    let offset = 0;
    const firstText = cleanHtmlText(cells[0]?.Text || '');
    if (/^\d{2}\.\d{2}\(/.test(firstText)) {
      currentDay = firstText.slice(0, 5);
      offset = 1;
    }
    if (currentDay !== targetDay) continue;
    if (cells.length < offset + 7) continue;

    const [awayTeam, homeTeam] = parseScheduleGameHtml(cells[offset + 1]?.Text || '');
    const awayKey = normalizeTeamName(awayTeam);
    const homeKey = normalizeTeamName(homeTeam);
    if (![awayKey, homeKey].includes(targetTeam)) continue;

    const matchedGame = games.find((game) =>
      normalizeTeamName(String(game?.AWAY_NM || '')) === awayKey
      && normalizeTeamName(String(game?.HOME_NM || '')) === homeKey
    ) || null;

    const opponentShort = targetTeam === awayKey ? homeTeam : awayTeam;
    const tv = cleanScheduleMediaText(cells[offset + 4]?.Text || '');
    const radio = cleanScheduleMediaText(cells[offset + 5]?.Text || '');
    const stadium = cleanHtmlText(cells[offset + 6]?.Text || '');
    const startingPitcher = matchedGame
      ? cleanHtmlText(targetTeam === awayKey ? matchedGame.T_PIT_P_NM : matchedGame.B_PIT_P_NM)
      : '';

    return {
      found: true,
      date: dateValue,
      team: targetTeam,
      opponentTeam: normalizeScheduleTeamName(opponentShort),
      kiaSide: targetTeam === awayKey ? 'away' : 'home',
      gameTime: cleanHtmlText(cells[offset]?.Text || ''),
      stadium,
      tv,
      radio,
      broadcaster: normalizeBroadcasterName(tv),
      startingPitcher,
      startingPitcherAnnounced: Boolean(startingPitcher),
      gameId: matchedGame?.G_ID || '',
      source: 'KBO schedule list'
    };
  }

  return {
    found: false,
    date: dateValue,
    team: targetTeam,
    source: 'KBO schedule list'
  };
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return text('', 204);
    }

    const url = new URL(request.url);
    if (url.pathname === '/') {
      return text('KBO worker is running. Use /api/kbo/schedule or /api/kbo/roster-moves');
    }

    if (url.pathname === '/api/kbo/schedule') {
      const dateValue = (url.searchParams.get('date') || '').trim();
      const team = (url.searchParams.get('team') || 'KIA').trim() || 'KIA';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return json({ error: 'date must use YYYY-MM-DD format.' }, 400);
      }

      try {
        return json(await buildSchedulePayload(dateValue, team));
      } catch (error) {
        return json({ error: `Worker processing failed: ${error.message || error}` }, 500);
      }
    }

    if (url.pathname !== '/api/kbo/roster-moves') {
      if (url.pathname !== '/api/kbo/player-stats') {
        return json({ error: 'Unsupported path.' }, 404);
      }

      const name = (url.searchParams.get('name') || '').trim();
      const section = (url.searchParams.get('section') || 'callUp').trim() || 'callUp';
      const dateValue = (url.searchParams.get('date') || '').trim();
      if (!name) {
        return json({ error: 'name is required.' }, 400);
      }
      if (!['callUp', 'sendDown'].includes(section)) {
        return json({ error: 'section must be callUp or sendDown.' }, 400);
      }

      try {
        return json(await buildSinglePlayerPayload(name, section, dateValue));
      } catch (error) {
        return json({ error: `Worker processing failed: ${error.message || error}` }, 500);
      }
    }

    const dateValue = (url.searchParams.get('date') || '').trim();
    const team = (url.searchParams.get('team') || 'KIA').trim() || 'KIA';

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return json({ error: 'date must use YYYY-MM-DD format.' }, 400);
    }

    try {
      return json(await buildRosterPayload(dateValue, team));
    } catch (error) {
      return json({ error: `Worker processing failed: ${error.message || error}` }, 500);
    }
  }
};
