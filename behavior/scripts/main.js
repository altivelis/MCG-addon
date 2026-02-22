import * as mc from "@minecraft/server";
import { cardList } from "./cardinfo";
import { cardInfo, getDisplayName, getEntityDisplayName, getItemCount } from "./lib";
import "./system";
import "./button";
import "./craft";
import "./rulebook";
import "./die";
import "./commands/index";
import { mcg } from "./system";
import { VIEW_DISTANCE, EXCLUDE_TYPES, HP_DISPLAY, ALLOWED_ITEMS, ALL_ATTRIBUTES } from "./constants";
import { DRAW_CARDS } from "./button";
import { isDeckBanned } from "./deck-ban";

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
    (target.typeId == "minecraft:player") ? `\n海洋の心:${getItemCount(target, "minecraft:heart_of_the_sea")}` : "",
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
  for (const [tagName, displayName] of Object.entries(ALL_ATTRIBUTES)) {
    if (target.hasTag(tagName)) {
      tags.push(`§2${displayName} `);
    }
  }
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
  
  const drawInfo = getDrawInfo(player, block.typeId, high);
  if (drawInfo) {
    if (isDeckBanned(DRAW_CARDS[block.typeId]?.name)) {
      player.onScreenDisplay.setActionBar(`§c${DRAW_CARDS[block.typeId].name}デッキはBANされています`);
      return;
    }
    player.onScreenDisplay.setActionBar(drawInfo);
  }
}

/**
 * ブロックタイプに応じたドロー情報を取得
 * @param {mc.Player} player
 * @param {string} blockType 
 * @param {boolean} high
 * @returns {string | null}
 */
function getDrawInfo(player, blockType, high) {
  let text = "§bドロー可能なカード\n§3";
  
  let prefix = "";
  let info = DRAW_CARDS[blockType]
  if (info === undefined) return null;
  if (info.requiresTag && !player.hasTag(info.requiresTag)) {
    prefix = `§c${info.unlockConditions}\n`;
  }
  return prefix + text + (high ? info.high : info.low).map(item => getDisplayName(item)).join("\n");
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
 * 動いてしまうモブの位置を固定
 */
function updateEntityPosition() {
  mc.world.getDimension("overworld").getEntities().filter(e=>{
    return [
      "minecraft:vex",
      "minecraft:tropicalfish",
      "minecraft:guardian",
      "minecraft:dolphin",
      "minecraft:elder_guardian",
    ].includes(e.typeId)
  }).forEach(entity => {
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
  updateEntityPosition();
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
