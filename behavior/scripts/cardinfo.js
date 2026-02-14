export const cardList = [
  {
    name:["minecraft:compass"],
    type: "item",
    attribute: "アイテム",
    Cact: "-",
    text: [
      "§b使用時 / 自分のターンを終了する。"
    ],
    texture: "textures/items/compass_item"
  },
  {
    name:["minecraft:spyglass"],
    type: "item",
    attribute: "アイテム",
    Cact: "-",
    text: [
      "§bこのアイテムを持っている間、視点の先の対象の情報を表示する。"
    ],
    texture: "textures/items/spyglass"
  },
  {
    name:["minecraft:grass_block"],
    type: "item",
    attribute: "アイテム",
    Cact: "-",
    text: [
      "§bドローするのに必要なアイテム。"
    ],
    texture: "textures/blocks/grass_side_carried"
  },
  {
    name:["minecraft:wither_skeleton_skull"],
    displayName: "ウィザースケルトンの頭",
    type: "item",
    attribute: "アイテム",
    Cact: "300",
    text: [
      "§b使用時 / ウィザーを召喚する。",
      "§bウィザーの召喚に成功したとき、あなたは勝利する。"
    ],
    texture: "textures/gui/newgui/mob_effects/wither_effect"
  },
  {
    name:["minecraft:wooden_sword"],
    displayName: "木の剣",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 5",
      "§bプレイヤーに与えるダメージは1。",
      "§b+丸石 = 石の剣",
      "§b+鉄のインゴット = 鉄の剣",
      "§b+ダイヤモンド = ダイヤモンドの剣",
      "§b+ネザライトインゴット+20act = ネザライトの剣"
    ],
    texture: "textures/items/wood_sword"
  },
  {
    name:["minecraft:stone_sword"],
    displayName: "石の剣",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 15",
      "§bプレイヤーに与えるダメージは3。",
      "§bターン終了時に消滅する。"
    ],
    texture: "textures/items/stone_sword"
  },
  {
    name:["minecraft:golden_sword"],
    displayName: "金の剣",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 20",
      "§bプレイヤーに与えるダメージは4。",
      "§bターン終了時に消滅する。"
    ],
    texture: "textures/items/gold_sword"
  },
  {
    name:["minecraft:iron_sword"],
    displayName: "鉄の剣",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 30",
      "§bプレイヤーに与えるダメージは6。",
      "§bターン終了時に消滅する。"
    ],
    texture: "textures/items/iron_sword"
  },
  {
    name:["minecraft:diamond_sword"],
    displayName: "ダイヤモンドの剣",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 50",
      "§bプレイヤーに与えるダメージは10。",
      "§bターン終了時に消滅する。"
    ],
    texture: "textures/items/diamond_sword"
  },
  {
    name:["minecraft:netherite_sword"],
    displayName: "ネザライトの剣",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 70",
      "§bプレイヤーに与えるダメージは14。",
      "§bターン終了時に消滅する。"
    ],
    texture: "textures/items/netherite_sword"
  },
  {
    name:["minecraft:wooden_pickaxe"],
    displayName: "木のツルハシ",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 丸石と石炭を入手する。",
      "§b+丸石 = 石のツルハシ",
      "§b+鉄のインゴット = 鉄のツルハシ"
    ],
    texture: "textures/items/wood_pickaxe"
  },
  {
    name:["minecraft:stone_pickaxe"],
    displayName: "石のツルハシ",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 鉄インゴットを入手する。"
    ],
    texture: "textures/items/stone_pickaxe"
  },
  {
    name:["minecraft:iron_pickaxe"],
    displayName: "鉄のツルハシ",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§bダイヤモンドを入手する。"
    ],
    texture: "textures/items/iron_pickaxe"
  },
  {
    name:["minecraft:coal"],
    displayName: "石炭",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+生の豚肉 = 焼き豚",
      "§b+スケルトン = ウィザースケルトン",
      "§b+くり抜かれたカボチャ = ジャック・オ・ランタン" 
    ],
    texture: "textures/items/coal"
  },
  {
    name:["minecraft:cobblestone"],
    displayName: "丸石",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text:[
      "§b+木の剣 = 石の剣",
      "§b+木のツルハシ = 石のツルハシ"
    ],
    texture: "textures/blocks/cobblestone"
  },
  {
    name:["minecraft:iron_ingot"],
    displayName: "鉄のインゴット",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+木の剣 = 鉄の剣",
      "§b+木のツルハシ = 鉄のツルハシ"
    ],
    texture: "textures/items/iron_ingot"
  },
  {
    name:["minecraft:diamond"],
    displayName: "ダイヤモンド",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+木の剣 = ダイヤモンドの剣",
    ],
    texture: "textures/items/diamond"
  },
  {
    name:["minecraft:carrot_on_a_stick"],
    displayName: "ニンジン付きの棒",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のモブを1体除外してスロットを空けることができる。",
      "§bこの効果は除外無効のモブにも有効である。"
    ],
    texture: "textures/items/carrot_on_a_stick"
  },
  {
    name:["minecraft:arrow"],
    displayName: "矢",
    type: "item",
    attribute: "アイテム",
    Cact: "2",
    text: [
      "§b使用時 / 相手1体に30ダメージ",
      "§b浮遊している敵にも当たる。",
      "§bまた、相手スロットにモブがいてもプレイヤーを攻撃できる。",
      "§bプレイヤーに与えるダメージは1になる。",
      "§bターン終了時に消滅する。"
    ],
    texture: "textures/items/arrow"
  },
  // 現世
  {
    name: ["minecraft:pig", "minecraft:pig_spawn_egg"],
    displayName: "ブタ",
    type: "entity",
    attribute: "なし",
    hp: "10",
    atk: "0",
    Sact: "2",
    Bact: "14",
    text: [
      "§b召喚時効果 / 生の豚肉を1つ入手"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_pig"
  },
  {
    name: ["minecraft:villager_v2", "minecraft:villager_spawn_egg"],
    displayName: "村人",
    type: "entity",
    attribute: "なし",
    hp: "20",
    atk: "0",
    Sact: "4",
    Bact: "7",
    text: [
      "§b召喚時効果 / 草ブロックを2つ入手",
      "§bターン開始時効果 / 草ブロックを1つ入手"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_villager"
  },
  {
    name: ["minecraft:chest"],
    displayName: "チェスト",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "3",
    text: [
      "§b使用時 / 「木の剣、木のツルハシ、ニンジン付きの棒」を獲得する。",
      "§6オブジェクト効果 / 自分の番開始時に草ブロックを1つ入手する。"
    ],
    texture: "textures/blocks/chest_front"
  },
  {
    name:["minecraft:carved_pumpkin"],
    displayName: "くり抜かれたカボチャ",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "2",
    text: [
      "§b使用時 / 「スノーゴーレム」、「アイアンゴーレム」を入手する。",
      "§6オブジェクト効果 / 自分の番開始時に3actと草ブロックを獲得する。",
      "§6その後、このオブジェクトを破壊する。",
      "§b+石炭 = ジャック・オ・ランタン"
    ],
    texture: "textures/blocks/pumpkin_face_off"
  },
  {
    name:["minecraft:wolf", "minecraft:wolf_spawn_egg"],
    displayName: "オオカミ",
    type: "entity",
    attribute: "速攻",
    hp: "32",
    atk: "30",
    Sact: "40",
    Bact: "4",
    text: [
      "§b生の豚肉を使用すると追加で1回攻撃できる。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_wolf"
  },
  {
    name:["minecraft:bell"],
    displayName: "鐘",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "15",
    text: [
      "§bお互いの場のアンデッド系モブと残虐モブに即死ダメージを与える。(除外効果ではない)",
      "§bそれ以外のモブは全回復し、すべてのモブから除外無効効果をなくす。",
      "§b「大将」となった残虐モブはこの効果によってダメージを受けない。",
      "§6オブジェクト効果 / ターン開始時に村人を1枚獲得する。",
      "§6このオブジェクトがある間、自分は村人のSactが0になる。"
    ],
    texture: "textures/blocks/bell_side"
  },
  {
    name:["minecraft:allay", "minecraft:allay_spawn_egg"],
    displayName: "アレイ",
    type: "entity",
    attribute: "浮遊・速攻",
    hp: "20",
    atk: "50",
    Sact: "45",
    Bact: "20",
    text: [
      "§bアレイがいる状態でドローするたびに5act獲得する。",
      "§bこの効果はアレイが複数いても重ならない。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_allay"
  },
  {
    name:["minecraft:panda", "minecraft:panda_spawn_egg"],
    displayName: "パンダ",
    type: "entity",
    attribute: "なし",
    hp: "300",
    atk: "70",
    Sact: "80",
    Bact: "8",
    text: [
      "§b除外無効"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_panda"
  },
  {
    name:["minecraft:porkchop"],
    displayName: "生の豚肉",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§bそのままオオカミに使用できる。",
      "§b+石炭 = 焼き豚",
      "§b+ゾンビ = ゾンビピッグマン"
    ],
    texture: "textures/items/porkchop_raw"
  },
  {
    name:["minecraft:cooked_porkchop"],
    displayName: "焼き豚",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分のHPを6回復する。"
    ],
    texture: "textures/items/porkchop_cooked"
  },
  {
    name:["minecraft:snow_golem", "minecraft:snow_golem_spawn_egg"],
    displayName: "スノーゴーレム",
    type: "entity",
    attribute: "なし",
    hp: "36",
    atk: "15",
    Sact: "4",
    Bact: "2",
    text: [
      "§b除外無効"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_snow_golem"
  },
  {
    name:["minecraft:iron_golem", "minecraft:iron_golem_spawn_egg"],
    displayName: "アイアンゴーレム",
    type: "entity",
    attribute: "なし",
    hp: "250",
    atk: "30x2",
    Sact: "70",
    Bact: "5",
    text: [
      "§b召喚時効果 / 自分の場に村人がいると40act獲得する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_iron_golem"
  },
  {
    name:["minecraft:lit_pumpkin"],
    displayName: "ジャック・オ・ランタン",
    type: "item",
    attribute: "オブジェクト",
    Cact: "20",
    text: [
      "§bこのカードは自分のスロットに「ゴーレム」カードが存在しないと使用/設置できない。",
      "§6オブジェクト効果",
      "§6設置時 / 相手のオブジェクトをジャック・オ・ランタンに変え、",
      "§6元々設置してあったオブジェクトは自分のものになる。"
    ],
    texture: "textures/blocks/pumpkin_face_on"
  },
  // 洞窟
  {
    name:["minecraft:zombie", "minecraft:zombie_spawn_egg"],
    displayName: "ゾンビ",
    type: "entity",
    attribute: "なし",
    hp: "20",
    atk: "15",
    Sact: "3",
    Bact: "3",
    text: [
      "§b召喚時効果 / 草ブロックを2つ獲得",
      "§b特殊効果/装備がなくてもダメージを少し軽減する。",
      "§bたまに装備を付けた硬いゾンビが出る。",
      "§b+生の豚肉 = ゾンビピッグマン"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_zombie",
    enhance:{
      type: "entity",
      attribute: "エンハンス",
      hp: "35",
      atk: "15x2",
      Sact: "-",
      Bact: "8",
      text: [
        "§b強化時効果 / HPを全回復し、草ブロックを2つ入手する。",
        "§b特殊効果/装備がなくてもダメージを少し軽減する。"
      ]
    }
  },
  {
    name:["minecraft:skeleton", "minecraft:skeleton_spawn_egg"],
    displayName: "スケルトン",
    type: "entity",
    attribute: "速攻・貫通",
    hp: "20",
    atk: "-",
    Sact: "5",
    Bact: "3",
    text: [
      "§b召喚時効果 / 「矢」を1つ獲得する。",
      "§bターン開始時効果 / 「矢」を1つ獲得する。",
      "§bたまに装備を付けたスケルトンが出る。",
      "§b+石炭 = ウィザースケルトン",
      "§b+赤いキノコ = ボグド"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_skeleton",
    enhance:{
      type: "entity",
      attribute: "エンハンス",
      hp: "45",
      atk: "-",
      Sact: "-",
      Bact: "6",
      text: [
        "§b強化時効果 / HPを全回復し、矢を1枚入手する。",
        "§bターン開始時効果 / 自分の場のモブの数だけ矢を入手する。"
      ]
    }
  },
  {
    name:["minecraft:creeper", "minecraft:creeper_spawn_egg"],
    displayName: "クリーパー",
    type: "entity",
    attribute: "ガード",
    hp: "20",
    atk: "-",
    Sact: "4",
    Bact: "3",
    text: [
      "§bターン開始時効果 / 相手のモブ全員(浮遊、ガードを除く)に5ダメージを与え、",
      "§b相手のオブジェクトを破壊する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_creeper",
    enhance:{
      type: "entity",
      attribute: "エンハンス",
      hp: "20",
      atk: "0",
      Sact: "-",
      Bact: "0",
      text: [
        "§b強化時効果 / 強化エネルギーに耐えられず爆発し、除外される。",
        "§bお互いの場の全てのモブ(浮遊・ガードを除く)に20ダメージを与える。",
        "§bお互いのオブジェクトを破壊する。"
      ]
    }
  },
  {
    name:["minecraft:witch", "minecraft:witch_spawn_egg"],
    displayName: "ウィッチ",
    type: "entity",
    attribute: "なし",
    hp: "26",
    atk: "15",
    Sact: "5",
    Bact: "11",
    text: [
      "§bターン開始時効果 / 自分を全回復する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_witch",
    enhance:{
      type: "entity",
      attribute: "エンハンス",
      hp: "45",
      atk: "20",
      Sact: "-",
      Bact: "11",
      text: [
        "§b強化時効果 / このモブのHPを全回復し、「奇妙なポーション」を入手する。",
        "§bターン開始時効果 / このモブのHPを全回復し、「奇妙なポーション」を入手する。"
      ]
    }
  },
  {
    name:["minecraft:mob_spawner"],
    displayName: "モンスタースポナー",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "10",
    text: [
      "§b使用時 / 「ハスク」、「ストレイ」、「洞窟グモ」を獲得する。",
      "§6オブジェクト効果 / 自分のターン開始時、自分のactを15増やす。"
    ],
    texture: "textures/blocks/mob_spawner"
  },
  {
    name:["minecraft:phantom", "minecraft:phantom_spawn_egg"],
    displayName: "ファントム",
    type: "entity",
    attribute: "浮遊・速攻",
    hp: "20",
    atk: "15x2",
    Sact: "15",
    Bact: "6",
    text: [],
    texture: "textures/items/spawn_eggs/spawn_egg_phantom"
  },
  {
    name:["minecraft:breeze", "minecraft:breeze_spawn_egg"],
    displayName: "ブリーズ",
    type: "entity",
    attribute: "浮遊",
    hp: "30",
    atk: "15",
    Sact: "45",
    Bact: "8",
    text: [
      "§b召喚時効果 / お互いの場のブリーズ以外のモブをすべて除外する。",
      "§b残ったモブからは除外無効効果をなくす。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_breeze"
  },
  {
    name:["minecraft:ender_chest"],
    displayName: "エンダーチェスト",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "15",
    text: [
      "§b使用時 / 相手モブ全員に5ダメージを与え、以下のカードからランダムで獲得する。",
      "§b「エンチャントされた金のリンゴ」",
      "§b「ストレイ」と「ハスク」、",
      "§b「ハスク」と「洞窟グモ」、",
      "§b「洞窟グモ」と「ストレイ」",
      "§6このカードは自分のオブジェクトがチェストの場合のみ設置できる。",
      "§6オブジェクト効果 / ターン開始時に草ブロックを3つ入手する。"
    ],
    texture: "textures/blocks/ender_chest_front"
  },
  {
    name:["minecraft:husk", "minecraft:husk_spawn_egg"],
    displayName: "ハスク",
    type: "entity",
    attribute: "ガード",
    hp: "20",
    atk: "30",
    Sact: "10",
    Bact: "10",
    text: [
      "§bこのモブは剣以外から攻撃を受けない。",
      "§b特殊効果/装備がなくてもダメージを少し軽減する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_husk"
  },
  {
    name:["minecraft:stray", "minecraft:stray_spawn_egg"],
    displayName: "ストレイ",
    type: "entity",
    attribute: "速攻・貫通",
    hp: "35",
    atk: "-",
    Sact: "20",
    Bact: "6",
    text: [
      "§b召喚時効果 / 「矢」を2つ獲得する。",
      "§bターン開始時効果 / 「矢」を2つ獲得する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_stray"
  },
  {
    name:["minecraft:cave_spider", "minecraft:cave_spider_spawn_egg"],
    displayName: "洞窟グモ",
    type: "entity",
    attribute: "なし",
    hp: "13",
    atk: "30",
    Sact: "15",
    Bact: "0",
    text: [
      "§b召喚時効果 / 「クモの巣」を1つ獲得。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_cave_spider"
  },
  {
    name:["minecraft:enchanted_golden_apple"],
    displayName: "エンチャントされた金のリンゴ",
    type: "item",
    attribute: "アイテム",
    Cact: "20",
    text: [
      "§b使用時 / 自分のHP上限を40にし、全回復する。"
    ],
    texture: "textures/items/apple_golden"
  },
  {
    name:["minecraft:web"],
    displayName: "クモの巣",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 相手のactを15下げる。"
    ],
    texture: "textures/blocks/web"
  },
  // ネザー
  {
    name:["minecraft:zombie_pigman", "minecraft:zombie_pigman_spawn_egg"],
    displayName: "ゾンビピグリン",
    type: "entity",
    attribute: "ネザー",
    hp: "20",
    atk: "20x2",
    Sact: "10",
    Bact: "15",
    text: [
      "§b召喚時効果 / 草ブロックを2つ獲得。",
      "§b特殊効果/装備がなくてもダメージを少し軽減する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_zombified_piglin"
  },
  {
    name:["minecraft:crying_obsidian"],
    displayName: "泣く黒曜石",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "8",
    text: [
      "§b使用時 / 自分のモブに使用した次の相手ターンにそのモブが死亡すると、",
      "§bそのスロットにゾンビピッグマンを召喚する。",
      "§6オブジェクト効果 / 相手のターンに自分のブタが死亡するとそのスロットに",
      "§6ゾンビピッグマンを召喚する。"
    ],
    texture: "textures/blocks/crying_obsidian"
  },
  {
    name:["minecraft:wither_rose"],
    displayName: "ウィザーローズ",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§bこのカードは以下の条件下でしか使用できない。",
      "§b・相手のスロットがすべて埋まっている。",
      "§b・自分の場にモブがいない。",
      "§b・相手のactが30以上",
      "§b・自分のactが10以下",
      "§b使用時 / 使用者のactを40にする。相手のactを30にする。自分は8ダメージを受ける。",
      "§b草ブロックを3つ入手する。 相手の場のすべてのモブに20ダメージを与える。",
      "§bこのダメージは相手の属性の影響を受けない。",
      "§b+白い羊毛 = 黒い羊毛"
    ],
    texture: "textures/blocks/flower_wither_rose"
  },
  {
    name:["minecraft:ancient_debris"],
    displayName: "古代の残骸",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "10",
    text: [
      "§b使用時 / 「ネザライトの欠片」を入手する。",
      "§6オブジェクト効果 / 自分の場のネザーモンスターに除外無効を付与する。"
    ],
    texture: "textures/blocks/ancient_debris_side"
  },
  {
    name:["minecraft:strider", "minecraft:strider_spawn_egg"],
    displayName: "ストライダー",
    type: "entity",
    attribute: "ネザー",
    hp: "32",
    atk: "0",
    Sact: "20",
    Bact: "25",
    text: [
      "§b召喚時効果 / 「鞍」を1つ入手する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_strider"
  },
  {
    name:["minecraft:lava_bucket"],
    displayName: "溶岩入りバケツ",
    type: "item",
    attribute: "アイテム",
    Cact: "25",
    text: [
      "§b使用時 / 相手プレイヤーに6ダメージを与える。"
    ],
    texture: "textures/items/bucket_lava"
  },
  {
    name:["minecraft:wither_skeleton", "minecraft:wither_skeleton_spawn_egg"],
    displayName: "ウィザースケルトン",
    type: "entity",
    attribute: "ネザー",
    hp: "60",
    atk: "15x3",
    Sact: "20",
    Bact: "10",
    text: [],
    texture: "textures/items/spawn_eggs/spawn_egg_wither_skeleton"
  },
  {
    name:["minecraft:potato"],
    displayName: "ジャガイモ(ブレイズ)",
    type: "item",
    attribute: "アイテム",
    Cact: "30",
    text: [
      "§b使用時 / なぜか「ブレイズ」を召喚できる。"
    ],
    texture: "textures/items/potato"
  },
  {
    name:["minecraft:blaze", "minecraft:blaze_spawn_egg"],
    displayName: "ブレイズ",
    type: "entity",
    attribute: "浮遊・速攻・ネザー",
    hp: "20",
    atk: "30",
    Sact: "30",
    Bact: "15",
    text: [
      "§b相手がドローするたびに相手に1ダメージ与える。",
      "§b何体いてもダメージは重ならない。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_blaze"
  },
  {
    name: ["minecraft:netherite_scrap"],
    displayName: "ネザライトの欠片",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+ダイヤモンド = ネザライトインゴット",
    ],
    texture: "textures/items/netherite_scrap"
  },
  {
    name:["minecraft:netherite_ingot"],
    displayName: "ネザライトインゴット",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+木の剣 = ネザライトの剣",
    ],
    texture: "textures/items/netherite_ingot"
  },
  {
    name:["minecraft:saddle"],
    displayName: "鞍",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分の場にストライダーがいるときのみ使える。",
      "§b使用時 / 相手のモンスター1体と",
      "§b自分の場のすべてのストライダーを除外する。"
    ],
    texture: "textures/items/saddle"
  },
  // アニマル
  {
    name:["minecraft:chicken", "minecraft:chicken_spawn_egg"],
    displayName: "ニワトリ",
    type: "entity",
    attribute: "なし",
    hp: "4",
    atk: "0",
    Sact: "1",
    Bact: "15",
    text: [
      "§bこのカードはオーバーコスト召喚ができない。",
      "§b召喚時効果 / 卵を1つ入手",
      "§bターン開始時効果 / 卵を1つ入手"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_chicken"
  },
  {
    name:["minecraft:parrot", "minecraft:parrot_spawn_egg"],
    displayName: "オウム",
    type: "entity",
    attribute: "浮遊",
    hp: "6",
    atk: "0",
    Sact: "3",
    Bact: "3",
    text: [
      "§b召喚時効果 / 草ブロックを2つ入手する。",
      "§bポピー、タンポポ、桃色のチューリップ、",
      "§bサボテンの中からランダムに1つ入手する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_parrot"
  },
  {
    name:["minecraft:bee_nest"],
    displayName: "ミツバチの巣",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "3",
    text: [
      "§b使用時 / 「ハチのスポーンエッグ」を2枚手札に加える。",
      "§6オブジェクト効果 / 毎ターン開始時に「ハチのスポーンエッグ」を1枚手札に加える。",
      "§6このオブジェクトがなくなったとき、手札にある「ハチミツ入りの瓶」をすべて消費して",
      "§6その数x10act入手する。",
      "§6さらに、自分の場にハチがいるときにこの効果を使える。",
      "§6「ポピー」「桃色のチューリップ」「タンポポ」を使用すると「ハチミツ入りの瓶」を1つ入手する。"
    ],
    texture: "textures/blocks/bee_nest_front"
  },
  {
    name:["minecraft:composter"],
    displayName: "コンポスター",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "4",
    text: [
      "§b使用時 / 「木のツルハシ」と「木のクワ」、「ニンジン付きの棒」を1枚ずつ入手する。",
      "§6オブジェクト効果 / ターン開始時に「ポピー」「タンポポ」「桃色のチューリップ」",
      "§6「サボテン」からランダムに1枚入手する。"
    ],
    texture: "textures/blocks/composter_side"
  },
  {
    name:["minecraft:fox", "minecraft:fox_spawn_egg"],
    displayName: "キツネ",
    type: "entity",
    attribute: "速攻",
    hp: "29",
    atk: "30",
    Sact: "25",
    Bact: "12",
    text: [
      "§b召喚時効果 / 自分の場にあるオブジェクトと同じカードを1枚入手する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_fox"
  },
  {
    name:["minecraft:frog", "minecraft:frog_spawn_egg"],
    displayName: "カエル",
    type: "entity",
    attribute: "なし",
    hp: "10",
    atk: "0",
    Sact: "30",
    Bact: "1",
    text: [
      "§b召喚時効果 / 相手の場にオブジェクトがある時、相手のオブジェクトを破壊し、",
      "§bさらに召喚したレーンの相手のモブを除外する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_frog"
  },
  {
    name:["minecraft:mooshroom", "minecraft:mooshroom_spawn_egg"],
    displayName: "ムーシュルーム",
    type: "entity",
    attribute: "なし",
    hp: "35",
    atk: "15",
    Sact: "16",
    Bact: "9",
    text: [
      "§b召喚時効果 / 「赤いキノコ」を入手する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_mooshroom"
  },
  {
    name:["minecraft:polar_bear", "minecraft:polar_bear_spawn_egg"],
    displayName: "シロクマ",
    type: "entity",
    attribute: "なし",
    hp: "130",
    atk: "50",
    Sact: "50",
    Bact: "8",
    text: [
      "§bターン終了時効果 / 相手の手札に「氷塊」を4枚加える。",
      "§b自分の場に存在するスノーゴーレム1体につき追加で4枚相手の手札に「氷塊」を加える。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_polar_bear"
  },
  {
    name:["minecraft:egg"],
    displayName: "卵",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 自分のHPを1回復する。",
      "§b+小麦+ミルクバケツ = ケーキ"
    ],
    texture: "textures/items/egg"
  },
  {
    name:["minecraft:poppy", "minecraft:red_flower"],
    displayName: "ポピー",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白色の羊毛 = 赤色の羊毛"
    ],
    texture: "textures/blocks/flower_rose"
  },
  {
    name:["minecraft:dandelion", "minecraft:yellow_flower"],
    displayName: "タンポポ",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白色の羊毛 = 黄色の羊毛"
    ],
    texture: "textures/blocks/flower_dandelion"
  },
  {
    name:["minecraft:pink_tulip"],
    displayName: "桃色のチューリップ",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白色の羊毛 = 桃色の羊毛"
    ],
    texture: "textures/blocks/flower_tulip_pink"
  },
  {
    name:["minecraft:cactus"],
    displayName: "サボテン",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 相手のモブ全員に5ダメージを与える。(浮遊、ガードを除く)",
      "§b+白色の羊毛 = 緑色の羊毛"
    ],
    texture: "textures/blocks/cactus_side"
  },
  {
    name:["minecraft:bee", "minecraft:bee_spawn_egg"],
    displayName: "ハチ",
    type: "entity",
    attribute: "浮遊・速攻",
    hp: "10",
    atk: "15",
    Sact: "4",
    Bact: "3",
    text: [
      "§b召喚時効果 / 自分のオブジェクトがミツバチの巣であれば",
      "§b「ハチミツ入りの瓶」を1つ入手する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_bee"
  },
  {
    name:["minecraft:honey_bottle"],
    displayName: "ハチミツ入りの瓶",
    type: "item",
    attribute: "キープアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§b自分の「ミツバチの巣」がなくなると自動的に消費され、",
      "§b1つにつき10actと交換される。"
    ],
    texture: "textures/items/honey_bottle"
  },
  {
    name:["minecraft:wooden_hoe"],
    displayName: "木のクワ",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 「小麦」を1つ入手する。",
      "§b+丸石 = 石のクワ",
      "§b+鉄インゴット = 鉄のクワ"
    ],
    texture: "textures/items/wood_hoe"
  },
  {
    name:["minecraft:stone_hoe"],
    displayName: "石のクワ",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 「小麦」を1つ入手する。",
      "§b「ポピー」「タンポポ」「桃色のチューリップ」「サボテン」の中からランダムに1つ入手する。"
    ],
    texture: "textures/items/stone_hoe"
  },
  {
    name:["minecraft:iron_hoe"],
    displayName: "鉄のクワ",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 「小麦」を2つ入手する。",
      "§b「草ブロック」を入手する。",
      "§b「ポピー」「タンポポ」「桃色のチューリップ」「サボテン」の中からランダムに2つ入手する。"
    ],
    texture: "textures/items/iron_hoe"
  },
  {
    name:["minecraft:wheat"],
    displayName: "小麦",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 「ウシ」「羊」を1つずつ入手する。",
      "§b+石炭 = パン",
      "§b+卵+ミルクバケツ = ケーキ"
    ],
    texture: "textures/items/wheat"
  },
  {
    name:["minecraft:red_mushroom"],
    displayName: "赤いキノコ",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+スケルトン = ボグド",
      "§b+ウシ = ムーシュルーム"
    ],
    texture: "textures/blocks/mushroom_red"
  },
  {
    name:["minecraft:packed_ice"],
    displayName: "氷塊",
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "10",
    text: [
      "§b使用することでも消費できる。",
      "§b「ドロー」「攻撃」をすると1つずつ消滅する。",
      "§bこのカードを持っている限りピンク色のボタンを使用できない。",
      "§b自分のターン終了時にこのカードを持っていると1つにつき1ダメージ受ける。"
    ],
    texture: "textures/blocks/ice_packed"
  },
  {
    name:["minecraft:bread"],
    displayName: "パン",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のHPを3回復する。"
    ],
    texture: "textures/items/bread"
  },
  {
    name:["minecraft:cake"],
    displayName: "ケーキ",
    type: "item",
    attribute: "アイテム",
    Cact: "3",
    text: [
      "§b使用時 / 自分のHPを9回復して「チェスト」を1つ入手する。"
    ],
    texture: "textures/items/cake"
  },
  {
    name:["minecraft:sheep", "minecraft:sheep_spawn_egg"],
    displayName: "羊",
    type: "entity",
    attribute: "なし",
    hp: "10",
    atk: "0",
    Sact: "4",
    Bact: "5",
    text: [
      "§b召喚時効果 / 「白い羊毛」を1つ入手する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_sheep"
  },
  {
    name:["minecraft:cow", "minecraft:cow_spawn_egg"],
    displayName: "ウシ",
    type: "entity",
    attribute: "なし",
    hp: "30",
    atk: "15",
    Sact: "7",
    Bact: "2",
    text: [
      "§b召喚時効果 / 「ミルクバケツ」を1つ入手する。",
      "§b+赤いキノコ = ムーシュルームのスポーンエッグ"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_cow"
  },
  {
    name:["minecraft:white_wool"],
    displayName: "白色の羊毛",
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b各色の花・サボテンと合成できる。",
      "§b+ポピー = 赤色の羊毛",
      "§b+タンポポ = 黄色の羊毛",
      "§b+桃色のリューリップ = 桃色の羊毛",
      "§b+サボテン = 緑色の羊毛",
      "§b+ウィザーローズ = 黒色の羊毛"
    ],
    texture: "textures/blocks/wool_colored_white"
  },
  {
    name:["minecraft:red_wool"],
    displayName: "赤色の羊毛",
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーは[§cATK§b:15]を得る。"
    ],
    texture: "textures/blocks/wool_colored_red"
  },
  {
    name:["minecraft:yellow_wool"],
    displayName: "黄色の羊毛",
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時10act入手する。"
    ],
    texture: "textures/blocks/wool_colored_yellow"
  },
  {
    name:["minecraft:pink_wool"],
    displayName: "桃色の羊毛",
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時に草ブロックを1つ入手する。"
    ],
    texture: "textures/blocks/wool_colored_pink"
  },
  {
    name:["minecraft:green_wool"],
    displayName: "緑色の羊毛",
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時に自分のHPを3回復する。"
    ],
    texture: "textures/blocks/wool_colored_green"
  },
  {
    name:["minecraft:black_wool"],
    displayName: "黒色の羊毛",
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時に相手プレイヤーに1ダメージを与える。"
    ],
    texture: "textures/blocks/wool_colored_black"
  },
  {
    name:["minecraft:milk_bucket"],
    displayName: "ミルクバケツ",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 自分の任意のモブ(浮遊・水中を除く)にガード属性を付与する。",
      "§b+卵+小麦 = ケーキ"
    ],
    texture: "textures/items/bucket_milk"
  },
  {
    name:["minecraft:bogged", "minecraft:bogged_spawn_egg"],
    displayName: "ボグド",
    type: "entity",
    attribute: "速攻・貫通",
    hp: "25",
    atk: "-",
    Sact: "12",
    Bact: "10",
    text: [
      "§b召喚時効果 / 自分の場にオブジェクトがあると矢を3つ入手する。",
      "§bターン開始時効果 / 矢を2つ入手する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_bogged"
  },
  // 残虐
  {
    name:["minecraft:pillager", "minecraft:pillager_spawn_egg"],
    displayName: "ピリジャー",
    type: "entity",
    attribute: "残虐・速攻",
    hp: "20",
    atk: "-",
    Sact: "11",
    Bact: "6",
    text: [
      "§aこのモブは§c赤スロット§aにいる§e村人§aを置き換えることで召喚できる。",
      "§b召喚時効果 / 使用者に3ダメージ与え、矢を入手する。",
      "§bターン開始時効果 / 使用者に3ダメージ与え、草ブロック2つと矢を入手する。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_pillager"
  },
  {
    name:["minecraft:trapped_chest"],
    displayName: "トラップチェスト",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "3",
    text: [
      "§aこのカードは自分の場に「残虐」モブがいるときのみ使用できる。",
      "§b使用時 / 「不吉な瓶」「不死のトーテム」「ニンジン付きの棒」を入手する。",
      "§6オブジェクト効果 / 相手が「チェスト」を使用した際、50%の確率で以下の効果が発動する。",
      "§6相手の「チェスト」の効果を無効にし、相手に4ダメージ与える。",
      "§6このオブジェクトを破壊する。"
    ],
    texture: "textures/blocks/trapped_chest_front"
  },
  {
    name:["minecraft:vindicator", "minecraft:vindicator_spawn_egg"],
    displayName: "ヴィンディケーター",
    type: "entity",
    attribute: "残虐",
    hp: "40",
    atk: "-",
    Sact: "13",
    Bact: "6",
    text: [
      "§aこのモブは§9青スロット§aにいる§e村人§aを置き換えることで召喚できる。",
      "§b召喚時効果 / 使用者に3ダメージ与える。",
      "§bターン開始時効果 / 鉄の斧、草ブロックx2を入手する。使用者に3ダメージ与える。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_vindicator"
  },
  {
    name:["mcg:goat_horn"],
    displayName: "ヤギの角笛",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のHPを10減らし、10act獲得する。"
    ],
    texture: "textures/items/goat_horn"
  },
  {
    name:["minecraft:evocation_illager", "minecraft:evoker_spawn_egg"],
    displayName: "エヴォーカー",
    type: "entity",
    attribute: "残虐",
    hp: "35",
    atk: "-",
    Sact: "15",
    Bact: "6",
    text: [
      "§aこのモブは§f白スロット§aにいる§e村人§aを置き換えることで召喚できる。",
      "§b召喚時効果 / 使用者に3ダメージ与える。その後、不死のトーテムを入手する。",
      "§bターン終了時効果 / 自分の空いているスロットに「ヴェックス」を召喚する。",
      "§bターン開始時効果 / 使用者に3ダメージ与え、草ブロックx2を入手する。",
      "§b相手の全てのモブに10ダメージ与える。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_evoker"
  },
  {
    name:["minecraft:armor_stand"],
    displayName: "防具立て",
    type: "item",
    attribute: "アイテム",
    Cact: "2",
    text: [
      "§b使用時 / 使用者に2ダメージ与える。",
      "§bその後、指定した相手のスロットに「防具立て」を設置する。",
      "§b「防具立て」は攻撃の対象にならず、あらゆるダメージは無効化される。",
      "§b「防具立て」のあるスロットにはモブを召喚できない。",
      "§bこのカードが置かれたプレイヤーのターンが終了したときにこのカードを破壊する。"
    ],
    texture: "textures/items/armor_stand"
  },
  {
    name:["minecraft:ravager", "minecraft:ravager_spawn_egg"],
    displayName: "ラヴェジャー",
    type: "entity",
    attribute: "残虐",
    hp: "80",
    atk: "50",
    Sact: "24",
    Bact: "6",
    text: [
      "§aこのモブは自分の場に「残虐」カードがあるときのみ召喚できる。",
      "§b召喚時効果 / 使用者に6ダメージ与える。",
      "§bターン開始時効果 / 使用者に6ダメージ与える。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_ravager"
  },
  {
    name:["minecraft:banner"],
    displayName: "不吉な旗",
    type: "item",
    attribute: "アイテム",
    Cact: "9",
    text: [
      "§aこのカードは自分の場の「ピリジャー」「ヴィンディケーター」",
      "§a「エヴォーカー」に対してのみ使用できる。",
      "§b使用時 / 選択したモブを「大将」にする。",
      "§b「大将」になったモブに以下の効果を適用する。",
      "§b-最大HPを+30する。",
      "§b-HPを最大まで回復する。",
      "§b-除外無効効果を付与する。",
      "§bすでに「大将」が自分の場に存在する場合、このカードは使用できない。"
    ],
    texture: "textures/gui/newgui/mob_effects/bad_omen_effect"
  },
  {
    name:["minecraft:vex", "minecraft:vex_spawn_egg"],
    displayName: "ヴェックス",
    type: "entity",
    attribute: "残虐・浮遊",
    hp: "20",
    atk: "15",
    Sact: "-",
    Bact: "2",
    text: [
      "§bターン開始時効果 / 使用者に1ダメージ与える。"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_vex"
  },
  {
    name:["minecraft:iron_axe"],
    displayName: "鉄の斧",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 白スロットに居る敵に25ダメージ与え、",
      "§bそれ以外のスロットに居る敵に10ダメージを与える。",
      "§bこのカードはターン終了時に消滅する。"
    ],
    texture: "textures/items/iron_axe"
  },
  {
    name:["mcg:totem"],
    displayName: "不死のトーテム",
    type: "item",
    attribute: "キープアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持している状態で自分のHPが0になると以下の効果を適用する。",
      "§b-インベントリのトーテムを全て消費する。",
      "§b-消費したトーテムの数だけ自分のHPを回復する。"
    ],
    texture: "textures/items/totem"
  },
  {
    name:["minecraft:ominous_bottle"],
    displayName: "不吉な瓶",
    type: "item",
    attribute: "強化素材",
    Cact: "2",
    text: [
      "§aこのカードは自分の場の「ウィッチ」にのみ使用できる。",
      "§b使用時 / ウィッチをウィッチロードに進化させる。"
    ],
    texture: "textures/items/ominous_bottle"
  },
  {
    name:["mcg:awkward_potion"],
    displayName: "奇妙なポーション",
    type: "item",
    attribute: "強化素材",
    Cact: "5",
    text: [
      "§b使用時 / 使用したモブによって効果が変わる。",
      "§b「ウィッチ」に使用すると以下の4種のポーションの中からランダムに1つ入手する。",
      "§b「回復」「負傷」「俊敏」「耐火」",
      "§b「ゾンビ」に使用すると「エンハンスゾンビ」に進化する。",
      "§b「スケルトン」に使用すると「エンハンススケルトン」に進化する。",
      "§b「クリーパー」に使用すると「エンハンスクリーパー」に進化する。"
    ],
    texture: "textures/items/potion_bottle_drinkable"
  },
  {
    name:["mcg:heal_potion"],
    displayName: "治癒のポーション",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b自分か自分の場のモブに対して使用できる。",
      "§b使用時 / 対象に15HP分の回復効果を付与する。",
      "§bプレイヤーに対しては8HP分の回復効果を付与する。",
      "§bアンデッド系モブに対しては防御力貫通の15ダメージを与える。",
      "§b+クリーパー = 治癒のスプラッシュポーション"
    ],
    texture: "textures/items/potion_bottle_heal"
  },
  {
    name:["mcg:heal_splash_potion"],
    displayName: "治癒のスプラッシュポーション",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分のモブ全体に対して、または相手のモブ1体(浮遊を除く)に対して使用できる。",
      "§b使用時 / 対象に15HP分の回復効果を付与する。",
      "§bアンデッド系モブに対しては防御力貫通の15ダメージを与える。"
    ],
    texture: "textures/items/potion_bottle_splash_heal"
  },
  {
    name:["mcg:damage_potion"],
    displayName: "負傷のポーション",
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b自分の場のモブ1体または相手の場のモブ1体(浮遊を除く)、",
      "§bまたは相手プレイヤーに対して使用できる。(ダイレクトアタック扱い)",
      "§b使用時 / 対象に20HP分のダメージ効果を付与する。",
      "§bプレイヤー、ウィッチに対しては3HP分のダメージ効果を付与する。",
      "§bアンデッド系モブに対しては20HP分の回復効果を与える。",
      "§b+クリーパー = 負傷のスプラッシュポーション"
    ],
    texture: "textures/items/potion_bottle_harm"
  },
  {
    name:["mcg:damage_splash_potion"],
    displayName: "負傷のスプラッシュポーション",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分のモブ全体または相手のモブ全体(浮遊を除く)に対して使用できる。",
      "§b使用時 / 対象に20HP分のダメージ効果を付与する。",
      "§bウィッチに対しては3HP分のダメージ効果を付与する。",
      "§bアンデッド系モブに対しては20HP分の回復効果を与える。"
    ],
    texture: "textures/items/potion_bottle_splash_harm"
  },
  {
    name:["mcg:speed_potion"],
    displayName: "俊敏のポーション",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 15actを獲得する。"
    ],
    texture: "textures/items/potion_bottle_moveSpeed"
  },
  {
    name:["mcg:fireresistance_potion"],
    displayName: "耐火のポーション",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のモブ1体(浮遊・水中を除く)に対してガード属性を付与する。"
    ],
    texture: "textures/items/potion_bottle_fireResistance"
  },
  // シーワールド
  {
    name:["minecraft:tropicalfish", "minecraft:tropical_fish_spawn_egg"],
    displayName: "熱帯魚",
    type: "entity",
    attribute: "水中",
    hp: "10",
    atk: "0",
    Sact: "3",
    Bact: "4",
    text: [
      "§b召喚時効果 / 草ブロックを2つ入手する。",
      "§bターン開始時効果 / 海洋の心を1つ入手する。",
      "§b死亡時効果 / 生鱈を1つ入手する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_tropicalfish"
  },
  {
    name:["minecraft:turtle", "minecraft:turtle_spawn_egg"],
    displayName: "カメ",
    type: "entity",
    attribute: "水中・ガード",
    hp: "30",
    atk: "0",
    Sact: "5",
    Bact: "1",
    text: [
      "§b召喚時効果 / 海洋の心の所持数が3つ以上の時、カメの甲羅を1つ入手する。",
      "§bターン開始時効果 / 自分の場にオブジェクトがないならact+5",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_turtle"
  },
  {
    name:["minecraft:squid", "minecraft:squid_spawn_egg"],
    displayName: "イカ",
    type: "entity",
    attribute: "水中",
    hp: "21",
    atk: "0",
    Sact: "4",
    Bact: "3",
    text: [
      "§bターン開始時効果 / 相手プレイヤーの所持している羊毛はすべて黒色の羊毛になる。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_squid"
  },
  {
    name:["minecraft:barrel"],
    displayName: "樽",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "4",
    text: [
      "§b使用時 / 「釣り竿、製図台、ニンジン付きの棒」を入手する。",
      "§6オブジェクト効果 / ターン開始時、海洋の心の所持数が5つ以下であれば「生鱈」を入手する。",
      "§6海洋の心の所持数が6つ以上であれば「釣り竿」を入手する。",
    ],
    texture: "textures/blocks/barrel_side"
  },
  {
    name:["minecraft:guardian", "minecraft:guardian_spawn_egg"],
    displayName: "ガーディアン",
    type: "entity",
    attribute: "水中",
    hp: "35",
    atk: "20",
    Sact: "18",
    Bact: "9",
    text: [
      "§b召喚時効果 / 海洋の心を1つ入手する。",
      "§bターン開始時効果 / 自分の正面のモブ(浮遊、ガードを除く)に5ダメージ。",
      "§bターン終了時効果 / 自分の海洋の心の所持数が10個以上で§c赤スロット§bと§9青スロット",
      "§bがガーディアンのとき、§f白スロット§bにモブがいなければ海洋の心を5つ消費して",
      "§f白スロット§bに「エルダーガーディアン」を召喚する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_guardian"
  },
  {
    name:["minecraft:axolotl", "minecraft:axolotl_spawn_egg"],
    displayName: "ウーパールーパー",
    type: "entity",
    attribute: "水中・速攻",
    hp: "32",
    atk: "15",
    Sact: "25",
    Bact: "9",
    text: [
      "§b特殊効果 / 自分プレイヤーが金の剣以上の剣で攻撃を行うたびに「海洋の心」を1つ入手する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_axolotl"
  },
  {
    name:["minecraft:glow_squid", "minecraft:glow_squid_spawn_egg"],
    displayName: "発光するイカ",
    type: "entity",
    attribute: "水中",
    hp: "20",
    atk: "0",
    Sact: "50",
    Bact: "5",
    text: [
      "§b召喚時効果 / 自分の場の水中モブの数だけ「ダイヤモンド」を入手する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_glow_squid"
  },
  {
    name:["minecraft:dolphin", "minecraft:dolphin_spawn_egg"],
    displayName: "イルカ",
    type: "entity",
    attribute: "水中・速攻",
    hp: "60",
    atk: "50",
    Sact: "40",
    Bact: "11",
    text: [
      "§b召喚時効果 / 海洋の心の所持数が10個以上の時act+30",
      "§bターン開始時効果 / このモブが水中属性の場合、1の効果を適用する。",
      "§bこのモブが浮遊属性の場合、2の効果を適用する。",
      "§b1.このモブの属性を水中から浮遊に変更する。",
      "§b2.このモブの属性を浮遊から水中に変更する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_dolphin"
  },
  {
    name:["minecraft:turtle_helmet"],
    displayName: "亀の甲羅",
    type: "item",
    attribute: "アイテム",
    Cact: "10",
    text: [
      "§b使用時 / 次の相手の番の終わりまで衝撃吸収効果(HP8相当)を獲得する。",
    ],
    texture: "textures/items/turtle_helmet"
  },
  {
    name:["minecraft:fishing_rod"],
    displayName: "釣り竿",
    type: "item",
    attribute: "アイテム",
    Cact: "2",
    text: [
      "§b使用時 / 海洋の心の所持数が5個以下の場合、草ブロックを1つ入手する。",
      "§b使用時 / 海洋の心の所持数が6個以上の場合、草ブロックを2つ入手する。",
    ],
    texture: "textures/items/fishing_rod_uncast"
  },
  {
    name:["minecraft:cartography_table"],
    displayName: "製図台",
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "2",
    text: [
      "§b使用時 / 相手の場に出ているオブジェクトと同じカードを入手する。",
      "§6オブジェクト効果 / 自分のターン開始時、自分の所持している海洋の心の数×2だけactが増加する。",
    ],
    texture: "textures/blocks/cartography_table_top"
  },
  {
    name:["minecraft:cod"],
    displayName: "生鱈",
    type: "item",
    attribute: "アイテム・強化合成",
    Cact: "0",
    text: [
      "§b+石炭=焼き鱈",
      "§b使用時 / 水中モブに使用するとそのモブのHPを10回復する。",
    ],
    texture: "textures/items/fish_raw"
  },
  {
    name:["minecraft:cooked_cod"],
    displayName: "焼き鱈",
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分プレイヤーのHPを3回復する。",
    ],
    texture: "textures/items/fish_cooked"
  },
  {
    name:["minecraft:heart_of_the_sea"],
    displayName: "海洋の心",
    type: "item",
    attribute: "キープアイテム・強化合成",
    Cact: "0",
    text: [
      "§b+ゾンビのスポーンエッグ=ドラウンドのスポーンエッグ",
      "§bこのカードの所持数は相手プレイヤーに認知される。",
    ],
    texture: "textures/items/heartofthesea_closed"
  },
  {
    name:["minecraft:drowned", "minecraft:drowned_spawn_egg"],
    displayName: "ドラウンド",
    type: "entity",
    attribute: "水中・速攻",
    hp: "35",
    atk: "-",
    Sact: "20",
    Bact: "6",
    text: [
      "§b召喚時効果 / 草ブロック、トライデントを入手する。",
      "§bターン開始時効果 / 自分の手札にある「ゾンビのスポーンエッグ」を「ドラウンドのスポーンエッグ」にする。",
      "§bトライデントを入手する。",
      "§b特殊効果 / 自分の場に3体ドラウンドがいるとき、トライデントを使用するたびに海洋の心を1つ入手する。",
      "§b特殊効果 / 装備がなくてもダメージを少し軽減する。",
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_drowned"
  },
  {
    name:["minecraft:trident"],
    displayName: "トライデント",
    type: "item",
    attribute: "武器",
    Cact: "1",
    text: [
      "§bこのカードは海洋の心を6つ以上所持していないと使用することができない。",
      "§b使用時 / 海洋の心を1つ消費して、相手モブに30ダメージ与えるか相手プレイヤーに3ダメージを与える。",
      "§b水中モブに使用するとそのモブを除外する。",
    ],
    texture: "textures/items/trident"
  },
  {
    name:["minecraft:elder_guardian", "minecraft:elder_guardian_spawn_egg"],
    displayName: "エルダーガーディアン",
    type: "entity",
    attribute: "水中",
    hp: "150",
    atk: "70",
    Sact: "-",
    Bact: "10",
    text: [
      "§b特殊効果 / 相手のオレンジボタンを封印する。",
      "§b除外無効"
    ],
    texture: "textures/items/spawn_eggs/spawn_egg_elder_guardian"
  },
  // イベントアイテム
  {
    name:["minecraft:snowball"],
    displayName: "雪玉",
    type: "item",
    attribute: "イベントアイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分の空きスロット全てに「スノーゴーレム」を召喚する。",
      "§bこのアイテムは自分ターン終了時に消滅する。"
    ],
    texture: "textures/items/snowball"
  }
]