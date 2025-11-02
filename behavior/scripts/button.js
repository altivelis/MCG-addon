import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { mcg, turnChange } from "./system";
import { hasItem, decrementContainer, giveItem, handItem, addAct, sendPlayerMessage, isOnline, applyDamage, cardInfo, getCard } from "./lib";
import { useCard } from "./usecard";
import { ERROR_MESSAGES, SPECTATOR_COORDS, LOBBY_COORDS } from "./constants";

// ========== ドローカードデータ ==========

const DRAW_CARDS = {
  "minecraft:grass_block": {
    low: [
      { item: "minecraft:pig_spawn_egg", name: "ブタ" },
      { item: "minecraft:villager_spawn_egg", name: "村人" },
      { item: "minecraft:chest", name: "チェスト" },
      { item: "minecraft:carved_pumpkin", name: "くり抜かれたカボチャ" }
    ],
    high: [
      { item: "minecraft:wolf_spawn_egg", name: "オオカミ" },
      { item: "minecraft:bell", name: "鐘" },
      { item: "minecraft:allay_spawn_egg", name: "アレイ" },
      { item: "minecraft:panda_spawn_egg", name: "パンダ" }
    ]
  },
  "minecraft:stone": {
    low: [
      { item: "minecraft:zombie_spawn_egg", name: "ゾンビ" },
      { item: "minecraft:skeleton_spawn_egg", name: "スケルトン" },
      { item: "minecraft:creeper_spawn_egg", name: "クリーパー" },
      { item: "minecraft:witch_spawn_egg", name: "ウィッチ" }
    ],
    high: [
      { item: "minecraft:mob_spawner", name: "モンスタースポナー" },
      { item: "minecraft:phantom_spawn_egg", name: "ファントム" },
      { item: "minecraft:breeze_spawn_egg", name: "ブリーズ" },
      { item: "minecraft:ender_chest", name: "エンダーチェスト" }
    ]
  },
  "minecraft:hay_block": {
    low: [
      { item: "minecraft:chicken_spawn_egg", name: "ニワトリ" },
      { item: "minecraft:parrot_spawn_egg", name: "オウム" },
      { item: "minecraft:bee_nest", name: "ミツバチの巣" },
      { item: "minecraft:composter", name: "コンポスター" }
    ],
    high: [
      { item: "minecraft:fox_spawn_egg", name: "キツネ" },
      { item: "minecraft:frog_spawn_egg", name: "カエル" },
      { item: "minecraft:mooshroom_spawn_egg", name: "ムーシュルーム" },
      { item: "minecraft:polar_bear_spawn_egg", name: "シロクマ" }
    ]
  },
  "minecraft:netherrack": {
    low: [
      { item: "minecraft:zombie_pigman_spawn_egg", name: "ゾンビピッグマン" },
      { item: "minecraft:wither_skeleton_spawn_egg", name: "ウィザースケルトン" },
      { item: "minecraft:crying_obsidian", name: "泣く黒曜石" },
      { item: "minecraft:wither_rose", name: "ウィザーローズ" }
    ],
    high: [
      { item: "minecraft:strider_spawn_egg", name: "ストライダー" },
      { item: "minecraft:lava_bucket", name: "溶岩バケツ" },
      { item: "minecraft:potato", name: "ジャガイモ" },
      { item: "minecraft:netherite_ingot", name: "ネザライトインゴット" }
    ],
    requiresTag: "nether",
    lockMessage: ERROR_MESSAGES.NETHER_LOCKED
  },
  "minecraft:dark_oak_log": {
    low: [
      { item: "minecraft:pillager_spawn_egg", name: "略奪者" },
      { item: "minecraft:trapped_chest", name: "トラップチェスト" },
      { item: "minecraft:vindicator_spawn_egg", name: "ヴィンディケーター" },
      { item: "minecraft:goat_horn", name: "ヤギの角笛" }
    ],
    high: [
      { item: "minecraft:evoker_spawn_egg", name: "エヴォーカー" },
      { item: "minecraft:armor_stand", name: "防具立て" },
      { item: "minecraft:ravager_spawn_egg", name: "ラヴェジャー" },
      { item: "minecraft:banner", name: "不吉な旗" }
    ],
    requiresTag: "genocide",
    lockMessage: ERROR_MESSAGES.GENOCIDE_LOCKED
  }
};

// ========== ドロー処理 ==========

/**
 * ドロー前の検証
 * @param {mc.Player} source 
 * @returns {boolean}
 */
function validateDraw(source) {
  if (!(source.hasTag("red") || source.hasTag("blue"))) return false;
  
  if (!source.hasTag("turn")) {
    source.sendMessage(ERROR_MESSAGES.NOT_YOUR_TURN);
    return false;
  }
  
  if (!hasItem(source, "minecraft:grass_block")) {
    source.sendMessage(ERROR_MESSAGES.NO_GRASS_BLOCK);
    return false;
  }
  
  return true;
}

/**
 * ドロー共通処理
 * @param {mc.Player} source 
 * @param {mc.Block} drawBlock 
 * @param {boolean} high 
 */
function performDraw(source, drawBlock, high) {
  const cardData = DRAW_CARDS[drawBlock.typeId];
  if (!cardData) return;

  // 解放条件チェック
  if (cardData.requiresTag && !source.hasTag(cardData.requiresTag)) {
    source.sendMessage(cardData.lockMessage);
    return;
  }

  // アイテム消費
  decrementContainer(source, "minecraft:grass_block");
  decrementContainer(source, "minecraft:packed_ice");

  // ブレイズダメージチェック
  checkBlazeEffect(source);

  // カードを引く
  const cards = high ? cardData.high : cardData.low;
  const randomIndex = Math.floor(Math.random() * cards.length);
  const selectedCard = cards[randomIndex];

  giveItem(source, new mc.ItemStack(selectedCard.item));
  source.sendMessage("ドロー: " + selectedCard.name);

  // アレイボーナス
  checkAllayBonus(source);
}

/**
 * ブレイズの効果をチェック
 * @param {mc.Player} source 
 */
function checkBlazeEffect(source) {
  const oppositeTeam = source.hasTag("red") ? "blue" : "red";
  const blazeExists = mc.world.getDimension("minecraft:overworld")
    .getEntities({ type: "minecraft:blaze", tags: [oppositeTeam] }).length > 0;

  if (blazeExists) {
    applyDamage(source, 1, { cause: mc.EntityDamageCause.fire });
  }
}

/**
 * アレイボーナスをチェック
 * @param {mc.Player} source 
 */
function checkAllayBonus(source) {
  const playerTeam = source.hasTag("red") ? "red" : "blue";
  const allayExists = mc.world.getDimension("minecraft:overworld")
    .getEntities({ type: "minecraft:allay", tags: [playerTeam] }).length > 0;

  if (allayExists) {
    addAct(source, 4);
    sendPlayerMessage(source, "[アレイ] act+4");
  }
}

// ========== ドローボタン処理 ==========

mc.world.afterEvents.buttonPush.subscribe(data => {
  const { source, block, dimension } = data;
  if (block.typeId !== "minecraft:stone_button") return;
  if (source.typeId !== "minecraft:player") return;

  block.setPermutation(mc.BlockPermutation.resolve("minecraft:stone_button", { "facing_direction": 1 }));

  if (!validateDraw(source)) return;

  const drawBlock = block.below();
  const leverPos = source.hasTag("red") ? mcg.const.red.lever : mcg.const.blue.lever;
  const high = dimension.getBlock(leverPos).permutation.getState("open_bit");

  performDraw(source, drawBlock, high);
});

// ========== カード使用処理 ==========

/**
 * コンパス確認ダイアログを表示
 * @param {mc.Player} source 
 */
function showCompassDialog(source) {
  const compassForm = new ui.MessageFormData()
    .title("§l§cターンを終了しようとしています")
    .body("本当にターンを終了しますか？")
    .button1("§l§cはい")
    .button2("§lいいえ");

  compassForm.show(source).then(res => {
    if (res.canceled || res.selection === 1) return;
    if (res.selection === 0 && source.hasTag("turn")) {
      turnChange();
    }
  });
}

/**
 * カード使用の検証
 * @param {mc.Player} source 
 * @returns {boolean}
 */
function validateCardUse(source) {
  if (!isOnline()) {
    source.sendMessage(ERROR_MESSAGES.WAIT_FOR_OPPONENT);
    return false;
  }

  if (!(source.hasTag("red") || source.hasTag("blue"))) return false;

  if (!source.hasTag("turn")) {
    source.sendMessage(ERROR_MESSAGES.NOT_YOUR_TURN);
    return false;
  }

  return true;
}

mc.world.afterEvents.buttonPush.subscribe(async data => {
  const { source, block } = data;
  if (block.typeId !== "minecraft:wooden_button") return;
  if (!(source instanceof mc.Player)) return;

  block.setPermutation(mc.BlockPermutation.resolve("minecraft:wooden_button", { "facing_direction": 1 }));

  if (!validateCardUse(source)) return;

  let item = handItem(source);
  if (item === undefined) {
    let container = source.getComponent(mc.EntityInventoryComponent.componentId).container;
    let selectItemForm = new ui.ActionFormData()
      .title("カード選択")
      .body("手に持っているカードがありません。インベントリから使用するカードを選択してください。");
    for(let i=0; i<container.size; i++) {
      let slotItem = container.getItem(i);
      if (slotItem) {
        let info = cardInfo(slotItem.typeId);
        if (info.length > 0) {
          selectItemForm.button({rawtext: [slotItem?.nameTag ? {text: slotItem.nameTag} : {translate: slotItem.localizationKey}, {text: "\n"}, {text: info.join("\n")}]}, getCard(slotItem.typeId)?.texture);
        } else {
          selectItemForm.button({rawtext: [slotItem?.nameTag ? {text: slotItem.nameTag} : {translate: slotItem.localizationKey}]});
        }
      } else {
        selectItemForm.button(" ")
      }
    }
    await selectItemForm.show(source).then(res => {
      if (res.canceled) return;
      let index = res.selection;
      let titem = container.getItem(index);
      if (titem && cardInfo(titem.typeId).length > 0) {
        container.swapItems(index, source.selectedSlotIndex, container);
        item = handItem(source);
      }
    })
  }
  if (item === undefined) return;

  // コンパスの場合
  if (item.typeId === "minecraft:compass") {
    showCompassDialog(source);
    return;
  }

  const cardBlock = block.below();

  // 氷塊制限チェック
  if (hasItem(source, "minecraft:packed_ice") && cardBlock.typeId === "minecraft:pink_concrete") {
    source.sendMessage(ERROR_MESSAGES.ICE_RESTRICTION);
    return;
  }

  // カード使用
  const itemType = handItem(source)?.typeId;
  const cardKey = itemType.includes("minecraft:") ? itemType.slice(10) : itemType.slice(4);
  useCard[cardKey]?.run(cardBlock, source);
});

// ========== 観戦モード処理 ==========

const SPECTATOR_TELEPORTS = {
  [`${SPECTATOR_COORDS.LOBBY_TO_SPECTATOR.x} ${SPECTATOR_COORDS.LOBBY_TO_SPECTATOR.y} ${SPECTATOR_COORDS.LOBBY_TO_SPECTATOR.z}`]: { // ロビー => 観戦席
    action: (player) => {
      player.teleport(LOBBY_COORDS.SPECTATOR);
      giveItem(player, new mc.ItemStack("minecraft:spyglass"));
    }
  },
  [`${SPECTATOR_COORDS.SPECTATOR_TO_LOBBY.x} ${SPECTATOR_COORDS.SPECTATOR_TO_LOBBY.y} ${SPECTATOR_COORDS.SPECTATOR_TO_LOBBY.z}`]: { // 観戦 => ロビー
    action: (player) => {
      player.teleport(LOBBY_COORDS.WINNER_RETURN);
      decrementContainer(player, "minecraft:spyglass");
    }
  },
  [`${SPECTATOR_COORDS.ARENA_EXITS[0].x} ${SPECTATOR_COORDS.ARENA_EXITS[0].y} ${SPECTATOR_COORDS.ARENA_EXITS[0].z}`]: { // アリーナ出口1
    action: (player) => {
      player.teleport(LOBBY_COORDS.WINNER_RETURN);
      decrementContainer(player, "minecraft:spyglass");
    }
  },
  [`${SPECTATOR_COORDS.ARENA_EXITS[1].x} ${SPECTATOR_COORDS.ARENA_EXITS[1].y} ${SPECTATOR_COORDS.ARENA_EXITS[1].z}`]: { // アリーナ出口2
    action: (player) => {
      player.teleport(LOBBY_COORDS.WINNER_RETURN);
      decrementContainer(player, "minecraft:spyglass");
    }
  },
  [`${SPECTATOR_COORDS.ARENA_EXITS[2].x} ${SPECTATOR_COORDS.ARENA_EXITS[2].y} ${SPECTATOR_COORDS.ARENA_EXITS[2].z}`]: { // アリーナ出口3
    action: (player) => {
      player.teleport(LOBBY_COORDS.WINNER_RETURN);
      decrementContainer(player, "minecraft:spyglass");
    }
  },
  [`${SPECTATOR_COORDS.ARENA_EXITS[3].x} ${SPECTATOR_COORDS.ARENA_EXITS[3].y} ${SPECTATOR_COORDS.ARENA_EXITS[3].z}`]: { // アリーナ出口4
    action: (player) => {
      player.teleport(LOBBY_COORDS.WINNER_RETURN);
      decrementContainer(player, "minecraft:spyglass");
    }
  },
  [`${SPECTATOR_COORDS.SPECTATOR_MODE_TOGGLE.x} ${SPECTATOR_COORDS.SPECTATOR_MODE_TOGGLE.y} ${SPECTATOR_COORDS.SPECTATOR_MODE_TOGGLE.z}`]: { // スペクテイターモード切替
    action: (player) => {
      player.setGameMode(mc.GameMode.Spectator);
    }
  }
};

mc.world.beforeEvents.playerInteractWithBlock.subscribe(data => {
  const { block, isFirstEvent, player } = data;
  if (!isFirstEvent) return;

  const blockPos = `${block.location.x} ${block.location.y} ${block.location.z}`;
  const teleportData = SPECTATOR_TELEPORTS[blockPos];

  if (teleportData) {
    data.cancel = true;
    mc.system.run(() => {
      teleportData.action(player);
    });
  }
});

// スペクテイターモード自動復帰
mc.system.runInterval(() => {
  mc.world.getDimension("minecraft:overworld")
    .getPlayers({ gameMode: mc.GameMode.Spectator, location: { x: 0, y: 12, z: -13 }, maxDistance: 2 })
    .forEach(player => {
      player.setGameMode(mc.GameMode.Adventure);
      player.teleport(LOBBY_COORDS.SPECTATOR);
    });
});

// ========== コンパス直接使用 ==========

mc.world.afterEvents.itemUse.subscribe(data => {
  const { source, itemStack } = data;
  if (itemStack.typeId !== "minecraft:compass") return;
  if (!(source.hasTag("red") || source.hasTag("blue"))) return;
  if (!source.hasTag("turn")) return;

  showCompassDialog(source);
});
