import * as mc from "@minecraft/server";
import { mcg } from "./system";
import { giveItem, addAct, sendPlayerMessage, applyDamage, lineParticle, createColor, getAct, decrementSlot, setObject, getObject } from "./lib";

/**
 * カード使用の共通ヘルパー関数
 */

// ========== チーム判定ヘルパー ==========

/**
 * プレイヤーのチームを取得
 * @param {mc.Player} player
 * @returns {"red"|"blue"}
 */
export function getPlayerTeam(player) {
  return player.hasTag("red") ? "red" : "blue";
}

/**
 * 相手チームを取得
 * @param {mc.Player} player
 * @returns {"red"|"blue"}
 */
export function getOpponentTeam(player) {
  return player.hasTag("red") ? "blue" : "red";
}

/**
 * エンティティが指定プレイヤーと同じチームか判定
 * @param {mc.Entity} entity
 * @param {mc.Player} player
 * @returns {boolean}
 */
export function isSameTeam(entity, player) {
  const team = getPlayerTeam(player);
  return entity.hasTag(team);
}

/**
 * エンティティが指定プレイヤーと相手チームか判定
 * @param {mc.Entity} entity
 * @param {mc.Player} player
 * @returns {boolean}
 */
export function isOpponentTeam(entity, player) {
  const team = getOpponentTeam(player);
  return entity.hasTag(team);
}

// ========== スロット関連ヘルパー ==========

/**
 * スロット位置を取得
 * @param {mc.Player} player
 * @param {"B"|"W"|"R"} slot
 * @returns {mc.Vector3}
 */
export function getSlotPosition(player, slot) {
  const team = getPlayerTeam(player);
  const slotMap = { B: "blue", W: "white", R: "red" };
  return mcg.const[team].slot[slotMap[slot]];
}

/**
 * スロットタグを取得
 * @param {"B"|"W"|"R"} slot
 * @returns {"slotB"|"slotW"|"slotR"}
 */
export function getSlotTag(slot) {
  return `slot${slot}`;
}

/**
 * ブロックタイプからスロットを判定
 * @param {string} blockType
 * @returns {"B"|"W"|"R"|"P"|"O"|null}
 */
export function getSlotFromBlock(blockType) {
  const slotMap = {
    "minecraft:blue_concrete": "B",
    "minecraft:white_concrete": "W",
    "minecraft:red_concrete": "R",
    "minecraft:pink_concrete": "P",
    "minecraft:orange_concrete": "O"
  };
  return slotMap[blockType] || null;
}

/**
 * 指定スロットのモブを取得
 * @param {mc.Player} player
 * @param {"B"|"W"|"R"} slot
 * @param {object} options - 追加のフィルターオプション
 * @returns {mc.Entity[]}
 */
export function getMobsInSlot(player, slot, options = {}) {
  const team = getPlayerTeam(player);
  const slotTag = getSlotTag(slot);
  
  return mc.world.getDimension("minecraft:overworld").getEntities({
    excludeTypes: ["minecraft:player"],
    tags: [team, slotTag],
    ...options
  });
}

/**
 * 相手の指定スロットのモブを取得
 * @param {mc.Player} player
 * @param {"B"|"W"|"R"} slot
 * @param {object} options - 追加のフィルターオプション
 * @returns {mc.Entity[]}
 */
export function getOpponentMobsInSlot(player, slot, options = {}) {
  const team = getOpponentTeam(player);
  const slotTag = getSlotTag(slot);
  
  return mc.world.getDimension("minecraft:overworld").getEntities({
    excludeTypes: ["minecraft:player"],
    tags: [team, slotTag],
    ...options
  });
}

// ========== コスト・検証ヘルパー ==========

/**
 * actコストをチェック（オーバーコスト考慮）
 * @param {mc.Player} player
 * @param {number} cost
 * @param {boolean} allowOvercost
 * @returns {boolean}
 */
export function canPayCost(player, cost, allowOvercost = true) {
  if (allowOvercost) {
    return cost <= getAct(player) + 1;
  }
  return cost <= getAct(player);
}

/**
 * actコストを支払う
 * @param {mc.Player} player
 * @param {number} cost
 */
export function payCost(player, cost) {
  addAct(player, -cost);
  decrementSlot(player, player.selectedSlotIndex);
}

/**
 * スロットにモブが存在するかチェック
 * @param {mc.Player} player
 * @param {"B"|"W"|"R"} slot
 * @returns {boolean}
 */
export function isSlotOccupied(player, slot) {
  return getMobsInSlot(player, slot).length > 0;
}

// ========== エフェクト・ビジュアルヘルパー ==========

/**
 * カード使用時の共通エフェクト
 * @param {mc.Player} player
 * @param {mc.Vector3} targetLocation
 * @param {string} particleName
 */
export function playCardEffect(player, targetLocation, particleName = "mcg:custom_explosion_emitter") {
  const team = getPlayerTeam(player);
  const color = createColor(mcg.const.rgb[team]);
  
  lineParticle(player.dimension, player.location, targetLocation, particleName, 1.0, color);
  player.dimension.spawnParticle("mcg:knockback_roar_particle", targetLocation, color);
}

/**
 * ダメージメッセージを送信
 * @param {mc.Player} attacker
 * @param {mc.Entity} target
 * @param {string} weaponName
 */
export function sendDamageMessage(attacker, target, weaponName) {
  const attackerTeam = getPlayerTeam(attacker);
  const attackerColor = attackerTeam === "red" ? "§c" : "§b";
  const targetColor = attackerTeam === "red" ? "§b" : "§c";
  
  mc.world.sendMessage([
    attackerColor + attacker.nameTag + "§r=>" + targetColor,
    { translate: `entity.${target.typeId.slice(10)}.name` },
    `§r[${weaponName}]`
  ]);
}

// ========== アイテム配布ヘルパー ==========

/**
 * アイテムを配布してメッセージを表示
 * @param {mc.Player} player
 * @param {string} itemType
 * @param {number} amount
 * @param {string} displayName
 */
export function giveItemWithMessage(player, itemType, amount = 1, displayName = null) {
  giveItem(player, new mc.ItemStack(itemType), amount);
  const name = displayName || itemType.replace("minecraft:", "");
  const amountText = amount > 1 ? ` x${amount}` : "";
  player.sendMessage(`[入手] ${name}${amountText}`);
}

// ========== スロット操作ヘルパー ==========

/**
 * 複数スロットに対して処理を実行
 * @param {("B"|"W"|"R")[]} slots
 * @param {mc.Player} player
 * @param {Function} callback - (slot, mobs) => void
 * @param {object} filterOptions
 */
export function forEachSlot(slots, player, callback, filterOptions = {}) {
  slots.forEach(slot => {
    const mobs = getMobsInSlot(player, slot, filterOptions);
    if (mobs.length > 0) {
      callback(slot, mobs);
    }
  });
}

/**
 * 相手の複数スロットに対して処理を実行
 * @param {("B"|"W"|"R")[]} slots
 * @param {mc.Player} player
 * @param {Function} callback - (slot, mobs) => void
 * @param {object} filterOptions
 */
export function forEachOpponentSlot(slots, player, callback, filterOptions = {}) {
  slots.forEach(slot => {
    const mobs = getOpponentMobsInSlot(player, slot, filterOptions);
    if (mobs.length > 0) {
      callback(slot, mobs);
    }
  });
}

// ========== オブジェクト関連ヘルパー ==========

/**
 * プレイヤーのオブジェクトを取得
 * @param {mc.Player} player
 * @returns {mc.Block}
 */
export function getPlayerObject(player) {
  const team = getPlayerTeam(player);
  return getObject(team);
}

/**
 * 相手のオブジェクトを取得
 * @param {mc.Player} player
 * @returns {mc.Block}
 */
export function getOpponentObject(player) {
  const team = getOpponentTeam(player);
  return getObject(team);
}

// ========== チーム全体操作ヘルパー ==========

/**
 * プレイヤーのチームの全モブを取得
 * @param {mc.Player} player
 * @param {object} options
 * @returns {mc.Entity[]}
 */
export function getAllTeamMobs(player, options = {}) {
  const team = getPlayerTeam(player);
  return mc.world.getDimension("minecraft:overworld").getEntities({
    excludeTypes: ["minecraft:player"],
    tags: [team],
    ...options
  });
}

/**
 * 相手チームの全モブを取得
 * @param {mc.Player} player
 * @param {object} options
 * @returns {mc.Entity[]}
 */
export function getAllOpponentMobs(player, options = {}) {
  const team = getOpponentTeam(player);
  return mc.world.getDimension("minecraft:overworld").getEntities({
    excludeTypes: ["minecraft:player"],
    tags: [team],
    ...options
  });
}

/**
 * 相手プレイヤーを取得
 * @param {mc.Player} player
 * @returns {mc.Player[]}
 */
export function getOpponentPlayers(player) {
  const team = getOpponentTeam(player);
  return mc.world.getPlayers({ tags: [team] });
}

// ========== モブ召喚ヘルパー ==========

/**
 * モブを召喚して基本設定を行う
 * @param {mc.Player} player
 * @param {"B"|"W"|"R"} slot
 * @param {string} mobType
 * @param {object} options - { fly: boolean, guard: boolean, protect: boolean, water: boolean }
 * @returns {mc.Entity}
 */
export function summonMobInSlot(player, slot, mobType, options = {}) {
  const team = getPlayerTeam(player);
  const position = getSlotPosition(player, slot);
  const slotTag = getSlotTag(slot);
  
  const mob = mc.world.getDimension("minecraft:overworld").spawnEntity(mobType, position);
  mob.addTag(team);
  mob.addTag(slotTag);
  
  if (options.fly) {
    mob.addTag("fly");
    mob.teleport({ ...mob.location, y: mob.location.y + 1 });
  }
  if (options.guard) mob.addTag("guard");
  if (options.protect) mob.addTag("protect");
  if (options.water) mob.addTag("water");
  
  playCardEffect(player, mob.location);
  
  return mob;
}

// ========== 攻撃ヘルパー ==========

/**
 * スロット内の全モブに攻撃
 * @param {mc.Player} attacker
 * @param {"B"|"W"|"R"} targetSlot
 * @param {number} damage
 * @param {string} weaponName
 * @param {object} options
 */
export function attackSlot(attacker, targetSlot, damage, weaponName, options = {}) {
  const mobs = getOpponentMobsInSlot(attacker, targetSlot, {
    excludeTags: options.excludeTags || ["fly"]
  });
  
  mobs.forEach(mob => {
    sendDamageMessage(attacker, mob, weaponName);
    playCardEffect(attacker, mob.location);
    applyDamage(mob, damage);
    mob.dimension.playSound("random.glass", mob.location, { volume: 10 });
  });
}

/**
 * 全スロットに攻撃
 * @param {mc.Player} attacker
 * @param {number} damage
 * @param {string} weaponName
 */
export function attackAllSlots(attacker, damage, weaponName) {
  ["B", "W", "R"].forEach(slot => {
    attackSlot(attacker, slot, damage, weaponName);
  });
}

// ========== usecard.js専用ヘルパー ==========

/**
 * スロット位置に対応する処理を実行（BWR共通）
 * @param {string} blockType - ブロックタイプ
 * @param {mc.Player} player
 * @param {Function} bwrCallback - (slot) => void BWRスロット用の処理
 * @param {Function} pCallback - () => void Pスロット用の処理（オプション）
 * @param {Function} oCallback - () => void Oスロット用の処理（オプション）
 */
export function handleSlotAction(blockType, player, bwrCallback, pCallback = null, oCallback = null) {
  const slot = getSlotFromBlock(blockType);
  
  if (["B", "W", "R"].includes(slot)) {
    bwrCallback(slot);
  } else if (slot === "P" && pCallback) {
    pCallback();
  } else if (slot === "O" && oCallback) {
    oCallback();
  } else {
    return false; // 無効なスロット
  }
  return true;
}

/**
 * モブ召喚カードの共通処理
 * @param {string} blockType
 * @param {mc.Player} player
 * @param {string} mobType
 * @param {number} cost
 * @param {Function} onSummon - (mob, slot) => void
 * @returns {boolean} 成功したか
 */
export function handleMobSummon(blockType, player, mobType, cost, onSummon) {
  const slot = getSlotFromBlock(blockType);
  
  // P/Oスロットは不可
  if (!["B", "W", "R"].includes(slot)) {
    return false;
  }
  
  // スロット占有チェック
  if (isSlotOccupied(player, slot)) {
    return false;
  }
  
  // 召喚実行
  const mob = summonMobInSlot(player, slot, mobType);
  onSummon(mob, slot);
  
  return true;
}

/**
 * 指定スロットのモブを削除（ニンジン付きの棒用）
 * @param {mc.Player} player
 * @param {"B"|"W"|"R"} slot
 */
export function killMobsInSlot(player, slot) {
  const mobs = getMobsInSlot(player, slot);
  mobs.forEach(mob => {
    mob.dimension.playSound("random.fizz", mob.location, { volume: 10 });
    mob.kill();
  });
}

/**
 * 全スロット(B/W/R)に対してモブ削除処理を実行
 * @param {mc.Player} player
 * @param {string} blockType
 * @param {string} errorMessage
 * @param {Function} onSuccess
 */
export function handleKillMobInSlots(player, blockType, errorMessage, onSuccess) {
  const slot = getSlotFromBlock(blockType);
  
  if (!["B", "W", "R"].includes(slot)) {
    player.sendMessage(errorMessage);
    return;
  }
  
  const mobs = getMobsInSlot(player, slot);
  if (mobs.length === 0) {
    player.sendMessage(errorMessage);
    return;
  }
  
  onSuccess(slot, mobs);
}
