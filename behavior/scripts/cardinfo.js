export const drawList = {
  grass: {
    low:[
      "ブタ",
      "村人",
      "チェスト",
      "くり抜かれたカボチャ"
    ],
    high:[
      "オオカミ",
      "鐘",
      "アレイ",
      "パンダ"
    ]
  },
  stone: {
    low:[
      "ゾンビ",
      "スケルトン",
      "クリーパー",
      "ウィッチ"
    ],
    high:[
      "モンスタースポナー",
      "ファントム",
      "ブリーズ",
      "エンダーチェスト"
    ]
  },
  hay: {
    low:[
      "ニワトリ",
      "オウム",
      "ミツバチの巣",
      "コンポスター"
    ],
    high:[
      "キツネ",
      "カエル",
      "ムーシュルーム",
      "ホッキョクグマ"
    ]
  },
  nether: {
    low:[
      "ゾンビピッグマン",
      "ウィザースケルトン",
      "泣く黒曜石",
      "ウィザーローズ"
    ],
    high:[
      "ストライダー",
      "溶岩入りバケツ",
      "じゃがいも(ブレイズ)",
      "ネザライトインゴット"
    ]
  }
}

export const cardList = [
  {
    name: ["minecraft:pig", "minecraft:pig_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "10",
    atk: "0",
    Sact: "2",
    Bact: "14",
    text: [
      "§b召喚時効果 / 生の豚肉を1つ入手"
    ]
  },
  {
    name: ["minecraft:villager_v2", "minecraft:villager_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "20",
    atk: "0",
    Sact: "3",
    Bact: "8",
    text: [
      "§b召喚時効果 / 草ブロックを2つ入手",
      "§bターン開始時効果 / 草ブロックを1つ入手"
    ]
  },
  {
    name: ["minecraft:chest"],
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "3",
    text: [
      "§b使用時 / 「木の剣、木のツルハシ、ニンジン付きの棒」を獲得する。",
      "§6オブジェクト効果 / 自分の番開始時に草ブロックを1つ入手する。"
    ]
  },
  {
    name:["minecraft:carved_pumpkin"],
    type: "item",
    attribute: "アイテム",
    Cact: "2",
    text: [
      "§b使用時 / 「スノーゴーレム」、「アイアンゴーレム」を入手する。"
    ]
  },
  {
    name:["minecraft:wolf", "minecraft:wolf_spawn_egg"],
    type: "entity",
    attribute: "速攻",
    hp: "32",
    atk: "30",
    Sact: "40",
    Bact: "4",
    text: [
      "§b生の豚肉を使用すると追加で1回攻撃できる。"
    ]
  },
  {
    name:["minecraft:bell"],
    type: "item",
    attribute: "アイテム",
    Cact: "15",
    text: [
      "§bお互いの場のアンデッド系モブに即死ダメージを与える。(除外効果ではない)",
      "§bそれ以外のモブは全回復し、すべてのモブから除外無効効果をなくす。"
    ]
  },
  {
    name:["minecraft:allay", "minecraft:allay_spawn_egg"],
    type: "entity",
    attribute: "浮遊・速攻",
    hp: "20",
    atk: "50",
    Sact: "40",
    Bact: "20",
    text: [
      "§bアレイがいる状態でドローするたびに4act獲得する。",
      "§bこの効果はアレイが複数いても重ならない。"
    ]
  },
  {
    name:["minecraft:panda", "minecraft:panda_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "300",
    atk: "70",
    Sact: "80",
    Bact: "8",
    text: [
      "§b除外無効"
    ]
  },
  {
    name:["minecraft:zombie", "minecraft:zombie_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "20",
    atk: "15",
    Sact: "3",
    Bact: "3",
    text: [
      "§b召喚時効果 / 草ブロックを2つ獲得",
      "§b装備がなくても防御力が2ある。",
      "§bたまに装備を付けた硬いゾンビが出る。"
    ]
  },
  {
    name:["minecraft:skeleton", "minecraft:skeleton_spawn_egg"],
    type: "entity",
    attribute: "速攻・貫通",
    hp: "20",
    atk: "-",
    Sact: "5",
    Bact: "3",
    text: [
      "§b召喚時効果 / 「矢」を1つ獲得する。",
      "§bターン開始時効果 / 「矢」を1つ獲得する。",
      "§bたまに装備を付けたスケルトンが出る。"
    ]
  },
  {
    name:["minecraft:creeper", "minecraft:creeper_spawn_egg"],
    type: "entity",
    attribute: "ガード",
    hp: "20",
    atk: "-",
    Sact: "4",
    Bact: "3",
    text: [
      "§bターン開始時効果 / 相手のモブ全員(浮遊、ガードを除く)に5ダメージを与える。",
      "§b相手のオブジェクトを破壊する。"
    ]
  },
  {
    name:["minecraft:witch", "minecraft:witch_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "26",
    atk: "15",
    Sact: "5",
    Bact: "11",
    text: [
      "§bターン開始時効果 / 自分を全回復する。",
      "§b時間経過で回復するので同じターン内でも一気に倒したほうが良い。"
    ]
  },
  {
    name:["minecraft:mob_spawner"],
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "8",
    text: [
      "§b使用時 / 「ハスク」、「ストレイ」、「洞窟グモ」を獲得する。",
      "§6オブジェクト効果 / 自分のターン開始時、自分のactを15増やす。"
    ]
  },
  {
    name:["minecraft:phantom", "minecraft:phantom_spawn_egg"],
    type: "entity",
    attribute: "浮遊・速攻",
    hp: "20",
    atk: "15x2",
    Sact: "15",
    Bact: "6",
    text: []
  },
  {
    name:["minecraft:breeze", "minecraft:breeze_spawn_egg"],
    type: "entity",
    attribute: "浮遊",
    hp: "30",
    atk: "15",
    Sact: "45",
    Bact: "8",
    text: [
      "§b召喚時効果 / お互いの場のブリーズ以外のモブをすべて除外する。",
      "§b残ったモブからは除外無効効果をなくす。"
    ]
  },
  {
    name:["minecraft:ender_chest"],
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "25",
    text: [
      "§b使用時 / 相手モブ全員に10ダメージを与え、次のカードからランダムで獲得する。",
      "§b「エンチャントされた金のリンゴ」",
      "§b「ストレイ」x2",
      "§b「ハスク」x2",
      "§b「ファントム」x2",
      "§6オブジェクト効果 / ターン開始時に草ブロックを3つ入手する。"
    ]
  },
  {
    name:["minecraft:wither_rose"],
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
    ]
  },
  {
    name:["minecraft:zombie_pigman", "minecraft:zombie_pigman_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "20",
    atk: "20x2",
    Sact: "10",
    Bact: "15",
    text: [
      "§b召喚時効果 / 草ブロックを2つ獲得。",
      "§b装備がなくても防御力が2ある。",
    ]
  },
  {
    name:["minecraft:wither_skeleton", "minecraft:wither_skeleton_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "60",
    atk: "15x3",
    Sact: "20",
    Bact: "10",
    text: []
  },
  {
    name:["minecraft:crying_obsidian"],
    type: "item",
    attribute: "アイテム",
    Cact: "10",
    text: [
      "§b使用時 / 味方1体に除外無効効果を付与する。"
    ]
  },
  {
    name:["minecraft:strider", "minecraft:strider_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "32",
    atk: "0",
    Sact: "25",
    Bact: "25",
    text: [
      "§b召喚時効果 / 「鞍」を1つ入手する。"
    ]
  },
  {
    name:["minecraft:lava_bucket"],
    type: "item",
    attribute: "アイテム",
    Cact: "25",
    text: [
      "§b使用時 / 相手プレイヤーに4ダメージを与えて",
      "§bその後「泣く黒曜石」と「ジャガイモ」を入手する。"
    ]
  },
  {
    name:["minecraft:blaze", "minecraft:blaze_spawn_egg"],
    type: "entity",
    attribute: "浮遊",
    hp: "20",
    atk: "30",
    Sact: "30",
    Bact: "15",
    text: [
      "§bお互いのターン終了時 / 相手プレイヤーに2ダメージを与える。",
      "§b何体いてもダメージは重ならない。"
    ]
  },
  {
    name:["minecraft:netherite_ingot"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b木の剣と合成できる。",
      "§b合成するのに20act必要。"
    ]
  },
  {
    name:["minecraft:porkchop"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§bそのままオオカミに使用できる。",
      "§b+石炭 = 焼き豚",
      "§b+ゾンビ = ゾンビピッグマン"
    ]
  },
  {
    name:["minecraft:cooked_porkchop"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分のHPを6回復する。"
    ]
  },
  {
    name:["minecraft:snow_golem", "minecraft:snow_golem_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "36",
    atk: "15",
    Sact: "4",
    Bact: "2",
    text: [
      "§b除外無効"
    ]
  },
  {
    name:["minecraft:iron_golem", "minecraft:iron_golem_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "250",
    atk: "30x2",
    Sact: "80",
    Bact: "5",
    text: [
      "§b召喚時効果 / 自分の場に村人がいると40act獲得する。"
    ]
  },
  {
    name:["minecraft:husk", "minecraft:husk_spawn_egg"],
    type: "entity",
    attribute: "ガード",
    hp: "20",
    atk: "30",
    Sact: "10",
    Bact: "10",
    text: [
      "§bこのモブは剣以外から攻撃を受けない。",
      "§b装備がなくても防御力が2ある。"
    ]
  },
  {
    name:["minecraft:stray", "minecraft:stray_spawn_egg"],
    type: "entity",
    attribute: "速攻・貫通",
    hp: "40",
    atk: "-",
    Sact: "20",
    Bact: "10",
    text: [
      "§b召喚時効果 / 「矢」を2つ獲得する。",
      "§bターン開始時効果 / 「矢」を2つ獲得する。"
    ]
  },
  {
    name:["minecraft:cave_spider", "minecraft:cave_spider_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "13",
    atk: "30",
    Sact: "15",
    Bact: "0",
    text: [
      "§b召喚時効果 / 「クモの巣」を1つ獲得。"
    ]
  },
  {
    name:["minecraft:enchanted_golden_apple"],
    type: "item",
    attribute: "アイテム",
    Cact: "20",
    text: [
      "§b使用時 / 自分のHP上限を40にし、",
      "§b自分のHPを全回復する。"
    ]
  },
  {
    name:["minecraft:saddle"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分の場にストライダーがいるときだけ使える。",
      "§b使用時 / 相手のモンスター1体と",
      "§b自分の場のすべてのストライダーを除外する。"
    ]
  },
  {
    name:["minecraft:web"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 相手のactを15下げる。"
    ]
  },
  {
    name:["minecraft:wooden_sword"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 5",
      "§bプレイヤーに与えるダメージは1。"
    ]
  },
  {
    name:["minecraft:stone_sword"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 15",
      "§bプレイヤーに与えるダメージは3。",
      "§bターン終了時に消滅する。"
    ]
  },
  {
    name:["minecraft:golden_sword"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 20",
      "§bプレイヤーに与えるダメージは4。",
      "§bターン終了時に消滅する。"
    ]
  },
  {
    name:["minecraft:iron_sword"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 30",
      "§bプレイヤーに与えるダメージは6。",
      "§bターン終了時に消滅する。"
    ]
  },
  {
    name:["minecraft:diamond_sword"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 50",
      "§bプレイヤーに与えるダメージは10。",
      "§bターン終了時に消滅する。"
    ]
  },
  {
    name:["minecraft:netherite_sword"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b攻撃力: 70",
      "§bプレイヤーに与えるダメージは14。",
      "§bターン終了時に消滅する。"
    ]
  },
  {
    name:["minecraft:wooden_pickaxe"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 丸石と石炭を入手する。"
    ]
  },
  {
    name:["minecraft:stone_pickaxe"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 鉄インゴットを入手する。"
    ]
  },
  {
    name:["minecraft:iron_pickaxe"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§bダイヤモンドを入手する。"
    ]
  },
  {
    name:["minecraft:cobblestone"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text:[
      "§b+木の剣 = 石の剣",
      "§b+木のツルハシ = 石のツルハシ"
    ]
  },
  {
    name:["minecraft:iron_ingot"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+木の剣 = 鉄の剣",
      "§b+木のツルハシ = 鉄のツルハシ"
    ]
  },
  {
    name:["minecraft:diamond"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+木の剣 = ダイヤモンドの剣",
    ]
  },
  {
    name:["minecraft:coal"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+生の豚肉 = 焼き豚",
      "§b+スケルトン = ウィザースケルトン"
    ]
  },
  {
    name:["minecraft:arrow"],
    type: "item",
    attribute: "アイテム",
    Cact: "2",
    text: [
      "§b使用時 / 相手1体に30ダメージ",
      "§b浮遊している敵にも当たる。",
      "§bまた、相手スロットにモブがいてもプレイヤーを攻撃できる。",
      "§bプレイヤーに与えるダメージは1になる。",
      "§bターン終了時に消滅する。"
    ]
  },
  {
    name:["minecraft:carrot_on_a_stick"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のモブを1体除外してスロットを空けることができる。",
      "§bこの効果は除外無効のモブにも有効である。"
    ]
  },
  {
    name:["minecraft:compass"],
    type: "item",
    attribute: "アイテム",
    Cact: "-",
    text: [
      "§b使用時 / 自分のターンを終了する。"
    ]
  },
  {
    name:["minecraft:spyglass"],
    type: "item",
    attribute: "アイテム",
    Cact: "-",
    text: [
      "§b遠くを見るための道具。"
    ]
  },
  {
    name:["minecraft:grass_block"],
    type: "item",
    attribute: "アイテム",
    Cact: "-",
    text: [
      "§bドローするのに必要なアイテム。"
    ]
  },
  {
    name:["minecraft:wither_skeleton_skull"],
    type: "item",
    attribute: "アイテム",
    Cact: "300",
    text: [
      "§b使用時 / ウィザーを召喚する。",
      "§bウィザーの召喚に成功したとき、あなたは勝利する。"
    ]
  },
  {
    name:["minecraft:chicken", "minecraft:chicken_spawn_egg"],
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
    ]
  },
  {
    name:["minecraft:parrot", "minecraft:parrot_spawn_egg"],
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
    ]
  },
  {
    name:["minecraft:bee_nest"],
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
    ]
  },
  {
    name:["minecraft:composter"],
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "4",
    text: [
      "§b使用時 / 「木のツルハシ」と「木のクワ」、「ニンジン付きの棒」を1枚ずつ入手する。",
      "§6オブジェクト効果 / ターン開始時に「ポピー」「タンポポ」「桃色のチューリップ」",
      "§6「サボテン」からランダムに1枚入手する。"
    ]
  },
  {
    name:["minecraft:fox", "minecraft:fox_spawn_egg"],
    type: "entity",
    attribute: "速攻",
    hp: "34",
    atk: "30",
    Sact: "25",
    Bact: "12",
    text: [
      "§b召喚時効果 / 自分の場にあるオブジェクトと同じカードを1枚入手する。"
    ]
  },
  {
    name:["minecraft:frog", "minecraft:frog_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "10",
    atk: "0",
    Sact: "20",
    Bact: "1",
    text: [
      "§b召喚時効果 / 相手の場にオブジェクトがある時、相手のオブジェクトを破壊して",
      "§b自分と同じレーンのモブを除外する。"
    ]
  },
  {
    name:["minecraft:mooshroom", "minecraft:mooshroom_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "62",
    atk: "15",
    Sact: "20",
    Bact: "11",
    text: [
      "§b召喚時効果 / 「赤いキノコ」を入手する。"
    ]
  },
  {
    name:["minecraft:polar_bear", "minecraft:polar_bear_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "130",
    atk: "50",
    Sact: "50",
    Bact: "8",
    text: [
      "§bターン終了時効果 / 相手プレイヤーの手札に「氷塊」を4枚加える。",
      "§b自分の場にスノーゴレームがいるなら、追加で4枚相手プレイヤーに押し付けることができる。",
      "§bこの追加で「氷塊」を押し付ける効果はホッキョクグマ、スノーゴーレムが複数体いても重ならない。"
    ]
  },
  {
    name:["minecraft:egg"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 自分のHPを1回復する。",
      "§b+小麦+ミルクバケツ = ケーキ"
    ]
  },
  {
    name:["minecraft:poppy", "minecraft:red_flower"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白い羊毛 = 赤い羊毛"
    ]
  },
  {
    name:["minecraft:dandelion", "minecraft:yellow_flower"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白い羊毛 = 黄色い羊毛"
    ]
  },
  {
    name:["minecraft:pink_tulip"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白い羊毛 = 桃色の羊毛"
    ]
  },
  {
    name:["minecraft:cactus"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 相手のモブ全員に5ダメージを与える。(浮遊、ガードを除く)",
      "§b+白い羊毛 = 緑色の羊毛"
    ]
  },
  {
    name:["minecraft:bee", "minecraft:bee_spawn_egg"],
    type: "entity",
    attribute: "浮遊・速攻",
    hp: "10",
    atk: "15",
    Sact: "4",
    Bact: "8",
    text: [
      "§b召喚時効果 / 自分のオブジェクトにミツバチの巣があるなら",
      "§b「ハチミツ入りの瓶」を1つ入手する。",
    ]
  },
  {
    name:["minecraft:honey_bottle"],
    type: "item",
    attribute: "キープアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§b自分の「ミツバチの巣」がなくなると自動的に消費され、",
      "§b1つにつき10actと交換される。"
    ]
  },
  {
    name:["minecraft:wooden_hoe"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 「小麦」を1つ入手する。",
      "§b+丸石 = 石のクワ",
      "§b+鉄インゴット = 鉄のクワ"
    ]
  },
  {
    name:["minecraft:stone_hoe"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 「小麦」を1つ入手する。",
      "§b「草ブロック」を1つ入手する。",
      "§b「ポピー」「タンポポ」「桃色のチューリップ」「サボテン」の中からランダムに1つ入手する。"
    ]
  },
  {
    name:["minecraft:iron_hoe"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 「小麦」を2つ入手する。",
      "§b「草ブロック」を3つ入手する。",
      "§b「ポピー」「タンポポ」「桃色のチューリップ」「サボテン」の中からランダムに2つ入手する。"
    ]
  },
  {
    name:["minecraft:wheat"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 「ウシのスポーンエッグ」「羊のスポーンエッグ」を1つずつ入手する。",
      "§b+石炭 = パン",
      "§b+卵+ミルクバケツ = ケーキ"
    ]
  },
  {
    name:["minecraft:red_mushroom"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+スケルトンのスポーンエッグ = ボグドのスポーンエッグ",
      "§b+ウシのスポーンエッグ = ムーシュルームのスポーンエッグ"
    ]
  },
  {
    name:["minecraft:packed_ice"],
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "10",
    text: [
      "§bこのカードを使用すると10act消費する。",
      "§bドローするか攻撃すると自動的に1つずつ消滅する。",
      "§bこのカードを持っている限りピンク色の感圧板を使用できない。",
      "§b自分のターン終了時にこのカードを持っていると1つにつき1ダメージ受ける。"
    ]
  },
  {
    name:["minecraft:bread"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分プレイヤーのHPを3回復する。"
    ]
  },
  {
    name:["minecraft:cake"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分プレイヤーのHPを9回復して「チェスト」を1つ入手する。"
    ]
  },
  {
    name:["minecraft:sheep", "minecraft:sheep_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "10",
    atk: "0",
    Sact: "4",
    Bact: "5",
    text: [
      "§b召喚時効果 / 「白い羊毛」を1つ入手する。"
    ]
  },
  {
    name:["minecraft:cow", "minecraft:cow_spawn_egg"],
    type: "entity",
    attribute: "なし",
    hp: "34",
    atk: "15",
    Sact: "7",
    Bact: "2",
    text: [
      "§b召喚時効果 / 「ミルクバケツ」を1つ入手する。",
      "§b+赤いキノコ = ムーシュルームのスポーンエッグ"
    ]
  },
  {
    name:["minecraft:white_wool"],
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
    ]
  },
  {
    name:["minecraft:red_wool"],
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーは[§cATK§b:15]を得る。"
    ]
  },
  {
    name:["minecraft:yellow_wool"],
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時10act入手する。"
    ]
  },
  {
    name:["minecraft:pink_wool"],
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時に草ブロックを1つ入手する。"
    ]
  },
  {
    name:["minecraft:green_wool"],
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時に自分のHPを3回復する。"
    ]
  },
  {
    name:["minecraft:black_wool"],
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "-",
    text: [
      "§bこのカードは使用できない。",
      "§bこのカードを所持しているプレイヤーはターン開始時に相手プレイヤーに3ダメージを与える。"
    ]
  },
  {
    name:["minecraft:milk_bucket"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 自分の任意のモブ(浮遊を除く)にガード属性を付与する。",
      "§b+卵+小麦 = ケーキ"
    ]
  },
  {
    name:["minecraft:bogged", "minecraft:bogged_spawn_egg"],
    type: "entity",
    attribute: "速攻・貫通",
    hp: "16",
    atk: "-",
    Sact: "15",
    Bact: "10",
    text: [
      "§b召喚時効果 / 自分の場にオブジェクトがあると矢を3つ入手する。",
      "§bターン開始時効果 / 矢を1つ入手する。"
    ]
  },
  {
    name:["minecraft:potato"],
    type: "item",
    attribute: "アイテム",
    Cact: "40",
    text: [
      "§b使用時 / なぜか「ブレイズ」を召喚できる。"
    ]
  }
]