const TEAM_DB = [
  { name: 'LG 트윈스', stadium: '잠실 야구장', code: 'lg' },
  { name: '두산 베어스', stadium: '잠실 야구장', code: 'doo' },
  { name: '키움 히어로즈', stadium: '고척 스카이돔', code: 'kiw' },
  { name: 'SSG 랜더스', stadium: '인천 SSG 랜더스필드', code: 'ssg' },
  { name: 'KT 위즈', stadium: '수원 KT위즈파크', code: 'kt' },
  { name: '한화 이글스', stadium: '대전 한화생명 볼파크', code: 'han' },
  { name: '롯데 자이언츠', stadium: '사직 야구장', code: 'lot' },
  { name: 'NC 다이노스', stadium: '창원 NC파크', code: 'nc' },
  { name: '삼성 라이온즈', stadium: '대구 삼성 라이온즈파크', code: 'sam' }
] ;

const BACKGROUND_BY_RESULT = {
  win: 'assets/background/bg-win.png',
  lose: 'assets/background/bg-lose.png',
  draw: 'assets/background/bg-draw.png'
};

const PLAYER_NUMBER_BY_NAME = {
  '곽도규': 0, '박정우': 1, '박민': 2, '김선빈': 3, '유지성': 4, '김도영': 5,
  '이창진': 8, '정해원': 9, '김태형': 10, '조상우': 11, '정현창': 12, '윤영철': 13,
  '김규성': 14, '박재현': 15, '윤도현': 16, '김현수(17)': 17, '윤중현': 19, '이준영': 20,
  '김사윤': 21, '주효상': 22, '최정용': 23, '한준수': 25, '카스트로': 26, '김호령': 27,
  '이형범': 28, '변우혁': 29, '한승연': 31, '데일': 32, '올러': 33, '황대인': 34,
  '김석환': 35, '이호연': 36, '김민규': 37, '장재혁': 38, '최지민': 39,
  '네일': 40, '황동하': 41, '김태군': 42, '김건국': 43, '이태양': 44, '정찬화': 45,
  '김정엽': 46, '나성범': 47, '이의리': 48, '김범수': 49, '박상준': 50, '전상현': 51,
  '홍건희': 52, '김기훈': 53, '양현종': 54, '한재승': 55, '오선우': 56, '고종욱': 57,
  '이성원': 58, '김도현': 60, '김시훈': 61, '정해영': 62, '이호민': 63, '김현수(64)': 64,
  '성영탁': 65, '이도현': 66, '홍민규': 67, '김대유': 69
};

const PLAYER_INFO_LIST = [
  { name: '곽도규', throwBat: '좌사좌타', positionGroup: '투수' },
  { name: '김대유', throwBat: '좌사좌타', positionGroup: '투수' },
  { name: '윤중현', throwBat: '우사우타', positionGroup: '투수' },
  { name: '이형범', throwBat: '우사우타', positionGroup: '투수' },
  { name: '유지성', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '윤영철', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '이준영', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '김사윤', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '최지민', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '이의리', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '김범수', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '김기훈', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '양현종', throwBat: '좌투좌타', positionGroup: '투수' },
  { name: '박상준', throwBat: '좌투좌타', positionGroup: '내야수' },
  { name: '나성범', throwBat: '좌투좌타', positionGroup: '외야수' },
  { name: '홍민규', throwBat: '우투좌타', positionGroup: '투수' },
  { name: '주효상', throwBat: '우투좌타', positionGroup: '포수' },
  { name: '한준수', throwBat: '우투좌타', positionGroup: '포수' },
  { name: '김규성', throwBat: '우투좌타', positionGroup: '내야수' },
  { name: '최정용', throwBat: '우투좌타', positionGroup: '내야수' },
  { name: '이호연', throwBat: '우투좌타', positionGroup: '내야수' },
  { name: '박정우', throwBat: '우투좌타', positionGroup: '외야수' },
  { name: '카스트로', throwBat: '우투좌타', positionGroup: '외야수' },
  { name: '김석환', throwBat: '우투좌타', positionGroup: '외야수' },
  { name: '오선우', throwBat: '우투좌타', positionGroup: '외야수' },
  { name: '고종욱', throwBat: '우투좌타', positionGroup: '외야수' },
  { name: '김태형', throwBat: '우투우타', positionGroup: '투수' },
  { name: '조상우', throwBat: '우투우타', positionGroup: '투수' },
  { name: '김현수(17)', throwBat: '우투우타', positionGroup: '투수' },
  { name: '올러', throwBat: '우투우타', positionGroup: '투수' },
  { name: '장재혁', throwBat: '우투우타', positionGroup: '투수' },
  { name: '네일', throwBat: '우투우타', positionGroup: '투수' },
  { name: '황동하', throwBat: '우투우타', positionGroup: '투수' },
  { name: '김건국', throwBat: '우투우타', positionGroup: '투수' },
  { name: '이태양', throwBat: '우투우타', positionGroup: '투수' },
  { name: '정찬화', throwBat: '우투우타', positionGroup: '투수' },
  { name: '김정엽', throwBat: '우투우타', positionGroup: '투수' },
  { name: '전상현', throwBat: '우투우타', positionGroup: '투수' },
  { name: '홍건희', throwBat: '우투우타', positionGroup: '투수' },
  { name: '한재승', throwBat: '우투우타', positionGroup: '투수' },
  { name: '이성원', throwBat: '우투우타', positionGroup: '투수' },
  { name: '김도현', throwBat: '우투우타', positionGroup: '투수' },
  { name: '김시훈', throwBat: '우투우타', positionGroup: '투수' },
  { name: '정해영', throwBat: '우투우타', positionGroup: '투수' },
  { name: '이호민', throwBat: '우투우타', positionGroup: '투수' },
  { name: '김현수(64)', throwBat: '우투우타', positionGroup: '투수' },
  { name: '성영탁', throwBat: '우투우타', positionGroup: '투수' },
  { name: '이도현', throwBat: '우투우타', positionGroup: '투수' },
  { name: '김태군', throwBat: '우투우타', positionGroup: '포수' },
  { name: '박민', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '김선빈', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '김도영', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '정해원', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '정현창', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '윤도현', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '변우혁', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '데일', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '황대인', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '김민규', throwBat: '우투우타', positionGroup: '내야수' },
  { name: '이창진', throwBat: '우투우타', positionGroup: '외야수' },
  { name: '박재현', throwBat: '우투우타', positionGroup: '외야수' },
  { name: '김호령', throwBat: '우투우타', positionGroup: '외야수' },
  { name: '한승연', throwBat: '우투우타', positionGroup: '외야수' }
];

const PLAYER_INFO_BY_NAME = Object.fromEntries(
  PLAYER_INFO_LIST.map((player) => [player.name, player])
);

const KIA_HOME_STADIUM = '광주 기아 챔피언스필드';

const RESULT_LAYOUT = {
  dateText: { x: 66, y: 354, size: 29 },
  opponentText: { x: 215, y: 354, size: 28 },
  stadiumText: { x: 66, y: 391, size: 29 },
  homeScoreText: { x: 285, y: 532, size: 140 },
  awayScoreText: { x: 285, y: 715, size: 140 },
  winnerText: { x: 127, y: 959, size: 33 },
  loserText: { x: 127, y: 1011, size: 33 },
  saveText: { x: 127, y: 1062, size: 33 },
  badgeWin: { x: 68, y: 957, size: 42, font: 31 },
  badgeLose: { x: 68, y: 1008, size: 42, font: 31 },
  badgeSave: { x: 68, y: 1059, size: 42, font: 31 },
  mvpNameText: { x: 252, y: 1120, size: 39 },
  mvpRecordText: { x: 359, y: 1135, size: 20 }
};

const LINEUP_LAYOUT = {
  dateText: { x: 66, y: 354, size: 29 },
  opponentText: { x: 228, y: 354, size: 28 },
  stadiumText: { x: 66, y: 391, size: 29 },
  names: {},
  positions: {},
  pitcher: { x: 135, y: 1144, size: 45 }
};
const ROSTER_MOVES_LAYOUT = {
  dateText: { x: 66, y: 354, size: 29 },
  opponentText: { x: 228, y: 354, size: 28 },
  stadiumText: { x: 66, y: 391, size: 29 },
  callUpTitle: { x: 62, y: 470, size: 53, letterSpacing: -3, lineHeight: 64 },
  sendDownTitle: { x: 62, y: 859, size: 53, letterSpacing: -3, lineHeight: 64 },
  groupName: { x: 270, y: 578, size: 52, letterSpacing: 0, lineHeight: 66 },
  groupMeta: { x: 273.6, y: 640, size: 20, letterSpacing: 0, lineHeight: 32 },
  groupStats: { x: 276, y: 727, size: 19, letterSpacing: -1.5, lineHeight: 29 }
};
const MAX_ROSTER_GROUPS = 4;
const ROSTER_SECTION_SLOT_Y = {
  upper: 0,
  lower: 398
};
const ROSTER_GROUP_GRID = [
  { x: 0, y: 0 },
  { x: 474, y: 0 },
  { x: 0, y: 328 },
  { x: 474, y: 328 }
];
const LINEUP_FIXED = {
  nameX: 167,
  nameSize: 47,
  posX: 399,
  posSize: 49
};
const LINEUP_Y_VALUES = [
  480, 475,
  553, 548,
  624, 619,
  695, 690,
  768, 763,
  840, 835,
  912, 907,
  985, 980,
  1056, 1051
];

for (let i = 1; i <= 9; i += 1) {
  LINEUP_LAYOUT.names[i] = { x: LINEUP_FIXED.nameX, y: LINEUP_Y_VALUES[(i - 1) * 2], size: LINEUP_FIXED.nameSize };
  LINEUP_LAYOUT.positions[i] = { x: LINEUP_FIXED.posX, y: LINEUP_Y_VALUES[(i - 1) * 2 + 1], size: LINEUP_FIXED.posSize };
}

const VIDEO_LAYOUT = {
  title: { x: 120, y: 246, width: 840, size: 77, lineHeight: 93, letterSpacing: -3 },
  frame: { x: 90, y: 516, width: 900, height: 506, scale: 120 },
  meta: { x: 120, y: 1107, width: 840, size: 40, lineHeight: 54 }
};

const VIDEO_BG_FALLBACK = {
  top: '#7f0b0d',
  mid: '#8d1b19',
  bottom: '#781310'
};

const LINEUP_POSITION_MAP = {
  '1': 'P',
  '2': 'C',
  '3': '1B',
  '4': '2B',
  '5': '3B',
  '6': 'SS',
  '7': 'LF',
  '8': 'CF',
  '9': 'RF',
  D: 'DH'
};

const el = {
  tabResult: document.getElementById('tabResult'),
  tabLineup: document.getElementById('tabLineup'),
  tabVideo: document.getElementById('tabVideo'),
  tabRosterMoves: document.getElementById('tabRosterMoves'),
  resultControls: document.getElementById('resultControls'),
  lineupControls: document.getElementById('lineupControls'),
  videoControls: document.getElementById('videoControls'),
  rosterMovesControls: document.getElementById('rosterMovesControls'),
  resultPoster: document.getElementById('resultPoster'),
  lineupPoster: document.getElementById('lineupPoster'),
  videoPoster: document.getElementById('videoPoster'),
  rosterMovesPoster: document.getElementById('rosterMovesPoster'),
  previewScale: document.getElementById('previewScale'),

  result: document.querySelectorAll('input[name="result"]'),
  kiaSide: document.querySelectorAll('input[name="kiaSide"]'),
  gameDate: document.getElementById('gameDate'),
  opponentTeam: document.getElementById('opponentTeam'),
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
  opponentXRange: document.getElementById('opponentXRange'),
  opponentYRange: document.getElementById('opponentYRange'),
  mvpRecordXInput: document.getElementById('mvpRecordXInput'),
  mvpRecordYInput: document.getElementById('mvpRecordYInput'),
  mvpRecordXRange: document.getElementById('mvpRecordXRange'),
  mvpRecordYRange: document.getElementById('mvpRecordYRange'),

  lineupDate: document.getElementById('lineupDate'),
  lineupKiaSide: document.querySelectorAll('input[name="lineupKiaSide"]'),
  lineupOpponentTeam: document.getElementById('lineupOpponentTeam'),
  lineupStadiumName: document.getElementById('lineupStadiumName'),
  lineupPitcherName: document.getElementById('lineupPitcherName'),
  lineupLetterSpacing: document.getElementById('lineupLetterSpacing'),
  lineupOpponentXInput: document.getElementById('lineupOpponentXInput'),
  lineupOpponentYInput: document.getElementById('lineupOpponentYInput'),
  lineupOpponentXRange: document.getElementById('lineupOpponentXRange'),
  lineupOpponentYRange: document.getElementById('lineupOpponentYRange'),
  rosterOpponentXInput: document.getElementById('rosterOpponentXInput'),
  rosterOpponentYInput: document.getElementById('rosterOpponentYInput'),
  rosterOpponentXRange: document.getElementById('rosterOpponentXRange'),
  rosterOpponentYRange: document.getElementById('rosterOpponentYRange'),
  lineupInputGrid: document.getElementById('lineupInputGrid'),
  lineupGameTime: document.getElementById('lineupGameTime'),
  lineupGameTimeCustom: document.getElementById('lineupGameTimeCustom'),
  lineupBroadcaster: document.getElementById('lineupBroadcaster'),
  lineupTerrestrial: document.getElementById('lineupTerrestrial'),

  videoFileInput: document.getElementById('videoFileInput'),
  videoTitleInput: document.getElementById('videoTitleInput'),
  videoDate: document.getElementById('videoDate'),
  videoOpponentTeam: document.getElementById('videoOpponentTeam'),
  videoMetaOverride: document.getElementById('videoMetaOverride'),
  videoStartTime: document.getElementById('videoStartTime'),
  videoEndTime: document.getElementById('videoEndTime'),
  videoTrimStartRange: document.getElementById('videoTrimStartRange'),
  videoTrimEndRange: document.getElementById('videoTrimEndRange'),
  videoPlayToggle: document.getElementById('videoPlayToggle'),
  videoPreviewToggleBtn: document.getElementById('videoPreviewToggleBtn'),
  videoPlaybackRange: document.getElementById('videoPlaybackRange'),
  videoPlaybackTime: document.getElementById('videoPlaybackTime'),
  videoSaveProgress: document.getElementById('videoSaveProgress'),
  videoSaveProgressFill: document.getElementById('videoSaveProgressFill'),
  videoSaveProgressText: document.getElementById('videoSaveProgressText'),
  followDownloadBtn: document.getElementById('followDownloadBtn'),
  videoFrameXInput: document.getElementById('videoFrameXInput'),
  videoFrameYInput: document.getElementById('videoFrameYInput'),
  videoFrameXRange: document.getElementById('videoFrameXRange'),
  videoFrameYRange: document.getElementById('videoFrameYRange'),
  videoFrameScaleInput: document.getElementById('videoFrameScaleInput'),
  videoFrameScaleRange: document.getElementById('videoFrameScaleRange'),
  videoTitleXInput: document.getElementById('videoTitleXInput'),
  videoTitleYInput: document.getElementById('videoTitleYInput'),
  videoTitleXRange: document.getElementById('videoTitleXRange'),
  videoTitleYRange: document.getElementById('videoTitleYRange'),
  videoTitleSizeInput: document.getElementById('videoTitleSizeInput'),
  videoTitleSizeRange: document.getElementById('videoTitleSizeRange'),
  videoTitleSpacingInput: document.getElementById('videoTitleSpacingInput'),
  videoTitleSpacingRange: document.getElementById('videoTitleSpacingRange'),
  videoTitleLineHeightInput: document.getElementById('videoTitleLineHeightInput'),
  videoTitleLineHeightRange: document.getElementById('videoTitleLineHeightRange'),
  videoMetaXInput: document.getElementById('videoMetaXInput'),
  videoMetaYInput: document.getElementById('videoMetaYInput'),
  videoMetaXRange: document.getElementById('videoMetaXRange'),
  videoMetaYRange: document.getElementById('videoMetaYRange'),
  videoMetaSizeInput: document.getElementById('videoMetaSizeInput'),
  videoMetaSizeRange: document.getElementById('videoMetaSizeRange'),

  rosterMovesDate: document.getElementById('rosterMovesDate'),
  rosterMovesOpponentTeam: document.getElementById('rosterMovesOpponentTeam'),
  rosterMovesStadiumName: document.getElementById('rosterMovesStadiumName'),
  callUpDetails: document.getElementById('callUpDetails'),
  sendDownDetails: document.getElementById('sendDownDetails'),
  callUpCount: document.getElementById('callUpCount'),
  sendDownCount: document.getElementById('sendDownCount'),
  callUpGroupControls: document.getElementById('callUpGroupControls'),
  sendDownGroupControls: document.getElementById('sendDownGroupControls'),
  callUpName: document.getElementById('callUpName'),
  callUpMeta: document.getElementById('callUpMeta'),
  callUpPitcherStats: document.getElementById('callUpPitcherStats'),
  callUpPitcherGames: document.getElementById('callUpPitcherGames'),
  callUpPitcherWins: document.getElementById('callUpPitcherWins'),
  callUpPitcherLosses: document.getElementById('callUpPitcherLosses'),
  callUpPitcherSaves: document.getElementById('callUpPitcherSaves'),
  callUpPitcherHolds: document.getElementById('callUpPitcherHolds'),
  callUpPitcherInnings: document.getElementById('callUpPitcherInnings'),
  callUpPitcherEra: document.getElementById('callUpPitcherEra'),
  callUpPitcherWhip: document.getElementById('callUpPitcherWhip'),
  callUpHitterStats: document.getElementById('callUpHitterStats'),
  callUpHitterGames: document.getElementById('callUpHitterGames'),
  callUpHitterHomeRuns: document.getElementById('callUpHitterHomeRuns'),
  callUpHitterRbi: document.getElementById('callUpHitterRbi'),
  callUpHitterSteals: document.getElementById('callUpHitterSteals'),
  callUpHitterAvg: document.getElementById('callUpHitterAvg'),
  callUpHitterOps: document.getElementById('callUpHitterOps'),
  sendDownName: document.getElementById('sendDownName'),
  sendDownMeta: document.getElementById('sendDownMeta'),
  sendDownPitcherStats: document.getElementById('sendDownPitcherStats'),
  sendDownPitcherGames: document.getElementById('sendDownPitcherGames'),
  sendDownPitcherWins: document.getElementById('sendDownPitcherWins'),
  sendDownPitcherLosses: document.getElementById('sendDownPitcherLosses'),
  sendDownPitcherSaves: document.getElementById('sendDownPitcherSaves'),
  sendDownPitcherHolds: document.getElementById('sendDownPitcherHolds'),
  sendDownPitcherInnings: document.getElementById('sendDownPitcherInnings'),
  sendDownPitcherEra: document.getElementById('sendDownPitcherEra'),
  sendDownPitcherWhip: document.getElementById('sendDownPitcherWhip'),
  sendDownHitterStats: document.getElementById('sendDownHitterStats'),
  sendDownHitterGames: document.getElementById('sendDownHitterGames'),
  sendDownHitterHomeRuns: document.getElementById('sendDownHitterHomeRuns'),
  sendDownHitterRbi: document.getElementById('sendDownHitterRbi'),
  sendDownHitterSteals: document.getElementById('sendDownHitterSteals'),
  sendDownHitterAvg: document.getElementById('sendDownHitterAvg'),
  sendDownHitterOps: document.getElementById('sendDownHitterOps'),
  callUpBoxXInput: document.getElementById('callUpBoxXInput'),
  callUpBoxYInput: document.getElementById('callUpBoxYInput'),
  callUpBoxXRange: document.getElementById('callUpBoxXRange'),
  callUpBoxYRange: document.getElementById('callUpBoxYRange'),
  sendDownBoxXInput: document.getElementById('sendDownBoxXInput'),
  sendDownBoxYInput: document.getElementById('sendDownBoxYInput'),
  sendDownBoxXRange: document.getElementById('sendDownBoxXRange'),
  sendDownBoxYRange: document.getElementById('sendDownBoxYRange'),
  callUpCardXInput: document.getElementById('callUpCardXInput'),
  callUpCardYInput: document.getElementById('callUpCardYInput'),
  callUpCardXRange: document.getElementById('callUpCardXRange'),
  callUpCardYRange: document.getElementById('callUpCardYRange'),
  sendDownCardXInput: document.getElementById('sendDownCardXInput'),
  sendDownCardYInput: document.getElementById('sendDownCardYInput'),
  sendDownCardXRange: document.getElementById('sendDownCardXRange'),
  sendDownCardYRange: document.getElementById('sendDownCardYRange'),
  callUpNameXInput: document.getElementById('callUpNameXInput'),
  callUpNameYInput: document.getElementById('callUpNameYInput'),
  callUpNameXRange: document.getElementById('callUpNameXRange'),
  callUpNameYRange: document.getElementById('callUpNameYRange'),
  callUpNameSizeInput: document.getElementById('callUpNameSizeInput'),
  callUpNameSizeRange: document.getElementById('callUpNameSizeRange'),
  callUpNameSpacingInput: document.getElementById('callUpNameSpacingInput'),
  callUpNameSpacingRange: document.getElementById('callUpNameSpacingRange'),
  callUpNameLineHeightInput: document.getElementById('callUpNameLineHeightInput'),
  callUpNameLineHeightRange: document.getElementById('callUpNameLineHeightRange'),
  callUpMetaXInput: document.getElementById('callUpMetaXInput'),
  callUpMetaYInput: document.getElementById('callUpMetaYInput'),
  callUpMetaXRange: document.getElementById('callUpMetaXRange'),
  callUpMetaYRange: document.getElementById('callUpMetaYRange'),
  callUpMetaSizeInput: document.getElementById('callUpMetaSizeInput'),
  callUpMetaSizeRange: document.getElementById('callUpMetaSizeRange'),
  callUpMetaSpacingInput: document.getElementById('callUpMetaSpacingInput'),
  callUpMetaSpacingRange: document.getElementById('callUpMetaSpacingRange'),
  callUpMetaLineHeightInput: document.getElementById('callUpMetaLineHeightInput'),
  callUpMetaLineHeightRange: document.getElementById('callUpMetaLineHeightRange'),
  sendDownNameXInput: document.getElementById('sendDownNameXInput'),
  sendDownNameYInput: document.getElementById('sendDownNameYInput'),
  sendDownNameXRange: document.getElementById('sendDownNameXRange'),
  sendDownNameYRange: document.getElementById('sendDownNameYRange'),
  sendDownNameSizeInput: document.getElementById('sendDownNameSizeInput'),
  sendDownNameSizeRange: document.getElementById('sendDownNameSizeRange'),
  sendDownNameSpacingInput: document.getElementById('sendDownNameSpacingInput'),
  sendDownNameSpacingRange: document.getElementById('sendDownNameSpacingRange'),
  sendDownNameLineHeightInput: document.getElementById('sendDownNameLineHeightInput'),
  sendDownNameLineHeightRange: document.getElementById('sendDownNameLineHeightRange'),
  sendDownMetaXInput: document.getElementById('sendDownMetaXInput'),
  sendDownMetaYInput: document.getElementById('sendDownMetaYInput'),
  sendDownMetaXRange: document.getElementById('sendDownMetaXRange'),
  sendDownMetaYRange: document.getElementById('sendDownMetaYRange'),
  sendDownMetaSizeInput: document.getElementById('sendDownMetaSizeInput'),
  sendDownMetaSizeRange: document.getElementById('sendDownMetaSizeRange'),
  sendDownMetaSpacingInput: document.getElementById('sendDownMetaSpacingInput'),
  sendDownMetaSpacingRange: document.getElementById('sendDownMetaSpacingRange'),
  sendDownMetaLineHeightInput: document.getElementById('sendDownMetaLineHeightInput'),
  sendDownMetaLineHeightRange: document.getElementById('sendDownMetaLineHeightRange'),
  playerNameOptions: document.getElementById('playerNameOptions'),

  downloadBtn: document.getElementById('downloadBtn'),
  lineupCaptionSettings: document.getElementById('lineupCaptionSettings'),
  captionTools: document.getElementById('captionTools'),
  captionOutput: document.getElementById('captionOutput'),
  copyCaptionBtn: document.getElementById('copyCaptionBtn'),
  copyToast: document.getElementById('copyToast')
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
  awayScoreText: document.getElementById('awayScoreText'),
  winnerText: document.getElementById('winnerText'),
  loserText: document.getElementById('loserText'),
  saveText: document.getElementById('saveText'),
  badgeWin: document.getElementById('badgeWin'),
  badgeLose: document.getElementById('badgeLose'),
  badgeSave: document.getElementById('badgeSave'),
  mvpNameText: document.getElementById('mvpNameText'),
  mvpRecordText: document.getElementById('mvpRecordText'),

  lineupBgLayer: document.getElementById('lineupBgLayer'),
  lineupPlayerPhoto: document.getElementById('lineupPlayerPhoto'),
  lineupDateText: document.getElementById('lineupDateText'),
  lineupOpponentText: document.getElementById('lineupOpponentText'),
  lineupStadiumText: document.getElementById('lineupStadiumText'),
  lineupTextLayer: document.getElementById('lineupTextLayer'),
  lineupPitcherText: document.getElementById('lineupPitcherText'),
  resultMobilePreview: document.getElementById('resultMobilePreview'),
  lineupMobilePreview: document.getElementById('lineupMobilePreview'),
  rosterMovesBgLayer: document.getElementById('rosterMovesBgLayer'),
  rosterMovesDateText: document.getElementById('rosterMovesDateText'),
  rosterMovesOpponentText: document.getElementById('rosterMovesOpponentText'),
  rosterMovesStadiumText: document.getElementById('rosterMovesStadiumText'),
  callUpTitleText: document.getElementById('callUpTitleText'),
  rosterMovesDynamicLayer: document.getElementById('rosterMovesDynamicLayer'),
  callUpBoxLayer: document.getElementById('callUpBoxLayer'),
  callUpPlayerMini: document.getElementById('callUpPlayerMini'),
  callUpNameText: document.getElementById('callUpNameText'),
  callUpMetaText: document.getElementById('callUpMetaText'),
  sendDownTitleText: document.getElementById('sendDownTitleText'),
  sendDownBoxLayer: document.getElementById('sendDownBoxLayer'),
  sendDownPlayerMini: document.getElementById('sendDownPlayerMini'),
  sendDownNameText: document.getElementById('sendDownNameText'),
  sendDownMetaText: document.getElementById('sendDownMetaText'),
  rosterMovesMobilePreview: document.getElementById('rosterMovesMobilePreview'),
  videoBgImage: document.getElementById('videoBgImage'),
  videoTitleText: document.getElementById('videoTitleText'),
  videoPreviewElement: document.getElementById('videoPreviewElement'),
  videoMetaText: document.getElementById('videoMetaText'),
  videoFramePreviewImage: document.getElementById('videoFramePreviewImage')
};
out.videoTrimSelected = document.getElementById('videoTrimSelected');

let activeTab = 'result';
const lineupTextRefs = { names: {}, positions: {} };
const rosterMoveEditors = { callUp: [], sendDown: [] };
const rosterMovePreviewGroups = { callUp: [], sendDown: [] };
let mobilePreviewTimer = null;
let copyToastTimer = null;
const videoState = {
  objectUrl: '',
  loopHandler: null,
  sourceBytes: null,
  sourceExt: 'mp4',
  overlayPromise: null,
  overlayKey: '',
  overlayBitmapPromise: null,
  previewMode: false
};
let resultManualOverride = false;

function selectedValue(radios) {
  return Array.from(radios).find((radio) => radio.checked)?.value;
}

function setSelectedRadioValue(radios, value) {
  Array.from(radios).forEach((radio) => {
    radio.checked = radio.value === value;
  });
}

function syncNumberRangeValues(numberInput, rangeInput, value) {
  if (numberInput) numberInput.value = String(value);
  if (rangeInput) rangeInput.value = String(value);
}

function parseScoreInput(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getAutoResultValue() {
  const side = selectedValue(el.kiaSide);
  const homeScore = parseScoreInput(el.homeScore.value);
  const awayScore = parseScoreInput(el.awayScore.value);
  const kiaScore = side === 'home' ? homeScore : awayScore;
  const opponentScore = side === 'home' ? awayScore : homeScore;

  if (kiaScore > opponentScore) return 'win';
  if (kiaScore < opponentScore) return 'lose';
  return 'draw';
}

function syncAutoResultSelection() {
  if (resultManualOverride) return selectedValue(el.result) || 'win';
  const autoResult = getAutoResultValue();
  setSelectedRadioValue(el.result, autoResult);
  return autoResult;
}

function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${y}.${m}.${d}`;
}

function formatVideoMeta(dateValue, opponentName) {
  const lines = [];
  if (dateValue) lines.push(formatDate(dateValue));
  if (opponentName) lines.push(`vs ${opponentName}`);
  return lines.join('\n');
}

function getVideoMetaLines() {
  const overrideLines = (el.videoMetaOverride?.value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (overrideLines.length) return overrideLines;

  return formatVideoMeta(el.videoDate.value, el.videoOpponentTeam.value)
    .split('\n')
    .filter(Boolean);
}

function formatLineupPosition(value) {
  const raw = (value || '').trim();
  if (!raw) return '';
  const upper = raw.toUpperCase();
  return LINEUP_POSITION_MAP[upper] || upper;
}

function getLineupBroadcastLabel() {
  const broadcaster = el.lineupBroadcaster?.value || 'KBS N SPORTS';
  if (!el.lineupTerrestrial?.checked) return broadcaster;
  const terrestrialMap = {
    'KBS N SPORTS': 'KBS2',
    'SBS SPORTS': 'SBS',
    'MBC SPORTS+': 'MBC'
  };
  return terrestrialMap[broadcaster] || broadcaster;
}

function getLineupGameTimeLabel() {
  const selected = el.lineupGameTime?.value || '18:30';
  if (selected === 'custom') {
    return (el.lineupGameTimeCustom?.value || '').trim() || '직접입력';
  }
  return selected;
}

function updateLineupGameTimeCustomVisibility() {
  const customField = el.lineupGameTimeCustom?.closest('label');
  if (!customField) return;
  customField.style.display = el.lineupGameTime?.value === 'custom' ? '' : 'none';
}

function getGeneratedCaptionText() {
  if (activeTab === 'lineup') {
    const teamName = (el.lineupOpponentTeam.value || '').trim();
    const timeLabel = getLineupGameTimeLabel();
    const broadcasterLabel = getLineupBroadcastLabel();
    return [
      `𝐖𝐈𝐍𝐍𝐈𝐍𝐆 𝐋𝐈𝐍𝐄𝐔𝐏 vs ${teamName}`,
      `⏰️ ${timeLabel} / 📺 ${broadcasterLabel}`
    ].join('\n');
  }

  if (activeTab === 'result') {
    const teamName = (el.opponentTeam.value || '').trim();
    const resultMap = { win: '승리', draw: '무승부', lose: '패배' };
    const resultLabel = resultMap[syncAutoResultSelection()] || '승리';
    const homeScore = el.homeScore.value || '0';
    const awayScore = el.awayScore.value || '0';
    return [
      `𝐅𝐈𝐍𝐀𝐋 vs ${teamName}`,
      `${awayScore} - ${homeScore} ${resultLabel}`
    ].join('\n');
  }

  return '';
}

function getVideoTitleLines() {
  return (el.videoTitleInput.value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getVideoTrimTimes() {
  const video = out.videoPreviewElement;
  const start = Math.max(0, Number(el.videoStartTime.value) || 0);
  const rawEnd = Number(el.videoEndTime.value);
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const end = rawEnd > start ? rawEnd : duration;
  return {
    start,
    end: end > start ? end : start
  };
}

function updateTrimSelectedBar() {
  const max = Number(el.videoTrimStartRange.max) || 0;
  const start = Number(el.videoTrimStartRange.value) || 0;
  const end = Number(el.videoTrimEndRange.value) || 0;
  const startPercent = max > 0 ? (start / max) * 100 : 0;
  const endPercent = max > 0 ? (end / max) * 100 : 0;
  out.videoTrimSelected.style.left = `${startPercent}%`;
  out.videoTrimSelected.style.width = `${Math.max(0, endPercent - startPercent)}%`;
}

function formatSecondsLabel(value) {
  return (Number(value) || 0).toFixed(1);
}

function updateVideoPlaybackUi() {
  const video = out.videoPreviewElement;
  const { start, end } = getVideoTrimTimes();
  const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
  const max = Math.max(0, end);
  const clamped = Math.max(0, Math.min(current, max));

  el.videoPlaybackRange.max = String(max);
  el.videoPlaybackRange.value = String(clamped);
  el.videoPlaybackTime.textContent = `${formatSecondsLabel(clamped)} / ${formatSecondsLabel(max)}`;
  el.videoPlayToggle.textContent = video.paused ? '▶️' : '⏸️';
}

function setVideoPreviewMode(enabled) {
  videoState.previewMode = enabled;
  el.videoPoster.classList.toggle('preview-frame-mode', enabled);
  el.videoPreviewToggleBtn.textContent = enabled ? '영상으로 돌아가기' : '미리보기';
}

function setVideoSaveProgress(progress, label) {
  const percent = Math.max(0, Math.min(100, Math.round(progress)));
  el.videoSaveProgress.classList.add('active');
  el.videoSaveProgressFill.style.width = `${percent}%`;
  el.videoSaveProgressText.textContent = label || `${percent}%`;
}

function hideVideoSaveProgress() {
  el.videoSaveProgress.classList.remove('active');
  el.videoSaveProgressFill.style.width = '0%';
  el.videoSaveProgressText.textContent = '0%';
}

function updateVideoPreviewToggleVisibility() {
  const visible = activeTab === 'video' && isMobilePreviewMode();
  el.videoPreviewToggleBtn.classList.toggle('mobile-video-only', visible);
  if (!visible) {
    setVideoPreviewMode(false);
  }
}

function updateSecondaryActionButtons() {
  el.followDownloadBtn.style.display = activeTab === 'video' ? 'block' : 'none';
  if (el.lineupCaptionSettings) {
    el.lineupCaptionSettings.style.display = activeTab === 'lineup' ? 'block' : 'none';
  }
  const showCaptionTools = activeTab === 'lineup' || activeTab === 'result';
  if (el.captionTools) {
    el.captionTools.style.display = showCaptionTools ? 'grid' : 'none';
  }
  if (el.copyCaptionBtn) {
    el.copyCaptionBtn.style.display = showCaptionTools ? 'block' : 'none';
  }
  if (el.captionOutput) {
    el.captionOutput.value = showCaptionTools ? getGeneratedCaptionText() : '';
  }
}

function syncVideoTrimInputs(source = 'start-range') {
  const duration = Number.isFinite(out.videoPreviewElement.duration) ? out.videoPreviewElement.duration : 0;
  let start = Number(el.videoStartTime.value) || 0;
  let end = Number(el.videoEndTime.value) || duration;

  if (source === 'start-range') start = Number(el.videoTrimStartRange.value) || 0;
  if (source === 'end-range') end = Number(el.videoTrimEndRange.value) || duration;
  if (source === 'start-input') start = Number(el.videoStartTime.value) || 0;
  if (source === 'end-input') end = Number(el.videoEndTime.value) || duration;

  start = Math.max(0, Math.min(start, duration));
  end = Math.max(0, Math.min(end, duration || end));

  if (start > end) {
    if (source === 'start-range' || source === 'start-input') {
      end = start;
    } else {
      start = end;
    }
  }

  el.videoStartTime.value = start.toFixed(1).replace(/\.0$/, '');
  el.videoEndTime.value = end.toFixed(1).replace(/\.0$/, '');
  el.videoTrimStartRange.value = String(start);
  el.videoTrimEndRange.value = String(end);
  updateTrimSelectedBar();
}

function syncVideoTrimDraftInput(source = 'start-input') {
  const duration = Number.isFinite(out.videoPreviewElement.duration) ? out.videoPreviewElement.duration : 0;
  const rawStart = el.videoStartTime.value.trim();
  const rawEnd = el.videoEndTime.value.trim();
  const parsedStart = Number(rawStart);
  const parsedEnd = Number(rawEnd);

  let start = Number(el.videoTrimStartRange.value) || 0;
  let end = Number(el.videoTrimEndRange.value) || duration;

  if (source === 'start-input' && rawStart !== '' && Number.isFinite(parsedStart)) {
    start = Math.max(0, Math.min(parsedStart, duration));
    if (start > end) end = start;
  }

  if (source === 'end-input' && rawEnd !== '' && Number.isFinite(parsedEnd)) {
    end = Math.max(0, Math.min(parsedEnd, duration || parsedEnd));
    if (end < start) start = end;
  }

  el.videoTrimStartRange.value = String(start);
  el.videoTrimEndRange.value = String(end);
  updateTrimSelectedBar();
}

function configureVideoTrimRange(duration) {
  const safeDuration = Math.max(0, duration || 0);
  const maxValue = safeDuration.toFixed(1);
  el.videoTrimStartRange.max = maxValue;
  el.videoTrimEndRange.max = maxValue;
  if (!el.videoEndTime.value || Number(el.videoEndTime.value) === 0) {
    el.videoEndTime.value = safeDuration.toFixed(1).replace(/\.0$/, '');
  }
  syncVideoTrimInputs();
  updateVideoPlaybackUi();
}

function getVideoLayoutValues() {
  const frameScale = (Number(el.videoFrameScaleInput.value) || VIDEO_LAYOUT.frame.scale) / 100;
  const titleSize = Number(el.videoTitleSizeInput.value) || VIDEO_LAYOUT.title.size;
  const metaSize = Number(el.videoMetaSizeInput.value) || VIDEO_LAYOUT.meta.size;
  const titleLetterSpacing = Number(el.videoTitleSpacingInput.value);
  const titleLineHeight = Number(el.videoTitleLineHeightInput.value) || VIDEO_LAYOUT.title.lineHeight;
  const frameWidth = Math.round(VIDEO_LAYOUT.frame.width * frameScale);
  const frameHeight = Math.round(VIDEO_LAYOUT.frame.height * frameScale);
  const metaLineHeight = Math.round(metaSize * 1.36);
  return {
    frame: {
      ...VIDEO_LAYOUT.frame,
      x: Number(el.videoFrameXInput.value) || VIDEO_LAYOUT.frame.x,
      y: Number(el.videoFrameYInput.value) || VIDEO_LAYOUT.frame.y,
      scale: frameScale,
      width: frameWidth,
      height: frameHeight,
      renderX: Math.round((Number(el.videoFrameXInput.value) || VIDEO_LAYOUT.frame.x) - (frameWidth - VIDEO_LAYOUT.frame.width) / 2),
      renderY: Math.round((Number(el.videoFrameYInput.value) || VIDEO_LAYOUT.frame.y) - (frameHeight - VIDEO_LAYOUT.frame.height) / 2)
    },
    title: {
      ...VIDEO_LAYOUT.title,
      x: Number(el.videoTitleXInput.value) || VIDEO_LAYOUT.title.x,
      y: Number(el.videoTitleYInput.value) || VIDEO_LAYOUT.title.y,
      size: titleSize,
      lineHeight: titleLineHeight,
      letterSpacing: Number.isFinite(titleLetterSpacing) ? titleLetterSpacing : VIDEO_LAYOUT.title.letterSpacing
    },
    meta: {
      ...VIDEO_LAYOUT.meta,
      x: Number(el.videoMetaXInput.value) || VIDEO_LAYOUT.meta.x,
      y: Number(el.videoMetaYInput.value) || VIDEO_LAYOUT.meta.y,
      size: metaSize,
      lineHeight: metaLineHeight
    }
  };
}

function getCenteredTextTop(baseTop, baseSize, baseLineHeight, nextSize, nextLineHeight, lineCount) {
  const safeCount = Math.max(1, lineCount);
  const baseHeight = baseSize + (safeCount - 1) * baseLineHeight;
  const nextHeight = nextSize + (safeCount - 1) * nextLineHeight;
  return Math.round(baseTop - (nextHeight - baseHeight) / 2);
}

function drawCenteredSpacedText(ctx, text, centerX, baselineY, letterSpacing) {
  const chars = Array.from(text || '');
  if (chars.length === 0) return;
  if (!letterSpacing) {
    const prevAlign = ctx.textAlign;
    ctx.textAlign = 'center';
    ctx.fillText(text, centerX, baselineY);
    ctx.textAlign = prevAlign;
    return;
  }

  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  const widths = chars.map((char) => ctx.measureText(char).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, chars.length - 1) * letterSpacing;
  let cursorX = centerX - totalWidth / 2;

  chars.forEach((char, index) => {
    ctx.fillText(char, cursorX, baselineY);
    cursorX += widths[index] + letterSpacing;
  });
  ctx.textAlign = prevAlign;
}

function drawCoverImage(ctx, source, dx, dy, dWidth, dHeight) {
  const sourceWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const sourceHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  if (!sourceWidth || !sourceHeight) return;

  const sourceRatio = sourceWidth / sourceHeight;
  const destRatio = dWidth / dHeight;
  let sx = 0;
  let sy = 0;
  let sWidth = sourceWidth;
  let sHeight = sourceHeight;

  if (sourceRatio > destRatio) {
    sWidth = sourceHeight * destRatio;
    sx = (sourceWidth - sWidth) / 2;
  } else {
    sHeight = sourceWidth / destRatio;
    sy = (sourceHeight - sHeight) / 2;
  }

  ctx.drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

function escapeDrawtext(text) {
  return String(text || '')
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/,/g, '\\,')
    .replace(/%/g, '\\%');
}

function getFileExtension(name, fallback = 'mp4') {
  const ext = String(name || '').split('.').pop()?.toLowerCase();
  return ext && ext !== name ? ext : fallback;
}

function getVideoOverlaySnapshot() {
  const layout = getVideoLayoutValues();
  const titleLines = getVideoTitleLines();
  const metaLines = getVideoMetaLines();
  const titleTop = getCenteredTextTop(
    layout.title.y,
    VIDEO_LAYOUT.title.size,
    VIDEO_LAYOUT.title.lineHeight,
    layout.title.size,
    layout.title.lineHeight,
    titleLines.length
  );
  const metaTop = getCenteredTextTop(
    layout.meta.y,
    VIDEO_LAYOUT.meta.size,
    VIDEO_LAYOUT.meta.lineHeight,
    layout.meta.size,
    layout.meta.lineHeight,
    metaLines.length
  );

  return { layout, titleLines, metaLines, titleTop, metaTop };
}

function getVideoOverlayKey(snapshot) {
  return JSON.stringify({
    layout: snapshot.layout,
    titleLines: snapshot.titleLines,
    metaLines: snapshot.metaLines,
    titleTop: snapshot.titleTop,
    metaTop: snapshot.metaTop,
    bgVisible: Boolean(out.videoBgImage.complete && out.videoBgImage.naturalWidth > 0)
  });
}

function waitForVideoEvent(video, eventName) {
  return new Promise((resolve) => {
    const done = () => {
      video.removeEventListener(eventName, done);
      video.removeEventListener('error', done);
      resolve();
    };
    video.addEventListener(eventName, done, { once: true });
    video.addEventListener('error', done, { once: true });
  });
}

async function prepareExportVideo(sourceVideo, startTime) {
  const exportVideo = document.createElement('video');
  exportVideo.src = sourceVideo.currentSrc || sourceVideo.src;
  exportVideo.preload = 'auto';
  exportVideo.muted = false;
  exportVideo.volume = 1;
  exportVideo.playsInline = true;
  exportVideo.crossOrigin = 'anonymous';
  exportVideo.style.position = 'fixed';
  exportVideo.style.left = '-99999px';
  exportVideo.style.top = '0';
  exportVideo.style.width = '1px';
  exportVideo.style.height = '1px';
  document.body.appendChild(exportVideo);

  try {
    if (exportVideo.readyState < 2) {
      exportVideo.load();
      await waitForVideoEvent(exportVideo, 'loadeddata');
    }
    exportVideo.currentTime = startTime;
    await waitForVideoEvent(exportVideo, 'seeked');
    return exportVideo;
  } catch (error) {
    exportVideo.remove();
    throw error;
  }
}

async function buildVideoOverlayPng(layout, titleLines, metaLines, titleTop, metaTop) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('브라우저에서 캔버스를 만들 수 없습니다.');

  const bgImage = out.videoBgImage;
  if (bgImage.complete && bgImage.naturalWidth > 0) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, VIDEO_BG_FALLBACK.top);
    gradient.addColorStop(0.48, VIDEO_BG_FALLBACK.mid);
    gradient.addColorStop(1, VIDEO_BG_FALLBACK.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = '#111';
  ctx.font = `400 ${layout.title.size}px 'boldfont'`;
  const titleBaseY = titleTop + Math.round(layout.title.size * 0.95);
  titleLines.forEach((line, index) => {
    drawCenteredSpacedText(
      ctx,
      line,
      layout.title.x + layout.title.width / 2,
      titleBaseY + index * layout.title.lineHeight,
      layout.title.letterSpacing
    );
  });

  ctx.fillStyle = '#111';
  ctx.font = `400 ${layout.meta.size}px 'mediumfont'`;
  metaLines.forEach((line, index) => {
    drawCenteredSpacedText(
      ctx,
      line,
      layout.meta.x + layout.meta.width / 2,
      metaTop + Math.round(layout.meta.size * 0.96) + index * layout.meta.lineHeight,
      0
    );
  });

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('브라우저에서 이미지를 만들 수 없습니다.'));
    }, 'image/png');
  });
}

function invalidateVideoOverlayCache() {
  videoState.overlayPromise = null;
  videoState.overlayKey = '';
  videoState.overlayBitmapPromise = null;
}

function primeVideoOverlayCache() {
  const snapshot = getVideoOverlaySnapshot();
  const key = getVideoOverlayKey(snapshot);
  if (videoState.overlayPromise && videoState.overlayKey === key) {
    return videoState.overlayPromise;
  }

  videoState.overlayKey = key;
  videoState.overlayPromise = buildVideoOverlayPng(
    snapshot.layout,
    snapshot.titleLines,
    snapshot.metaLines,
    snapshot.titleTop,
    snapshot.metaTop
  ).catch((error) => {
    videoState.overlayPromise = null;
    videoState.overlayKey = '';
    throw error;
  });

  return videoState.overlayPromise;
}

async function createOverlayBitmapFromBlob(blob) {
  if ('createImageBitmap' in window) {
    return await createImageBitmap(blob);
  }

  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('브라우저에서 이미지를 읽을 수 없습니다.'));
    };
    image.src = url;
  });
}

function primeVideoOverlayBitmapCache() {
  if (videoState.overlayBitmapPromise) return videoState.overlayBitmapPromise;
  videoState.overlayBitmapPromise = primeVideoOverlayCache()
    .then((blob) => createOverlayBitmapFromBlob(blob))
    .catch((error) => {
      videoState.overlayBitmapPromise = null;
      throw error;
    });
  return videoState.overlayBitmapPromise;
}

function drawVideoCompositeFrame(ctx, video, layout, overlayBitmap) {
  ctx.clearRect(0, 0, 1080, 1350);
  ctx.drawImage(overlayBitmap, 0, 0, 1080, 1350);

  drawCoverImage(ctx, video, layout.frame.renderX, layout.frame.renderY, layout.frame.width, layout.frame.height);
}

async function renderVideoPreviewFrameImage() {
  const video = out.videoPreviewElement;
  if (!video.getAttribute('src')) {
    window.alert('먼저 영상 파일을 업로드해 주세요.');
    return;
  }

  const { start } = getVideoTrimTimes();
  const { layout } = getVideoOverlaySnapshot();
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const previewVideo = await prepareExportVideo(video, start);
  const overlayBitmap = await primeVideoOverlayBitmapCache();

  try {
    drawVideoCompositeFrame(ctx, previewVideo, layout, overlayBitmap);
    const dataUrl = canvas.toDataURL('image/png', 1);
    out.videoFramePreviewImage.src = dataUrl;
    setVideoPreviewMode(true);
  } finally {
    previewVideo.pause();
    previewVideo.removeAttribute('src');
    previewVideo.load();
    previewVideo.remove();
  }
}

function normalizeName(name) {
  return (name || '').replace(/\s+/g, '');
}

function formatDisplayName(name) {
  return (name || '').replace(/\s*\(\d+\)\s*$/, '').trim();
}

function getPlayerPhotoPath(name) {
  if (!normalizeName(name)) return '';
  const normalized = normalizeName(name);
  const matched = Object.keys(PLAYER_NUMBER_BY_NAME).find((key) => normalizeName(key) === normalized);
  return matched ? `assets/player/${PLAYER_NUMBER_BY_NAME[matched]}.png` : '';
}

function getPlayerMiniPhotoPath(name) {
  if (!normalizeName(name)) return '';
  const normalized = normalizeName(name);
  const matched = Object.keys(PLAYER_NUMBER_BY_NAME).find((key) => normalizeName(key) === normalized);
  return matched ? `assets/player_mini/${PLAYER_NUMBER_BY_NAME[matched]}.png` : '';
}

function getPlayerInfo(name) {
  if (!normalizeName(name)) return null;
  const normalized = normalizeName(name);
  const matched = Object.keys(PLAYER_INFO_BY_NAME).find((key) => normalizeName(key) === normalized);
  return matched ? PLAYER_INFO_BY_NAME[matched] : null;
}

function selectedTeamInfo(selectEl) {
  return TEAM_DB.find((team) => team.name === selectEl.value) || TEAM_DB[0];
}

function selectedTeamInfoByName(teamName) {
  return TEAM_DB.find((team) => team.name === teamName) || TEAM_DB[0];
}

function applySharedOpponent(teamName) {
  const team = selectedTeamInfoByName(teamName);
  const sharedName = team.name;

  el.opponentTeam.value = sharedName;
  el.lineupOpponentTeam.value = sharedName;
  el.videoOpponentTeam.value = sharedName;
  if (el.rosterMovesOpponentTeam) el.rosterMovesOpponentTeam.value = sharedName;

  el.stadiumName.value = selectedValue(el.kiaSide) === 'home' ? KIA_HOME_STADIUM : team.stadium;
  el.lineupStadiumName.value = selectedValue(el.lineupKiaSide) === 'home' ? KIA_HOME_STADIUM : team.stadium;
  if (el.rosterMovesStadiumName) {
    el.rosterMovesStadiumName.value = selectedValue(el.lineupKiaSide) === 'home' ? KIA_HOME_STADIUM : team.stadium;
  }

  updateResultPoster();
  updateLineupPoster();
  updateVideoPoster();
  updateRosterMovesPoster();
  updateSecondaryActionButtons();
}

function applySharedKiaSide(side) {
  setSelectedRadioValue(el.kiaSide, side);
  setSelectedRadioValue(el.lineupKiaSide, side);
  const team = selectedTeamInfo(el.opponentTeam);
  const stadium = side === 'home' ? KIA_HOME_STADIUM : team.stadium;
  el.stadiumName.value = stadium;
  el.lineupStadiumName.value = stadium;
  if (el.rosterMovesStadiumName) el.rosterMovesStadiumName.value = stadium;
  updateResultPoster();
  updateLineupPoster();
  updateRosterMovesPoster();
}

function applySharedOpponentFineTune(x, y) {
  syncNumberRangeValues(el.opponentXInput, el.opponentXRange, x);
  syncNumberRangeValues(el.lineupOpponentXInput, el.lineupOpponentXRange, x);
  syncNumberRangeValues(el.rosterOpponentXInput, el.rosterOpponentXRange, x);
  syncNumberRangeValues(el.opponentYInput, el.opponentYRange, y);
  syncNumberRangeValues(el.lineupOpponentYInput, el.lineupOpponentYRange, y);
  syncNumberRangeValues(el.rosterOpponentYInput, el.rosterOpponentYRange, y);
  updateResultPoster();
  updateLineupPoster();
  updateRosterMovesPoster();
}

function teamLogoFile(code, side, result) {
  if (side === 'away') return `assets/logo/${code}1.png`;
  if (result === 'lose') return `assets/logo/${code}3.png`;
  return `assets/logo/${code}2.png`;
}

function applyText(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.fontSize = `${cfg.size}px`;
}

function applyBadge(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = `${cfg.size}px`;
  node.style.height = `${cfg.size}px`;
  node.style.lineHeight = `${cfg.size}px`;
  node.style.fontSize = `${cfg.font}px`;
}

function applyAdvancedText(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.fontSize = `${cfg.size}px`;
  if (cfg.letterSpacing != null) node.style.letterSpacing = `${cfg.letterSpacing}px`;
  if (cfg.lineHeight != null) node.style.lineHeight = `${cfg.lineHeight}px`;
}

function applyScaledImage(node, cfg, baseWidth, baseHeight) {
  const scale = (Number(cfg.scale) || 100) / 100;
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = `${baseWidth * scale}px`;
  node.style.height = `${baseHeight * scale}px`;
}

function applyPositionOnly(node, cfg) {
  node.style.left = `${cfg.x}px`;
  node.style.top = `${cfg.y}px`;
  node.style.width = '';
  node.style.height = '';
}

function formatRosterNumber(value, decimals = 0) {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw === 0) return '';
  if (decimals <= 0) return String(raw);
  return raw.toFixed(decimals).replace(/\.?0+$/, '');
}

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

function updateRosterMovesFormVisibility(section, index) {
  const groupRefs = rosterMoveEditors[section]?.[index];
  if (!groupRefs) return;
  const info = getPlayerInfo(groupRefs.nameInput?.value || '');
  const meta = info ? `${info.throwBat}/${info.positionGroup}` : '';
  if (groupRefs.metaInput) groupRefs.metaInput.value = meta;
  const isPitcher = info?.positionGroup === '투수';
  if (groupRefs.pitcherStats) groupRefs.pitcherStats.style.display = isPitcher ? 'grid' : 'none';
  if (groupRefs.hitterStats) groupRefs.hitterStats.style.display = isPitcher === false && info ? 'grid' : 'none';
}

function getRosterSectionCount(section) {
  return Math.max(0, Math.min(MAX_ROSTER_GROUPS, Number(el[`${section}Count`]?.value) || 0));
}

function refreshRosterGroupEditors(section) {
  const count = getRosterSectionCount(section);
  rosterMoveEditors[section].forEach((groupRefs, index) => {
    groupRefs.root.classList.toggle('is-hidden', index >= count);
  });
}

function createRosterGroupEditor(section, index) {
  const root = document.createElement('div');
  root.className = 'roster-group-editor';
  root.innerHTML = `
    <h3>${index + 1}번 선수</h3>
    <label class="field">선수 이름 <input class="roster-name-input" type="text" list="playerNameOptions" /></label>
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
        <label class="field">이닝 <input class="roster-pitcher-innings" type="number" min="0" step="0.1" value="0" /></label>
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
    nameInput: root.querySelector('.roster-name-input'),
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

  refs.nameInput.addEventListener('input', () => updateRosterMovesFormVisibility(section, index));
  refs.nameInput.addEventListener('change', () => updateRosterMovesFormVisibility(section, index));
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

function buildRosterMovesUi() {
  ['callUp', 'sendDown'].forEach((section) => {
    const container = el[`${section}GroupControls`];
    if (!container) return;
    container.innerHTML = '';
    rosterMoveEditors[section] = [];
    for (let i = 0; i < MAX_ROSTER_GROUPS; i += 1) {
      const refs = createRosterGroupEditor(section, i);
      rosterMoveEditors[section].push(refs);
      container.appendChild(refs.root);
      updateRosterMovesFormVisibility(section, i);
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

function getRosterMovesLayoutValue(key, axis) {
  const input = el[`${key}${axis}Input`];
  return Number(input?.value) || 0;
}

function syncFineTunePair(numberInput, rangeInput) {
  if (!numberInput || !rangeInput) return;
  const syncFromNumber = () => {
    rangeInput.value = numberInput.value || rangeInput.min || '0';
  };
  const syncFromRange = () => {
    numberInput.value = rangeInput.value;
  };
  const clearTextFocus = () => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    if (active === rangeInput || active === numberInput) return;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
      active.blur();
    }
  };
  rangeInput.addEventListener('pointerdown', clearTextFocus);
  rangeInput.addEventListener('touchstart', clearTextFocus, { passive: true });
  numberInput.addEventListener('input', syncFromNumber);
  rangeInput.addEventListener('input', syncFromRange);
  syncFromNumber();
}

function bindNudgeButtons() {
  document.querySelectorAll('.nudge-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const step = Number(button.getAttribute('data-step')) || 0;
      if (!targetId || !step) return;
      const input = document.getElementById(targetId);
      const range = document.getElementById(targetId.replace('Input', 'Range'));
      if (!(input instanceof HTMLInputElement)) return;
      let nextValue = (Number(input.value) || 0) + step;
      if (range instanceof HTMLInputElement) {
        const min = Number(range.min);
        const max = Number(range.max);
        if (Number.isFinite(min)) nextValue = Math.max(min, nextValue);
        if (Number.isFinite(max)) nextValue = Math.min(max, nextValue);
        syncNumberRangeValues(input, range, nextValue);
      } else {
        input.value = String(nextValue);
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      input.select?.();
    });
  });
}

function updateDownloadButtonLabel() {
  el.downloadBtn.textContent = activeTab === 'video' ? '영상 저장' : 'PNG 저장';
}

function downloadFollowImage() {
  const link = document.createElement('a');
  link.href = 'assets/follow.png';
  link.download = 'follow.png';
  link.click();
}

function showCopyToast(message) {
  if (!el.copyToast) return;
  el.copyToast.textContent = message;
  el.copyToast.classList.add('is-visible');
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => {
    el.copyToast?.classList.remove('is-visible');
  }, 1800);
}

async function copyGeneratedCaption() {
  const text = getGeneratedCaptionText();
  if (!text) {
    showCopyToast('복사할 문구가 없습니다.');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showCopyToast('문구가 복사되었습니다.');
  } catch {
    if (el.captionOutput) {
      el.captionOutput.focus();
      el.captionOutput.select();
      const copied = document.execCommand('copy');
      showCopyToast(copied ? '문구가 복사되었습니다.' : '문구 복사에 실패했습니다.');
    }
  }
}

function configureVideoLoop() {
  const video = out.videoPreviewElement;
  if (videoState.loopHandler) {
    video.removeEventListener('timeupdate', videoState.loopHandler);
    videoState.loopHandler = null;
  }

  if (!video.getAttribute('src')) return;

  videoState.loopHandler = () => {
    const { start, end } = getVideoTrimTimes();
    if (!end || video.currentTime < start) {
      video.currentTime = start;
      return;
    }
    if (video.currentTime >= end) {
      video.currentTime = end;
      video.pause();
      updateVideoPlaybackUi();
    }
  };

  video.addEventListener('timeupdate', videoState.loopHandler);
}

function updateVideoPoster(previewTarget = 'keep') {
  const video = out.videoPreviewElement;
  const wasPlaying = !video.paused;
  const { layout, titleLines, metaLines, titleTop, metaTop } = getVideoOverlaySnapshot();
  out.videoTitleText.textContent = titleLines.join('\n');
  out.videoMetaText.textContent = metaLines.join('\n');
  out.videoTitleText.style.left = `${layout.title.x}px`;
  out.videoTitleText.style.top = `${titleTop}px`;
  out.videoTitleText.style.fontSize = `${layout.title.size}px`;
  out.videoTitleText.style.lineHeight = `${layout.title.lineHeight}px`;
  out.videoTitleText.style.letterSpacing = `${layout.title.letterSpacing}px`;
  out.videoMetaText.style.left = `${layout.meta.x}px`;
  out.videoMetaText.style.top = `${metaTop}px`;
  out.videoMetaText.style.fontSize = `${layout.meta.size}px`;
  out.videoMetaText.style.lineHeight = `${layout.meta.lineHeight}px`;
  out.videoPreviewElement.style.left = `${layout.frame.renderX}px`;
  out.videoPreviewElement.style.top = `${layout.frame.renderY}px`;
  out.videoPreviewElement.style.width = `${layout.frame.width}px`;
  out.videoPreviewElement.style.height = `${layout.frame.height}px`;

  configureVideoLoop();

  if (!video.getAttribute('src')) return;
  const { start, end } = getVideoTrimTimes();
  let nextTime = Number.isFinite(video.currentTime) ? video.currentTime : start;
  if (previewTarget === 'start') nextTime = start;
  if (previewTarget === 'end') nextTime = end;
  nextTime = Math.max(start, Math.min(nextTime, end));
  if (Math.abs(video.currentTime - nextTime) > 0.15) {
    video.currentTime = nextTime;
  }
  video.muted = false;
  video.volume = 1;
  if (wasPlaying) {
    const playPromise = video.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }
  updateVideoPlaybackUi();

  invalidateVideoOverlayCache();
  primeVideoOverlayCache().catch(() => {});
}

async function exportVideo() {
  const sourceVideo = out.videoPreviewElement;
  const sourceFile = el.videoFileInput.files?.[0];
  if (!sourceVideo.getAttribute('src') || !sourceFile) {
    window.alert('먼저 영상 파일을 업로드해 주세요.');
    return;
  }

  await document.fonts.ready;
  await waitForImageElement(sourceVideo);
  await waitForImageElement(out.videoBgImage);

  const { start, end } = getVideoTrimTimes();
  const { layout, titleLines, metaLines, titleTop, metaTop } = getVideoOverlaySnapshot();
  await exportVideoFast(sourceVideo, start, end, layout, titleLines, metaLines, titleTop, metaTop);
}

async function exportVideoFast(sourceVideo, start, end, layout, titleLines, metaLines, titleTop, metaTop) {
  const duration = Math.max(0.1, end - start);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    window.alert('브라우저에서 영상 캔버스를 만들 수 없습니다.');
    return;
  }

  const formats = [
    { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4' },
    { mimeType: 'video/mp4', ext: 'mp4' },
    { mimeType: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mimeType: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mimeType: 'video/webm', ext: 'webm' }
  ];
  const selectedFormat = formats.find((format) => MediaRecorder.isTypeSupported(format.mimeType)) || formats[formats.length - 1];
  const stream = canvas.captureStream(30);
  const exportVideo = await prepareExportVideo(sourceVideo, start);
  const overlayBitmap = await primeVideoOverlayBitmapCache();
  setVideoSaveProgress(0, '以鍮꾩쨷 0%');

  try {
    const exportStream = typeof exportVideo.captureStream === 'function' ? exportVideo.captureStream() : null;
    if (exportStream) {
      exportStream.getAudioTracks().forEach((track) => stream.addTrack(track));
    }

    const recorder = new MediaRecorder(stream, { mimeType: selectedFormat.mimeType });
    const chunks = [];
    recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    });

    const stopped = new Promise((resolve) => {
      recorder.addEventListener('stop', resolve, { once: true });
    });

    let stopRequested = false;
    let frameRequestId = null;
    let rafId = null;

    const stopRecording = () => {
      if (stopRequested) return;
      stopRequested = true;
      if (frameRequestId !== null && typeof exportVideo.cancelVideoFrameCallback === 'function') {
        exportVideo.cancelVideoFrameCallback(frameRequestId);
      }
      if (rafId !== null) cancelAnimationFrame(rafId);
      exportVideo.pause();
      if (recorder.state !== 'inactive') recorder.stop();
    };

    const renderLoop = () => {
      drawVideoCompositeFrame(ctx, exportVideo, layout, overlayBitmap);
      const progress = ((exportVideo.currentTime - start) / duration) * 100;
      setVideoSaveProgress(progress, `저장중 ${Math.max(0, Math.min(100, Math.round(progress)))}%`);
      if (exportVideo.currentTime >= end || exportVideo.ended) {
        stopRecording();
        return;
      }
      if (typeof exportVideo.requestVideoFrameCallback === 'function') {
        frameRequestId = exportVideo.requestVideoFrameCallback(() => {
          frameRequestId = null;
          renderLoop();
        });
      } else {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          renderLoop();
        });
      }
    };

    exportVideo.addEventListener('ended', stopRecording, { once: true });

    recorder.start(250);
    drawVideoCompositeFrame(ctx, exportVideo, layout, overlayBitmap);
    setVideoSaveProgress(1, '저장중 1%');
    const playPromise = exportVideo.play();
    if (playPromise?.catch) playPromise.catch(() => {});
    renderLoop();

    await new Promise((resolve) => {
      const safetyTimer = window.setTimeout(() => {
        stopRecording();
        resolve();
      }, Math.ceil(duration * 1000) + 3000);

      recorder.addEventListener('stop', () => {
        window.clearTimeout(safetyTimer);
        resolve();
      }, { once: true });
    });

    await stopped;

    const blob = new Blob(chunks, { type: selectedFormat.mimeType });
    setVideoSaveProgress(100, '저장 완료');
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `video-${Date.now()}.${selectedFormat.ext}`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  } finally {
    exportVideo.pause();
    exportVideo.removeAttribute('src');
    exportVideo.load();
    exportVideo.remove();
    window.setTimeout(() => hideVideoSaveProgress(), 600);
    updateVideoPoster();
  }
}

function isMobilePreviewMode() {
  return window.matchMedia('(max-width: 768px)').matches;
}

async function renderMobilePreview(tabName) {
  if (!window.html2canvas || !isMobilePreviewMode()) return;

  const poster = tabName === 'result'
    ? el.resultPoster
    : tabName === 'lineup'
      ? el.lineupPoster
      : el.rosterMovesPoster;
  const preview = tabName === 'result'
    ? out.resultMobilePreview
    : tabName === 'lineup'
      ? out.lineupMobilePreview
      : out.rosterMovesMobilePreview;
  const posterCanvas = poster.querySelector('.poster-canvas');
  const images = Array.from(poster.querySelectorAll('img, video'));

  const wasActive = poster.classList.contains('active');
  if (!wasActive) poster.classList.add('active');

  const prevPosterWidth = poster.style.width;
  const prevPosterHeight = poster.style.height;
  const prevPosterTransform = poster.style.transform;
  const prevCanvasPosition = posterCanvas?.style.position || '';
  const prevCanvasInset = posterCanvas?.style.inset || '';
  const prevCanvasWidth = posterCanvas?.style.width || '';
  const prevCanvasHeight = posterCanvas?.style.height || '';
  const prevCanvasTransform = posterCanvas?.style.transform || '';

  try {
    await document.fonts.ready;
    await Promise.all(images.map(waitForImageElement));

    // Capture from the full-size poster, not the mobile-scaled preview layout.
    poster.style.width = '1080px';
    poster.style.height = '1350px';
    poster.style.transform = 'none';
    if (posterCanvas) {
      posterCanvas.style.position = 'relative';
      posterCanvas.style.inset = 'auto';
      posterCanvas.style.width = '1080px';
      posterCanvas.style.height = '1350px';
      posterCanvas.style.transform = 'none';
    }

    const canvas = await html2canvas(poster, {
      useCORS: true,
      scale: 1,
      backgroundColor: null
    });
    preview.src = canvas.toDataURL('image/png', 1);
  } finally {
    poster.style.width = prevPosterWidth;
    poster.style.height = prevPosterHeight;
    poster.style.transform = prevPosterTransform;
    if (posterCanvas) {
      posterCanvas.style.position = prevCanvasPosition;
      posterCanvas.style.inset = prevCanvasInset;
      posterCanvas.style.width = prevCanvasWidth;
      posterCanvas.style.height = prevCanvasHeight;
      posterCanvas.style.transform = prevCanvasTransform;
    }
    if (!wasActive) poster.classList.remove('active');
  }
}

function scheduleMobilePreviewRender() {
  if (mobilePreviewTimer) clearTimeout(mobilePreviewTimer);
  mobilePreviewTimer = setTimeout(async () => {
    if (!isMobilePreviewMode()) return;
    await renderMobilePreview('result');
    await renderMobilePreview('lineup');
    await renderMobilePreview('rosterMoves');
  }, 80);
}

function buildLineupInputs() {
  for (let i = 1; i <= 9; i += 1) {
    const row = document.createElement('div');
    row.className = 'lineup-input-row';
    row.innerHTML = `
      <span>${i}</span>
      <input id="lineupName${i}" type="text" placeholder="${i}번 타자" />
      <input id="lineupPos${i}" type="text" placeholder="포지션" />
    `;
    el.lineupInputGrid.appendChild(row);
  }
}

function buildLineupTextLayer() {
  for (let i = 1; i <= 9; i += 1) {
    const nameNode = document.createElement('div');
    nameNode.id = `lineupNameText${i}`;
    nameNode.className = 'lineup-name-text';

    const posNode = document.createElement('div');
    posNode.id = `lineupPosText${i}`;
    posNode.className = 'lineup-pos-text';

    out.lineupTextLayer.append(nameNode, posNode);
    lineupTextRefs.names[i] = nameNode;
    lineupTextRefs.positions[i] = posNode;
  }
}

function updateResultPoster() {
  const result = syncAutoResultSelection();
  const side = selectedValue(el.kiaSide);
  const team = selectedTeamInfo(el.opponentTeam);

  out.backgroundLayer.src = BACKGROUND_BY_RESULT[result];
  el.resultPoster.style.setProperty('--global-letter-spacing', `${Number(el.globalLetterSpacing.value) || 0}px`);

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

  RESULT_LAYOUT.opponentText.x = Number(el.opponentXInput.value) || RESULT_LAYOUT.opponentText.x;
  RESULT_LAYOUT.opponentText.y = Number(el.opponentYInput.value) || RESULT_LAYOUT.opponentText.y;
  RESULT_LAYOUT.mvpRecordText.x = Number(el.mvpRecordXInput.value) || RESULT_LAYOUT.mvpRecordText.x;
  RESULT_LAYOUT.mvpRecordText.y = Number(el.mvpRecordYInput.value) || RESULT_LAYOUT.mvpRecordText.y;

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
  scheduleMobilePreviewRender();
}

function updateLineupPoster() {
  const team = selectedTeamInfo(el.lineupOpponentTeam);

  out.lineupDateText.textContent = formatDate(el.lineupDate.value);
  LINEUP_LAYOUT.opponentText.x = Number(el.lineupOpponentXInput.value) || LINEUP_LAYOUT.opponentText.x;
  LINEUP_LAYOUT.opponentText.y = Number(el.lineupOpponentYInput.value) || LINEUP_LAYOUT.opponentText.y;
  out.lineupOpponentText.textContent = `vs ${team.name}`;
  out.lineupStadiumText.textContent = el.lineupStadiumName.value;
  out.lineupPitcherText.textContent = formatDisplayName(el.lineupPitcherName.value);
  const lineupPhotoPath = getPlayerPhotoPath(el.lineupPitcherName.value);
  out.lineupPlayerPhoto.classList.toggle('is-hidden', !lineupPhotoPath);
  if (lineupPhotoPath) out.lineupPlayerPhoto.src = lineupPhotoPath;
  const spacing = Number(el.lineupLetterSpacing.value);
  el.lineupPoster.style.setProperty('--global-letter-spacing', `${Number.isFinite(spacing) ? spacing : -1}px`);

  applyText(out.lineupDateText, LINEUP_LAYOUT.dateText);
  applyText(out.lineupOpponentText, LINEUP_LAYOUT.opponentText);
  applyText(out.lineupStadiumText, LINEUP_LAYOUT.stadiumText);
  applyText(out.lineupPitcherText, LINEUP_LAYOUT.pitcher);

  for (let i = 1; i <= 9; i += 1) {
    const name = document.getElementById(`lineupName${i}`)?.value || '';
    const pos = formatLineupPosition(document.getElementById(`lineupPos${i}`)?.value || '');

    LINEUP_LAYOUT.names[i].x = LINEUP_FIXED.nameX;
    LINEUP_LAYOUT.names[i].size = LINEUP_FIXED.nameSize;
    LINEUP_LAYOUT.positions[i].x = LINEUP_FIXED.posX;
    LINEUP_LAYOUT.positions[i].size = LINEUP_FIXED.posSize;

    lineupTextRefs.names[i].textContent = name;
    lineupTextRefs.positions[i].textContent = pos;
    applyText(lineupTextRefs.names[i], LINEUP_LAYOUT.names[i]);
    applyText(lineupTextRefs.positions[i], LINEUP_LAYOUT.positions[i]);
  }
  scheduleMobilePreviewRender();
}

function updateRosterMovesPoster() {
  const team = selectedTeamInfo(el.rosterMovesOpponentTeam);
  ROSTER_MOVES_LAYOUT.opponentText.x = Number(el.rosterOpponentXInput.value) || ROSTER_MOVES_LAYOUT.opponentText.x;
  ROSTER_MOVES_LAYOUT.opponentText.y = Number(el.rosterOpponentYInput.value) || ROSTER_MOVES_LAYOUT.opponentText.y;

  out.rosterMovesDateText.textContent = formatDate(el.rosterMovesDate.value);
  out.rosterMovesOpponentText.textContent = `vs ${team.name}`;
  out.rosterMovesStadiumText.textContent = el.rosterMovesStadiumName.value;
  out.rosterMovesDateText.style.letterSpacing = '-1px';
  out.rosterMovesOpponentText.style.letterSpacing = '-1px';
  out.rosterMovesStadiumText.style.letterSpacing = '-1px';

  applyText(out.rosterMovesDateText, ROSTER_MOVES_LAYOUT.dateText);
  applyText(out.rosterMovesOpponentText, ROSTER_MOVES_LAYOUT.opponentText);
  applyText(out.rosterMovesStadiumText, ROSTER_MOVES_LAYOUT.stadiumText);

  const counts = {
    callUp: getRosterSectionCount('callUp'),
    sendDown: getRosterSectionCount('sendDown')
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

function switchTab(target) {
  activeTab = target;
  const isResult = target === 'result';
  const isLineup = target === 'lineup';
  const isVideo = target === 'video';
  const isRosterMoves = target === 'rosterMoves';
  el.tabResult.classList.toggle('active', isResult);
  el.tabLineup.classList.toggle('active', isLineup);
  el.tabVideo.classList.toggle('active', isVideo);
  el.tabRosterMoves.classList.toggle('active', isRosterMoves);
  el.resultControls.classList.toggle('active', isResult);
  el.lineupControls.classList.toggle('active', isLineup);
  el.videoControls.classList.toggle('active', isVideo);
  el.rosterMovesControls.classList.toggle('active', isRosterMoves);
  el.resultPoster.classList.toggle('active', isResult);
  el.lineupPoster.classList.toggle('active', isLineup);
  el.videoPoster.classList.toggle('active', isVideo);
  el.rosterMovesPoster.classList.toggle('active', isRosterMoves);
  out.resultMobilePreview.classList.toggle('active', isResult);
  out.lineupMobilePreview.classList.toggle('active', isLineup);
  out.rosterMovesMobilePreview.classList.toggle('active', isRosterMoves);
  el.previewScale.classList.toggle('video-mobile-plain', isVideo && isMobilePreviewMode());
  if (!isVideo) setVideoPreviewMode(false);
  updateVideoPreviewToggleVisibility();
  updateDownloadButtonLabel();
  updateSecondaryActionButtons();
}

function waitForImageElement(img) {
  if (!img) return Promise.resolve();
  if (img instanceof HTMLVideoElement) {
    if (img.readyState >= 2) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => {
        img.removeEventListener('loadeddata', done);
        img.removeEventListener('error', done);
        resolve();
      };
      img.addEventListener('loadeddata', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }
  if (img.classList?.contains('is-hidden')) return Promise.resolve();
  if (!img.getAttribute('src')) return Promise.resolve();
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
      resolve();
    };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}

async function downloadImage() {
  if (activeTab === 'video') {
    await exportVideo();
    return;
  }
  await document.fonts.ready;
  const poster = activeTab === 'result'
    ? el.resultPoster
    : activeTab === 'lineup'
      ? el.lineupPoster
      : el.rosterMovesPoster;
  const images = Array.from(poster.querySelectorAll('img, video'));
  await Promise.all(images.map(waitForImageElement));

  const prevTransform = poster.style.transform;
  const prevOrigin = poster.style.transformOrigin;
  poster.style.transform = 'none';
  poster.style.transformOrigin = 'top left';

  try {
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

function populatePlayerNameOptions() {
  if (!el.playerNameOptions) return;
  el.playerNameOptions.innerHTML = '';
  PLAYER_INFO_LIST.forEach((player) => {
    const option = document.createElement('option');
    option.value = player.name;
    el.playerNameOptions.appendChild(option);
  });
}

function bindEvents() {
  syncFineTunePair(el.opponentXInput, el.opponentXRange);
  syncFineTunePair(el.opponentYInput, el.opponentYRange);
  syncFineTunePair(el.mvpRecordXInput, el.mvpRecordXRange);
  syncFineTunePair(el.mvpRecordYInput, el.mvpRecordYRange);
  syncFineTunePair(el.lineupOpponentXInput, el.lineupOpponentXRange);
  syncFineTunePair(el.lineupOpponentYInput, el.lineupOpponentYRange);
  syncFineTunePair(el.rosterOpponentXInput, el.rosterOpponentXRange);
  syncFineTunePair(el.rosterOpponentYInput, el.rosterOpponentYRange);
  syncFineTunePair(el.videoFrameXInput, el.videoFrameXRange);
  syncFineTunePair(el.videoFrameYInput, el.videoFrameYRange);
  syncFineTunePair(el.videoFrameScaleInput, el.videoFrameScaleRange);
  syncFineTunePair(el.videoTitleXInput, el.videoTitleXRange);
  syncFineTunePair(el.videoTitleYInput, el.videoTitleYRange);
  syncFineTunePair(el.videoTitleSizeInput, el.videoTitleSizeRange);
  syncFineTunePair(el.videoTitleSpacingInput, el.videoTitleSpacingRange);
  syncFineTunePair(el.videoTitleLineHeightInput, el.videoTitleLineHeightRange);
  syncFineTunePair(el.videoMetaXInput, el.videoMetaXRange);
  syncFineTunePair(el.videoMetaYInput, el.videoMetaYRange);
  syncFineTunePair(el.videoMetaSizeInput, el.videoMetaSizeRange);
  syncFineTunePair(el.callUpBoxXInput, el.callUpBoxXRange);
  syncFineTunePair(el.callUpBoxYInput, el.callUpBoxYRange);
  syncFineTunePair(el.sendDownBoxXInput, el.sendDownBoxXRange);
  syncFineTunePair(el.sendDownBoxYInput, el.sendDownBoxYRange);
  syncFineTunePair(el.callUpCardXInput, el.callUpCardXRange);
  syncFineTunePair(el.callUpCardYInput, el.callUpCardYRange);
  syncFineTunePair(el.sendDownCardXInput, el.sendDownCardXRange);
  syncFineTunePair(el.sendDownCardYInput, el.sendDownCardYRange);
  syncFineTunePair(el.callUpNameXInput, el.callUpNameXRange);
  syncFineTunePair(el.callUpNameYInput, el.callUpNameYRange);
  syncFineTunePair(el.callUpNameSizeInput, el.callUpNameSizeRange);
  syncFineTunePair(el.callUpNameSpacingInput, el.callUpNameSpacingRange);
  syncFineTunePair(el.callUpNameLineHeightInput, el.callUpNameLineHeightRange);
  syncFineTunePair(el.callUpMetaXInput, el.callUpMetaXRange);
  syncFineTunePair(el.callUpMetaYInput, el.callUpMetaYRange);
  syncFineTunePair(el.callUpMetaSizeInput, el.callUpMetaSizeRange);
  syncFineTunePair(el.callUpMetaSpacingInput, el.callUpMetaSpacingRange);
  syncFineTunePair(el.callUpMetaLineHeightInput, el.callUpMetaLineHeightRange);
  syncFineTunePair(el.sendDownNameXInput, el.sendDownNameXRange);
  syncFineTunePair(el.sendDownNameYInput, el.sendDownNameYRange);
  syncFineTunePair(el.sendDownNameSizeInput, el.sendDownNameSizeRange);
  syncFineTunePair(el.sendDownNameSpacingInput, el.sendDownNameSpacingRange);
  syncFineTunePair(el.sendDownNameLineHeightInput, el.sendDownNameLineHeightRange);
  syncFineTunePair(el.sendDownMetaXInput, el.sendDownMetaXRange);
  syncFineTunePair(el.sendDownMetaYInput, el.sendDownMetaYRange);
  syncFineTunePair(el.sendDownMetaSizeInput, el.sendDownMetaSizeRange);
  syncFineTunePair(el.sendDownMetaSpacingInput, el.sendDownMetaSpacingRange);
  syncFineTunePair(el.sendDownMetaLineHeightInput, el.sendDownMetaLineHeightRange);

  const resultInputs = [
    ...el.result, ...el.kiaSide, el.gameDate, el.opponentTeam,
    el.stadiumName, el.homeScore, el.awayScore, el.mvpName, el.mvpRecord,
    el.winnerName, el.loserName, el.saveName, el.globalLetterSpacing,
    el.opponentXInput, el.opponentYInput, el.opponentXRange, el.opponentYRange,
    el.mvpRecordXInput, el.mvpRecordYInput, el.mvpRecordXRange, el.mvpRecordYRange
  ];
  resultInputs.forEach((input) => {
    input.addEventListener('input', updateResultPoster);
    input.addEventListener('change', updateResultPoster);
    input.addEventListener('input', updateSecondaryActionButtons);
    input.addEventListener('change', updateSecondaryActionButtons);
  });
  el.result.forEach((input) => {
    input.addEventListener('change', () => {
      resultManualOverride = true;
      updateResultPoster();
      updateSecondaryActionButtons();
    });
  });
  el.kiaSide.forEach((input) => {
    input.addEventListener('change', () => {
      applySharedKiaSide(selectedValue(el.kiaSide));
    });
  });

  el.opponentTeam.addEventListener('change', () => {
    applySharedOpponent(el.opponentTeam.value);
  });

  const lineupInputs = [
    el.lineupDate,
    el.lineupOpponentTeam,
    el.lineupStadiumName,
    el.lineupPitcherName,
    el.lineupGameTime,
    el.lineupGameTimeCustom,
    el.lineupBroadcaster,
    el.lineupTerrestrial,
    el.lineupLetterSpacing,
    el.lineupOpponentXInput,
    el.lineupOpponentYInput,
    el.lineupOpponentXRange,
    el.lineupOpponentYRange
  ];
  const lineupSideInputs = [...el.lineupKiaSide];
  lineupInputs.forEach((input) => {
    input.addEventListener('input', updateLineupPoster);
    input.addEventListener('change', updateLineupPoster);
    input.addEventListener('input', updateSecondaryActionButtons);
    input.addEventListener('change', updateSecondaryActionButtons);
  });
  el.lineupGameTime?.addEventListener('input', updateLineupGameTimeCustomVisibility);
  el.lineupGameTime?.addEventListener('change', updateLineupGameTimeCustomVisibility);
  lineupSideInputs.forEach((input) => {
    input.addEventListener('input', updateLineupPoster);
    input.addEventListener('change', updateLineupPoster);
  });
  el.lineupKiaSide.forEach((input) => {
    input.addEventListener('change', () => {
      applySharedKiaSide(selectedValue(el.lineupKiaSide));
    });
  });

  [el.opponentXInput, el.opponentXRange, el.opponentYInput, el.opponentYRange].forEach((input) => {
    input.addEventListener('input', () => {
      applySharedOpponentFineTune(el.opponentXInput.value || 0, el.opponentYInput.value || 0);
    });
    input.addEventListener('change', () => {
      applySharedOpponentFineTune(el.opponentXInput.value || 0, el.opponentYInput.value || 0);
    });
  });

  [el.lineupOpponentXInput, el.lineupOpponentXRange, el.lineupOpponentYInput, el.lineupOpponentYRange].forEach((input) => {
    input.addEventListener('input', () => {
      applySharedOpponentFineTune(el.lineupOpponentXInput.value || 0, el.lineupOpponentYInput.value || 0);
    });
    input.addEventListener('change', () => {
      applySharedOpponentFineTune(el.lineupOpponentXInput.value || 0, el.lineupOpponentYInput.value || 0);
    });
  });

  [el.rosterOpponentXInput, el.rosterOpponentXRange, el.rosterOpponentYInput, el.rosterOpponentYRange].forEach((input) => {
    input.addEventListener('input', () => {
      applySharedOpponentFineTune(el.rosterOpponentXInput.value || 0, el.rosterOpponentYInput.value || 0);
    });
    input.addEventListener('change', () => {
      applySharedOpponentFineTune(el.rosterOpponentXInput.value || 0, el.rosterOpponentYInput.value || 0);
    });
  });

  el.lineupInputGrid.addEventListener('input', updateLineupPoster);
  el.lineupInputGrid.addEventListener('input', updateSecondaryActionButtons);
  el.lineupInputGrid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const nameMatch = target.id.match(/^lineupName(\d)$/);
    const posMatch = target.id.match(/^lineupPos(\d)$/);
    if (!nameMatch && !posMatch) return;

    event.preventDefault();
    const current = Number((nameMatch || posMatch)[1]);
    const next = current + 1;
    if (next > 9) return;
    const nextId = nameMatch ? `lineupName${next}` : `lineupPos${next}`;
    document.getElementById(nextId)?.focus();
  });

  el.lineupOpponentTeam.addEventListener('change', () => {
    applySharedOpponent(el.lineupOpponentTeam.value);
  });

  [
    el.rosterMovesDate,
    el.rosterMovesOpponentTeam,
    el.rosterMovesStadiumName,
    el.callUpCount,
    el.sendDownCount,
    el.rosterOpponentXInput, el.rosterOpponentXRange, el.rosterOpponentYInput, el.rosterOpponentYRange
  ].filter(Boolean).forEach((input) => {
    input.addEventListener('input', () => {
      refreshRosterGroupEditors('callUp');
      refreshRosterGroupEditors('sendDown');
      updateRosterMovesPoster();
    });
    input.addEventListener('change', () => {
      refreshRosterGroupEditors('callUp');
      refreshRosterGroupEditors('sendDown');
      updateRosterMovesPoster();
    });
  });

  ['callUp', 'sendDown'].forEach((section) => {
    rosterMoveEditors[section].forEach((groupRefs, index) => {
      [
        groupRefs.nameInput,
        groupRefs.pitcherGames,
        groupRefs.pitcherWins,
        groupRefs.pitcherLosses,
        groupRefs.pitcherSaves,
        groupRefs.pitcherHolds,
        groupRefs.pitcherInnings,
        groupRefs.pitcherEra,
        groupRefs.pitcherWhip,
        groupRefs.hitterGames,
        groupRefs.hitterHomeRuns,
        groupRefs.hitterRbi,
        groupRefs.hitterSteals,
        groupRefs.hitterAvg,
        groupRefs.hitterOps
      ].forEach((input) => {
        input.addEventListener('input', () => {
          updateRosterMovesFormVisibility(section, index);
          updateRosterMovesPoster();
        });
        input.addEventListener('change', () => {
          updateRosterMovesFormVisibility(section, index);
          updateRosterMovesPoster();
        });
      });
    });
  });

  el.rosterMovesOpponentTeam.addEventListener('change', () => {
    applySharedOpponent(el.rosterMovesOpponentTeam.value);
  });

  const videoInputs = [
    el.videoTitleInput,
    el.videoDate,
    el.videoOpponentTeam,
    el.videoMetaOverride,
    el.videoStartTime,
    el.videoEndTime,
    el.videoFrameXInput,
    el.videoFrameYInput,
    el.videoFrameXRange,
    el.videoFrameYRange,
    el.videoFrameScaleInput,
    el.videoFrameScaleRange,
    el.videoTitleXInput,
    el.videoTitleYInput,
    el.videoTitleXRange,
    el.videoTitleYRange,
    el.videoTitleSizeInput,
    el.videoTitleSizeRange,
    el.videoTitleSpacingInput,
    el.videoTitleSpacingRange,
    el.videoTitleLineHeightInput,
    el.videoTitleLineHeightRange,
    el.videoMetaXInput,
    el.videoMetaYInput,
    el.videoMetaXRange,
    el.videoMetaYRange,
    el.videoMetaSizeInput,
    el.videoMetaSizeRange
  ];
  videoInputs.forEach((input) => {
    input.addEventListener('input', updateVideoPoster);
    input.addEventListener('change', updateVideoPoster);
  });

  el.videoTrimStartRange.addEventListener('input', () => {
    syncVideoTrimInputs('start-range');
    updateVideoPoster('start');
  });
  el.videoTrimEndRange.addEventListener('input', () => {
    syncVideoTrimInputs('end-range');
    updateVideoPoster('end');
  });
  el.videoStartTime.addEventListener('input', () => {
    syncVideoTrimDraftInput('start-input');
    updateVideoPoster('start');
  });
  el.videoEndTime.addEventListener('input', () => {
    syncVideoTrimDraftInput('end-input');
    updateVideoPoster('end');
  });
  el.videoStartTime.addEventListener('change', () => {
    syncVideoTrimInputs('start-input');
    updateVideoPoster('start');
  });
  el.videoEndTime.addEventListener('change', () => {
    syncVideoTrimInputs('end-input');
    updateVideoPoster('end');
  });

  el.videoPlayToggle.addEventListener('click', async () => {
    const video = out.videoPreviewElement;
    if (!video.getAttribute('src')) return;
    if (video.paused) {
      const { start, end } = getVideoTrimTimes();
      if (video.currentTime < start || video.currentTime > end) {
        video.currentTime = start;
      }
      const playPromise = video.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    } else {
      video.pause();
    }
    updateVideoPlaybackUi();
  });

  el.videoPreviewToggleBtn.addEventListener('click', async () => {
    if (videoState.previewMode) {
      setVideoPreviewMode(false);
      return;
    }
    await renderVideoPreviewFrameImage();
  });

  el.videoPlaybackRange.addEventListener('input', () => {
    const video = out.videoPreviewElement;
    const nextTime = Number(el.videoPlaybackRange.value) || 0;
    video.currentTime = nextTime;
    updateVideoPlaybackUi();
  });

  el.videoFileInput.addEventListener('change', () => {
    const file = el.videoFileInput.files?.[0];
    if (videoState.objectUrl) {
      URL.revokeObjectURL(videoState.objectUrl);
      videoState.objectUrl = '';
    }
    if (!file) {
      videoState.sourceBytes = null;
      videoState.sourceExt = 'mp4';
      setVideoPreviewMode(false);
      out.videoPreviewElement.removeAttribute('src');
      out.videoPreviewElement.load();
      el.videoStartTime.value = '0';
      el.videoEndTime.value = '0';
      configureVideoTrimRange(0);
      updateVideoPoster();
      return;
    }
    videoState.sourceExt = getFileExtension(file.name, 'mp4');
    videoState.objectUrl = URL.createObjectURL(file);
    out.videoPreviewElement.src = videoState.objectUrl;
    out.videoPreviewElement.load();
    setVideoPreviewMode(false);
    file.arrayBuffer().then((buffer) => {
      videoState.sourceBytes = new Uint8Array(buffer);
    }).catch(() => {
      videoState.sourceBytes = null;
    });
  });

  out.videoPreviewElement.addEventListener('loadedmetadata', () => {
    out.videoPreviewElement.muted = false;
    out.videoPreviewElement.volume = 1;
    configureVideoTrimRange(out.videoPreviewElement.duration);
    updateVideoPoster();
  });

  out.videoPreviewElement.addEventListener('timeupdate', updateVideoPlaybackUi);
  out.videoPreviewElement.addEventListener('play', updateVideoPlaybackUi);
  out.videoPreviewElement.addEventListener('pause', updateVideoPlaybackUi);
  out.videoPreviewElement.addEventListener('seeked', updateVideoPlaybackUi);

  out.videoBgImage.addEventListener('error', () => {
    out.videoBgImage.style.display = 'none';
    el.videoPoster.querySelector('.video-canvas')?.classList.remove('has-bg-image');
    invalidateVideoOverlayCache();
  });

  out.videoBgImage.addEventListener('load', () => {
    out.videoBgImage.style.display = 'block';
    el.videoPoster.querySelector('.video-canvas')?.classList.add('has-bg-image');
    invalidateVideoOverlayCache();
    primeVideoOverlayCache().catch(() => {});
  });

  el.videoOpponentTeam.addEventListener('change', () => {
    applySharedOpponent(el.videoOpponentTeam.value);
  });

  el.tabResult.addEventListener('click', () => switchTab('result'));
  el.tabLineup.addEventListener('click', () => switchTab('lineup'));
  el.tabVideo.addEventListener('click', () => switchTab('video'));
  el.tabRosterMoves.addEventListener('click', () => switchTab('rosterMoves'));
  el.downloadBtn.addEventListener('click', downloadImage);
  el.followDownloadBtn.addEventListener('click', downloadFollowImage);
  el.copyCaptionBtn?.addEventListener('click', copyGeneratedCaption);
  window.addEventListener('resize', () => {
    el.previewScale.classList.toggle('video-mobile-plain', activeTab === 'video' && isMobilePreviewMode());
    updateVideoPreviewToggleVisibility();
    updateSecondaryActionButtons();
    scheduleMobilePreviewRender();
  });
}

function setToday(target) {
  const now = new Date();
  target.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function init() {
  buildLineupInputs();
  buildLineupTextLayer();
  populateTeamSelect(el.opponentTeam);
  populateTeamSelect(el.lineupOpponentTeam);
  populateTeamSelect(el.videoOpponentTeam);
  populateTeamSelect(el.rosterMovesOpponentTeam);
  populatePlayerNameOptions();
  buildRosterMovesUi();

  el.opponentTeam.value = 'LG 트윈스';
  el.lineupOpponentTeam.value = 'LG 트윈스';
  el.videoOpponentTeam.value = 'LG 트윈스';
  el.rosterMovesOpponentTeam.value = 'LG 트윈스';
  el.stadiumName.value = KIA_HOME_STADIUM;
  el.lineupStadiumName.value = KIA_HOME_STADIUM;
  el.rosterMovesStadiumName.value = KIA_HOME_STADIUM;

  setToday(el.gameDate);
  setToday(el.lineupDate);
  setToday(el.videoDate);
  setToday(el.rosterMovesDate);

  if (out.videoBgImage.complete) {
    out.videoBgImage.style.display = out.videoBgImage.naturalWidth > 0 ? 'block' : 'none';
    el.videoPoster.querySelector('.video-canvas')?.classList.toggle('has-bg-image', out.videoBgImage.naturalWidth > 0);
  }

  bindEvents();
  bindNudgeButtons();
  configureVideoTrimRange(0);
  updateLineupGameTimeCustomVisibility();
  refreshRosterGroupEditors('callUp');
  refreshRosterGroupEditors('sendDown');
  applySharedKiaSide('home');
  applySharedOpponentFineTune(el.lineupOpponentXInput.value || 228, el.lineupOpponentYInput.value || 354);
  syncAutoResultSelection();
  updateResultPoster();
  updateLineupPoster();
  updateVideoPoster();
  updateRosterMovesPoster();
  updateVideoPreviewToggleVisibility();
  updateDownloadButtonLabel();
  updateSecondaryActionButtons();
}

function initializeApp() {
  document.querySelector('.tab-row')?.prepend(el.tabLineup);
  init();
  applySharedOpponent('LG 트윈스');
  switchTab('lineup');
}

initializeApp();
