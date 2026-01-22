import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { cardInfo, getCard, getDisplayName } from "./lib";

// ========== カードライブラリデータ ==========

export const cardLibrary = {
  normal: [
    "minecraft:wither_skeleton_skull",
    "minecraft:wooden_sword",
    "minecraft:stone_sword",
    "minecraft:golden_sword",
    "minecraft:iron_sword",
    "minecraft:diamond_sword",
    "minecraft:netherite_sword",
    "minecraft:wooden_pickaxe",
    "minecraft:stone_pickaxe",
    "minecraft:iron_pickaxe",
    "minecraft:coal",
    "minecraft:cobblestone",
    "minecraft:iron_ingot",
    "minecraft:diamond",
    "minecraft:carrot_on_a_stick",
    "minecraft:arrow"
  ],
  overworld: {
    low: [
      "minecraft:pig",
      "minecraft:villager_v2",
      "minecraft:chest",
      "minecraft:carved_pumpkin"
    ],
    high: [
      "minecraft:wolf",
      "minecraft:bell",
      "minecraft:allay",
      "minecraft:panda"
    ],
    other: [
      "minecraft:porkchop",
      "minecraft:cooked_porkchop",
      "minecraft:snow_golem",
      "minecraft:iron_golem",
      "minecraft:lit_pumpkin"
    ]
  },
  cave: {
    low: [
      "minecraft:zombie",
      "minecraft:skeleton",
      "minecraft:creeper",
      "minecraft:witch"
    ],
    high: [
      "minecraft:mob_spawner",
      "minecraft:phantom",
      "minecraft:breeze",
      "minecraft:ender_chest"
    ],
    other: [
      "minecraft:husk",
      "minecraft:stray",
      "minecraft:cave_spider",
      "minecraft:enchanted_golden_apple",
      "minecraft:web"
    ]
  },
  nether: {
    low: [
      "minecraft:zombie_pigman",
      "minecraft:wither_skeleton",
      "minecraft:crying_obsidian",
      "minecraft:wither_rose"
    ],
    high: [
      "minecraft:strider",
      "minecraft:lava_bucket",
      "minecraft:blaze",
      "minecraft:netherite_ingot"
    ],
    other: [
      "minecraft:saddle"
    ]
  },
  animal: {
    low: [
      "minecraft:chicken",
      "minecraft:parrot",
      "minecraft:bee_nest",
      "minecraft:composter"
    ],
    high: [
      "minecraft:fox",
      "minecraft:frog",
      "minecraft:mooshroom",
      "minecraft:polar_bear"
    ],
    other: [
      "minecraft:egg",
      "minecraft:poppy",
      "minecraft:dandelion",
      "minecraft:pink_tulip",
      "minecraft:cactus",
      "minecraft:bee",
      "minecraft:honey_bottle",
      "minecraft:wooden_hoe",
      "minecraft:stone_hoe",
      "minecraft:iron_hoe",
      "minecraft:wheat",
      "minecraft:red_mushroom",
      "minecraft:packed_ice",
      "minecraft:bread",
      "minecraft:cake",
      "minecraft:sheep",
      "minecraft:cow",
      "minecraft:white_wool",
      "minecraft:red_wool",
      "minecraft:yellow_wool",
      "minecraft:pink_wool",
      "minecraft:green_wool",
      "minecraft:black_wool",
      "minecraft:milk_bucket",
      "minecraft:bogged"
    ]
  },
  raid: {
    low: [
      "minecraft:pillager",
      "minecraft:trapped_chest",
      "minecraft:vindicator",
      "mcg:goat_horn"
    ],
    high: [
      "minecraft:evocation_illager",
      "minecraft:armor_stand",
      "minecraft:ravager",
      "minecraft:banner"
    ],
    other: [
      "minecraft:vex",
      "minecraft:iron_axe",
      "mcg:totem",
      "minecraft:ominous_bottle",
      "mcg:awkward_potion",
      "mcg:heal_potion",
      "mcg:heal_splash_potion",
      "mcg:damage_potion",
      "mcg:damage_splash_potion",
      "mcg:speed_potion",
      "mcg:fireresistance_potion"
    ]
  },
  seaworld: {
    low: [
      "minecraft:tropicalfish",
      "minecraft:turtle",
      "minecraft:squid",
      "minecraft:barrel"
    ],
    high: [
      "minecraft:guardian",
      "minecraft:axolotl",
      "minecraft:glow_squid",
      "minecraft:dolphin"
    ],
    other: [
      "minecraft:turtle_helmet",
      "minecraft:fishing_rod",
      "minecraft:cartography_table",
      "minecraft:cod",
      "minecraft:cooked_cod",
      "minecraft:heart_of_the_sea",
      "minecraft:drowned",
      "minecraft:trident",
      "minecraft:elder_guardian"
    ]
  }
};

// カテゴリー定義
const CATEGORIES = {
  normal: { title: "一般カード", color: "" },
  overworld: { title: "現世カード", color: "§2", icon: "textures/blocks/grass_side_carried" },
  cave: { title: "洞窟カード", color: "§8", icon: "textures/blocks/stone" },
  nether: { title: "ネザーカード", color: "§4", icon: "textures/blocks/netherrack" },
  animal: { title: "アニマルカード", color: "§6", icon: "textures/blocks/hay_block_side" },
  raid: { title: "襲撃カード", color: "§5", icon: "textures/blocks/stripped_dark_oak_log_top" },
  seaworld: { title: "海洋カード", color: "§b", icon: "textures/blocks/prismarine_bricks" }
};

// ========== 共通フォーム関数 ==========

/**
 * カードリストを表示するフォームを作成
 * @param {string} title - フォームタイトル
 * @param {Array} cards - カードリスト
 * @returns {ui.ActionFormData}
 */
function createCardListForm(title, cards) {
  const form = new ui.ActionFormData().title(title);
  cards.forEach(cardId => {
    let info = getCard(cardId);
    let displayName = getDisplayName(cardId);
    form.button(displayName, info.texture);
  });
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  return form;
}

/**
 * カード詳細を表示するフォームを作成
 * @param {Object} card - カード情報
 * @returns {ui.MessageFormData}
 */
function createCardDetailForm(cardId) {
  let displayName = getDisplayName(cardId);
  let body = displayName + "\n" + cardInfo(cardId).join("\n");
  
  // 強化情報があれば追加
  if (getCard(cardId)?.enhance) {
    body += "\n§d§l強化後§r\n" + cardInfo(cardId, true).join("\n");
  }

  return new ui.MessageFormData()
    .title("カード情報")
    .body(body)
    .button1("§l§c図鑑を閉じる")
    .button2("§l§8戻る");
}

/**
 * カードリストを表示し、選択されたカードの詳細を表示
 * @param {mc.Player} player
 * @param {string} title - リストのタイトル
 * @param {Array} cards - カードリスト
 * @param {Function} backCallback - 戻るボタンが押された時のコールバック
 */
function showCardList(player, title, cards, backCallback) {
  const form = createCardListForm(title, cards);
  
  form.show(player).then(res => {
    if (res.canceled) return;
    
    // 戻るボタンが押された場合
    if (res.selection === cards.length) {
      backCallback(player);
      return;
    }

    // カード詳細を表示
    const selectedCardId = cards[res.selection];
    const detailForm = createCardDetailForm(selectedCardId);
    
    detailForm.show(player).then(res2 => {
      if (res2.canceled || res2.selection === 0) return;
      if (res2.selection === 1) {
        // 戻るボタンでリストに戻る
        showCardList(player, title, cards, backCallback);
      }
    });
  });
}

/**
 * カテゴリー選択フォームを表示
 * @param {mc.Player} player
 * @param {string} category - カテゴリー名
 * @param {Function} backCallback - 戻るボタンが押された時のコールバック
 */
function showCategorySelector(player, category, backCallback) {
  const categoryData = CATEGORIES[category];
  const form = new ui.ActionFormData()
    .title(categoryData.title)
    .button("§l§9ローコスト")
    .button("§l§cハイコスト")
    .button("§l§aドロー以外で入手可能なカード")
    .button("§l§8戻る", "textures/ui/back_button_hover");

  form.show(player).then(res => {
    if (res.canceled) return;
    
    switch (res.selection) {
      case 0:
        showCardList(player, `${categoryData.title}(ローコスト)`, cardLibrary[category].low, 
          () => showCategorySelector(player, category, backCallback));
        break;
      case 1:
        showCardList(player, `${categoryData.title}(ハイコスト)`, cardLibrary[category].high,
          () => showCategorySelector(player, category, backCallback));
        break;
      case 2:
        showCardList(player, `${categoryData.title}(ドロー以外)`, cardLibrary[category].other,
          () => showCategorySelector(player, category, backCallback));
        break;
      case 3:
        backCallback(player);
        break;
    }
  });
}

// ========== メインフォーム ==========

/**
 * カード図鑑のホーム画面を表示
 * @param {mc.Player} player
 */
export function cardBookForm_home(player) {
  const form = new ui.ActionFormData()
    .title("カード図鑑")
    .body(
      "ドローによって入手できるカードの内、消費actの§9低い§rカードは§9ローコスト§r、§c高い§rカードは§cハイコスト§rといいます。\n" +
      "効果で「+OO = XX」と書かれているカードはクラフト可能です。\n"
    )
    .button("§l一般カード", "textures/items/wood_sword")
    .button(`§l${CATEGORIES.overworld.color}現世§r§lカード`, CATEGORIES.overworld.icon)
    .button(`§l${CATEGORIES.cave.color}洞窟§r§lカード`, CATEGORIES.cave.icon)
    .button(`§l${CATEGORIES.nether.color}ネザー§r§lカード`, CATEGORIES.nether.icon)
    .button(`§l${CATEGORIES.animal.color}アニマル§r§lカード`, CATEGORIES.animal.icon)
    .button(`§l${CATEGORIES.raid.color}襲撃§r§lカード`, CATEGORIES.raid.icon)
    .button(`§l${CATEGORIES.seaworld.color}海洋§r§lカード`, CATEGORIES.seaworld.icon);

  form.show(player).then(res => {
    if (res.canceled) return;
    
    switch (res.selection) {
      case 0:
        showCardList(player, "一般カード", cardLibrary.normal, cardBookForm_home);
        break;
      case 1:
        showCategorySelector(player, "overworld", cardBookForm_home);
        break;
      case 2:
        showCategorySelector(player, "cave", cardBookForm_home);
        break;
      case 3:
        showCategorySelector(player, "nether", cardBookForm_home);
        break;
      case 4:
        showCategorySelector(player, "animal", cardBookForm_home);
        break;
      case 5:
        showCategorySelector(player, "raid", cardBookForm_home);
        break;
      case 6:
        showCategorySelector(player, "seaworld", cardBookForm_home);
        break;
    }
  });
}
