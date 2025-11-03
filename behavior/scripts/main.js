import * as mc from "@minecraft/server";
import { drawList, cardList } from "./cardinfo";
import { cardInfo, getEntityDisplayName } from "./lib";
import "./system";
import "./button";
import "./craft";
import "./config";
import "./rulebook";
import "./die";
import { mcg } from "./system";
import { VIEW_DISTANCE, EXCLUDE_TYPES, HP_DISPLAY, ALLOWED_ITEMS } from "./constants";

/**
 * 
 * @param {mc.Player} player 
 */
function hasSpyglass(player) {
  const mainhand = player.getComponent(mc.EntityEquippableComponent.componentId).getEquipment(mc.EquipmentSlot.Mainhand);
  return mainhand?.typeId == "minecraft:spyglass";
}

/**
 * プレイヤーが見ているターゲットの情報を表示
 * @param {mc.Player} player 
 */
function updatePlayerDisplay(player) {
  const target = getViewTarget(player);
  
  if (target) {
    displayTargetInfo(player, target);
  } else {
    displayBlockInfo(player);
  }
}

/**
 * プレイヤーの視線先のエンティティを取得
 * @param {mc.Player} player 
 * @returns {mc.Entity | undefined}
 */
function getViewTarget(player) {
  return player.getEntitiesFromViewDirection({
    maxDistance: VIEW_DISTANCE.ENTITY,
    ignoreBlockCollision: true,
    excludeTypes: EXCLUDE_TYPES.DROPPED_ITEMS
  }).find((e) => {
    return (e.entity.typeId != "minecraft:player" ||
      mc.world.getPlayers().find(p => p.id == e.entity.id)?.getGameMode() != mc.GameMode.Spectator
    );
  })?.entity;
}

/**
 * ターゲットエンティティの情報を表示
 * @param {mc.Player} player 
 * @param {mc.Entity} target 
 */
function displayTargetInfo(player, target) {
  if (hasSpyglass(player) == false) return;
  const hp = target.getComponent(mc.EntityHealthComponent.componentId);
  if (!hp) return;

  const displayName = getEntityDisplayName(target);
  const statusTags = getStatusTags(target);
  
  player.onScreenDisplay.setActionBar([
    ...displayName,
    ` ${Math.floor(hp.currentValue * HP_DISPLAY.DECIMAL_PLACES) / HP_DISPLAY.DECIMAL_PLACES}/${Math.floor(hp.defaultValue * HP_DISPLAY.DECIMAL_PLACES) / HP_DISPLAY.DECIMAL_PLACES} `,
    ...statusTags,
    "\n",
    cardInfo(target.typeId, target.hasTag("enhance")).join("\n")
  ]);
}

/**
 * エンティティの状態タグを取得
 * @param {mc.Entity} target 
 * @returns {string[]}
 */
function getStatusTags(target) {
  const tags = [];
  if (target.hasTag("protect")) tags.push("§2除外無効 ");
  if (target.hasTag("guard")) tags.push("§2ガード ");
  if (target.hasTag("fly")) tags.push("§2浮遊 ");
  if (target.hasTag("call_pigman")) tags.push("§2呼び声 ");
  if (target.hasTag("ace")) tags.push("§2大将 ");
  return tags;
}

/**
 * プレイヤーが見ているブロックの情報を表示
 * @param {mc.Player} player 
 */
function displayBlockInfo(player) {
  const block = player.getBlockFromViewDirection({
    excludeTypes: EXCLUDE_TYPES.BARRIER_BUTTONS,
    maxDistance: VIEW_DISTANCE.BLOCK
  })?.block;

  if (!block) return;

  if (isObjectCard(block)) {
    displayObjectCard(player, block);
  } else if (isWoolCard(block)) {
    displayWoolCard(player, block);
  } else if (player.hasTag("red") || player.hasTag("blue")) {
    displayDrawInfo(player, block);
  }
}

/**
 * ブロックがオブジェクトカードかどうか
 * @param {mc.Block} block 
 * @returns {boolean}
 */
function isObjectCard(block) {
  return cardList.some((e) => e.name.includes(block.typeId) && e.attribute.includes("オブジェクト"));
}

/**
 * ブロックが羊毛カードかどうか
 * @param {mc.Block} block 
 * @returns {boolean}
 */
function isWoolCard(block) {
  return cardList.some((e) => e.name.includes(block.typeId) && block.typeId.includes("wool"));
}

/**
 * オブジェクトカードの情報を表示
 * @param {mc.Player} player 
 * @param {mc.Block} block 
 */
function displayObjectCard(player, block) {
  if (hasSpyglass(player) == false) return;
  player.onScreenDisplay.setActionBar([
    { translate: block.localizationKey },
    "\n",
    cardInfo(block.typeId).join("\n")
  ]);
}

/**
 * 羊毛カードの情報を表示
 * @param {mc.Player} player 
 * @param {mc.Block} block 
 */
function displayWoolCard(player, block) {
  if (hasSpyglass(player) == false) return;
  player.onScreenDisplay.setActionBar([
    { translate: block.localizationKey },
    "\n",
    cardInfo(block.typeId).join("\n")
  ]);
}

// 手に持ったカードの情報を表示
mc.world.afterEvents.playerHotbarSelectedSlotChange.subscribe(data => {
  const {itemStack, player, newSlotSelected, previousSlotSelected} = data;
  if (!itemStack) return;
  let text = cardInfo(itemStack.typeId);

  if (text.length > 0) {
    player.onScreenDisplay.setActionBar([itemStack?.nameTag ?? {translate: itemStack.localizationKey},"\n",text.join("\n")]);
  } else {
    player.onScreenDisplay.setActionBar(itemStack?.nameTag ?? {translate: itemStack.localizationKey});
  }
})

/**
 * ドロー可能なカードの情報を表示
 * @param {mc.Player} player 
 * @param {mc.Block} block 
 */
function displayDrawInfo(player, block) {
  const leverBlock = player.hasTag("red") ? mcg.const.red.lever : mcg.const.blue.lever;
  const high = player.dimension.getBlock(leverBlock).permutation.getState("open_bit");
  
  const drawInfo = getDrawInfo(block.typeId, high, player.hasTag("nether"), player.hasTag("genocide"));
  if (drawInfo) {
    player.onScreenDisplay.setActionBar(drawInfo);
  }
}

/**
 * ブロックタイプに応じたドロー情報を取得
 * @param {string} blockType 
 * @param {boolean} high 
 * @param {boolean} hasNether 
 * @param {boolean} hasGenocide
 * @returns {string | null}
 */
function getDrawInfo(blockType, high, hasNether, hasGenocide) {
  let text = "§bドロー可能なカード\n§3";
  
  switch (blockType) {
    case "minecraft:grass_block":
      return text + (high ? drawList.grass.high : drawList.grass.low).join("\n");
    case "minecraft:stone":
      return text + (high ? drawList.stone.high : drawList.stone.low).join("\n");
    case "minecraft:hay_block":
      return text + (high ? drawList.hay.high : drawList.hay.low).join("\n");
    case "minecraft:netherrack":
      const prefix = hasNether ? "" : "§cゾンビピッグマンかウィザースケルトンを召喚すると開放\n";
      return prefix + text + (high ? drawList.nether.high : drawList.nether.low).join("\n");
    case "minecraft:dark_oak_log":
      const prefi2 = hasGenocide ? "" : "§c一度でもHPが9以下になると解放\n";
      return prefi2 + text + (high ? drawList.genocide.high : drawList.genocide.low).join("\n");
    default:
      return null;
  }
}

/**
 * エンティティの名前タグ（HP表示）を更新
 */
function updateEntityNameTags() {
  mc.world.getDimension("overworld").getEntities({
    excludeTypes: EXCLUDE_TYPES.PLAYERS_ONLY,
    families: ["mob"]
  }).forEach(entity => {
    const hp = entity.getComponent(mc.EntityHealthComponent.componentId);
    const hpRatio = hp.currentValue / hp.effectiveMax;
    const greenBars = Math.floor(HP_DISPLAY.BAR_LENGTH * hpRatio);
    const redBars = HP_DISPLAY.BAR_LENGTH - greenBars;
    
    entity.nameTag = `${Math.floor(hp.currentValue * HP_DISPLAY.DECIMAL_PLACES) / HP_DISPLAY.DECIMAL_PLACES}/${hp.effectiveMax} §l§a${"|".repeat(greenBars)}§c${"|".repeat(redBars)}`;
  });
}

/**
 * ヴェックスの位置を固定
 */
function updateVexPosition() {
  mc.world.getDimension("overworld").getEntities({ type: "minecraft:vex" }).forEach(entity => {
    entity.teleport(entity.location, { keepVelocity: false });
  });
}

// メインループ
mc.system.runInterval(() => {
  const players = mc.world.getPlayers();
  players.forEach(player => {
    player.onScreenDisplay.setHudVisibility(mc.HudVisibility.Hide, [mc.HudElement.ItemText])
    updatePlayerDisplay(player);
  });
  
  updateEntityNameTags();
  updateVexPosition();
});

// ダメージイベント
mc.world.afterEvents.entityHurt.subscribe(data => {
  const entityName = getEntityDisplayName(data.hurtEntity);
  
  if (data.damageSource.cause == mc.EntityDamageCause.selfDestruct) {
    if (mc.world.getDynamicProperty("status") == 2) {
      mc.world.sendMessage(["[除外] ", ...entityName]);
    }
  } else {
    mc.world.sendMessage([...entityName, `に${Math.floor(data.damage * 10) / 10}ダメージ!`]);
  }
});

// アイテム使用制限
mc.world.beforeEvents.itemUse.subscribe(data => {
  if (!ALLOWED_ITEMS.includes(data.itemStack.typeId)) {
    data.cancel = true;
  }
});

//デバッグを開始
//"/script debugger connect localhost 19144"
