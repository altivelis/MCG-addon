import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { cardInfo, getCard } from "./lib";

// ========== カードライブラリデータ ==========

const cardLibrary = {
  normal: [
    { name: "ウィザースケルトンの頭", id: "minecraft:wither_skeleton_skull", icon: "textures/gui/newgui/mob_effects/wither_effect" },
    { name: "木の剣", id: "minecraft:wooden_sword", icon: "textures/items/wood_sword" },
    { name: "石の剣", id: "minecraft:stone_sword", icon: "textures/items/stone_sword" },
    { name: "金の剣", id: "minecraft:golden_sword", icon: "textures/items/gold_sword" },
    { name: "鉄の剣", id: "minecraft:iron_sword", icon: "textures/items/iron_sword" },
    { name: "ダイヤモンドの剣", id: "minecraft:diamond_sword", icon: "textures/items/diamond_sword" },
    { name: "ネザライトの剣", id: "minecraft:netherite_sword", icon: "textures/items/netherite_sword" },
    { name: "木のツルハシ", id: "minecraft:wooden_pickaxe", icon: "textures/items/wood_pickaxe" },
    { name: "石のツルハシ", id: "minecraft:stone_pickaxe", icon: "textures/items/stone_pickaxe" },
    { name: "鉄のツルハシ", id: "minecraft:iron_pickaxe", icon: "textures/items/iron_pickaxe" },
    { name: "石炭", id: "minecraft:coal", icon: "textures/items/coal" },
    { name: "丸石", id: "minecraft:cobblestone", icon: "textures/blocks/cobblestone" },
    { name: "鉄のインゴット", id: "minecraft:iron_ingot", icon: "textures/items/iron_ingot" },
    { name: "ダイヤモンド", id: "minecraft:diamond", icon: "textures/items/diamond" },
    { name: "ニンジン付きの棒", id: "minecraft:carrot_on_a_stick", icon: "textures/items/carrot_on_a_stick" },
    { name: "矢", id: "minecraft:arrow", icon: "textures/items/arrow" }
  ],
  overworld: {
    low: [
      { name: "ブタ", id: "minecraft:pig", icon: "textures/items/spawn_eggs/spawn_egg_pig" },
      { name: "村人", id: "minecraft:villager_v2", icon: "textures/items/spawn_eggs/spawn_egg_villager" },
      { name: "チェスト", id: "minecraft:chest", icon: "textures/blocks/chest_front" },
      { name: "くり抜かれたカボチャ", id: "minecraft:carved_pumpkin", icon: "textures/blocks/pumpkin_face_off" }
    ],
    high: [
      { name: "オオカミ", id: "minecraft:wolf", icon: "textures/items/spawn_eggs/spawn_egg_wolf" },
      { name: "鐘", id: "minecraft:bell", icon: "textures/blocks/bell_side" },
      { name: "アレイ", id: "minecraft:allay", icon: "textures/items/bundle_light_blue" },
      { name: "パンダ", id: "minecraft:panda", icon: "textures/items/spawn_eggs/spawn_egg_panda" }
    ],
    other: [
      { name: "生の豚肉", id: "minecraft:porkchop", icon: "textures/items/porkchop_raw" },
      { name: "焼き豚", id: "minecraft:cooked_porkchop", icon: "textures/items/porkchop_cooked" },
      { name: "スノーゴーレム", id: "minecraft:snow_golem", icon: "textures/items/spawn_eggs/spawn_egg_snow_golem" },
      { name: "アイアンゴーレム", id: "minecraft:iron_golem", icon: "textures/items/egg_null" },
      { name: "ジャック・オ・ランタン", id: "minecraft:lit_pumpkin", icon: "textures/blocks/pumpkin_face_on" }
    ]
  },
  cave: {
    low: [
      { name: "ゾンビ", id: "minecraft:zombie", icon: "textures/items/spawn_eggs/spawn_egg_zombie" },
      { name: "スケルトン", id: "minecraft:skeleton", icon: "textures/items/spawn_eggs/spawn_egg_skeleton" },
      { name: "クリーパー", id: "minecraft:creeper", icon: "textures/items/spawn_eggs/spawn_egg_creeper" },
      { name: "ウィッチ", id: "minecraft:witch", icon: "textures/items/spawn_eggs/spawn_egg_witch" }
    ],
    high: [
      { name: "モンスタースポナー", id: "minecraft:mob_spawner", icon: "textures/blocks/mob_spawner" },
      { name: "ファントム", id: "minecraft:phantom", icon: "textures/items/spawn_eggs/spawn_egg_phantom" },
      { name: "ブリーズ", id: "minecraft:breeze", icon: "textures/items/spawn_eggs/spawn_egg_breeze" },
      { name: "エンダーチェスト", id: "minecraft:ender_chest", icon: "textures/blocks/ender_chest_front" }
    ],
    other: [
      { name: "ハスク", id: "minecraft:husk", icon: "textures/items/spawn_eggs/spawn_egg_husk" },
      { name: "ストレイ", id: "minecraft:stray", icon: "textures/items/spawn_eggs/spawn_egg_stray" },
      { name: "洞窟グモ", id: "minecraft:cave_spider", icon: "textures/items/spawn_eggs/spawn_egg_cave_spider" },
      { name: "エンチャントされた金のリンゴ", id: "minecraft:enchanted_golden_apple", icon: "textures/items/apple_golden" },
      { name: "クモの巣", id: "minecraft:web", icon: "textures/blocks/web" }
    ]
  },
  nether: {
    low: [
      { name: "ゾンビピグリン", id: "minecraft:zombie_pigman", icon: "textures/items/spawn_eggs/spawn_egg_zombified_piglin" },
      { name: "ウィザースケルトン", id: "minecraft:wither_skeleton", icon: "textures/items/spawn_eggs/spawn_egg_wither_skeleton" },
      { name: "泣く黒曜石", id: "minecraft:crying_obsidian", icon: "textures/blocks/crying_obsidian" },
      { name: "ウィザーローズ", id: "minecraft:wither_rose", icon: "textures/blocks/flower_wither_rose" }
    ],
    high: [
      { name: "ストライダー", id: "minecraft:strider", icon: "textures/items/spawn_eggs/spawn_egg_strider" },
      { name: "溶岩入りバケツ", id: "minecraft:lava_bucket", icon: "textures/items/bucket_lava" },
      { name: "ジャガイモ(ブレイズ)", id: "minecraft:blaze", icon: "textures/items/potato" },
      { name: "ネザライトインゴット", id: "minecraft:netherite_ingot", icon: "textures/items/netherite_ingot" }
    ],
    other: [
      { name: "鞍", id: "minecraft:saddle", icon: "textures/items/saddle" }
    ]
  },
  animal: {
    low: [
      { name: "ニワトリ", id: "minecraft:chicken", icon: "textures/items/spawn_eggs/spawn_egg_chicken" },
      { name: "オウム", id: "minecraft:parrot", icon: "textures/items/spawn_eggs/spawn_egg_parrot" },
      { name: "ミツバチの巣", id: "minecraft:bee_nest", icon: "textures/blocks/bee_nest_front" },
      { name: "コンポスター", id: "minecraft:composter", icon: "textures/blocks/composter_side" }
    ],
    high: [
      { name: "キツネ", id: "minecraft:fox", icon: "textures/items/spawn_eggs/spawn_egg_fox" },
      { name: "カエル", id: "minecraft:frog", icon: "textures/items/spawn_eggs/spawn_egg_frog" },
      { name: "ムーシュルーム", id: "minecraft:mooshroom", icon: "textures/items/spawn_eggs/spawn_egg_mooshroom" },
      { name: "シロクマ", id: "minecraft:polar_bear", icon: "textures/items/spawn_eggs/spawn_egg_polar_bear" }
    ],
    other: [
      { name: "卵", id: "minecraft:egg", icon: "textures/items/egg" },
      { name: "ポピー", id: "minecraft:poppy", icon: "textures/blocks/flower_rose" },
      { name: "タンポポ", id: "minecraft:dandelion", icon: "textures/blocks/flower_dandelion" },
      { name: "桃色のチューリップ", id: "minecraft:pink_tulip", icon: "textures/blocks/flower_tulip_pink" },
      { name: "サボテン", id: "minecraft:cactus", icon: "textures/blocks/cactus_side" },
      { name: "ハチ", id: "minecraft:bee", icon: "textures/items/spawn_eggs/spawn_egg_bee" },
      { name: "ハチミツ入りの瓶", id: "minecraft:honey_bottle", icon: "textures/items/honey_bottle" },
      { name: "木のクワ", id: "minecraft:wooden_hoe", icon: "textures/items/wood_hoe" },
      { name: "石のクワ", id: "minecraft:stone_hoe", icon: "textures/items/stone_hoe" },
      { name: "鉄のクワ", id: "minecraft:iron_hoe", icon: "textures/items/iron_hoe" },
      { name: "小麦", id: "minecraft:wheat", icon: "textures/items/wheat" },
      { name: "赤いキノコ", id: "minecraft:red_mushroom", icon: "textures/blocks/mushroom_red" },
      { name: "氷塊", id: "minecraft:packed_ice", icon: "textures/blocks/ice_packed" },
      { name: "パン", id: "minecraft:bread", icon: "textures/items/bread" },
      { name: "ケーキ", id: "minecraft:cake", icon: "textures/items/cake" },
      { name: "羊", id: "minecraft:sheep", icon: "textures/items/spawn_eggs/spawn_egg_sheep" },
      { name: "ウシ", id: "minecraft:cow", icon: "textures/items/spawn_eggs/spawn_egg_cow" },
      { name: "白色の羊毛", id: "minecraft:white_wool", icon: "textures/blocks/wool_colored_white" },
      { name: "赤色の羊毛", id: "minecraft:red_wool", icon: "textures/blocks/wool_colored_red" },
      { name: "黄色の羊毛", id: "minecraft:yellow_wool", icon: "textures/blocks/wool_colored_yellow" },
      { name: "桃色の羊毛", id: "minecraft:pink_wool", icon: "textures/blocks/wool_colored_pink" },
      { name: "緑色の羊毛", id: "minecraft:green_wool", icon: "textures/blocks/wool_colored_green" },
      { name: "黒色の羊毛", id: "minecraft:black_wool", icon: "textures/blocks/wool_colored_black" },
      { name: "ミルクバケツ", id: "minecraft:milk_bucket", icon: "textures/items/bucket_milk" },
      { name: "ボグド", id: "minecraft:bogged", icon: "textures/items/spawn_eggs/spawn_egg_bogged" }
    ]
  },
  raid: {
    low: [
      { name: "ピリジャー", id: "minecraft:pillager", icon: "textures/items/spawn_eggs/spawn_egg_pillager" },
      { name: "トラップチェスト", id: "minecraft:trapped_chest", icon: "textures/blocks/trapped_chest_front" },
      { name: "ヴィンディケーター", id: "minecraft:vindicator", icon: "textures/items/spawn_eggs/spawn_egg_vindicator" },
      { name: "ヤギの角笛", id: "minecraft:goat_horn", icon: "textures/items/goat_horn" }
    ],
    high: [
      { name: "エヴォーカー", id: "minecraft:evocation_illager", icon: "textures/items/spawn_eggs/spawn_egg_evoker" },
      { name: "防具立て", id: "minecraft:armor_stand", icon: "textures/items/armor_stand" },
      { name: "ラヴェジャー", id: "minecraft:ravager", icon: "textures/items/spawn_eggs/spawn_egg_ravager" },
      { name: "不吉な旗", id: "minecraft:banner", icon: "textures/gui/newgui/mob_effects/bad_omen_effect" }
    ],
    other: [
      { name: "ヴェックス", id: "minecraft:vex", icon: "textures/items/spawn_eggs/spawn_egg_vex" },
      { name: "鉄の斧", id: "minecraft:iron_axe", icon: "textures/items/iron_axe" },
      { name: "不死のトーテム", id: "minecraft:totem", icon: "textures/items/totem" },
      { name: "不吉な瓶", id: "minecraft:ominous_bottle", icon: "textures/items/ominous_bottle" },
      { name: "奇妙なポーション", id: "mcg:awkward_potion", icon: "textures/items/potion_bottle_drinkable" },
      { name: "治癒のポーション", id: "mcg:heal_potion", icon: "textures/items/potion_bottle_heal" },
      { name: "治癒のスプラッシュポーション", id: "mcg:heal_splash_potion", icon: "textures/items/potion_bottle_splash_heal" },
      { name: "負傷のポーション", id: "mcg:damage_potion", icon: "textures/items/potion_bottle_harm" },
      { name: "負傷のスプラッシュポーション", id: "mcg:damage_splash_potion", icon: "textures/items/potion_bottle_splash_harm" },
      { name: "俊敏のポーション", id: "mcg:speed_potion", icon: "textures/items/potion_bottle_moveSpeed" },
      { name: "耐火のポーション", id: "mcg:fireresistance_potion", icon: "textures/items/potion_bottle_fireResistance" }
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
  raid: { title: "襲撃カード", color: "§5", icon: "textures/blocks/stripped_dark_oak_log_top" }
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
  cards.forEach(card => {
    form.button(card.name, card.icon);
  });
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  return form;
}

/**
 * カード詳細を表示するフォームを作成
 * @param {Object} card - カード情報
 * @returns {ui.MessageFormData}
 */
function createCardDetailForm(card) {
  let body = card.name + "\n" + cardInfo(card.id).join("\n");
  
  // 強化情報があれば追加
  if (getCard(card.id)?.enhance) {
    body += "\n§d§l強化後§r\n" + cardInfo(card.id, true).join("\n");
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
    const selectedCard = cards[res.selection];
    const detailForm = createCardDetailForm(selectedCard);
    
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
    .button(`§l${CATEGORIES.raid.color}襲撃§r§lカード`, CATEGORIES.raid.icon);

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
    }
  });
}
