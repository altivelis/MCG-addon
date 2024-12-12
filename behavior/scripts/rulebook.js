import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { cardBookForm_home } from "./cardbook";

mc.world.afterEvents.playerInteractWithBlock.subscribe(data=>{
  const {player, block} = data;
  if(block.typeId != "minecraft:chest" || `${block.location.x} ${block.location.y} ${block.location.z}` != "-60 -54 -25") return;
  /**
   * @type {mc.Container}
   */
  let inv = block.getComponent(mc.BlockInventoryComponent.componentId).container;
  let rulebook = new mc.ItemStack("minecraft:book");
  rulebook.nameTag = "§l§eMCG説明書";
  let cardbook = new mc.ItemStack("minecraft:book");
  cardbook.nameTag = "§l§aカード図鑑";
  if(!inv.getItem(0)) inv.setItem(0, rulebook);
  if(!inv.getItem(1)) inv.setItem(1, cardbook);
})

mc.world.afterEvents.itemUse.subscribe(data=>{
  const {source, itemStack} = data;
  if(itemStack.typeId != "minecraft:book") return;
  switch(itemStack?.nameTag){
    case "§l§aカード図鑑":
      cardBookForm_home(source);
      break;
    case "§l§eMCG説明書":
      ruleBookForm_home(source);
      break;
  }
})

mc.world.afterEvents.buttonPush.subscribe(data=>{
  /**
   * @type {{source: mc.Player, block: mc.Block, dimension: mc.Dimension}}
   */
  const {source, block, dimension} = data;
  if(source.typeId != "minecraft:player") return;
  if(block.typeId != "minecraft:acacia_button") return;
  switch(`${block.location.x} ${block.location.y} ${block.location.z}`){
    case "18 5 1":
    case "-18 5 -1":
      cardBookForm_home(source);
      break;
    case "18 5 -1":
    case "-18 5 1":
      ruleBookForm_home(source);
      break;
  }
})

/**
 * @param {mc.Player} player 
 */
function ruleBookForm_home(player){
  let form = new ui.ActionFormData().title("MCG説明書")
    .body("お互いの場にモブを出し合い、モブの効果で相手を攻撃するカードバトルゲームです。")
    .button("§l§3用語説明", "textures/ui/book_edit_hover")
    .button("§l§2操作方法", "textures/ui/controller_glyph_color")
    .button("§l§5ゲームシステム", "textures/blocks/command_block")
    .button("§l§6カード図鑑", "textures/items/book_written")
    .button("§l§8パッチノート", "textures/ui/book_addtextpage_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    switch(res.selection){
      case 0:
        form_word(player);
        break;
      case 1:
        form_control(player);
        break;
      case 2:
        form_system(player);
        break;
      case 3:
        cardBookForm_home(player);
        break;
      case 4:
        form_patch(player);
        break;
    }
  })
}

const word_list = [
  {
    name: "act",
    description: [
      "ゲーム内で行動を起こすために必要なポイントです。",
      "モブを召喚するときやアイテムを使用するときに消費します。",
      "これを使ってゲームを進行します。",
      "余ったactは次のターンに繰り越すことができます。"
    ]
  },
  {
    name: "Sact",
    description: [
      "モブを召喚するために必要なactです。",
      "actが不足している場合モブの召喚はできません。"
    ]
  },
  {
    name: "Bact",
    description: [
      "モブが1ターン生存した場合に追加でもらえるactです。",
      "自分のターンのはじめにもらえます。",
      "何ターン生存してもBactはターンをまたぐごとにもらえます。"
    ]
  },
  {
    name: "Cact",
    description: [
      "アイテムカードを使用するのに必要なactを指します。",
      "Cactを支払っても基本的にモブは出現しませんが、戦況を有利に進めるアイテムを獲得できます。"
    ]
  },
  {
    name: "スロット",
    description: [
      "モブを召喚する場所のことを指します。",
      "このゲームでは赤レーンスロット、白レーンスロット、青レーンスロットがあります。同じスロットにモブを同時に出現させることはできません。",
      "合計3体まで召喚できます。"
    ]
  },
  {
    name: "レーン",
    description: [
      "スロットが乗っている色のついた線のことを指します。",
      "対象を指定してカードを使う場合にはこのレーン上にいる相手を指定してカードを使用します。",
      "スロットと同様に赤レーン、白レーン、青レーンがあります。"
    ]
  },
  {
    name: "オブジェクト",
    description: [
      "自分の場の左側に設置できるブロックのことを指します。",
      "オブジェクトは各プレイヤー1つだけ設置できます。",
      "オブジェクトはターン中何度でも置き直せます。",
      "設置にかかるactはカードを通常使用するCactと同じです。",
      "オレンジの感圧板でオブジェクトを設置できます。"
    ]
  },
  {
    name: "ダイレクトアタック",
    description: [
      "相手のスロットにモブがいなかったとき、直接プレイヤーを攻撃できます。",
      "また、相手のスロットが浮遊属性モブのみのときも直接攻撃できます。"
    ]
  },
  {
    name: "オーバーコスト",
    description: [
      "actが1足りなくてもカードを使うことができます。",
      "その代わりに自身に5ダメージのペナルティーが発生します。",
      "別の要因でactがマイナスになった場合にはペナルティーを受けてactが0にリセットされます。"
    ]
  }
]

/**
 * @param {mc.Player} player 
 */
function form_word(player){
  let form = new ui.ActionFormData().title("用語説明")
  word_list.forEach(e=>{
    form.button(e.name);
  })
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    if(res.selection == word_list.length){
      ruleBookForm_home(player);
      return;
    }
    let form2 = new ui.MessageFormData().title("用語説明")
      .body(word_list[res.selection].name + "\n" + word_list[res.selection].description.join("\n"))
      .button1("§l§c閉じる")
      .button2("§l§8戻る");
    form2.show(player).then(res2=>{
      if(res2.canceled) return;
      if(res2.selection == 0) return;
      if(res2.selection == 1) form_word(player);
    })
  })
}

const control_list = [
  {
    name: "対戦の始め方",
    description: [
      "§c赤§rと§9青§rの対戦予約ボタンで対戦予約を行うことができます。",
      "予約が完了したプレイヤーは予約した色のモヤをまといます。",
      "両方のプレイヤーが集まったときに自動的に試合が始まります。"
    ]
  },
  {
    name: "カードの発動",
    description: [
      "使いたいカードを持ちながらボタンを押すとそのカードの効果が発動します。どのボタンを押すかによって効果の対象を選ぶことができます。",
      "",
      "§c赤§r、白、§9青§rのボタン",
      "それぞれ対応したレーンのモブに対して発動します。",
      "",
      "§dピンク§rのボタン",
      "自分・相手プレイヤー、全体に対して発動します。",
      "",
      "§6オレンジ§rのボタン",
      "オブジェクト設置用のボタンです。"
    ]
  },
  {
    name: "ドロー",
    description: [
      "プレイヤーは§a草ブロック§rを1つ消費してカードを入手することができます。これをドローといいます。",
      "ジャンルごとに選んでドローすることができます。",
      "一部、ドローするために条件のあるデッキがあります。",
      "",
      "コストレバー",
      "各プレイヤーは§e金ブロック§rに設置されたレバーを操作することができます。",
      "レバーを下げることで消費actの高いカードをドローすることができます。",
      "序盤は使えるactに限りがあるのでレバーを上げておくことをおすすめします。"
    ]
  },
  {
    name: "クラフト",
    description: [
      "ある特定のアイテムの組み合わせでアイテムをクラフトできます。",
      "自分のターンに組み合わせるアイテムを投げるとクラフトしたアイテムを入手できます。"
    ]
  },
  {
    name: "ターンの終了",
    description: [
      "残り時間は画面右の「timer」に書かれています。これが0になったとき、強制的にターンを交代します。",
      "自分のターン開始時にはコンパスが配られます。§cコンパス§rを捨てることで即座にターンを終了することができます。"
    ]
  },
  {
    name: "サレンダー",
    description: [
      "§a緑色§rのブロックについているボタンを押すと降参することができます。",
      "このボタンを押した場合即座に敗北します。"
    ]
  }
]

/**
 * @param {mc.Player} player 
 */
function form_control(player){
  let form = new ui.ActionFormData().title("操作方法");
  let text = "";
  control_list.forEach(e=>{
    text += "§l" + e.name + "\n" + e.description.join("\n") + "\n\n";
  })
  form.body(text);
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    ruleBookForm_home(player);
  })
}

let system_list = [
  {
    name: "勝利条件",
    description: [
      "以下の内いずれかを達成すると勝利となります。",
      "・相手プレイヤーの§aHP§rを0にする",
      "・ウィザーを召喚する"
    ]
  },
  {
    name: "ターン経過",
    description: [
      "自分のターン開始時に5act、",
      "自分のターン終了時に3act獲得します。",
      "また、自分のターン終了時には木以外の剣、矢は消滅します。"
    ]
  },
  {
    name: "属性",
    description: [
      "モブの中には特殊な属性を持ったモブがいます。",
      "",
      "§6速攻§r",
      "場に出してすぐ攻撃することができます。",
      "",
      "§2浮遊§r",
      "「矢」以外からダメージを受けません。",
      "",
      "§d貫通§r",
      "相手のスロットにモブがいる場合でも直接相手プレイヤーを攻撃することができます。",
      "",
      "§9ガード§r",
      "剣以外からダメージを受けません。",
    ]
  },
  {
    name: "攻撃",
    description: [
      "自分のターン開始時に自分の場に生き残っているモブの§cATK§rの値と同じダメージの剣を獲得します。",
      "レーンの感圧板を押して使うとモブに、§dピンク§rの感圧板を押して使うとプレイヤーに攻撃します。",
      "攻撃できない対象を指定してもアイテムは消費されません。"
    ]
  }
]

/**
 * @param {mc.Player} player 
 */
function form_system(player){
  let form = new ui.ActionFormData().title("ゲームシステム");
  let text = "";
  system_list.forEach(e=>{
    text += "§l" + e.name + "\n" + e.description.join("\n") + "\n\n";
  })
  form.body(text);
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    ruleBookForm_home(player);
  })
}

let patch_list = [
  {
    ver: "1.5.2",
    description: [
      "-ミツバチの巣を設置した状態で、自分の場にハチがいなくても花を使用できてしまっていた問題を修正しました。",
      "-途中抜けしたプレイヤーが戻ってきたときに様々な問題が発生する恐れがあった問題を修正しました。",
      "-ケーキを作る際にactが3消費されるようになりました。",
      "-ウィッチがポーションにより自動で回復する仕様を削除し、ターン開始時にのみ回復するように変更しました。",
      "-追加されたカード",
      "--ジャック・オ・ランタン",
      "-変更されたカード",
      "--泣く黒曜石",
      "--鐘",
      "--ブレイズ",
      "-調整されたカード",
      "--ウシ",
      "--各種クワ",
      "-詳細はカード図鑑でご確認ください。"
    ]
  },
  {
    ver: "1.5.1",
    description: [
      "-§c緊急アップデート§r",
      "-モバイル端末でホストした際に正常に動作しない問題を修正しました。",
      "-誤字を修正しました。",
      "-設定の初期化コマンドの名前を変更しました。"
    ]
  },
  {
    ver: "1.5.0",
    description: [
      "-システムをScriptAPIを使用して再構築しました。",
      "-カードの使用方法が「アイテムを捨てる」から「ボタンを押す」に変更されました。",
      "-より詳細にバトルログが表示されるようになりました。",
      "-観戦者がスペクテイターになれるようになりました。",
      "-観戦席のデザインが変更されました。",
      "-片方のプレイヤーの立ち位置が1ブロック狭かった問題を修正しました。",
      "-除外無効、ガードのパーティクルを変更しました。",
      "-カード使用ボタン、ドローボタンが連打できるようになりました。",
      "-ボグド Sact:25→15",
      "-シロクマ Sact:60→50",
      "-ニワトリ Bact:21→15",
      "-オウム Bact:5→3",
      "-ハチ Bact:8→5",
      "-コンポスター Cact:3→4",
      "-ムーシュルーム Bact:14→11 HP:82→62 除外無効削除",
      "-ケーキ 回復量:13→9",
      "-卵 回復量:3→1",
      "-パン 回復量:5→3",
      "-モンスタースポナー act獲得量:20→15"
    ]
  }
]

/**
 * @param {mc.Player} player 
 */
function form_patch(player){
  let form = new ui.ActionFormData().title("パッチノート");
  let text = "";
  patch_list.forEach(e=>{
    text += "§lver:" + e.ver + "\n" + e.description.join("\n") + "\n\n";
  })
  form.body(text);
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    ruleBookForm_home(player);
  })
}