import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { cardInfo } from "./lib";

const cardBook_form = new ui.ActionFormData()
  .title("カード図鑑")
  .body(
    "ドローによって入手できるカードの内、消費actの§9低い§rカードは§9ローコスト§r、§c高い§rカードは§cハイコスト§rといいます。\n" +
    "効果で「+OO = XX」と書かれているカードはクラフト可能です。\n"
  )
  .button("§l一般カード", "textures/items/wood_sword")
  .button("§l§2現世§r§lカード", "textures/blocks/grass_side_carried")
  .button("§l§8洞窟§r§lカード", "textures/blocks/stone")
  .button("§l§4ネザー§r§lカード", "textures/blocks/netherrack")
  .button("§l§6アニマル§r§lカード", "textures/blocks/hay_block_side");

const cardLibrary = {
  normal: [
    {name: "ウィザースケルトンの頭", id: "minecraft:wither_skeleton_skull", icon: "textures/gui/newgui/mob_effects/wither_effect"},
    {name: "木の剣", id: "minecraft:wooden_sword", icon: "textures/items/wood_sword"},
    {name: "石の剣", id: "minecraft:stone_sword", icon: "textures/items/stone_sword"},
    {name: "金の剣", id: "minecraft:golden_sword", icon: "textures/items/gold_sword"},
    {name: "鉄の剣", id: "minecraft:iron_sword", icon: "textures/items/iron_sword"},
    {name: "ダイヤモンドの剣", id: "minecraft:diamond_sword", icon: "textures/items/diamond_sword"},
    {name: "ネザライトの剣", id: "minecraft:netherite_sword", icon: "textures/items/netherite_sword"},
    {name: "木のツルハシ", id: "minecraft:wooden_pickaxe", icon: "textures/items/wood_pickaxe"},
    {name: "石のツルハシ", id: "minecraft:stone_pickaxe", icon: "textures/items/stone_pickaxe"},
    {name: "鉄のツルハシ", id: "minecraft:iron_pickaxe", icon: "textures/items/iron_pickaxe"},
    {name: "石炭", id: "minecraft:coal", icon: "textures/items/coal"},
    {name: "丸石", id: "minecraft:cobblestone", icon: "textures/blocks/cobblestone"},
    {name: "鉄のインゴット", id: "minecraft:iron_ingot", icon: "textures/items/iron_ingot"},
    {name: "ダイヤモンド", id: "minecraft:diamond", icon: "textures/items/diamond"},
    {name: "ニンジン付きの棒", id: "minecraft:carrot_on_a_stick", icon: "textures/items/carrot_on_a_stick"},
    {name: "矢", id: "minecraft:arrow", icon: "textures/items/arrow"},
  ],
  overworld: {
    low: [
      {name: "ブタ", id: "minecraft:pig", icon: "textures/items/egg_pig"},
      {name: "村人", id: "minecraft:villager_v2", icon: "textures/items/egg_villager"},
      {name: "チェスト", id: "minecraft:chest", icon: "textures/blocks/chest_front"},
      {name: "くり抜かれたカボチャ", id: "minecraft:carved_pumpkin", icon: "textures/blocks/pumpkin_face_off"}
    ],
    high: [
      {name: "オオカミ", id: "minecraft:wolf", icon: "textures/items/egg_wolf"},
      {name: "鐘", id: "minecraft:bell", icon: "textures/blocks/bell_side"},
      {name: "アレイ", id: "minecraft:allay", icon: "textures/items/bundle_light_blue"},
      {name: "パンダ", id: "minecraft:panda", icon: "textures/items/egg_panda"}
    ],
    other: [
      {name: "生の豚肉", id: "minecraft:porkchop", icon: "textures/items/porkchop_raw"},
      {name: "焼き豚", id: "minecraft:cooked_porkchop", icon: "textures/items/porkchop_cooked"},
      {name: "スノーゴーレム", id: "minecraft:snow_golem", icon: "textures/items/snowball"},
      {name: "アイアンゴーレム", id: "minecraft:iron_golem", icon: "textures/items/egg_null"},
    ]
  },
  cave: {
    low: [
      {name: "ゾンビ", id: "minecraft:zombie", icon: "textures/items/egg_zombie"},
      {name: "スケルトン", id: "minecraft:skeleton", icon: "textures/items/egg_skeleton"},
      {name: "クリーパー", id: "minecraft:creeper", icon: "textures/items/egg_creeper"},
      {name: "ウィッチ", id: "minecraft:witch", icon: "textures/items/egg_witch"}
    ],
    high: [
      {name: "モンスタースポナー", id: "minecraft:mob_spawner", icon: "textures/blocks/mob_spawner"},
      {name: "ファントム", id: "minecraft:phantom", icon: "textures/items/egg_phantom"},
      {name: "ブリーズ", id: "minecraft:breeze", icon: "textures/items/egg_breeze"},
      {name: "エンダーチェスト", id: "minecraft:ender_chest", icon: "textures/blocks/ender_chest_front"}
    ],
    other: [
      {name: "ハスク", id: "minecraft:husk", icon: "textures/items/egg_husk"},
      {name: "ストレイ", id: "minecraft:stray", icon: "textures/items/egg_stray"},
      {name: "洞窟グモ", id: "minecraft:cave_spider", icon: "textures/items/egg_cave_spider"},
      {name: "エンチャントされた金のリンゴ", id: "minecraft:enchanted_golden_apple", icon: "textures/items/apple_golden"},
      {name: "クモの巣", id: "minecraft:web", icon: "textures/blocks/web"}
    ]
  },
  nether: {
    low: [
      {name: "ゾンビピッグマン", id: "minecraft:zombie_pigman", icon: "textures/items/egg_pigzombie"},
      {name: "ウィザースケルトン", id: "minecraft:wither_skeleton", icon: "textures/items/egg_wither"},
      {name: "泣く黒曜石", id: "minecraft:crying_obsidian", icon: "textures/blocks/crying_obsidian"},
      {name: "ウィザーローズ", id: "minecraft:wither_rose", icon: "textures/blocks/flower_wither_rose"}
    ],
    high: [
      {name: "ストライダー", id: "minecraft:strider", icon: "textures/items/egg_salmon"},
      {name: "溶岩入りバケツ", id: "minecraft:lava_bucket", icon: "textures/items/bucket_lava"},
      {name: "ジャガイモ(ブレイズ)", id: "minecraft:blaze", icon: "textures/items/egg_blaze"},
      {name: "ネザライトインゴット", id: "minecraft:netherite_ingot", icon: "textures/items/netherite_ingot"}
    ],
    other: [
      {name: "鞍", id: "minecraft:saddle", icon: "textures/items/saddle"}
    ]
  },
  animal: {
    low: [
      {name: "ニワトリ", id: "minecraft:chicken", icon: "textures/items/egg_chicken"},
      {name: "オウム", id: "minecraft:parrot", icon: "textures/items/egg_parrot"},
      {name: "ミツバチの巣", id: "minecraft:bee_nest", icon: "textures/blocks/bee_nest_front"},
      {name: "コンポスター", id: "minecraft:composter", icon: "textures/blocks/composter_side"}
    ],
    high: [
      {name: "キツネ", id: "minecraft:fox", icon: "textures/items/egg_fox"},
      {name: "カエル", id: "minecraft:frog", icon: "textures/items/egg_frog"},
      {name: "ムーシュルーム", id: "minecraft:mooshroom", icon: "textures/items/egg_mooshroom"},
      {name: "シロクマ", id: "minecraft:polar_bear", icon: "textures/items/egg_polar_bear"}
    ],
    other: [
      {name: "卵", id: "minecraft:egg", icon: "textures/items/egg"},
      {name: "ポピー", id: "minecraft:poppy", icon: "textures/blocks/flower_rose"},
      {name: "タンポポ", id: "minecraft:dandelion", icon: "textures/blocks/flower_dandelion"},
      {name: "桃色のチューリップ", id: "minecraft:pink_tulip", icon: "textures/blocks/flower_tulip_pink"},
      {name: "サボテン", id: "minecraft:cactus", icon: "textures/blocks/cactus_side"},
      {name: "ハチ", id: "minecraft:bee", icon: "textures/items/egg_bee"},
      {name: "ハチミツ入りの瓶", id: "minecraft:honey_bottle", icon: "textures/items/honey_bottle"},
      {name: "木のクワ", id: "minecraft:wooden_hoe", icon: "textures/items/wood_hoe"},
      {name: "石のクワ", id: "minecraft:stone_hoe", icon: "textures/items/stone_hoe"},
      {name: "鉄のクワ", id: "minecraft:iron_hoe", icon: "textures/items/iron_hoe"},
      {name: "小麦", id: "minecraft:wheat", icon: "textures/items/wheat"},
      {name: "赤いキノコ", id: "minecraft:red_mushroom", icon: "textures/blocks/mushroom_red"},
      {name: "氷塊", id: "minecraft:packed_ice", icon: "textures/blocks/ice_packed"},
      {name: "パン", id: "minecraft:bread", icon: "textures/items/bread"},
      {name: "ケーキ", id: "minecraft:cake", icon: "textures/items/cake"},
      {name: "羊", id: "minecraft:sheep", icon: "textures/items/egg_sheep"},
      {name: "ウシ", id: "minecraft:cow", icon: "textures/items/egg_cow"},
      {name: "白色の羊毛", id: "minecraft:white_wool", icon: "textures/blocks/wool_colored_white"},
      {name: "赤色の羊毛", id: "minecraft:red_wool", icon: "textures/blocks/wool_colored_red"},
      {name: "黄色の羊毛", id: "minecraft:yellow_wool", icon: "textures/blocks/wool_colored_yellow"},
      {name: "桃色の羊毛", id: "minecraft:pink_wool", icon: "textures/blocks/wool_colored_pink"},
      {name: "緑色の羊毛", id: "minecraft:green_wool", icon: "textures/blocks/wool_colored_green"},
      {name: "黒色の羊毛", id: "minecraft:black_wool", icon: "textures/blocks/wool_colored_black"},
      {name: "ミルクバケツ", id: "minecraft:milk_bucket", icon: "textures/items/bucket_milk"},
      {name: "ボグド", id: "minecraft:bogged", icon: "textures/items/egg_bogged"},
    ]
  }
}

mc.world.afterEvents.itemUse.subscribe(data=>{
  let {source, itemStack} = data;
  if(itemStack.typeId != "minecraft:book") return;
  form_home(source);
})

/**
 * @param {mc.Player} player 
 */
function form_home(player){
  cardBook_form.show(player).then(res=>{
    if(res.canceled) return;
    switch(res.selection){
      case 0:
        form_normal(player);
        break;
      case 1:
        form_overworld(player);
        break;
    }
  })
}

/**
 * @param {mc.Player} player
 */
function form_normal(player){
  let form = new ui.ActionFormData().title("一般カード");
  cardLibrary.normal.forEach(e=>{
    form.button(e.name, e.icon);
  })
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    if(res.selection == cardLibrary.normal.length) {
      form_home(player);
      return;
    }
    let form2 = new ui.MessageFormData().title("カード情報")
      .body(cardLibrary.normal[res.selection].name + "\n" + cardInfo(cardLibrary.normal[res.selection].id).join("\n"))
      .button1("§l§c図鑑を閉じる")
      .button2("§l§8戻る");
    form2.show(player).then(res2=>{
      if(res2.canceled){
        form_normal(player);
        return;
      }
      if(res2.selection == 0) return;
      if(res2.selection == 1) {
        form_normal(player);
        return;
      }
    })
  })
}

/**
 * @param {mc.Player} player 
 */
function form_overworld(player){
  let form = new ui.ActionFormData().title("現世カード")
    .button("§l§9ローコスト")
    .button("§l§cハイコスト")
    .button("§l§aドロー以外で入手可能なカード")
    .button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    switch(res.selection){
      case 0:
        form_overworld_low(player);
        break;
      case 1:
        form_overworld_high(player);
        break;
      case 2:
        form_overworld_other(player);
        break;
      case 3:
        form_home(player);
        break;
    }
  })
}

/**
 * @param {mc.Player} player 
 */
function form_overworld_low(player){
  let form = new ui.ActionFormData().title("現世カード(ローコスト)");
  cardLibrary.overworld.low.forEach(e=>{
    form.button(e.name, e.icon);
  })
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    if(res.selection == cardLibrary.overworld.low.length) {
      form_overworld(player);
      return;
    }
    let form2 = new ui.MessageFormData().title("カード情報")
      .body(cardLibrary.overworld.low[res.selection].name + "\n" + cardInfo(cardLibrary.overworld.low[res.selection].id).join("\n"))
      .button1("§l§c図鑑を閉じる")
      .button2("§l§8戻る");
    form2.show(player).then(res2=>{
      if(res2.canceled){
        form_overworld_low(player);
        return;
      }
      if(res2.selection == 0) return;
      if(res2.selection == 1) {
        form_overworld_low(player);
        return;
      }
    })
  })
}

/**
 * @param {mc.Player} player 
 */
function form_overworld_high(player){
  let form = new ui.ActionFormData().title("現世カード(ハイコスト)");
  cardLibrary.overworld.high.forEach(e=>{
    form.button(e.name, e.icon);
  })
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    if(res.selection == cardLibrary.overworld.high.length) {
      form_overworld(player);
      return;
    }
    let form2 = new ui.MessageFormData().title("カード情報")
      .body(cardLibrary.overworld.high[res.selection].name + "\n" + cardInfo(cardLibrary.overworld.high[res.selection].id).join("\n"))
      .button1("§l§c図鑑を閉じる")
      .button2("§l§8戻る");
    form2.show(player).then(res2=>{
      if(res2.canceled){
        form_overworld_high(player);
        return;
      }
      if(res2.selection == 0) return;
      if(res2.selection == 1) {
        form_overworld_high(player);
        return;
      }
    })
  })
}

/**
 * @param {mc.Player} player 
 */
function form_overworld_other(player){
  let form = new ui.ActionFormData().title("現世カード(ドロー以外)");
  cardLibrary.overworld.other.forEach(e=>{
    form.button(e.name, e.icon);
  })
  form.button("§l§8戻る", "textures/ui/back_button_hover");
  form.show(player).then(res=>{
    if(res.canceled) return;
    if(res.selection == cardLibrary.overworld.other.length) {
      form_overworld(player);
      return;
    }
    let form2 = new ui.MessageFormData().title("カード情報")
      .body(cardLibrary.overworld.other[res.selection].name + "\n" + cardInfo(cardLibrary.overworld.other[res.selection].id).join("\n"))
      .button1("§l§c図鑑を閉じる")
      .button2("§l§8戻る");
    form2.show(player).then(res2=>{
      if(res2.canceled){
        form_overworld_other(player);
        return;
      }
      if(res2.selection == 0) return;
      if(res2.selection == 1) {
        form_overworld_other(player);
        return;
      }
    })
  })
}