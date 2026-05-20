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
  updateCanceledPoster,
  updateSecondaryActionButtons
}) {
  const team = selectedTeamInfoByName(teamName);
  const sharedName = team.name;

  el.opponentTeam.value = sharedName;
  el.lineupOpponentTeam.value = sharedName;
  el.videoOpponentTeam.value = sharedName;
  if (el.rosterMovesOpponentTeam) el.rosterMovesOpponentTeam.value = sharedName;
  if (el.canceledOpponentTeam) el.canceledOpponentTeam.value = sharedName;

  el.stadiumName.value = selectedValue(el.kiaSide) === 'home' ? kiaHomeStadium : team.stadium;
  el.lineupStadiumName.value = selectedValue(el.lineupKiaSide) === 'home' ? kiaHomeStadium : team.stadium;
  if (el.rosterMovesStadiumName) {
    el.rosterMovesStadiumName.value = selectedValue(el.lineupKiaSide) === 'home' ? kiaHomeStadium : team.stadium;
  }
  if (el.canceledStadiumName) {
    el.canceledStadiumName.value = selectedValue(el.canceledKiaSide) === 'home' ? kiaHomeStadium : team.stadium;
  }

  updateResultPoster();
  updateLineupPoster();
  updateVideoPoster();
  updateRosterMovesPoster();
  if (typeof updateCanceledPoster === 'function') updateCanceledPoster();
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
  updateRosterMovesPoster,
  updateCanceledPoster
}) {
  setSelectedRadioValue(el.kiaSide, side);
  setSelectedRadioValue(el.lineupKiaSide, side);
  if (el.canceledKiaSide) setSelectedRadioValue(el.canceledKiaSide, side);
  const team = selectedTeamInfo(el.opponentTeam);
  const canceledTeam = el.canceledOpponentTeam ? selectedTeamInfo(el.canceledOpponentTeam) : team;
  const stadium = side === 'home' ? kiaHomeStadium : team.stadium;
  const canceledStadium = side === 'home' ? kiaHomeStadium : canceledTeam.stadium;
  el.stadiumName.value = stadium;
  el.lineupStadiumName.value = stadium;
  if (el.rosterMovesStadiumName) el.rosterMovesStadiumName.value = stadium;
  if (el.canceledStadiumName) el.canceledStadiumName.value = canceledStadium;
  updateResultPoster();
  updateLineupPoster();
  updateRosterMovesPoster();
  if (typeof updateCanceledPoster === 'function') updateCanceledPoster();
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
