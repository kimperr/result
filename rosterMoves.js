import {
  MAX_ROSTER_GROUPS,
  ROSTER_GROUP_GRID,
  ROSTER_MOVES_LAYOUT,
  ROSTER_SECTION_SLOT_Y
} from './constants.js';
import {
  formatDisplayName,
  formatRosterNumber,
  getPlayerInfo,
  getPlayerMiniPhotoPath,
  getMatchingPlayerNames,
  normalizeDecimalInput,
  normalizeIntegerInput,
  normalizePitcherInningsInput
} from './utils.js';

function buildPitcherStatsLines(groupRefs) {
  const games = Number(groupRefs.pitcherGames?.value) || 0;
  if (games <= 0) return '';
  const line1 = [
    String(games),
    formatRosterNumber(groupRefs.pitcherWins?.value),
    formatRosterNumber(groupRefs.pitcherLosses?.value),
    formatRosterNumber(groupRefs.pitcherSaves?.value),
    formatRosterNumber(groupRefs.pitcherHolds?.value)
  ];
  const labels1 = ['경기', '승', '패', '세', '홀'];
  const firstLine = line1.map((value, index) => (value ? `${value}${labels1[index]}` : '')).filter(Boolean).join(' ');
  const innings = formatRosterNumber(groupRefs.pitcherInnings?.value, 1);
  const era = (Number(groupRefs.pitcherEra?.value) || 0).toFixed(2);
  const whip = (Number(groupRefs.pitcherWhip?.value) || 0).toFixed(2);
  const secondLine = innings ? `${innings}이닝` : '';
  const thirdLine = [`ERA ${era}`, `WHIP ${whip}`].join(' ');
  return [firstLine, secondLine, thirdLine].join('\n');
}

function buildHitterStatsLines(groupRefs) {
  const games = Number(groupRefs.hitterGames?.value) || 0;
  if (games <= 0) return '';
  const firstLine = [
    [String(games), '경기'],
    [formatRosterNumber(groupRefs.hitterHomeRuns?.value), '홈런'],
    [formatRosterNumber(groupRefs.hitterRbi?.value), '타점'],
    [formatRosterNumber(groupRefs.hitterSteals?.value), '도루']
  ].map(([value, label]) => (value ? `${value}${label}` : '')).filter(Boolean).join(' ');
  const avg = (Number(groupRefs.hitterAvg?.value) || 0).toFixed(3);
  const ops = (Number(groupRefs.hitterOps?.value) || 0).toFixed(3);
  const secondLine = `타율 ${avg}`;
  const thirdLine = `OPS ${ops}`;
  return [firstLine, secondLine, thirdLine].join('\n');
}

function hidePlayerSuggestions(groupRefs) {
  if (!groupRefs?.nameSuggestions) return;
  groupRefs.nameSuggestions.innerHTML = '';
  groupRefs.nameSuggestions.classList.add('is-hidden');
}

function hidePlayerSuggestionsIfFocusOutside(groupRefs) {
  if (!groupRefs?.autocomplete) return;
  const active = document.activeElement;
  if (active instanceof Node && groupRefs.autocomplete.contains(active)) return;
  hidePlayerSuggestions(groupRefs);
}

function getSuggestionButtons(groupRefs) {
  if (!groupRefs?.nameSuggestions) return [];
  return Array.from(groupRefs.nameSuggestions.querySelectorAll('.roster-name-suggestion'))
    .filter((button) => button instanceof HTMLButtonElement);
}

function focusSuggestion(groupRefs, index) {
  const buttons = getSuggestionButtons(groupRefs);
  if (!buttons.length) return false;
  const safeIndex = Math.max(0, Math.min(index, buttons.length - 1));
  buttons[safeIndex].focus();
  return true;
}

function showPlayerSuggestions(groupRefs) {
  if (!groupRefs?.nameInput || !groupRefs?.nameSuggestions) return;
  const matches = getMatchingPlayerNames(groupRefs.nameInput.value);
  if (!matches.length) {
    hidePlayerSuggestions(groupRefs);
    return;
  }

  groupRefs.nameSuggestions.innerHTML = '';
  matches.forEach((name) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'roster-name-suggestion';
    button.textContent = name;
    const applySuggestion = () => {
      groupRefs.nameInput.value = name;
      groupRefs.nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      groupRefs.nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      hidePlayerSuggestions(groupRefs);
      groupRefs.nameInput.focus();
      groupRefs.nameInput.setSelectionRange(name.length, name.length);
    };
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
      applySuggestion();
    });
    button.addEventListener('click', (event) => {
      event.preventDefault();
      applySuggestion();
    });
    button.addEventListener('keydown', (event) => {
      const buttons = getSuggestionButtons(groupRefs);
      const currentIndex = buttons.indexOf(button);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusSuggestion(groupRefs, currentIndex + 1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentIndex <= 0) {
          groupRefs.nameInput.focus();
          groupRefs.nameInput.setSelectionRange(groupRefs.nameInput.value.length, groupRefs.nameInput.value.length);
          return;
        }
        focusSuggestion(groupRefs, currentIndex - 1);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        hidePlayerSuggestions(groupRefs);
        groupRefs.nameInput.focus();
      }
    });
    groupRefs.nameSuggestions.appendChild(button);
  });
  groupRefs.nameSuggestions.classList.remove('is-hidden');
}

export function getRosterSectionCount(el, section) {
  return Math.max(0, Math.min(MAX_ROSTER_GROUPS, Number(el[`${section}Count`]?.value) || 0));
}

export function updateRosterMovesFormVisibility(rosterMoveEditors, section, index) {
  const groupRefs = rosterMoveEditors[section]?.[index];
  if (!groupRefs) return;
  const info = getPlayerInfo(groupRefs.nameInput?.value || '');
  const meta = info ? `${info.throwBat}/${info.positionGroup}` : '';
  if (groupRefs.metaInput) groupRefs.metaInput.value = meta;
  const isPitcher = info?.positionGroup === '투수';
  if (groupRefs.pitcherStats) groupRefs.pitcherStats.style.display = isPitcher ? 'grid' : 'none';
  if (groupRefs.hitterStats) groupRefs.hitterStats.style.display = isPitcher === false && info ? 'grid' : 'none';
}

export function refreshRosterGroupEditors(el, rosterMoveEditors, section) {
  const count = getRosterSectionCount(el, section);
  rosterMoveEditors[section].forEach((groupRefs, index) => {
    groupRefs.root.classList.toggle('is-hidden', index >= count);
  });
}

function createRosterGroupEditor({ section, index, onVisibilityChange, onPosterUpdate, onAutoStatsFetch }) {
  const root = document.createElement('div');
  root.className = 'roster-group-editor';
  root.innerHTML = `
    <h3>${index + 1}번 선수</h3>
    <label class="field">선수 이름
      <div class="roster-name-autocomplete">
        <input class="roster-name-input" type="text" autocomplete="off" />
        <div class="roster-name-suggestions is-hidden"></div>
      </div>
    </label>
    <label class="field">유형 <input class="roster-meta-input" type="text" readonly /></label>
    <div class="roster-stats-grid roster-pitcher-stats">
      <div class="roster-stats-row roster-stats-row-five">
        <label class="field">경기 <input class="roster-pitcher-games" type="number" min="0" value="0" /></label>
        <label class="field">승 <input class="roster-pitcher-wins" type="number" min="0" value="0" /></label>
        <label class="field">패 <input class="roster-pitcher-losses" type="number" min="0" value="0" /></label>
        <label class="field">세 <input class="roster-pitcher-saves" type="number" min="0" value="0" /></label>
        <label class="field">홀 <input class="roster-pitcher-holds" type="number" min="0" value="0" /></label>
      </div>
      <div class="roster-stats-row roster-stats-row-single">
        <label class="field">이닝 <input class="roster-pitcher-innings" type="text" inputmode="decimal" value="0" /></label>
      </div>
      <div class="roster-stats-row roster-stats-row-two">
        <label class="field">ERA <input class="roster-pitcher-era" type="number" min="0" step="0.01" value="0" /></label>
        <label class="field">WHIP <input class="roster-pitcher-whip" type="number" min="0" step="0.01" value="0" /></label>
      </div>
    </div>
    <div class="roster-stats-grid roster-hitter-stats">
      <div class="roster-stats-row roster-stats-row-four">
        <label class="field">경기 <input class="roster-hitter-games" type="number" min="0" value="0" /></label>
        <label class="field">홈런 <input class="roster-hitter-homeruns" type="number" min="0" value="0" /></label>
        <label class="field">타점 <input class="roster-hitter-rbi" type="number" min="0" value="0" /></label>
        <label class="field">도루 <input class="roster-hitter-steals" type="number" min="0" value="0" /></label>
      </div>
      <div class="roster-stats-row roster-stats-row-single">
        <label class="field">타율 <input class="roster-hitter-avg" type="number" min="0" step="0.001" value="0" /></label>
      </div>
      <div class="roster-stats-row roster-stats-row-single">
        <label class="field">OPS <input class="roster-hitter-ops" type="number" min="0" step="0.001" value="0" /></label>
      </div>
    </div>
  `;

  const refs = {
    root,
    autocomplete: root.querySelector('.roster-name-autocomplete'),
    nameInput: root.querySelector('.roster-name-input'),
    nameSuggestions: root.querySelector('.roster-name-suggestions'),
    metaInput: root.querySelector('.roster-meta-input'),
    pitcherStats: root.querySelector('.roster-pitcher-stats'),
    pitcherGames: root.querySelector('.roster-pitcher-games'),
    pitcherWins: root.querySelector('.roster-pitcher-wins'),
    pitcherLosses: root.querySelector('.roster-pitcher-losses'),
    pitcherSaves: root.querySelector('.roster-pitcher-saves'),
    pitcherHolds: root.querySelector('.roster-pitcher-holds'),
    pitcherInnings: root.querySelector('.roster-pitcher-innings'),
    pitcherEra: root.querySelector('.roster-pitcher-era'),
    pitcherWhip: root.querySelector('.roster-pitcher-whip'),
    hitterStats: root.querySelector('.roster-hitter-stats'),
    hitterGames: root.querySelector('.roster-hitter-games'),
    hitterHomeRuns: root.querySelector('.roster-hitter-homeruns'),
    hitterRbi: root.querySelector('.roster-hitter-rbi'),
    hitterSteals: root.querySelector('.roster-hitter-steals'),
    hitterAvg: root.querySelector('.roster-hitter-avg'),
    hitterOps: root.querySelector('.roster-hitter-ops')
  };

  refs.nameInput.addEventListener('focus', () => showPlayerSuggestions(refs));
  refs.nameInput.addEventListener('input', () => {
    showPlayerSuggestions(refs);
    onVisibilityChange(section, index);
    if (getPlayerInfo(refs.nameInput.value || '')) {
      onAutoStatsFetch?.(section, index, { debounceMs: 180 });
    }
  });
  refs.nameInput.addEventListener('change', () => {
    onVisibilityChange(section, index);
    onAutoStatsFetch?.(section, index);
  });
  refs.nameInput.addEventListener('blur', () => {
    window.setTimeout(() => hidePlayerSuggestionsIfFocusOutside(refs), 120);
  });
  refs.nameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hidePlayerSuggestions(refs);
      return;
    }
    if (event.key === 'ArrowDown' && refs.nameSuggestions && !refs.nameSuggestions.classList.contains('is-hidden')) {
      event.preventDefault();
      focusSuggestion(refs, 0);
      return;
    }
    if (event.key === 'ArrowUp' && refs.nameSuggestions && !refs.nameSuggestions.classList.contains('is-hidden')) {
      event.preventDefault();
      const buttons = getSuggestionButtons(refs);
      if (buttons.length) {
        focusSuggestion(refs, buttons.length - 1);
      }
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && refs.nameSuggestions && !refs.nameSuggestions.classList.contains('is-hidden')) {
      const firstMatch = refs.nameSuggestions.querySelector('.roster-name-suggestion');
      if (firstMatch instanceof HTMLButtonElement) {
        event.preventDefault();
        firstMatch.focus();
      }
      return;
    }
    if (event.key === 'Enter' && refs.nameSuggestions && !refs.nameSuggestions.classList.contains('is-hidden')) {
      const firstMatch = refs.nameSuggestions.querySelector('.roster-name-suggestion');
      if (firstMatch instanceof HTMLButtonElement) {
        event.preventDefault();
        firstMatch.click();
      }
      return;
    }
    if (event.key === 'Enter') {
      window.setTimeout(() => onAutoStatsFetch?.(section, index), 0);
    }
  });
  refs.nameInput.addEventListener('blur', () => {
    if ((refs.nameInput.value || '').trim()) {
      onAutoStatsFetch?.(section, index);
    }
  });
  refs.autocomplete?.addEventListener('focusout', () => {
    window.setTimeout(() => hidePlayerSuggestionsIfFocusOutside(refs), 0);
  });
  refs.pitcherInnings.dataset.lastValidInnings = refs.pitcherInnings.value;
  refs.pitcherInnings.addEventListener('change', () => normalizePitcherInningsInput(refs.pitcherInnings));
  refs.pitcherInnings.addEventListener('blur', () => normalizePitcherInningsInput(refs.pitcherInnings));
  [
    refs.pitcherGames,
    refs.pitcherWins,
    refs.pitcherLosses,
    refs.pitcherSaves,
    refs.pitcherHolds,
    refs.hitterGames,
    refs.hitterHomeRuns,
    refs.hitterRbi,
    refs.hitterSteals
  ].forEach((input) => {
    input.addEventListener('input', () => normalizeIntegerInput(input));
    input.addEventListener('change', () => normalizeIntegerInput(input));
    input.addEventListener('blur', () => normalizeIntegerInput(input));
  });
  [refs.pitcherEra, refs.pitcherWhip].forEach((input) => {
    input.addEventListener('input', () => normalizeDecimalInput(input));
    input.addEventListener('change', () => normalizeDecimalInput(input));
    input.addEventListener('blur', () => normalizeDecimalInput(input));
  });

  const notify = () => {
    onVisibilityChange(section, index);
    onPosterUpdate();
  };
  [
    refs.nameInput,
    refs.pitcherGames,
    refs.pitcherWins,
    refs.pitcherLosses,
    refs.pitcherSaves,
    refs.pitcherHolds,
    refs.pitcherInnings,
    refs.pitcherEra,
    refs.pitcherWhip,
    refs.hitterGames,
    refs.hitterHomeRuns,
    refs.hitterRbi,
    refs.hitterSteals,
    refs.hitterAvg,
    refs.hitterOps
  ].forEach((input) => {
    input.addEventListener('input', notify);
    input.addEventListener('change', notify);
  });

  return refs;
}

function createRosterPreviewGroup(section) {
  const root = document.createElement('div');
  root.className = 'roster-preview-group is-hidden';
  root.innerHTML = `
    <img class="roster-group-box" src="assets/box.png" alt="" />
    <img class="roster-group-photo is-hidden" alt="" />
    <div class="roster-group-name"></div>
    <div class="roster-group-meta"></div>
    <div class="roster-group-stats"></div>
  `;
  return {
    root,
    photo: root.querySelector('.roster-group-photo'),
    box: root.querySelector('.roster-group-box'),
    name: root.querySelector('.roster-group-name'),
    meta: root.querySelector('.roster-group-meta'),
    stats: root.querySelector('.roster-group-stats')
  };
}

export function buildRosterMovesUi({
  el,
  out,
  rosterMoveEditors,
  rosterMovePreviewGroups,
  onVisibilityChange,
  onPosterUpdate,
  onAutoStatsFetch
}) {
  ['callUp', 'sendDown'].forEach((section) => {
    const container = el[`${section}GroupControls`];
    if (!container) return;
    container.innerHTML = '';
    rosterMoveEditors[section] = [];
    for (let i = 0; i < MAX_ROSTER_GROUPS; i += 1) {
      const refs = createRosterGroupEditor({
        section,
        index: i,
        onVisibilityChange,
        onPosterUpdate,
        onAutoStatsFetch
      });
      rosterMoveEditors[section].push(refs);
      container.appendChild(refs.root);
      onVisibilityChange(section, i);
    }
  });

  if (!out.rosterMovesDynamicLayer) return;
  out.rosterMovesDynamicLayer.innerHTML = '';
  ['callUp', 'sendDown'].forEach((section) => {
    rosterMovePreviewGroups[section] = [];
    for (let i = 0; i < MAX_ROSTER_GROUPS; i += 1) {
      const refs = createRosterPreviewGroup(section);
      rosterMovePreviewGroups[section].push(refs);
      out.rosterMovesDynamicLayer.appendChild(refs.root);
    }
  });
}

export function updateRosterMovesPoster({
  el,
  out,
  rosterMoveEditors,
  rosterMovePreviewGroups,
  selectedTeamInfo,
  formatDate,
  applyText,
  applyTextAfterAnchor,
  applyAdvancedText,
  applyPositionOnly,
  scheduleMobilePreviewRender
}) {
  const team = selectedTeamInfo(el.rosterMovesOpponentTeam);

  out.rosterMovesDateText.textContent = formatDate(el.rosterMovesDate.value);
  out.rosterMovesOpponentText.textContent = `vs ${team.name}`;
  out.rosterMovesStadiumText.textContent = el.rosterMovesStadiumName.value;
  out.rosterMovesDateText.style.letterSpacing = '-1px';
  out.rosterMovesOpponentText.style.letterSpacing = '-1px';
  out.rosterMovesStadiumText.style.letterSpacing = '-1px';

  applyText(out.rosterMovesDateText, ROSTER_MOVES_LAYOUT.dateText);
  applyTextAfterAnchor(out.rosterMovesOpponentText, ROSTER_MOVES_LAYOUT.opponentText, out.rosterMovesDateText, ROSTER_MOVES_LAYOUT.dateText, ROSTER_MOVES_LAYOUT.opponentText.x);
  applyText(out.rosterMovesStadiumText, ROSTER_MOVES_LAYOUT.stadiumText);

  const counts = {
    callUp: getRosterSectionCount(el, 'callUp'),
    sendDown: getRosterSectionCount(el, 'sendDown')
  };
  const activeSections = ['callUp', 'sendDown'].filter((section) => counts[section] > 0);
  const slotBySection = {};
  if (activeSections[0]) slotBySection[activeSections[0]] = 'upper';
  if (activeSections[1]) slotBySection[activeSections[1]] = 'lower';

  [
    ['callUp', out.callUpTitleText, 'CALL-UP'],
    ['sendDown', out.sendDownTitleText, 'SEND-DOWN']
  ].forEach(([section, node, label]) => {
    const slot = slotBySection[section];
    node.style.display = slot ? 'block' : 'none';
    if (!slot) return;
    node.textContent = label;
    applyAdvancedText(node, slot === 'upper' ? ROSTER_MOVES_LAYOUT.callUpTitle : ROSTER_MOVES_LAYOUT.sendDownTitle);
  });

  ['callUp', 'sendDown'].forEach((section) => {
    const slot = slotBySection[section];
    const slotY = slot ? ROSTER_SECTION_SLOT_Y[slot] : 0;
    rosterMovePreviewGroups[section].forEach((previewRefs, index) => {
      const isVisible = Boolean(slot) && index < counts[section];
      previewRefs.root.classList.toggle('is-hidden', !isVisible);
      if (!isVisible) return;

      const editorRefs = rosterMoveEditors[section][index];
      const info = getPlayerInfo(editorRefs.nameInput.value);
      const photoPath = getPlayerMiniPhotoPath(editorRefs.nameInput.value);
      const basePoint = ROSTER_GROUP_GRID[index] || ROSTER_GROUP_GRID[0];
      const groupX = basePoint.x;
      const groupY = slotY + basePoint.y;

      previewRefs.root.style.left = `${groupX}px`;
      previewRefs.root.style.top = `${groupY}px`;
      previewRefs.name.textContent = formatDisplayName(editorRefs.nameInput.value);
      previewRefs.meta.textContent = info ? `${info.throwBat}/${info.positionGroup}` : '';
      previewRefs.stats.textContent = !info
        ? ''
        : info.positionGroup === '투수'
          ? buildPitcherStatsLines(editorRefs)
          : buildHitterStatsLines(editorRefs);

      previewRefs.photo.classList.toggle('is-hidden', !photoPath);
      if (photoPath) previewRefs.photo.src = photoPath;

      applyPositionOnly(previewRefs.photo, { x: 0, y: 0 });
      applyPositionOnly(previewRefs.box, { x: 0, y: 0 });
      applyAdvancedText(previewRefs.name, ROSTER_MOVES_LAYOUT.groupName);
      applyAdvancedText(previewRefs.meta, ROSTER_MOVES_LAYOUT.groupMeta);
      applyAdvancedText(previewRefs.stats, ROSTER_MOVES_LAYOUT.groupStats);
    });
  });
  scheduleMobilePreviewRender();
}
