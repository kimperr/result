diff --git a/script.js b/script.js
index 36cf1068bda1f67f2f222e60d0048a281306ec20..2e1dc84fe6742966ee10ad9e3547f1abb13e999f 100644
--- a/script.js
+++ b/script.js
@@ -82,50 +82,53 @@ for (let i = 1; i <= 9; i += 1) {
 const el = {
   tabResult: document.getElementById('tabResult'),
   tabLineup: document.getElementById('tabLineup'),
   resultControls: document.getElementById('resultControls'),
   lineupControls: document.getElementById('lineupControls'),
   resultPoster: document.getElementById('resultPoster'),
   lineupPoster: document.getElementById('lineupPoster'),
 
   result: document.querySelectorAll('input[name="result"]'),
   kiaSide: document.querySelectorAll('input[name="kiaSide"]'),
   gameDate: document.getElementById('gameDate'),
   opponentTeam: document.getElementById('opponentTeam'),
   opponentName: document.getElementById('opponentName'),
   stadiumName: document.getElementById('stadiumName'),
   homeScore: document.getElementById('homeScore'),
   awayScore: document.getElementById('awayScore'),
   mvpName: document.getElementById('mvpName'),
   mvpRecord: document.getElementById('mvpRecord'),
   winnerName: document.getElementById('winnerName'),
   loserName: document.getElementById('loserName'),
   saveName: document.getElementById('saveName'),
   globalLetterSpacing: document.getElementById('globalLetterSpacing'),
   opponentXInput: document.getElementById('opponentXInput'),
   opponentYInput: document.getElementById('opponentYInput'),
   opponentSizeInput: document.getElementById('opponentSizeInput'),
+  mvpRecordXInput: document.getElementById('mvpRecordXInput'),
+  mvpRecordYInput: document.getElementById('mvpRecordYInput'),
+  mvpRecordSizeInput: document.getElementById('mvpRecordSizeInput'),
 
   lineupDate: document.getElementById('lineupDate'),
   lineupKiaSide: document.querySelectorAll('input[name="lineupKiaSide"]'),
   lineupOpponentTeam: document.getElementById('lineupOpponentTeam'),
   lineupOpponentName: document.getElementById('lineupOpponentName'),
   lineupStadiumName: document.getElementById('lineupStadiumName'),
   lineupPitcherName: document.getElementById('lineupPitcherName'),
   lineupLetterSpacing: document.getElementById('lineupLetterSpacing'),
   lineupOpponentXInput: document.getElementById('lineupOpponentXInput'),
   lineupOpponentYInput: document.getElementById('lineupOpponentYInput'),
   lineupOpponentSizeInput: document.getElementById('lineupOpponentSizeInput'),
   lineupInputGrid: document.getElementById('lineupInputGrid'),
 
   downloadBtn: document.getElementById('downloadBtn')
 };
 
 const out = {
   backgroundLayer: document.getElementById('backgroundLayer'),
   playerPhoto: document.getElementById('playerPhoto'),
   kiaLogo: document.getElementById('kiaLogo'),
   oppLogo: document.getElementById('oppLogo'),
   dateText: document.getElementById('dateText'),
   opponentText: document.getElementById('opponentText'),
   stadiumText: document.getElementById('stadiumText'),
   homeScoreText: document.getElementById('homeScoreText'),
@@ -252,50 +255,53 @@ function updateResultPoster() {
   }
 
   out.winnerText.textContent = el.winnerName.value;
   out.loserText.textContent = el.loserName.value;
   out.saveText.textContent = el.saveName.value;
   out.mvpNameText.textContent = el.mvpName.value || '';
   out.mvpRecordText.textContent = el.mvpRecord.value || '';
   out.playerPhoto.src = getPlayerPhotoPath(el.mvpName.value);
 
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
 
   RESULT_LAYOUT.opponentText.x = Number(el.opponentXInput.value) || RESULT_LAYOUT.opponentText.x;
   RESULT_LAYOUT.opponentText.y = Number(el.opponentYInput.value) || RESULT_LAYOUT.opponentText.y;
   RESULT_LAYOUT.opponentText.size = Number(el.opponentSizeInput.value) || RESULT_LAYOUT.opponentText.size;
+  RESULT_LAYOUT.mvpRecordText.x = Number(el.mvpRecordXInput.value) || RESULT_LAYOUT.mvpRecordText.x;
+  RESULT_LAYOUT.mvpRecordText.y = Number(el.mvpRecordYInput.value) || RESULT_LAYOUT.mvpRecordText.y;
+  RESULT_LAYOUT.mvpRecordText.size = Number(el.mvpRecordSizeInput.value) || RESULT_LAYOUT.mvpRecordText.size;
 
   applyText(out.dateText, RESULT_LAYOUT.dateText);
   applyText(out.opponentText, RESULT_LAYOUT.opponentText);
   applyText(out.stadiumText, RESULT_LAYOUT.stadiumText);
   applyText(out.homeScoreText, RESULT_LAYOUT.homeScoreText);
   applyText(out.awayScoreText, RESULT_LAYOUT.awayScoreText);
   applyText(out.winnerText, RESULT_LAYOUT.winnerText);
   applyText(out.loserText, RESULT_LAYOUT.loserText);
   applyText(out.saveText, RESULT_LAYOUT.saveText);
   applyText(out.mvpNameText, RESULT_LAYOUT.mvpNameText);
   applyText(out.mvpRecordText, RESULT_LAYOUT.mvpRecordText);
   applyBadge(out.badgeWin, RESULT_LAYOUT.badgeWin);
   applyBadge(out.badgeLose, RESULT_LAYOUT.badgeLose);
   applyBadge(out.badgeSave, RESULT_LAYOUT.badgeSave);
 }
 
 function updateLineupPoster() {
   const team = selectedTeamInfo(el.lineupOpponentTeam);
   const side = selectedValue(el.lineupKiaSide);
   el.lineupStadiumName.value = side === 'home' ? KIA_HOME_STADIUM : team.stadium;
 
   out.lineupDateText.textContent = formatDate(el.lineupDate.value);
   LINEUP_LAYOUT.opponentText.x = Number(el.lineupOpponentXInput.value) || LINEUP_LAYOUT.opponentText.x;
   LINEUP_LAYOUT.opponentText.y = Number(el.lineupOpponentYInput.value) || LINEUP_LAYOUT.opponentText.y;
   LINEUP_LAYOUT.opponentText.size = Number(el.lineupOpponentSizeInput.value) || LINEUP_LAYOUT.opponentText.size;
@@ -368,51 +374,52 @@ async function downloadImage() {
     const canvas = await html2canvas(poster, { useCORS: true, scale: 3, backgroundColor: null });
     const link = document.createElement('a');
     link.download = `${activeTab}-${Date.now()}.png`;
     link.href = canvas.toDataURL('image/png', 1);
     link.click();
   } finally {
     poster.style.transform = prevTransform;
     poster.style.transformOrigin = prevOrigin;
   }
 }
 
 function populateTeamSelect(selectEl) {
   TEAM_DB.forEach((team) => {
     const option = document.createElement('option');
     option.value = team.name;
     option.textContent = team.name;
     selectEl.appendChild(option);
   });
 }
 
 function bindEvents() {
   const resultInputs = [
     ...el.result, ...el.kiaSide, el.gameDate, el.opponentTeam, el.opponentName,
     el.stadiumName, el.homeScore, el.awayScore, el.mvpName, el.mvpRecord,
     el.winnerName, el.loserName, el.saveName, el.globalLetterSpacing,
-    el.opponentXInput, el.opponentYInput, el.opponentSizeInput
+    el.opponentXInput, el.opponentYInput, el.opponentSizeInput,
+    el.mvpRecordXInput, el.mvpRecordYInput, el.mvpRecordSizeInput
   ];
   resultInputs.forEach((input) => {
     input.addEventListener('input', updateResultPoster);
     input.addEventListener('change', updateResultPoster);
   });
 
   el.opponentTeam.addEventListener('change', () => {
     const team = selectedTeamInfo(el.opponentTeam);
     el.opponentName.value = team.name;
     el.stadiumName.value = selectedValue(el.kiaSide) === 'home' ? KIA_HOME_STADIUM : team.stadium;
     updateResultPoster();
   });
 
   const lineupInputs = [
     el.lineupDate,
     el.lineupOpponentTeam,
     el.lineupOpponentName,
     el.lineupStadiumName,
     el.lineupPitcherName,
     el.lineupLetterSpacing,
     el.lineupOpponentXInput,
     el.lineupOpponentYInput,
     el.lineupOpponentSizeInput
   ];
   const lineupSideInputs = [...el.lineupKiaSide];
