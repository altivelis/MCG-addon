/**
 * ゲーム全体の定数と設定値を管理
 */

// ダメージ値（剣の攻撃力）
export const SWORD_DAMAGE = {
  WOODEN: 5,
  STONE: 15,
  GOLDEN: 20,
  IRON: 30,
  DIAMOND: 50,
  NETHERITE: 70
};

// 剣の名前マッピング
export const SWORD_NAMES = {
  wooden_sword: "木の剣",
  stone_sword: "石の剣",
  golden_sword: "金の剣",
  iron_sword: "鉄の剣",
  diamond_sword: "ダイヤモンドの剣",
  netherite_sword: "ネザライトの剣"
};

// 剣のダメージマッピング（レガシー互換性のため）
export const SWORD_DAMAGE_MAP = {
  wooden_sword: 5,
  stone_sword: 15,
  golden_sword: 20,
  iron_sword: 30,
  diamond_sword: 50,
  netherite_sword: 70
};

// ゲーム設定のデフォルト値
export const GAME_CONFIG = {
  TIME_LIMIT: 150,
  FIRST_DRAW_COUNT: 5,
  SECOND_DRAW_COUNT: 6,
  START_ACT: 5,
  END_ACT: 3,
  EVENT_MODE: false
};

// タイマー設定
export const TIMER_CONFIG = {
  WARNING_THRESHOLD: 10, // 残り時間がこの値以下でサウンド再生
  TICK_INTERVAL: 20 // タイマー更新間隔（tick）
};

// 襲撃モード設定
export const RAID_MODE = {
  ACT_RESET: 20,
  SWORD_DAMAGE: "15"
};

// HP表示設定
export const HP_DISPLAY = {
  BAR_LENGTH: 20, // HPバーの長さ
  DECIMAL_PLACES: 10 // 小数点以下の桁数調整用
};

// 座標設定（既存のmcg.constから移行予定）
export const LOBBY_COORDS = {
  SPAWN: { x: -66.5, y: -44, z: -20.5 },
  LOBBY: { x: -63, y: -53, z: -13 },
  SPECTATOR: { x: 0.5, y: 11, z: 0.5 },
  WINNER_RETURN: { x: -62.5, y: -53, z: -12.5 }
};

export const SIGN_COORDS = {
  RED: { x: -62, y: -53, z: -2 },
  BLUE: { x: -64, y: -53, z: -2 }
};

// アリーナ座標
export const ARENA_COORDS = {
  RED_START: { x: 15.5, y: 5.5, z: 0.5 },
  BLUE_START: { x: -15.5, y: 5.5, z: 0.5 }
};

// カメラアニメーション設定
export const CAMERA_ANIMATION = {
  FADE: {
    FADE_IN: 1,
    HOLD: 1,
    FADE_OUT: 1
  },
  POSITIONS: {
    SKY_RED: { x: 0, y: 40, z: 0 },
    SKY_BLUE: { x: 0, y: 40, z: 1 },
    GROUND_RED: { x: 0, y: 6, z: 0 },
    GROUND_BLUE: { x: 0, y: 6, z: 1 },
    DUEL_RED: { x: -13, y: 6, z: 0 },
    DUEL_BLUE: { x: 13, y: 6, z: 1 }
  },
  TIMINGS: {
    INITIAL_FADE: 20,
    DESCEND_START: 20,
    DESCEND_DURATION: 40,
    TITLE_SHOW: 20,
    TITLE_DURATION: 40,
    FINAL_FADE: 20,
    GAME_START: 20
  }
};

// タイトル表示設定
export const TITLE_CONFIG = {
  FADE_IN: 10,
  STAY: 40,
  FADE_OUT: 10
};

// 観戦モード座標
export const SPECTATOR_COORDS = {
  LOBBY_TO_SPECTATOR: { x: -63, y: -53, z: -26 },
  SPECTATOR_TO_LOBBY: { x: 0, y: 12, z: 11 },
  SPECTATOR_MODE_TOGGLE: { x: 0, y: 12, z: -10 },
  ARENA_EXITS: [
    { x: 13, y: 1, z: -11 },
    { x: -13, y: 1, z: -11 },
    { x: -13, y: 1, z: 12 },
    { x: 13, y: 1, z: 12 }
  ]
};

// パーティクル設定
export const PARTICLE_CONFIG = {
  UPDATE_INTERVAL: 10, // tick
  OFFSET: {
    PROTECT: { x: -0.5, z: -0.5 },
    FLY: { y: -1 },
    GUARD: { x: -0.5, z: -0.5 },
    CALL_PIGMAN: { y: 1 },
    TURN_INDICATOR: { y: 2 }
  }
};

// 許可されたアイテム（使用制限の例外）
export const ALLOWED_ITEMS = [
  "minecraft:book",
  "minecraft:compass",
  "minecraft:spyglass"
];

// 削除対象アイテム（ターン終了時）
export const TURN_END_REMOVE_ITEMS = [
  "minecraft:compass",
  "minecraft:arrow",
  "minecraft:snowball",
  "minecraft:iron_axe"
];

// ゲームステータス
export const GAME_STATUS = {
  WAITING: 0,
  STARTING: 1,
  IN_GAME: 2,
  ENDING: 3
};

// カラーコード
export const COLOR_CODES = {
  RED: "§c",
  BLUE: "§b",
  GREEN: "§2",
  YELLOW: "§e",
  GOLD: "§6",
  AQUA: "§3",
  LIGHT_PURPLE: "§d",
  GRAY: "§8",
  RESET: "§r"
};

// エラーメッセージ
export const ERROR_MESSAGES = {
  NOT_ENOUGH_PLAYERS: "§c参加者が足りていないため、開始できませんでした。",
  PLAYER_NOT_FOUND: "§c対戦プレイヤーが見つかりません。タイマーをストップします。\n強制終了する場合は§a/scriptevent mcg:reset§cを実行してください。",
  WINNER_NOT_FOUND: "§c勝利プレイヤーが見つからなかったため、強制終了します。",
  NOT_YOUR_TURN: "あなたのターンではありません",
  NO_GRASS_BLOCK: "草ブロックがありません",
  NETHER_LOCKED: "ネザーカードが開放されていません",
  ICE_RESTRICTION: "§c氷塊を所持している状態ではピンクのボタンを使用できません",
  WAIT_FOR_OPPONENT: "対戦相手が復帰するまでお待ち下さい",
  // usecard.js用エラーメッセージ
  INVALID_SLOT: "§cこのスロットには使用できません",
  INSUFFICIENT_ACT: "§4actが足りません",
  SLOT_OCCUPIED: "§4このスロットには既にモブが存在します",
  DIRECT_ATTACK_BLOCKED: "§4相手の場にモブが存在します",
  NO_TARGET_MOB: "§c対象のモブが存在しないため使用できません",
  NO_STRIDER: "§c自分のスロットにストライダーが存在しないため使用できません",
  NO_BEE_NEST: "§cミツバチの巣が設置されていないか、ミツバチが存在しないため使用できません",
  SLOTS_NOT_FULL: "§c相手のスロットが埋まっていないため使用できません",
  OWN_SLOTS_NOT_EMPTY: "§c自分のスロットにモブが存在しているため使用できません",
  ENEMY_ACT_TOO_LOW: "§c相手のactが30未満のため使用できません",
  ACT_TOO_HIGH: "§cactが10より多いため使用できません",
  NO_GOLEM: "§c自分のスロットにゴーレムが存在しないため使用できません。",
  NO_VILLAGER_IN_SLOT: "§cスロットに村人が存在しないため使用できません。",
  NO_BRUTAL_MOB: "§c自分のスロットに残虐属性のモブが存在しないため使用できません。",
  ACE_EXISTS: "§c既に大将が存在するため使用できません。",
  NO_ILLAGER: "§c対象のスロットに略奪者・ヴィンディケーター・エヴォーカーが存在しないため使用できません",
  NOT_RAID_MODE: "§c襲撃モード中でないため使用できません",
  WITCH_ALREADY_ENHANCED: "§cすでに強化されているため使用できません。",
  NO_ATTACKABLE_ENEMY: "§c相手の場に攻撃可能なモブが存在しません",
  ENEMY_HAS_ATTACKABLE: "§c相手の場に攻撃可能なモブが存在するため使用できません"
};

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  CONFIG_INITIALIZED: "変数を初期化しました。",
  GAME_FORCE_ENDED: "対戦を強制終了しました。",
  PLAYERS_DECIDED: "参加者が決定しました。",
  GAME_STARTING: "対戦を開始します…",
  GAME_STARTED: "対戦を開始しました",
  SURRENDER: "サレンダーボタンが押されました。"
};

// 視線距離設定
export const VIEW_DISTANCE = {
  ENTITY: 64,
  BLOCK: 64
};

// エンティティ除外タイプ
export const EXCLUDE_TYPES = {
  BARRIER_BUTTONS: ["minecraft:barrier", "minecraft:wooden_button", "minecraft:stone_button"],
  PLAYERS_ONLY: ["minecraft:player"],
  DROPPED_ITEMS: ["minecraft:item"]
};