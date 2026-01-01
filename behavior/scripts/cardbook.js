import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { cardInfo, getCard } from "./lib";

// ========== カードライブラリデータ ==========

const cardLibrary = {
  normal: [
    { name: "ウィザースケルトンの頭", id: "minecraft:wither_skeleton_skull" },
    { name: "木の剣", id: "minecraft:wooden_sword" },
    { name: "石の剣", id: "minecraft:stone_sword" },
    { name: "金の剣", id: "minecraft:golden_sword" },
    { name: "鉄の剣", id: "minecraft:iron_sword" },
    { name: "ダイヤモンドの剣", id: "minecraft:diamond_sword" },
    { name: "ネザライトの剣", id: "minecraft:netherite_sword" },
    { name: "木のツルハシ", id: "minecraft:wooden_pickaxe" },
    { name: "石のツルハシ", id: "minecraft:stone_pickaxe" },
    { name: "鉄のツルハシ", id: "minecraft:iron_pickaxe" },
    { name: "石炭", id: "minecraft:coal" },
    { name: "丸石", id: "minecraft:cobblestone" },
    { name: "鉄のインゴット", id: "minecraft:iron_ingot" },
    { name: "ダイヤモンド", id: "minecraft:diamond" },
    { name: "ニンジン付きの棒", id: "minecraft:carrot_on_a_stick" },
    { name: "矢", id: "minecraft:arrow" }
  ],
  overworld: {
    low: [
      { name: "ブタ", id: "minecraft:pig" },
      { name: "村人", id: "minecraft:villager_v2" },
      { name: "チェスト", id: "minecraft:chest" },
      { name: "くり抜かれたカボチャ", id: "minecraft:carved_pumpkin" }
    ],
    high: [
      { name: "オオカミ", id: "minecraft:wolf" },
      { name: "鐘", id: "minecraft:bell" },
      { name: "アレイ", id: "minecraft:allay" },
      { name: "パンダ", id: "minecraft:panda" }
    ],
    other: [
      { name: "生の豚肉", id: "minecraft:porkchop" },
      { name: "焼き豚", id: "minecraft:cooked_porkchop" },
      { name: "スノーゴーレム", id: "minecraft:snow_golem" },
      { name: "アイアンゴーレム", id: "minecraft:iron_golem" },
      { name: "ジャック・オ・ランタン", id: "minecraft:lit_pumpkin" }
    ]
  },
  cave: {
    low: [
      { name: "ゾンビ", id: "minecraft:zombie" },
      { name: "スケルトン", id: "minecraft:skeleton" },
      { name: "クリーパー", id: "minecraft:creeper" },
      { name: "ウィッチ", id: "minecraft:witch" }
    ],
    high: [
      { name: "モンスタースポナー", id: "minecraft:mob_spawner" },
      { name: "ファントム", id: "minecraft:phantom" },
      { name: "ブリーズ", id: "minecraft:breeze" },
      { name: "エンダーチェスト", id: "minecraft:ender_chest" }
    ],
    other: [
      { name: "ハスク", id: "minecraft:husk" },
      { name: "ストレイ", id: "minecraft:stray" },
      { name: "洞窟グモ", id: "minecraft:cave_spider" },
      { name: "エンチャントされた金のリンゴ", id: "minecraft:enchanted_golden_apple" },
      { name: "クモの巣", id: "minecraft:web" }
    ]
  },
  nether: {
    low: [
      { name: "ゾンビピグリン", id: "minecraft:zombie_pigman" },
      { name: "ウィザースケルトン", id: "minecraft:wither_skeleton" },
      { name: "泣く黒曜石", id: "minecraft:crying_obsidian" },
      { name: "ウィザーローズ", id: "minecraft:wither_rose" }
    ],
    high: [
      { name: "ストライダー", id: "minecraft:strider" },
      { name: "溶岩入りバケツ", id: "minecraft:lava_bucket" },
      { name: "ジャガイモ(ブレイズ)", id: "minecraft:blaze" },
      { name: "ネザライトインゴット", id: "minecraft:netherite_ingot" }
    ],
    other: [
      { name: "鞍", id: "minecraft:saddle", icon: "textures/items/saddle" }
    ]
  },
  animal: {
    low: [
      { name: "ニワトリ", id: "minecraft:chicken" },
      { name: "オウム", id: "minecraft:parrot" },
      { name: "ミツバチの巣", id: "minecraft:bee_nest" },
      { name: "コンポスター", id: "minecraft:composter" }
    ],
    high: [
      { name: "キツネ", id: "minecraft:fox" },
      { name: "カエル", id: "minecraft:frog" },
      { name: "ムーシュルーム", id: "minecraft:mooshroom" },
      { name: "シロクマ", id: "minecraft:polar_bear" }
    ],
    other: [
      { name: "卵", id: "minecraft:egg" },
      { name: "ポピー", id: "minecraft:poppy" },
      { name: "タンポポ", id: "minecraft:dandelion" },
      { name: "桃色のチューリップ", id: "minecraft:pink_tulip" },
      { name: "サボテン", id: "minecraft:cactus" },
      { name: "ハチ", id: "minecraft:bee" },
      { name: "ハチミツ入りの瓶", id: "minecraft:honey_bottle" },
      { name: "木のクワ", id: "minecraft:wooden_hoe" },
      { name: "石のクワ", id: "minecraft:stone_hoe" },
      { name: "鉄のクワ", id: "minecraft:iron_hoe" },
      { name: "小麦", id: "minecraft:wheat" },
      { name: "赤いキノコ", id: "minecraft:red_mushroom" },
      { name: "氷塊", id: "minecraft:packed_ice" },
      { name: "パン", id: "minecraft:bread" },
      { name: "ケーキ", id: "minecraft:cake" },
      { name: "羊", id: "minecraft:sheep" },
      { name: "ウシ", id: "minecraft:cow" },
      { name: "白色の羊毛", id: "minecraft:white_wool" },
      { name: "赤色の羊毛", id: "minecraft:red_wool" },
      { name: "黄色の羊毛", id: "minecraft:yellow_wool" },
      { name: "桃色の羊毛", id: "minecraft:pink_wool" },
      { name: "緑色の羊毛", id: "minecraft:green_wool" },
      { name: "黒色の羊毛", id: "minecraft:black_wool" },
      { name: "ミルクバケツ", id: "minecraft:milk_bucket" },
      { name: "ボグド", id: "minecraft:bogged" }
    ]
  },
  raid: {
    low: [
      { name: "ピリジャー", id: "minecraft:pillager" },
      { name: "トラップチェスト", id: "minecraft:trapped_chest" },
      { name: "ヴィンディケーター", id: "minecraft:vindicator" },
      { name: "ヤギの角笛", id: "mcg:goat_horn" }
    ],
    high: [
      { name: "エヴォーカー", id: "minecraft:evocation_illager" },
      { name: "防具立て", id: "minecraft:armor_stand" },
      { name: "ラヴェジャー", id: "minecraft:ravager" },
      { name: "不吉な旗", id: "minecraft:banner" }
    ],
    other: [
      { name: "ヴェックス", id: "minecraft:vex" },
      { name: "鉄の斧", id: "minecraft:iron_axe" },
      { name: "不死のトーテム", id: "mcg:totem" },
      { name: "不吉な瓶", id: "minecraft:ominous_bottle" },
      { name: "奇妙なポーション", id: "mcg:awkward_potion" },
      { name: "治癒のポーション", id: "mcg:heal_potion" },
      { name: "治癒のスプラッシュポーション", id: "mcg:heal_splash_potion" },
      { name: "負傷のポーション", id: "mcg:damage_potion" },
      { name: "負傷のスプラッシュポーション", id: "mcg:damage_splash_potion" },
      { name: "俊敏のポーション", id: "mcg:speed_potion" },
      { name: "耐火のポーション", id: "mcg:fireresistance_potion" }
    ]
  },
  seaworld: {
    low: [
      { name: "熱帯魚", id: "minecraft:tropical_fish" },
      { name: "カメ", id: "minecraft:turtle" },
      { name: "イカ", id: "minecraft:squid" },
      { name: "樽", id: "minecraft:barrel" }
    ],
    high: [
      { name: "ガーディアン", id: "minecraft:guardian" },
      { name: "ウーパールーパー", id: "minecraft:axolotl" },
      { name: "発光するイカ", id: "minecraft:glow_squid" },
      { name: "イルカ", id: "minecraft:dolphin" }
    ],
    other: [
      { name: "亀の甲羅", id: "minecraft:turtle_helmet" },
      { name: "釣り竿", id: "minecraft:fishing_rod" },
      { name: "製図台", id: "minecraft:cartography_table" },
      { name: "生鱈", id: "minecraft:cod"},
      { name: "焼き鱈", id: "minecraft:cooked_cod"},
      { name: "海洋の心", id: "minecraft:heart_of_the_sea" },
      { name: "ドラウンド", id: "minecraft:drowned" },
      { name: "トライデント", id: "minecraft:trident" },
      { name: "エルダーガーディアン", id: "minecraft:elder_guardian" }
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
  cards.forEach(card => {
    let info = getCard(card.id);
    form.button(card.name, info.texture);
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
