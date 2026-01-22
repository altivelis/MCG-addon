import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { myTimeout, giveItem, setAct, getAct, addAct, getCard, giveSword, sendPlayerMessage, applyDamage, clearInventory, isOnline, cardInfo, createColor, lineParticle, getPlayerColoredName, setTime, getTime, progressTime, createHash, findItem } from "./lib";
import { turnItem, turnMob, turnObject } from "./turncard";
import { 
  GAME_CONFIG, GAME_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, 
  SIGN_COORDS, LOBBY_COORDS, ARENA_COORDS, PARTICLE_CONFIG,
  CAMERA_ANIMATION, TITLE_CONFIG, TIMER_CONFIG, TURN_END_REMOVE_ITEMS, RAID_MODE
} from "./constants";

export const mcg = {
  const: {
    red: {
      slot: {
        red: { x: 4.5, y: 1, z: -5.5 },
        white: { x: 4.5, y: 1, z: 0.5 },
        blue: { x: 4.5, y: 1, z: 6.5 },
        object: { x: 10.5, y: 4, z: 6.5 }
      },
      button: {
        red: { x: 13, y: 5, z: -2 },
        white: { x: 13, y: 5, z: 0 },
        blue: { x: 13, y: 5, z: 2 },
        pink: { x: 16, y: 5, z: 0 },
        orange: { x: 16, y: 5, z: 3 }
      },
      lever: { x: 15, y: 5, z: -5 },
      wool: {
        red: { x: 8, y: 0, z: 2 },
        yellow: { x: 8, y: 0, z: 1 },
        pink: { x: 8, y: 0, z: 0 },
        green: { x: 8, y: 0, z: -1 },
        black: { x: 8, y: 0, z: -2 }
      }
    },
    blue: {
      slot: {
        red: { x: -3.5, y: 1, z: -5.5 },
        white: { x: -3.5, y: 1, z: 0.5 },
        blue: { x: -3.5, y: 1, z: 6.5 },
        object: { x: -9.5, y: 4, z: -5.5 }
      },
      button: {
        red: { x: -13, y: 5, z: -2 },
        white: { x: -13, y: 5, z: 0 },
        blue: { x: -13, y: 5, z: 2 },
        pink: { x: -16, y: 5, z: 0 },
        orange: { x: -16, y: 5, z: -3 }
      },
      lever: { x: -15, y: 5, z: -5 },
      wool: {
        red: { x: -8, y: 0, z: -2 },
        yellow: { x: -8, y: 0, z: -1 },
        pink: { x: -8, y: 0, z: 0 },
        green: { x: -8, y: 0, z: 1 },
        black: { x: -8, y: 0, z: 2 }
      }
    },
    rgb: {
      red: { red: 1, green: 0.2, blue: 0.3 },
      blue: { red: 0, green: 0.7, blue: 0.9 }
    }
  },
  queue: {
    /** @type {mc.Player} */
    red: null,
    /** @type {mc.Player} */
    blue: null
  }
};

/** @type {mc.BlockPermutation} */
let button_permutation;

mc.world.afterEvents.worldLoad.subscribe(data => {
  button_permutation = mc.BlockPermutation.resolve("wooden_button", { "facing_direction": 1 });
});

// ========== 看板システム ==========

/**
 * 看板のテキストを設定
 * @param {String} color - "red" または "blue"
 * @param {mc.Player} player - プレイヤー（nullの場合は初期テキスト）
 */
function setSign(color, player = null) {
  const signLocation = color === "red" ? SIGN_COORDS.RED : SIGN_COORDS.BLUE;
  const block = mc.world.getDimension("minecraft:overworld").getBlock(signLocation);
  if (!block) return;

  const signComponent = block.getComponent(mc.BlockSignComponent.componentId);
  if (player) {
    const colorCode = color === "red" ? "§c" : "§b";
    signComponent.setText("\n対戦予約中\n" + colorCode + player.nameTag);
  } else {
    signComponent.setText("\nタッチして\n対戦予約");
  }
}

// 参加受付の看板インタラクション
mc.world.beforeEvents.playerInteractWithBlock.subscribe(data => {
  const { block, faceLocation, isFirstEvent, player } = data;
  if (!isFirstEvent) return;

  const blockPos = `${block.location.x} ${block.location.y} ${block.location.z}`;
  const redSignPos = `${SIGN_COORDS.RED.x} ${SIGN_COORDS.RED.y} ${SIGN_COORDS.RED.z}`;
  const blueSignPos = `${SIGN_COORDS.BLUE.x} ${SIGN_COORDS.BLUE.y} ${SIGN_COORDS.BLUE.z}`;
  
  if (blockPos === redSignPos) {
    handleQueueInteraction(data, "red", faceLocation);
  } else if (blockPos === blueSignPos) {
    handleQueueInteraction(data, "blue", faceLocation);
  }
});

/**
 * キュー登録のインタラクション処理
 * @param {Object} data - イベントデータ
 * @param {String} color - "red" または "blue"
 * @param {mc.Vector3} faceLocation - 看板の面の位置
 */
function handleQueueInteraction(data, color, faceLocation) {
  data.cancel = true;
  const player = data.player;
  const oppositeColor = color === "red" ? "blue" : "red";

  if (!mcg.queue[color]) {
    mcg.queue[color] = player;
    mc.system.run(() => {
      data.block.dimension.spawnParticle(
        "mcg:custom_explosion_emitter",
        faceLocation,
        createColor(mcg.const.rgb[color])
      );
    });
    
    // 反対側のキューから削除
    if (mcg.queue[oppositeColor]?.id === player.id) {
      mcg.queue[oppositeColor] = null;
    }
  } else if (mcg.queue[color]?.id === player.id) {
    mcg.queue[color] = null;
  }
}

// 看板の文字を更新
mc.system.runInterval(() => {
  if (!mcg.queue.red?.isValid) mcg.queue.red = null;
  if (!mcg.queue.blue?.isValid) mcg.queue.blue = null;

  setSign("red", mcg.queue.red);
  setSign("blue", mcg.queue.blue);
});

// ========== パーティクルシステム ==========

mc.system.runInterval(() => {
  // プレイヤーパーティクル
  if (mcg.queue.red && mcg.queue.red.getGameMode() !== mc.GameMode.Spectator) {
    mcg.queue.red.dimension.spawnParticle("minecraft:raid_omen_emitter", mcg.queue.red.location);
  }
  if (mcg.queue.blue && mcg.queue.blue.getGameMode() !== mc.GameMode.Spectator) {
    mcg.queue.blue.dimension.spawnParticle("minecraft:trial_omen_emitter", mcg.queue.blue.location);
  }

  mc.world.getPlayers().forEach(player => {
    if (player.hasTag("turn")) {
      player.dimension.spawnParticle("minecraft:heart_particle", { 
        ...player.location, 
        y: player.location.y + PARTICLE_CONFIG.OFFSET.TURN_INDICATOR.y 
      });
    }
    if (player.hasTag("raid")) {
      player.dimension.spawnParticle("minecraft:lava_particle", player.location);
    }
  });

  // 属性パーティクル
  spawnEntityAttributeParticles();
}, PARTICLE_CONFIG.UPDATE_INTERVAL);

/**
 * エンティティの属性パーティクルを生成
 */
function spawnEntityAttributeParticles() {
  mc.world.getDimension("minecraft:overworld").getEntities({ excludeTypes: ["minecraft:player"] }).forEach(entity => {
    if (entity.hasTag("protect")) {
      entity.dimension.spawnParticle("minecraft:trial_spawner_detection", {
        ...entity.location,
        x: entity.location.x + PARTICLE_CONFIG.OFFSET.PROTECT.x,
        z: entity.location.z + PARTICLE_CONFIG.OFFSET.PROTECT.z
      });
    }
    if (entity.hasTag("fly")) {
      entity.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", {
        ...entity.location,
        y: entity.location.y + PARTICLE_CONFIG.OFFSET.FLY.y
      });
    }
    if (entity.hasTag("guard")) {
      entity.dimension.spawnParticle("minecraft:trial_spawner_detection_ominous", {
        ...entity.location,
        x: entity.location.x + PARTICLE_CONFIG.OFFSET.GUARD.x,
        z: entity.location.z + PARTICLE_CONFIG.OFFSET.GUARD.z
      });
    }
    if (entity.hasTag("water")) {
      for(let i=0; i<16; i++) {
        entity.dimension.spawnParticle("minecraft:water_wake_particle", {
          ...entity.location,
          x: entity.location.x + Math.random() * PARTICLE_CONFIG.OFFSET.WATER.x - PARTICLE_CONFIG.OFFSET.WATER.x / 2,
          y: entity.location.y + Math.random() * PARTICLE_CONFIG.OFFSET.WATER.y - PARTICLE_CONFIG.OFFSET.WATER.y / 2,
          z: entity.location.z + Math.random() * PARTICLE_CONFIG.OFFSET.WATER.z - PARTICLE_CONFIG.OFFSET.WATER.z / 2
        });
      }
    }
    if (entity.hasTag("call_pigman")) {
      entity.dimension.spawnParticle("minecraft:infested_emitter", {
        ...entity.location,
        y: entity.location.y + PARTICLE_CONFIG.OFFSET.CALL_PIGMAN.y
      });
    }
    if (entity.hasTag("ace")) {
      entity.dimension.spawnParticle("minecraft:lava_particle", entity.location);
    }
  });
}

// ========== プレイヤー管理 ==========

mc.system.runInterval(() => {
  const voidhelmet = new mc.ItemStack("mcg:voidhelmet", 1);
  voidhelmet.lockMode = mc.ItemLockMode.slot;
  
  mc.world.getAllPlayers().forEach(player => {
    player.addEffect(mc.EffectTypes.get("minecraft:saturation"), 20, { showParticles: false, amplifier: 1 });
    player.setSpawnPoint({ dimension: mc.world.getDimension("minecraft:overworld"), x: -66.5, y: -44, z: -20.5 });
    player.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head, voidhelmet);
  });
});

// ========== ゲーム初期化・リセット ==========

mc.system.afterEvents.scriptEventReceive.subscribe(data => {
  if (data.id === "mcg:init") initialize_config();
  if (data.id === "mcg:reset") reset();
});

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const initialize_command = {
    name: "mcg:init",
    description: "ゲームの初期設定を行います",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [],
    optionalParameters: [],
  };
  data.customCommandRegistry.registerCommand(initialize_command, (origin) => {
    if (origin.sourceEntity === undefined) {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "このコマンドはプレイヤーのみが使用できます。"
      }
    }
    mc.system.run(() => {
      initialize_config();
    })
    return {
      status: mc.CustomCommandStatus.Success,
      message: "初期設定を行いました。"
    }
  });

  /**
   * @type {mc.CustomCommand}
   */
  const reset_command = {
    name: "mcg:reset",
    description: "ゲームをリセットします。",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [],
    optionalParameters: [],
  };
  data.customCommandRegistry.registerCommand(reset_command, (origin) => {
    if (origin.sourceEntity === undefined) {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "このコマンドはプレイヤーのみが使用できます。"
      }
    }
    mc.system.run(() => {
      reset();
    })
    return {
      status: mc.CustomCommandStatus.Success,
      message: "設定をリセットしました。"
    }
  });
})

function initialize_config() {
  mc.world.setDynamicProperty("time", GAME_CONFIG.TIME_LIMIT);
  mc.world.setDynamicProperty("first_draw", GAME_CONFIG.FIRST_DRAW_COUNT);
  mc.world.setDynamicProperty("second_draw", GAME_CONFIG.SECOND_DRAW_COUNT);
  mc.world.setDynamicProperty("start_act", GAME_CONFIG.START_ACT);
  mc.world.setDynamicProperty("end_act", GAME_CONFIG.END_ACT);
  mc.world.setDynamicProperty("event", GAME_CONFIG.EVENT_MODE);
  mc.world.sendMessage(SUCCESS_MESSAGES.CONFIG_INITIALIZED);
}

function reset() {
  mc.world.setDynamicProperty("status", 0);
  
  // スコアボードリセット
  mc.world.scoreboard.getObjective("act").getParticipants().forEach(id => {
    mc.world.scoreboard.getObjective("act").removeParticipant(id);
  });
  setTime(0);

  // プレイヤーリセット
  mc.world.getPlayers().forEach(player => {
    resetPlayer(player);
  });

  // エンティティ削除
  mc.world.getDimension("minecraft:overworld").getEntities({ excludeTypes: ["minecraft:player"] }).forEach(entity => {
    entity.remove();
  });

  // フィールドクリア
  clearGameField();

  mc.world.sendMessage("対戦を強制終了しました。");
}

/**
 * プレイヤーをリセット
 * @param {mc.Player} player
 */
function resetPlayer(player) {
  player.teleport({ x: -63, y: -53, z: -13 }, { dimension: mc.world.getDimension("minecraft:overworld") });
  ["red", "blue", "turn", "nether", "raid", "genocide"].forEach(tag => player.removeTag(tag));
  player.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  mc.EffectTypes.getAll().forEach(effect => player.removeEffect(effect));
  player.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
  player.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  player.camera.clear();
}

/**
 * ゲームフィールドをクリア
 */
function clearGameField() {
  const dimension = mc.world.getDimension("minecraft:overworld");

  // ボタン削除
  Object.values(mcg.const.red.button).forEach(pos => dimension.setBlockType(pos, "minecraft:air"));
  Object.values(mcg.const.blue.button).forEach(pos => dimension.setBlockType(pos, "minecraft:air"));

  // オブジェクト削除
  dimension.setBlockType(mcg.const.red.slot.object, "minecraft:air");
  dimension.setBlockType(mcg.const.blue.slot.object, "minecraft:air");

  // 羊毛削除
  Object.values(mcg.const.red.wool).forEach(pos => dimension.setBlockType(pos, "minecraft:air"));
  Object.values(mcg.const.blue.wool).forEach(pos => dimension.setBlockType(pos, "minecraft:air"));
}

// ========== ゲーム開始 ==========

mc.system.runInterval(() => {
  if (mc.world.getDynamicProperty("status") === 0 && mcg.queue.red && mcg.queue.blue) {
    start();
  }
});

function start() {
  const red = mcg.queue.red;
  const blue = mcg.queue.blue;

  if (!red || !blue) {
    mc.world.sendMessage("§c参加者が足りていないため、開始できませんでした。");
    return;
  }

  mc.world.sendMessage("参加者が決定しました。");
  mc.world.sendMessage("対戦を開始します…");
  mc.world.setDynamicProperty("status", 1);
  mcg.queue.red = null;
  mcg.queue.blue = null;

  initializePlayers(red, blue);
  clearGameField();
  startGameAnimation(red, blue);
}

/**
 * プレイヤーを初期化
 * @param {mc.Player} red
 * @param {mc.Player} blue
 */
function initializePlayers(red, blue) {
  [red, blue].forEach(player => {
    // タグ設定
    player.addTag(player === red ? "red" : "blue");
    player.removeTag("nether");
    player.removeTag("raid");
    player.removeTag("genocide");
    // player.addTag("genocide"); // テスト用
    // ゲームモード変更
    player.setGameMode(mc.GameMode.Adventure);

    // ポーション効果消去
    mc.EffectTypes.getAll().forEach(effect => player.removeEffect(effect));

    // アイテム・装備消去
    clearInventory(player);
    player.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);

    // HPリセット
    player.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  });

  // レバーリセット
  const dimension = mc.world.getDimension("minecraft:overworld");
  dimension.setBlockPermutation(mcg.const.red.lever, mc.BlockPermutation.resolve("minecraft:lever", { "lever_direction": "south" }));
  dimension.setBlockPermutation(mcg.const.blue.lever, mc.BlockPermutation.resolve("minecraft:lever", { "lever_direction": "south" }));
}

/**
 * ゲーム開始アニメーション
 * @param {mc.Player} red
 * @param {mc.Player} blue
 */
function startGameAnimation(red, blue) {
  // 移動禁止
  red.inputPermissions.movementEnabled = false;
  blue.inputPermissions.movementEnabled = false;

  // フォーム強制終了
  ui.uiManager.closeAllForms(red);
  ui.uiManager.closeAllForms(blue);

  // カメラフェード開始
  [red, blue].forEach(player => {
    player.camera.fade({
      fadeTime: { fadeInTime: 1, holdTime: 1, fadeOutTime: 1 },
      fadeColor: { red: 0, green: 0, blue: 0 }
    });
  });

  myTimeout(20, () => {
    teleportPlayersToArena(red, blue);
    startCameraSequence(red, blue);
  });
}

/**
 * プレイヤーをアリーナにテレポート
 * @param {mc.Player} red
 * @param {mc.Player} blue
 */
function teleportPlayersToArena(red, blue) {
  red.teleport({ x: 15.5, y: 5.5, z: 0.5 }, { rotation: { x: 0, y: 90 } });
  blue.teleport({ x: -15.5, y: 5.5, z: 0.5 }, { rotation: { x: 0, y: -90 } });
  mc.world.setDynamicProperty("anim", true);
}

/**
 * カメラシーケンスを開始
 * @param {mc.Player} red
 * @param {mc.Player} blue
 */
function startCameraSequence(red, blue) {
  // カメラ上空へ
  red.camera.setCamera("minecraft:free", {
    location: { x: 0, y: 40, z: 0 },
    rotation: { x: 90, y: 90 }
  });
  blue.camera.setCamera("minecraft:free", {
    location: { x: 0, y: 40, z: 1 },
    rotation: { x: 90, y: -90 }
  });

  myTimeout(20, () => {
    // カメラ降下
    red.camera.setCamera("minecraft:free", {
      location: { x: 0, y: 6, z: 0 },
      rotation: { x: 0, y: 90 },
      easeOptions: { easeTime: 2, easeType: "OutCirc" }
    });
    blue.camera.setCamera("minecraft:free", {
      location: { x: 0, y: 6, z: 1 },
      rotation: { x: 0, y: -90 },
      easeOptions: { easeTime: 2, easeType: "OutCirc" }
    });

    myTimeout(40, () => {
      showDuelTitle(red, blue);
    });
  });
}

/**
 * DUELタイトルを表示
 * @param {mc.Player} red
 * @param {mc.Player} blue
 */
function showDuelTitle(red, blue) {
  // カメラ移動
  red.camera.setCamera("minecraft:free", {
    location: { x: -13, y: 6, z: 0 },
    rotation: { x: 0, y: 90 },
    easeOptions: { easeTime: 1, easeType: "InQuart" }
  });
  blue.camera.setCamera("minecraft:free", {
    location: { x: 13, y: 6, z: 1 },
    rotation: { x: 0, y: -90 },
    easeOptions: { easeTime: 1, easeType: "InQuart" }
  });

  red.playSound("apply_effect.bad_omen", { location: { x: -13, y: 6, z: 0 } });
  blue.playSound("apply_effect.bad_omen", { location: { x: 13, y: 6, z: 1 } });

  myTimeout(20, () => {
    red.onScreenDisplay.setTitle("§oDUEL", { fadeInDuration: 0, fadeOutDuration: 20, stayDuration: 40 });
    blue.onScreenDisplay.setTitle("§oDUEL", { fadeInDuration: 0, fadeOutDuration: 20, stayDuration: 40 });
    red.onScreenDisplay.updateSubtitle("vs §b" + blue.nameTag);
    blue.onScreenDisplay.updateSubtitle("vs §c" + red.nameTag);
    mc.world.sendMessage("対戦を開始しました");
    mc.world.sendMessage("§l§c" + red.nameTag + "§r vs §l§b" + blue.nameTag);

    myTimeout(40, () => {
      endAnimationAndStartGame(red, blue);
    });
  });
}

/**
 * アニメーション終了とゲーム開始
 * @param {mc.Player} red
 * @param {mc.Player} blue
 */
function endAnimationAndStartGame(red, blue) {
  // カメラフェード
  [red, blue].forEach(player => {
    player.camera.fade({
      fadeTime: { fadeInTime: 1, holdTime: 1, fadeOutTime: 1 },
      fadeColor: { red: 0, green: 0, blue: 0 }
    });
  });

  myTimeout(20, () => {
    red.camera.clear();
    blue.camera.clear();
    mc.world.setDynamicProperty("anim", false);
    red.inputPermissions.movementEnabled = true;
    blue.inputPermissions.movementEnabled = true;

    myTimeout(20, () => {
      distributeInitialItems(red, blue);
    });
  });
}

/**
 * 初期アイテムを配布してゲーム開始
 * @param {mc.Player} red
 * @param {mc.Player} blue
 */
function distributeInitialItems(red, blue) {
  mc.world.setDynamicProperty("status", 2);
  mc.world.setDynamicProperty("turn", 1);

  // 望遠鏡とウィザー頭蓋骨配布
  [red, blue].forEach(player => {
    const spyglass = new mc.ItemStack("minecraft:spyglass", 1);
    spyglass.lockMode = mc.ItemLockMode.inventory;
    giveItem(player, spyglass);

    const witherSkull = new mc.ItemStack("minecraft:wither_skeleton_skull", 1);
    witherSkull.lockMode = mc.ItemLockMode.inventory;
    giveItem(player, witherSkull);
  });

  // 先行後攻決定
  const first = Math.floor(Math.random() * 2) === 0 ? red : blue;
  const second = first === red ? blue : red;
  
  first.addTag("turn");

  // 草ブロック配布
  giveItem(first, new mc.ItemStack("minecraft:grass_block"), mc.world.getDynamicProperty("first_draw"));
  giveItem(second, new mc.ItemStack("minecraft:grass_block"), mc.world.getDynamicProperty("second_draw"));

  // イベントアイテム配布
  if (mc.world.getDynamicProperty("event") == 1) {
    giveItem(first, new mc.ItemStack("minecraft:snowball"));
    giveItem(second, new mc.ItemStack("minecraft:snowball"));
  }

  // タイトル表示
  showTurnStartTitles(first, second);

  // コンパス配布
  giveItem(first, new mc.ItemStack("minecraft:compass"));

  // act付与
  setAct(first, mc.world.getDynamicProperty("start_act"));
  setAct(second, mc.world.getDynamicProperty("end_act"));
  setTime(mc.world.getDynamicProperty("time"));

  // ボタン設置
  setupButtons(first, second);
}

/**
 * ターン開始のタイトルを表示
 * @param {mc.Player} first
 * @param {mc.Player} second
 */
function showTurnStartTitles(first, second) {
  first.onScreenDisplay.setTitle("あなたは§b先攻§fです", { 
    fadeInDuration: TITLE_CONFIG.FADE_IN, 
    stayDuration: TITLE_CONFIG.STAY, 
    fadeOutDuration: TITLE_CONFIG.FADE_OUT 
  });
  second.onScreenDisplay.setTitle("あなたは§c後攻§fです", { 
    fadeInDuration: TITLE_CONFIG.FADE_IN, 
    stayDuration: TITLE_CONFIG.STAY, 
    fadeOutDuration: TITLE_CONFIG.FADE_OUT 
  });
  
  mc.world.getPlayers({ excludeTags: ["red", "blue"] }).forEach(player => {
    player.onScreenDisplay.setTitle("§bDUEL §cSTART", { 
      fadeInDuration: TITLE_CONFIG.FADE_IN, 
      stayDuration: TITLE_CONFIG.STAY, 
      fadeOutDuration: TITLE_CONFIG.FADE_OUT 
    });
  });

  mc.world.getPlayers().forEach(player => {
    player.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
  });

  mc.world.sendMessage((first.hasTag("red") ? "§c" : "§b") + first.nameTag + "§rが先攻です。");
}

/**
 * ボタンを設置
 * @param {mc.Player} first
 * @param {mc.Player} second
 */
function setupButtons(first, second) {
  const firstButtons = first.hasTag("red") ? mcg.const.red.button : mcg.const.blue.button;
  const secondButtons = first.hasTag("red") ? mcg.const.blue.button : mcg.const.red.button;

  Object.values(firstButtons).forEach(pos => {
    first.dimension.setBlockPermutation(pos, button_permutation);
  });
  Object.values(secondButtons).forEach(pos => {
    second.dimension.setBlockType(pos, "minecraft:air");
  });
}

// ========== 回線落ち対策 ==========

mc.world.afterEvents.playerSpawn.subscribe(data => {
  const { player, initialSpawn } = data;
  if (!initialSpawn) return;
  if (!(player.hasTag("red") || player.hasTag("blue"))) return;

  if (mc.world.getDynamicProperty("status") !== 2) {
    removePlayerFromGame(player);
  } else {
    const playerTeam = player.hasTag("red") ? "red" : "blue";
    if (mc.world.getPlayers({ tags: [playerTeam] }).length > 1) {
      removePlayerFromGame(player);
    }
  }
});

/**
 * プレイヤーをゲームから除外
 * @param {mc.Player} player
 */
function removePlayerFromGame(player) {
  player.removeTag("red");
  player.removeTag("blue");
  player.teleport({ x: -62.5, y: -53, z: -12.5 }, { dimension: mc.world.getDimension("minecraft:overworld") });
  mc.world.scoreboard.getObjective("act").removeParticipant(player);
  player.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
}

// ========== ターン経過処理 ==========

mc.system.runInterval(() => {
  if (mc.world.getDynamicProperty("status") !== 2) return;
  if (mc.world.getDynamicProperty("anim") === true) return;

  if (isOnline()) {
    mc.world.setDynamicProperty("stop", false);
  }

  if (mc.world.getDynamicProperty("stop") === true) return;

  if (!isOnline()) {
    mc.world.sendMessage("§c対戦プレイヤーが見つかりません。タイマーをストップします。\n強制終了する場合は§a/mcg:reset§cを実行してください。");
    mc.world.setDynamicProperty("stop", true);
    return;
  }

  if (getTime() > 0) {
    if (getTime() <= TIMER_CONFIG.WARNING_THRESHOLD) {
      mc.world.getPlayers({ tags: ["turn"] }).forEach(player => {
        player.playSound("random.click", { location: player.location });
      });
    }
    progressTime();
  } else {
    turnChange();
  }
}, TIMER_CONFIG.TICK_INTERVAL);

// ========== ターンチェンジ ==========

export function turnChange() {
  const turnPlayer = mc.world.getPlayers({ tags: ["turn"] })[0];
  const notTurnPlayer = mc.world.getPlayers({ tags: [turnPlayer.hasTag("red") ? "blue" : "red"] })[0];

  if (!turnPlayer || !notTurnPlayer) {
    mc.world.sendMessage("§c対戦プレイヤーが見つかりません。強制終了する場合は§a/mcg:reset§cを実行してください。");
    return;
  }

  switchButtons(turnPlayer, notTurnPlayer);
  switchTurnTag(turnPlayer, notTurnPlayer);
  grantTurnAct(turnPlayer, notTurnPlayer);
  cleanupDroppedItems(turnPlayer);
  applyTurnEffects(turnPlayer, notTurnPlayer);
  convertMobsToBact(notTurnPlayer);
  handleRaidMode(notTurnPlayer);
  cleanupTurnPlayerItems(turnPlayer);
  distributeTurnItems(notTurnPlayer);
  showTurnChangeTitles(turnPlayer, notTurnPlayer);
  
  notTurnPlayer.playSound("random.levelup", { location: notTurnPlayer.location });
  ui.uiManager.closeAllForms(turnPlayer);
}

/**
 * ボタンを切り替え
 * @param {mc.Player} turnPlayer
 * @param {mc.Player} notTurnPlayer
 */
function switchButtons(turnPlayer, notTurnPlayer) {
  const turnButtons = turnPlayer.hasTag("red") ? mcg.const.red.button : mcg.const.blue.button;
  const notTurnButtons = turnPlayer.hasTag("red") ? mcg.const.blue.button : mcg.const.red.button;

  Object.values(turnButtons).forEach(pos => {
    turnPlayer.dimension.setBlockType(pos, "minecraft:air");
  });
  Object.values(notTurnButtons).forEach(pos => {
    notTurnPlayer.dimension.setBlockPermutation(pos, button_permutation);
  });
}

/**
 * ターンタグを切り替え
 * @param {mc.Player} turnPlayer
 * @param {mc.Player} notTurnPlayer
 */
function switchTurnTag(turnPlayer, notTurnPlayer) {
  turnPlayer.removeTag("turn");
  notTurnPlayer.addTag("turn");
}

/**
 * ターン開始・終了のactを付与
 * @param {mc.Player} turnPlayer
 * @param {mc.Player} notTurnPlayer
 */
function grantTurnAct(turnPlayer, notTurnPlayer) {
  addAct(turnPlayer, mc.world.getDynamicProperty("end_act"));
  sendPlayerMessage(turnPlayer, "act+" + mc.world.getDynamicProperty("end_act"));
  addAct(notTurnPlayer, mc.world.getDynamicProperty("start_act"));
  sendPlayerMessage(notTurnPlayer, "act+" + mc.world.getDynamicProperty("start_act"));
}

/**
 * ドロップアイテムを消去
 * @param {mc.Player} turnPlayer
 */
function cleanupDroppedItems(turnPlayer) {
  turnPlayer.dimension.getEntities({ type: "minecraft:item", excludeTags: ["give"] }).forEach(item => {
    item.kill();
  });
}

/**
 * ターン経過時の効果を適用
 * @param {mc.Player} turnPlayer
 * @param {mc.Player} notTurnPlayer
 */
function applyTurnEffects(turnPlayer, notTurnPlayer) {
  // ポーション効果削除
  turnPlayer.removeEffect(mc.EffectTypes.get("minecraft:absorption"));

  // 泣く黒曜石効果
  const oppositeTeam = turnPlayer.hasTag("red") ? "blue" : "red";
  mc.world.getDimension("minecraft:overworld").getEntities({
    excludeTypes: ["minecraft:player"],
    tags: [oppositeTeam, "call_pigman"]
  }).forEach(entity => {
    entity.removeTag("call_pigman");
  });

  // モブ効果
  mc.world.getDimension("minecraft:overworld").getEntities({
    families: ["mob"],
    excludeTypes: ["minecraft:player"]
  }).forEach(entity => {
    turnMob[entity.typeId.slice(10)]?.run(notTurnPlayer, turnPlayer, entity);
  });

  // オブジェクト効果
  const dimension = mc.world.getDimension("minecraft:overworld");
  turnObject[dimension.getBlock(mcg.const.red.slot.object).typeId.slice(10)]?.run(notTurnPlayer, turnPlayer, "red");
  turnObject[dimension.getBlock(mcg.const.blue.slot.object).typeId.slice(10)]?.run(notTurnPlayer, turnPlayer, "blue");

  // アイテム効果
  turnItem(notTurnPlayer, turnPlayer);
}

/**
 * モブをBactと攻撃力に変換
 * @param {mc.Player} notTurnPlayer
 */
function convertMobsToBact(notTurnPlayer) {
  const playerTeam = notTurnPlayer.hasTag("red") ? "red" : "blue";
  
  mc.world.getDimension("minecraft:overworld").getEntities({
    excludeTypes: ["minecraft:player", "minecraft:armor_stand"],
    tags: [playerTeam]
  }).forEach(entity => {
    let info = getCard(entity.typeId);
    if (entity.hasTag("enhance")) {
      info = info?.enhance;
    }
    if (info) {
      addAct(notTurnPlayer, parseInt(info.Bact));
      giveSword(notTurnPlayer, info.atk, { translate: `entity.${entity.typeId.slice(10)}.name` });
      lineParticle(
        notTurnPlayer.dimension,
        entity.location,
        notTurnPlayer.location,
        "mcg:custom_explosion_emitter",
        1.0,
        createColor(mcg.const.rgb[playerTeam])
      );
    }
  });
}

/**
 * 襲撃モードの処理
 * @param {mc.Player} notTurnPlayer
 */
function handleRaidMode(notTurnPlayer) {
  if (notTurnPlayer.hasTag("raid")) {
    setAct(notTurnPlayer, RAID_MODE.ACT_RESET);
    sendPlayerMessage(notTurnPlayer, "[襲撃モード] actリセット");
    giveSword(notTurnPlayer, RAID_MODE.SWORD_DAMAGE, "襲撃モード");
    giveItem(notTurnPlayer, new mc.ItemStack("minecraft:grass_block"));
    sendPlayerMessage(notTurnPlayer, "[襲撃モード] 草ブロックを獲得");
  }
}

/**
 * ターン終了プレイヤーのアイテムをクリーンアップ
 * @param {mc.Player} turnPlayer
 */
function cleanupTurnPlayerItems(turnPlayer) {
  const container = turnPlayer.getComponent(mc.EntityInventoryComponent.componentId).container;
  const itemsToRemove = ["minecraft:compass", "minecraft:arrow", "minecraft:snowball", "minecraft:iron_axe", "minecraft:trident"];
  
  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);
    if (!item) continue;
    
    if (itemsToRemove.includes(item.typeId)) {
      container.setItem(i);
    } else if (item.typeId !== "minecraft:wooden_sword" && item.typeId.includes("sword")) {
      container.setItem(i);
    }
  }

  // オフハンドの矢を削除
  const offhandItem = turnPlayer.getComponent(mc.EntityEquippableComponent.componentId).getEquipment(mc.EquipmentSlot.Offhand);
  if (offhandItem?.typeId === "minecraft:arrow") {
    turnPlayer.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Offhand);
  }
}

/**
 * ターン開始アイテムを配布
 * @param {mc.Player} notTurnPlayer
 */
function distributeTurnItems(notTurnPlayer) {
  setTime(mc.world.getDynamicProperty("time"));
  mc.world.setDynamicProperty("turn", mc.world.getDynamicProperty("turn") + 1);
  
  giveItem(notTurnPlayer, new mc.ItemStack("minecraft:compass"));
  giveItem(notTurnPlayer, new mc.ItemStack("minecraft:grass_block"));
}

/**
 * ターン切り替えのタイトルを表示
 * @param {mc.Player} turnPlayer
 * @param {mc.Player} notTurnPlayer
 */
function showTurnChangeTitles(turnPlayer, notTurnPlayer) {
  const turn = mc.world.getDynamicProperty("turn");
  
  turnPlayer.onScreenDisplay.setTitle("Turn End", { 
    fadeInDuration: TITLE_CONFIG.FADE_IN, 
    stayDuration: TITLE_CONFIG.STAY, 
    fadeOutDuration: TITLE_CONFIG.FADE_OUT 
  });
  notTurnPlayer.onScreenDisplay.setTitle("Your Turn", { 
    fadeInDuration: TITLE_CONFIG.FADE_IN, 
    stayDuration: TITLE_CONFIG.STAY, 
    fadeOutDuration: TITLE_CONFIG.FADE_OUT 
  });
  turnPlayer.onScreenDisplay.updateSubtitle(`Turn ${turn}`);
  notTurnPlayer.onScreenDisplay.updateSubtitle(`Turn ${turn}`);

  mc.world.getPlayers({ excludeTags: ["red", "blue"] }).forEach(player => {
    const titleColor = notTurnPlayer.hasTag("red") ? "§cRed Turn" : "§bBlue Turn";
    player.onScreenDisplay.setTitle(titleColor, { 
      fadeInDuration: TITLE_CONFIG.FADE_IN, 
      stayDuration: TITLE_CONFIG.STAY, 
      fadeOutDuration: TITLE_CONFIG.FADE_OUT 
    });
    player.onScreenDisplay.updateSubtitle(`Turn ${turn}`);
  });
}

// ========== 勝敗判定 ==========

mc.world.afterEvents.entityDie.subscribe(data => {
  if (mc.world.getDynamicProperty("status") !== 2) return;

  const loser = data.deadEntity;
  if (loser.typeId !== "minecraft:player") return;

  const winner = mc.world.getPlayers({ tags: [loser.hasTag("red") ? "blue" : "red"] })[0];
  if (!winner) {
    mc.world.sendMessage("§c勝利プレイヤーが見つからなかったため、強制終了します。");
    reset();
    return;
  }

  handleGameEnd(winner, loser);
});

/**
 * ゲーム終了処理
 * @param {mc.Player} winner
 * @param {mc.Player} loser
 */
function handleGameEnd(winner, loser) {
  mc.world.setDynamicProperty("status", GAME_STATUS.ENDING);
  winner.teleport(LOBBY_COORDS.WINNER_RETURN);

  mc.world.sendMessage(`${getPlayerColoredName(winner)}が勝利しました。`);

  // タイトル表示
  winner.onScreenDisplay.setTitle("§bYOU WIN!", { 
    fadeInDuration: TITLE_CONFIG.FADE_IN, 
    stayDuration: TITLE_CONFIG.STAY, 
    fadeOutDuration: TITLE_CONFIG.FADE_OUT 
  });
  loser.onScreenDisplay.setTitle("§cYOU LOSE…", { 
    fadeInDuration: TITLE_CONFIG.FADE_IN, 
    stayDuration: TITLE_CONFIG.STAY, 
    fadeOutDuration: TITLE_CONFIG.FADE_OUT 
  });
  
  mc.world.getPlayers({ excludeTags: ["red", "blue"] }).forEach(player => {
    const title = winner.hasTag("red") ? "§cRED WIN" : "§bBLUE WIN";
    player.onScreenDisplay.setTitle(title, { 
      fadeInDuration: TITLE_CONFIG.FADE_IN, 
      stayDuration: TITLE_CONFIG.STAY, 
      fadeOutDuration: TITLE_CONFIG.FADE_OUT 
    });
  });

  // プレイヤークリーンアップ
  [winner, loser].forEach(player => {
    ["red", "blue", "turn", "nether", "raid", "genocide"].forEach(tag => player.removeTag(tag));
    player.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
    player.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  });

  winner.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  mc.EffectTypes.getAll().forEach(effect => winner.removeEffect(effect));

  // スコアリセット
  mc.world.scoreboard.getObjective("act").removeParticipant(winner);
  mc.world.scoreboard.getObjective("act").removeParticipant(loser);
  setTime(0);

  clearGameField();

  // エンティティ削除
  mc.world.getDimension("minecraft:overworld").getEntities({ excludeTypes: ["minecraft:player"] }).forEach(entity => {
    entity.kill();
  });

  // カメラリセット
  mc.world.getPlayers().forEach(player => {
    player.camera.clear();
  });

  myTimeout(60, () => {
    mc.world.setDynamicProperty("status", 0);
  });
}

// ========== サレンダー ==========

mc.world.afterEvents.buttonPush.subscribe(data => {
  const { source, block } = data;
  if (block.typeId !== "minecraft:spruce_button") return;
  if (source.typeId !== "minecraft:player") return;

  const surrenderForm = new ui.MessageFormData()
    .title("§l§cサレンダー")
    .body("降参しようとしています。\n本当によろしいですか?")
    .button1("§l§cはい")
    .button2("§lいいえ");

  surrenderForm.show(source).then(res => {
    if (res.canceled || res.selection === 1) return;
    if (res.selection === 0) {
      mc.world.sendMessage("サレンダーボタンが押されました。");
      source.kill();
    }
  });
});

// ========== テスト用 ==========

mc.system.afterEvents.scriptEventReceive.subscribe(data => {
  if (data.id !== "mcg:test") return;
  mc.world.sendMessage("test runed.");
  const player = data.sourceEntity;
  let inv = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  let targetItems = [
    "minecraft:white_wool",
    "minecraft:red_wool",
    "minecraft:yellow_wool",
    "minecraft:pink_wool",
    "minecraft:green_wool",
  ];
  while (true) {
    let index = undefined;
    mc.world.sendMessage("run");
    for (let i = 0; i < targetItems.length; i++) {
      index = findItem(targetItems[i], inv);
      mc.world.sendMessage(`${index}`);
      if(index !== undefined) break;
    }
    if (index === undefined) break;
    inv.setItem(index, new mc.ItemStack("minecraft:black_wool", inv.getItem(index).amount));
  }
});
