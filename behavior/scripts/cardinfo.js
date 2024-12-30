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
  },
  genocide: {
    low:[
      "略奪者",
      "トラップチェスト",
      "ヴィンディケーター",
      "ヴェックス"
    ],
    high:[
      "エヴォーカー",
      "防具立て",
      "ラヴェジャー",
      "不吉な旗"
    ]
  }
}

export const cardList = [
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
    name:["minecraft:wooden_sword"],
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
      "§b使用時 / 丸石と石炭を入手する。",
      "§b+丸石 = 石のツルハシ",
      "§b+鉄のインゴット = 鉄のツルハシ"
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
    name:["minecraft:coal"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+生の豚肉 = 焼き豚",
      "§b+スケルトン = ウィザースケルトン",
      "§b+くり抜かれたカボチャ = ジャック・オ・ランタン" 
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
      "§b使用時 / 「スノーゴーレム」、「アイアンゴーレム」を入手する。",
      "§b+石炭 = ジャック・オ・ランタン"
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
    attribute: "アイテム・オブジェクト",
    Cact: "15",
    text: [
      "§bお互いの場のアンデッド系モブに即死ダメージを与える。(除外効果ではない)",
      "§bそれ以外のモブは全回復し、すべてのモブから除外無効効果をなくす。",
      "§6オブジェクト効果 / ターン開始時に村人を1枚獲得する。",
      "§6このオブジェクトがある間、自分は村人のSactが0になる。"
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
    name:["minecraft:lit_pumpkin"],
    type: "item",
    attribute: "オブジェクト",
    Cact: "20",
    text: [
      "§bこのカードは自分のスロットに「ゴーレム」カードが存在しないと使用/設置できない。",
      "§6オブジェクト効果",
      "§6設置時 / 相手のオブジェクトをジャック・オ・ランタンに変え、",
      "§6元々設置してあったオブジェクトは自分のものになる。"
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
      "§bたまに装備を付けた硬いゾンビが出る。",
      "§b+生の豚肉 = ゾンビピッグマン"
    ],
    enhance:{
      type: "entity",
      attribute: "エンハンス",
      hp: "55",
      atk: "15x2",
      Sact: "-",
      Bact: "8",
      text: [
        "§b強化時効果 / HPを全回復し、草ブロックを3枚入手する。",
        "§b装備がなくても防御力が2ある。"
      ]
    }
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
      "§bたまに装備を付けたスケルトンが出る。",
      "§b+石炭 = ウィザースケルトン",
      "§b+赤いキノコ = ボグド"
    ],
    enhance:{
      type: "entity",
      attribute: "エンハンス",
      hp: "45",
      atk: "-",
      Sact: "-",
      Bact: "6",
      text: [
        "§b強化時効果 / 矢を1枚入手する。",
        "§bターン開始時効果 / 自分の場のモブの数だけ矢を入手する。"
      ]
    }
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
      "§bターン開始時効果 / 相手のモブ全員(浮遊、ガードを除く)に5ダメージを与え、",
      "§b相手のオブジェクトを破壊する。"
    ],
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
    type: "entity",
    attribute: "なし",
    hp: "26",
    atk: "15",
    Sact: "5",
    Bact: "11",
    text: [
      "§bターン開始時効果 / 自分を全回復する。"
    ],
    enhance:{
      type: "entity",
      attribute: "エンハンス",
      hp: "45",
      atk: "20",
      Sact: "-",
      Bact: "11",
      text: [
        "§b強化時効果 / 「奇妙なポーション」を2つ入手する。",
        "§bターン経過時効果 / 「奇妙なポーション」を1つ入手する。",
        "§bこのモブを全回復する。"
      ]
    }
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
    Cact: "30",
    text: [
      "§b使用時 / 相手モブ全員に10ダメージを与え、以下のカードからランダムで獲得する。",
      "§b「エンチャントされた金のリンゴ」",
      "§b「ストレイ」x2",
      "§b「ハスク」x2",
      "§b「ファントム」x2",
      "§6オブジェクト効果 / ターン開始時に草ブロックを3つ入手する。"
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
      "§b使用時 / 自分のHP上限を40にし、全回復する。"
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
    attribute: "アイテム・オブジェクト",
    Cact: "10",
    text: [
      "§b使用時 / 自分のモブに使用した次の相手ターンにそのモブが死亡すると、",
      "§bそのスロットにゾンビピッグマンを召喚する。",
      "§6オブジェクト効果 / 相手のターンに自分のブタが死亡するとそのスロットに",
      "§6ゾンビピッグマンを召喚する。"
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
    name:["minecraft:potato"],
    type: "item",
    attribute: "アイテム",
    Cact: "40",
    text: [
      "§b使用時 / なぜか「ブレイズ」を召喚できる。"
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
      "§b相手がドローするたびに相手に1ダメージ与える。",
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
      "§b合成するためには20act消費する必要がある。"
    ]
  },
  {
    name:["minecraft:saddle"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分の場にストライダーがいるときのみ使える。",
      "§b使用時 / 相手のモンスター1体と",
      "§b自分の場のすべてのストライダーを除外する。"
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
    Sact: "30",
    Bact: "1",
    text: [
      "§b召喚時効果 / 相手の場にオブジェクトがある時、相手のオブジェクトを破壊し、",
      "§bさらに召喚したレーンの相手のモブを除外する。"
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
      "§bターン終了時効果 / 相手の手札に「氷塊」を4枚加える。",
      "§b自分の場に存在するスノーゴレーム1体につき追加で4枚相手の手札に「氷塊」を加える。"
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
      "§b+白色の羊毛 = 赤色の羊毛"
    ]
  },
  {
    name:["minecraft:dandelion", "minecraft:yellow_flower"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白色の羊毛 = 黄色の羊毛"
    ]
  },
  {
    name:["minecraft:pink_tulip"],
    type: "item",
    attribute: "合成素材",
    Cact: "-",
    text: [
      "§b+白色の羊毛 = 桃色の羊毛"
    ]
  },
  {
    name:["minecraft:cactus"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b使用時 / 相手のモブ全員に5ダメージを与える。(浮遊、ガードを除く)",
      "§b+白色の羊毛 = 緑色の羊毛"
    ]
  },
  {
    name:["minecraft:bee", "minecraft:bee_spawn_egg"],
    type: "entity",
    attribute: "浮遊・速攻",
    hp: "10",
    atk: "15",
    Sact: "4",
    Bact: "5",
    text: [
      "§b召喚時効果 / 自分のオブジェクトがミツバチの巣であれば",
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
    Cact: "1",
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
    Cact: "1",
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
    Cact: "1",
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
      "§b使用時 / 「ウシ」「羊」を1つずつ入手する。",
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
      "§b+スケルトン = ボグド",
      "§b+ウシ = ムーシュルーム"
    ]
  },
  {
    name:["minecraft:packed_ice"],
    type: "item",
    attribute: "ハンドアイテム",
    Cact: "10",
    text: [
      "§b使用することでも消費できる。",
      "§b「ドロー」「攻撃」をすると1つずつ消滅する。",
      "§bこのカードを持っている限りピンク色のボタンを使用できない。",
      "§b自分のターン終了時にこのカードを持っていると1つにつき1ダメージ受ける。"
    ]
  },
  {
    name:["minecraft:bread"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のHPを3回復する。"
    ]
  },
  {
    name:["minecraft:cake"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のHPを9回復して「チェスト」を1つ入手する。"
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
    hp: "30",
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
      "§b+卵+小麦 = ケーキ",
      "§bクラフト時にactを3消費する。"
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
    name:["minecraft:pillager", "minecraft:pillager_spawn_egg"],
    type: "entity",
    attribute: "残虐",
    hp: "45",
    atk: "-",
    Sact: "5",
    Bact: "2",
    text: [
      "§aこのモブは§c赤スロット§aにいる§e村人§aを置き換えることで召喚できる。",
      "§b召喚時効果 / 使用者に3ダメージ与え、草ブロックを2つ入手する。",
      "§bターン開始時効果 / 草ブロックを1つ、矢を2つ入手する。",
      "§b使用者に2ダメージ与える。"
    ]
  },
  {
    name:["minecraft:trapped_chest"],
    type: "item",
    attribute: "アイテム・オブジェクト",
    Cact: "2",
    text: [
      "§aこのカードは自分の場に「残虐」モブがいるときのみ使用できる。",
      "§b使用時 / 「不吉な瓶」「不死のトーテム」「ニンジン付きの棒」を入手する。",
      "§6オブジェクト効果 / 相手が「チェスト」を使用した際、50%の確率で以下の効果が発動する。",
      "§6相手の「チェスト」の効果を無効にし、このオブジェクトを破壊する。"
    ]
  },
  {
    name:["minecraft:vindicator", "minecraft:vindicator_spawn_egg"],
    type: "entity",
    attribute: "残虐・ガード・速攻",
    hp: "65",
    atk: "-",
    Sact: "5",
    Bact: "2",
    text: [
      "§aこのモブは§9青スロット§aにいる§e村人§aを置き換えることで召喚できる。",
      "§b召喚時効果 / 鉄の斧を入手する。使用者に4ダメージ与える。",
      "§bターン開始時効果 / 鉄の斧を入手する。使用者に2ダメージ与える。"
    ]
  },
  {
    name:["minecraft:vex", "minecraft:vex_spawn_egg"],
    type: "entity",
    attribute: "残虐・浮遊",
    hp: "20",
    atk: "20",
    Sact: "4",
    Bact: "2",
    text: [
      "§bこのモブが存在する限り「ヴェックス」を除く自分の場の「残虐」",
      "§bモブが受けるダメージは半分になる。(小数点以下切り捨て)",
      "§bターン終了時効果 / 使用者に1ダメージ与える。"
    ]
  },
  {
    name:["minecraft:evocation_illager", "minecraft:evoker_spawn_egg"],
    type: "entity",
    attribute: "残虐",
    hp: "35",
    atk: "-",
    Sact: "5",
    Bact: "2",
    text: [
      "§aこのモブは§f白スロット§aにいる§e村人§aを置き換えることで召喚できる。",
      "§b召喚時効果 / 不死のトーテムを入手する。使用者に3ダメージ与える。",
      "§b自分の空いているスロットに「ヴェックス」を召喚する。",
      "§bターン終了時効果 / 自分の空いているスロットに「ヴェックス」を召喚する。",
      "§bターン開始時効果 / 使用者に5ダメージ与え、",
      "§b相手の赤スロットと青スロットに存在するモブに20ダメージ与える。"
    ]
  },
  {
    name:["minecraft:armor_stand"],
    type: "item",
    attribute: "アイテム",
    Cact: "6",
    text: [
      "§b使用時 / 使用者に5ダメージ与える。",
      "§bその後、指定した相手のスロットに「防具立て」を設置する。",
      "§b「防具立て」は攻撃の対象にならず、あらゆるダメージは無効化される。",
      "§b「防具立て」のあるスロットにはモブを召喚できない。",
      "§bこのカードが置かれたプレイヤーのターンが終了したときにこのカードを破壊する。"
    ]
  },
  {
    name:["minecraft:ravager", "minecraft:ravager_spawn_egg"],
    type: "entity",
    attribute: "残虐",
    hp: "100",
    atk: "70",
    Sact: "8",
    Bact: "4",
    text: [
      "§aこのモブは自分の場に「残虐」カードがあるときのみ",
      "§f白スロット§aに召喚できる。",
      "§b召喚時効果 / 使用者に4ダメージ与える。",
      "§bターン開始時効果 / 草ブロックを2枚入手する。"
    ]
  },
  {
    name:["minecraft:banner"],
    type: "item",
    attribute: "アイテム",
    Cact: "9",
    text: [
      "§aこのカードは自分の場の「略奪者」「ヴィンディケーター」",
      "§a「エヴォーカー」に対してのみ使用できる。",
      "§b使用時 / 選択したモブを「大将」にする。",
      "§b「大将」になったモブはHPが全回復し、襲撃モードに突入する。",
      "§b襲撃モード中は使用者のHP上限が8増加し、",
      "§b使用者のターン開始時に草ブロック、石の剣を追加で1枚入手し、",
      "§bactを20にリセットする。",
      "§b「大将」がいなくなると襲撃モードは終了する。"
    ]
  },
  {
    name:["minecraft:iron_axe"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 白スロットに居る敵に35ダメージ与え、",
      "§bそれ以外のスロットに居る敵に15ダメージを与える。"
    ]
  },
  {
    name:["mcg:totem"],
    type: "item",
    attribute: "アイテム",
    Cact: "1",
    text: [
      "§aこのカードは襲撃モード中にのみ使用できる。",
      "§b使用時 / 自分のHPを全回復する。"
    ]
  },
  {
    name:["minecraft:ominous_bottle"],
    type: "item",
    attribute: "強化素材",
    Cact: "2",
    text: [
      "§aこのカードは自分の場の「ウィッチ」にのみ使用できる。",
      "§b使用時 / ウィッチをウィッチロードに進化させる。"
    ]
  },
  {
    name:["mcg:awkward_potion"],
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
    ]
  },
  {
    name:["mcg:heal_potion"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b自分か自分の場のモブに対して使用できる。",
      "§b使用時 / 対象に15HP分の回復効果を付与する。",
      "§bプレイヤーに対しては5HP分の回復効果を付与する。",
      "§bアンデッド系モブに対しては防御力貫通の15ダメージを与える。",
      "§b+クリーパー = 回復のスプラッシュポーション"
    ]
  },
  {
    name:["mcg:heal_splash_potion"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分のモブ全体に対して、または相手のモブ1体に対して使用できる。",
      "§b使用時 / 対象に15HP分の回復効果を付与する。",
      "§bアンデッド系モブに対しては防御力貫通のダメージを与える。"
    ]
  },
  {
    name:["mcg:damage_potion"],
    type: "item",
    attribute: "アイテム・合成素材",
    Cact: "0",
    text: [
      "§b自分または相手の場のモブ1体、または相手プレイヤーに対して使用できる。",
      "§b使用時 / 対象に20HP分のダメージ効果を付与する。",
      "§bプレイヤーに対しては3HP分のダメージ効果を付与する。",
      "§bアンデッド系モブに対しては20HP分の回復効果を与える。",
      "§b+クリーパー = 負傷のスプラッシュポーション"
    ]
  },
  {
    name:["mcg:damage_splash_potion"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b自分のモブ全体または相手のモブ全体に対して使用できる。",
      "§b使用時 / 対象に20HP分のダメージ効果を付与する。",
      "§bアンデッド系モブに対しては20HP分の回復効果を与える。"
    ]
  },
  {
    name:["mcg:speed_potion"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 25actを獲得する。"
    ]
  },
  {
    name:["mcg:fireresistance_potion"],
    type: "item",
    attribute: "アイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分のモブ1体(浮遊を除く)に対してガード属性を付与する。"
    ]
  },
  {
    name:["minecraft:snowball"],
    type: "item",
    attribute: "イベントアイテム",
    Cact: "0",
    text: [
      "§b使用時 / 自分の空きスロット全てに「スノーゴーレム」を召喚する。",
      "§bこのアイテムは自分ターン終了時に消滅する。"
    ]
  }
]