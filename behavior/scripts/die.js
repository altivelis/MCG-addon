import * as mc from "@minecraft/server";
import { getObject } from "./lib";

mc.world.afterEvents.entityDie.subscribe(data=>{
  const {deadEntity, damageSource} = data;
  if(deadEntity.typeId == "minecraft:player") return;
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