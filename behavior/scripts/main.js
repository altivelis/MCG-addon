import * as mc from "@minecraft/server";
import { drawList, cardList } from "./cardinfo";
import { cardInfo } from "./lib";
import "./system";
import "./button";
import "./craft";
import "./config";
import "./rulebook";
import "./die";
import { mcg } from "./system";

mc.system.runInterval(() => {
  let players = mc.world.getPlayers();
  players.forEach(player => {
    //見ているモブの情報表示
    const target = player.getEntitiesFromViewDirection({maxDistance:64, ignoreBlockCollision:true, 
      excludeTypes:["minecraft:item"]
    }).find((e)=>{return (e.entity.typeId != "minecraft:player" || 
      mc.world.getPlayers().find(p => p.id == e.entity.id)?.getGameMode() != mc.GameMode.spectator
    )})?.entity;
    if(target){
      const hp = target.getComponent(mc.EntityHealthComponent.componentId);
      if(hp) player.onScreenDisplay.setActionBar([
        (target.typeId == "minecraft:player")?target.nameTag:{translate: `entity.${target.typeId.slice(10)}.name`},
        ` ${Math.floor(hp.currentValue*10)/10}/${Math.floor(hp.defaultValue*10)/10} `,
        (target.hasTag("protect"))?"§2除外無効 ":"",
        (target.hasTag("guard"))?"§2ガード ":"",
        (target.hasTag("fly"))?"§2浮遊 ":"",
        (target.hasTag("call_pigman"))?"§2呼び声 ":"",
        (target.hasTag("ace"))?"§2大将 ":"",
        "\n",
        cardInfo(target.typeId, target.hasTag("enhance")).join("\n")
      ]);
    }
    else{
      //見ているブロックの情報表示
      const block = player.getBlockFromViewDirection({excludeTypes:["minecraft:barrier","minecraft:wooden_button","minecraft:stone_button"], maxDistance:64})?.block;
      if(block && cardList.some((e)=>e.name.includes(block.typeId) && e.attribute.includes("オブジェクト"))){
        player.onScreenDisplay.setActionBar([{translate: `tile.${block.typeId.slice(10)}.name`}, "\n", cardInfo(block.typeId).join("\n")]);
      }
      else if(block && cardList.some((e)=>e.name.includes(block.typeId) && block.typeId.includes("wool"))){
        player.onScreenDisplay.setActionBar([{translate: `tile.wool.${block.typeId.slice(10, -5)}.name`}, "\n", cardInfo(block.typeId).join("\n")]);
      }
      else if(block && (player.hasTag("red") || player.hasTag("blue"))){
        /**
         * @type {Boolean}
         */
        let high = player.dimension.getBlock(player.hasTag("red") ? mcg.const.red.lever : mcg.const.blue.lever).permutation.getState("open_bit");
        let text = "§bドロー可能なカード\n§3";
        switch(block.typeId){
          case "minecraft:grass_block":
            text += (high ? drawList.grass.high : drawList.grass.low).join("\n");
            player.onScreenDisplay.setActionBar(text);
            break;
          case "minecraft:stone":
            text += (high ? drawList.stone.high : drawList.stone.low).join("\n");
            player.onScreenDisplay.setActionBar(text);
            break;
          case "minecraft:hay_block":
            text += (high ? drawList.hay.high : drawList.hay.low).join("\n");
            player.onScreenDisplay.setActionBar(text);
            break;
          case "minecraft:netherrack":
            text = (player.hasTag("nether")?"":"§cゾンビピッグマンかウィザースケルトンを召喚すると開放\n") + text;
            text += (high ? drawList.nether.high : drawList.nether.low).join("\n");
            player.onScreenDisplay.setActionBar(text);
            break;
          case "minecraft:dark_oak_log":
            text += (high ? drawList.genocide.high : drawList.genocide.low).join("\n");
            player.onScreenDisplay.setActionBar(text);
            break;
        }
      }
    }
  });
  //HP表示
  mc.world.getDimension("overworld").getEntities({excludeTypes:["minecraft:player"], families:["mob"]}).forEach(entity=>{
    /**
     * @type {mc.EntityHealthComponent}
     */
    let hp = entity.getComponent(mc.EntityHealthComponent.componentId);
    entity.nameTag = `${Math.floor(hp.currentValue*10)/10}/${hp.effectiveMax} §l§a${"|".repeat(Math.floor(20 * (hp.currentValue / hp.effectiveMax)))}§c${"|".repeat(20 * (1 - hp.currentValue / hp.effectiveMax))}`;
  })
  //ヴェックス固定
  mc.world.getDimension("overworld").getEntities({type:"minecraft:vex"}).forEach(entity=>{
    entity.teleport(entity.location, {keepVelocity:false});
  })
})

mc.world.afterEvents.entityHurt.subscribe(data=>{
  if(data.damageSource.cause == mc.EntityDamageCause.selfDestruct) {
    if(mc.world.getDynamicProperty("status") == 2) mc.world.sendMessage(["[除外] ", (data.hurtEntity.typeId == "minecraft:player")?data.hurtEntity.nameTag:{translate: `entity.${data.hurtEntity.typeId.slice(10)}.name`}])
  }
  else {
    mc.world.sendMessage([(data.hurtEntity.typeId == "minecraft:player")?data.hurtEntity.nameTag:{translate: `entity.${data.hurtEntity.typeId.slice(10)}.name`}, `に${Math.floor(data.damage*10)/10}ダメージ!`]);
  }
})

mc.world.beforeEvents.itemUse.subscribe(data=>{
  if(data.itemStack.typeId == "minecraft:book") return;
  if(data.itemStack.typeId == "minecraft:compass") return;
  if(data.itemStack.typeId == "minecraft:spyglass") return;
  data.cancel = true;
})

//デバッグを開始
//"/script debugger connect localhost 19144"