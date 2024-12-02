import * as mc from "@minecraft/server";
import { addAct, getAct, giveItem } from "./lib";
import { mcg } from "./system";

const recipe = [
  {
    item: "minecraft:stone_sword",
    name: "石の剣",
    materials: [
      "minecraft:wooden_sword",
      "minecraft:cobblestone"
    ]
  },
  {
    item: "minecraft:iron_sword",
    name: "鉄の剣",
    materials: [
      "minecraft:wooden_sword",
      "minecraft:iron_ingot"
    ]
  },
  {
    item: "minecraft:diamond_sword",
    name: "ダイヤモンドの剣",
    materials: [
      "minecraft:wooden_sword",
      "minecraft:diamond"
    ]
  },
  {
    item: "minecraft:netherite_sword",
    name: "ネザライトの剣",
    materials: [
      "minecraft:wooden_sword",
      "minecraft:netherite_ingot"
    ]
  },
  {
    item: "minecraft:stone_pickaxe",
    name: "石のツルハシ",
    materials: [
      "minecraft:wooden_pickaxe",
      "minecraft:cobblestone"
    ]
  },
  {
    item: "minecraft:iron_pickaxe",
    name: "鉄のツルハシ",
    materials: [
      "minecraft:wooden_pickaxe",
      "minecraft:iron_ingot"
    ]
  },
  {
    item: "minecraft:cooked_porkchop",
    name: "焼き豚",
    materials: [
      "minecraft:porkchop",
      "minecraft:coal"
    ]
  },
  {
    item: "minecraft:wither_skeleton_spawn_egg",
    name: "ウィザースケルトン",
    materials: [
      "minecraft:skeleton_spawn_egg",
      "minecraft:coal"
    ]
  },
  {
    item: "minecraft:zombie_pigman_spawn_egg",
    name: "ゾンビピッグマン",
    materials: [
      "minecraft:zombie_spawn_egg",
      "minecraft:porkchop"
    ]
  },
  {
    item: "minecraft:cake",
    name: "ケーキ",
    materials: [
      "minecraft:wheat",
      "minecraft:egg",
      "minecraft:milk_bucket"
    ]
  },
  {
    item: "minecraft:red_wool",
    name: "赤色の羊毛",
    materials: [
      "minecraft:white_wool",
      "minecraft:poppy"
    ]
  },
  {
    item: "minecraft:yellow_wool",
    name: "黄色の羊毛",
    materials: [
      "minecraft:white_wool",
      "minecraft:dandelion"
    ]
  },
  {
    item: "minecraft:pink_wool",
    name: "桃色の羊毛",
    materials: [
      "minecraft:white_wool",
      "minecraft:pink_tulip"
    ]
  },
  {
    item: "minecraft:green_wool",
    name: "緑色の羊毛",
    materials: [
      "minecraft:white_wool",
      "minecraft:cactus"
    ]
  },
  {
    item: "minecraft:black_wool",
    name: "黒色の羊毛",
    materials: [
      "minecraft:white_wool",
      "minecraft:wither_rose"
    ]
  },
  {
    item: "minecraft:stone_hoe",
    name: "石のクワ",
    materials: [
      "minecraft:wooden_hoe",
      "minecraft:cobblestone"
    ]
  },
  {
    item: "minecraft:iron_hoe",
    name: "鉄のクワ",
    materials: [
      "minecraft:wooden_hoe",
      "minecraft:iron_ingot"
    ]
  },
  {
    item: "minecraft:bread",
    name: "パン",
    materials: [
      "minecraft:wheat",
      "minecraft:coal"
    ]
  },
  {
    item: "minecraft:bogged_spawn_egg",
    name: "ボグド",
    materials: [
      "minecraft:skeleton_spawn_egg",
      "minecraft:red_mushroom"
    ]
  },
  {
    item: "minecraft:mooshroom_spawn_egg",
    name: "ムーシュルーム",
    materials: [
      "minecraft:cow_spawn_egg",
      "minecraft:red_mushroom"
    ]
  }
]

//クラフト処理
mc.system.runInterval(()=>{
  let turnPlayer = mc.world.getPlayers({tags:["turn"]})[0];
  if(!turnPlayer) return;
  recipe.forEach(r=>{
    let items = turnPlayer.dimension.getEntities({type:"minecraft:item", excludeTags:["give"], location:turnPlayer.location, minDistance:0, maxDistance:16});
    if(items.length == 0) return;
    /**
     * @type {mc.Entity[]}
     */
    let foundMaterials = [];
    let foundAll = true;
    let craftCost = 0;
    r.materials.forEach(m=>{
      let item = items.find(i=>i.getComponent(mc.EntityItemComponent.componentId).itemStack.typeId == m);
      if(item){
        if(item.getComponent(mc.EntityItemComponent.componentId).itemStack.typeId == "minecraft:netherite_ingot"){
          craftCost += 20;
        }
        foundMaterials.push(item);
      }
      else{
        foundAll = false;
      }
    });
    if(foundAll){
      if(getAct(turnPlayer)+1 < craftCost){
        return;
      }
      addAct(turnPlayer, -craftCost);
      foundMaterials.forEach(m=>{
        /**
         * @type {mc.ItemStack}
         */
        let itemStack = m.getComponent(mc.EntityItemComponent.componentId).itemStack;
        if(itemStack.amount>1){
          itemStack.amount--;
          m.dimension.spawnItem(itemStack, m.location);
        }
        m.kill();
      })
      giveItem(turnPlayer, new mc.ItemStack(r.item));
      mc.world.sendMessage((turnPlayer.hasTag("red")?"§c":"§b")+turnPlayer.nameTag+"§r: [クラフト] "+r.name);
      //羊毛設置
      switch(r.item){
        case "minecraft:red_wool":
          mc.world.getDimension("minecraft:overworld").setBlockType(turnPlayer.hasTag("red")?mcg.const.red.wool.red:mcg.const.blue.wool.red, "minecraft:red_wool");
          break;
        case "minecraft:yellow_wool":
          mc.world.getDimension("minecraft:overworld").setBlockType(turnPlayer.hasTag("red")?mcg.const.red.wool.yellow:mcg.const.blue.wool.yellow, "minecraft:yellow_wool");
          break;
        case "minecraft:pink_wool":
          mc.world.getDimension("minecraft:overworld").setBlockType(turnPlayer.hasTag("red")?mcg.const.red.wool.pink:mcg.const.blue.wool.pink, "minecraft:pink_wool");
          break;
        case "minecraft:green_wool":
          mc.world.getDimension("minecraft:overworld").setBlockType(turnPlayer.hasTag("red")?mcg.const.red.wool.green:mcg.const.blue.wool.green, "minecraft:green_wool");
          break;
        case "minecraft:black_wool":
          mc.world.getDimension("minecraft:overworld").setBlockType(turnPlayer.hasTag("red")?mcg.const.red.wool.black:mcg.const.blue.wool.black, "minecraft:black_wool");
          break;
      }
    }
  })
})