import * as mc from "@minecraft/server";
import { changeHealthBoost, getObject, sendPlayerMessage } from "./lib";

mc.world.afterEvents.entityDie.subscribe(data=>{
  const {deadEntity, damageSource} = data;
  if(deadEntity.typeId == "minecraft:player") return;
  if(deadEntity.hasTag("ace")){
    let aces = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(deadEntity.hasTag("red")?"red":"blue"), "ace"]});
    if(aces.length == 0){
      let owners = mc.world.getPlayers({tags:[(deadEntity.hasTag("red")?"red":"blue")]});
      owners.forEach(owner=>{
        owner.removeTag("raid");
        changeHealthBoost(owner, -2);
        sendPlayerMessage(owner, "襲撃モードが終了しました");
      })
    }
  }
  if(damageSource.cause == mc.EntityDamageCause.selfDestruct) return;
  if((deadEntity.hasTag("call_pigman") || (deadEntity.typeId == "minecraft:pig" && getObject(deadEntity.hasTag("red")?"red":"blue").typeId == "minecraft:crying_obsidian")) && 
  (mc.world.getPlayers({tags:["turn"]})[0].hasTag("red")?deadEntity.hasTag("blue"):deadEntity.hasTag("red"))){
    deadEntity.removeTag("call_pigman");
    let pigman = deadEntity.dimension.spawnEntity("minecraft:zombie_pigman", deadEntity.location);
    deadEntity.getTags().forEach(tag=>{
      if(["slotB", "slotW", "slotR", "red", "blue"].includes(tag)) pigman.addTag(tag);
    })
  }
})