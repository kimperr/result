export function applySharedOpponent({
  teamName,
  el,
  kiaHomeStadium,
  selectedValue,
  selectedTeamInfoByName,
  updateResultPoster,
  updateLineupPoster,
  updateVideoPoster,
  updateRosterMovesPoster,
  updateSecondaryActionButtons
}) {
  const team = selectedTeamInfoByName(teamName);
  const sharedName = team.name;

  el.opponentTeam.value = sharedName;
  el.lineupOpponentTeam.value = sharedName;
  el.videoOpponentTeam.value = sharedName;
  if (el.rosterMovesOpponentTeam) el.rosterMovesOpponentTeam.value = sharedName;

  el.stadiumName.value = selectedValue(el.kiaSide) === 'home' ? kiaHomeStadium : team.stadium;
  el.lineupStadiumName.value = selectedValue(el.lineupKiaSide) === 'home' ? kiaHomeStadium : team.stadium;
  if (el.rosterMovesStadiumName) {
    el.rosterMovesStadiumName.value = selectedValue(el.lineupKiaSide) === 'home' ? kiaHomeStadium : team.stadium;
  }

  updateResultPoster();
  updateLineupPoster();
  updateVideoPoster();
  updateRosterMovesPoster();
  updateSecondaryActionButtons();
}

export function applySharedKiaSide({
  side,
  el,
  kiaHomeStadium,
  setSelectedRadioValue,
  selectedTeamInfo,
  updateResultPoster,
  updateLineupPoster,
  updateRosterMovesPoster
}) {
  setSelectedRadioValue(el.kiaSide, side);
  setSelectedRadioValue(el.lineupKiaSide, side);
  const team = selectedTeamInfo(el.opponentTeam);
  const stadium = side === 'home' ? kiaHomeStadium : team.stadium;
  el.stadiumName.value = stadium;
  el.lineupStadiumName.value = stadium;
  if (el.rosterMovesStadiumName) el.rosterMovesStadiumName.value = stadium;
  updateResultPoster();
  updateLineupPoster();
  updateRosterMovesPoster();
}

export function applySharedOpponentFineTune({
  x,
  y,
  el,
  syncNumberRangeValues,
  updateResultPoster,
  updateLineupPoster,
  updateRosterMovesPoster
}) {
  if (el.opponentXInput && el.opponentXRange) syncNumberRangeValues(el.opponentXInput, el.opponentXRange, x);
  if (el.lineupOpponentXInput && el.lineupOpponentXRange) syncNumberRangeValues(el.lineupOpponentXInput, el.lineupOpponentXRange, x);
  if (el.rosterOpponentXInput && el.rosterOpponentXRange) syncNumberRangeValues(el.rosterOpponentXInput, el.rosterOpponentXRange, x);
  if (el.opponentYInput && el.opponentYRange) syncNumberRangeValues(el.opponentYInput, el.opponentYRange, y);
  if (el.lineupOpponentYInput && el.lineupOpponentYRange) syncNumberRangeValues(el.lineupOpponentYInput, el.lineupOpponentYRange, y);
  if (el.rosterOpponentYInput && el.rosterOpponentYRange) syncNumberRangeValues(el.rosterOpponentYInput, el.rosterOpponentYRange, y);
  updateResultPoster();
  updateLineupPoster();
  updateRosterMovesPoster();
}
