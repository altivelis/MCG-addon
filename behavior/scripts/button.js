import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { mcg, turnChange } from "./system";
import { hasItem, decrementContainer, giveItem, handItem, addAct } from "./lib";
import { useCard } from "./usecard";

//ドロー
mc.world.afterEvents.buttonPush.subscribe(data=>{
  /**
   * @type {{source: mc.Player, block: mc.Block, dimension: mc.Dimension}}
   */
  const {source, block, dimension} = data;
  if(block.typeId != "minecraft:stone_button") return;
  if(source.typeId != "minecraft:player") return;
  if(!(source.hasTag("red") || source.hasTag("blue"))) return;
  if(!source.hasTag("turn")) {
    source.sendMessage("あなたのターンではありません");
    return;
  };
  if(!hasItem(source, "minecraft:grass_block")) {
    source.sendMessage("草ブロックがありません");
    return;
  };
  const drawBlock = block.below();
  /**
   * @type {Boolean}
   */
  let high = dimension.getBlock(source.hasTag("red") ? mcg.const.red.lever : mcg.const.blue.lever).permutation.getState("open_bit");
  /**
   * @type {mc.ItemStack}
   */
  let item;
  switch(drawBlock.typeId){
    case "minecraft:grass_block":
      decrementContainer(source, "minecraft:grass_block");
      switch(Math.floor(Math.random()*4)){
        case 0:
          item = high ? new mc.ItemStack("minecraft:wolf_spawn_egg") : new mc.ItemStack("minecraft:pig_spawn_egg");
          source.sendMessage("ドロー: " + (high?"オオカミ":"ブタ"));
          break;
        case 1:
          item = high ? new mc.ItemStack("minecraft:bell") : new mc.ItemStack("minecraft:villager_spawn_egg");
          source.sendMessage("ドロー: " + (high?"鐘":"村人"));
          break;
        case 2:
          item = high ? new mc.ItemStack("minecraft:allay_spawn_egg") : new mc.ItemStack("minecraft:chest");
          source.sendMessage("ドロー: " + (high?"アレイ":"チェスト"));
          break;
        case 3:
          item = high ? new mc.ItemStack("minecraft:panda_spawn_egg") : new mc.ItemStack("minecraft:carved_pumpkin");
          source.sendMessage("ドロー: " + (high?"パンダ":"くり抜かれたカボチャ"));
          break;
      }
      giveItem(source, item);
      break;

    case "minecraft:stone":
      decrementContainer(source, "minecraft:grass_block");
      switch(Math.floor(Math.random()*4)){
        case 0:
          item = high ? new mc.ItemStack("minecraft:mob_spawner") : new mc.ItemStack("minecraft:zombie_spawn_egg");
          source.sendMessage("ドロー: " + (high?"モンスタースポナー":"ゾンビ"));
          break;
        case 1:
          item = high ? new mc.ItemStack("minecraft:phantom_spawn_egg") : new mc.ItemStack("minecraft:skeleton_spawn_egg");
          source.sendMessage("ドロー: " + (high?"ファントム":"スケルトン"));
          break;
        case 2:
          item = high ? new mc.ItemStack("minecraft:breeze_spawn_egg") : new mc.ItemStack("minecraft:creeper_spawn_egg");
          source.sendMessage("ドロー: " + (high?"ブリーズ":"クリーパー"));
          break;
        case 3:
          item = high ? new mc.ItemStack("minecraft:ender_chest") : new mc.ItemStack("minecraft:witch_spawn_egg");
          source.sendMessage("ドロー: " + (high?"エンダーチェスト":"ウィッチ"));
          break;
      }
      giveItem(source, item);
      break;

    case "minecraft:hay_block":
      decrementContainer(source, "minecraft:grass_block");
      switch(Math.floor(Math.random()*4)){
        case 0:
          item = high ? new mc.ItemStack("minecraft:fox_spawn_egg") : new mc.ItemStack("minecraft:chicken_spawn_egg");
          source.sendMessage("ドロー: " + (high?"キツネ":"ニワトリ"));
          break;
        case 1:
          item = high ? new mc.ItemStack("minecraft:frog_spawn_egg") : new mc.ItemStack("minecraft:parrot_spawn_egg");
          source.sendMessage("ドロー: " + (high?"カエル":"オウム"));
          break;
        case 2:
          item = high ? new mc.ItemStack("minecraft:mooshroom_spawn_egg") : new mc.ItemStack("minecraft:bee_nest");
          source.sendMessage("ドロー: " + (high?"ムーシュルーム":"ミツバチの巣"));
          break;
        case 3:
          item = high ? new mc.ItemStack("minecraft:polar_bear_spawn_egg") : new mc.ItemStack("minecraft:composter");
          source.sendMessage("ドロー: " + (high?"シロクマ":"コンポスター"));
          break;
      }
      giveItem(source, item);
      break;

    case "minecraft:netherrack":
      if(!source.hasTag("nether")){
        source.sendMessage("ネザーカードが開放されていません")
        return;
      }
      decrementContainer(source, "minecraft:grass_block");
      switch(Math.floor(Math.random()*4)){
        case 0:
          item = high ? new mc.ItemStack("minecraft:strider_spawn_egg") : new mc.ItemStack("minecraft:zombie_pigman_spawn_egg");
          source.sendMessage("ドロー: " + (high?"ストライダー":"ゾンビピッグマン"));
          break;
        case 1:
          item = high ? new mc.ItemStack("minecraft:lava_bucket") : new mc.ItemStack("minecraft:wither_skeleton_spawn_egg");
          source.sendMessage("ドロー: " + (high?"溶岩バケツ":"ウィザースケルトン"));
          break;
        case 2:
          item = high ? new mc.ItemStack("minecraft:potato") : new mc.ItemStack("minecraft:crying_obsidian");
          source.sendMessage("ドロー: " + (high?"ジャガイモ":"泣く黒曜石"));
          break;
        case 3:
          item = high ? new mc.ItemStack("minecraft:netherite_ingot") : new mc.ItemStack("minecraft:wither_rose");
          source.sendMessage("ドロー: " + (high?"ネザライトインゴット":"ウィザーローズ"));
          break;
      }
      giveItem(source, item);
      break;
    default:
      return;
  }
  if(mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:allay", tags:[(source.hasTag("red")?"red":"blue")]}).length >0){
    addAct(source, 4);
  }
})

const compass_form = new ui.MessageFormData()
  .title("§l§cターンを終了しようとしています")
  .body("本当にターンを終了しますか？")
  .button1("§l§cはい")
  .button2("いいえ");

//カード使用
mc.world.afterEvents.buttonPush.subscribe(data=>{
  /**
   * @type {{source: mc.Player, block: mc.Block, dimension: mc.Dimension}}
   */
  const {source, block, dimension} = data;
  if(block.typeId != "minecraft:wooden_button") return;
  if(source.typeId != "minecraft:player") return;
  if(!handItem(source)) return;
  if(!(source.hasTag("red") || source.hasTag("blue"))) return;
  if(!source.hasTag("turn")) {
    source.sendMessage("あなたのターンではありません");
    return;
  };
  if(handItem(source)?.typeId == "minecraft:compass" && source.hasTag("turn")){
    compass_form.show(source).then(res=>{
      if(res.canceled) return;
      if(res.selection == 0){
        turnChange();
      }
      if(res.selection == 1) return;
    })
  }
  const cardBlock = block.below();
  useCard[handItem(source).typeId.slice(10)]?.run(cardBlock, source);
})