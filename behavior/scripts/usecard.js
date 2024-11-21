import * as mc from "@minecraft/server";
import { addAct, getAct, getCard, giveItem, handItem, myTimeout } from "./lib";
import { cardList } from "./cardinfo";

const error_slot = "§cこのスロットには使用できません",
      error_act = "§4actが足りません",
      B = "minecraft:blue_concrete",
      W = "minecraft:white_concrete",
      R = "minecraft:red_concrete",
      P = "minecraft:pink_concrete",
      O = "minecraft:orange_concrete";

/**
 * カード使用関数
 * @param {mc.Block} cardBlock 
 * @param {mc.Player} player 
 */
export function useCard(cardBlock, player){
  const card = handItem(player);
  if(!card) return;
  switch(card.typeId){
    case "minecraft:wither_skeleton_skull":
      const info = getCard(card.typeId);
      if(parseInt(info.Cact) <= getAct(player)){
        addAct(player, -parseInt(info.Cact));
        mc.world.sendMessage("§cウィザーを召喚しました");
        const wither = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:wither", {x:0.5, y:0, z:0.5});
        mc.world.getPlayers().forEach(p => p.addEffect(mc.EffectTypes.get("minecraft:resistance"), 300, {amplifier: 10, showParticles: false}));
        mc.world.setDynamicProperty("anim", true);
        let enemy;
        if(player.hasTag("red")){
          enemy = mc.world.getPlayers({tags:["blue"]})[0];
          player.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:11.5, y:5.0, z:0.5}
          })
          enemy.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:-11.5, y:5.0, z:0.5}
          })
          player.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:3.5, y:1.0, z:0.5},
            easeOptions: {easeTime: 10, easeType: "OutQuad"}
          })
          enemy.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:-3.5, y:1.0, z:0.5},
            easeOptions: {easeTime: 10, easeType: "OutQuad"}
          })
        }else{
          enemy = mc.world.getPlayers({tags:["red"]})[0];
          player.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:-11.5, y:5.0, z:0.5}
          })
          enemy.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:11.5, y:5.0, z:0.5}
          })
          player.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:-2.5, y:2.0, z:0.5},
            easeOptions: {easeTime: 10, easeType: "OutQuad"}
          })
          enemy.camera.setCamera("minecraft:free",{
            facingEntity: wither,
            location: {x:2.5, y:2.0, z:0.5},
            easeOptions: {easeTime: 10, easeType: "OutQuad"}
          })
        }
        myTimeout(200, ()=>{
          enemy.kill();
          mc.world.sendMessage("ウィザーの効果により勝利しました");
        })
      }
      else{
        player.sendMessage(error_act);
      }
      break;
  }
}