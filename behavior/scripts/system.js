import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { myTimeout, giveItem } from "./lib";

export const mcg = {
  const:{
    red:{
      slot:{
        red: {x:4, y:1, z:-6},
        white: {x:4, y:1, z:0},
        blue: {x:4, y:1, z:6},
        object: {x:10, y:4, z:6}
      },
      plate:{
        red: {x:13, y:5, z:-2},
        white: {x:13, y:5, z:0},
        blue: {x:13, y:5, z:2},
        pink: {x:16, y:5, z:0},
        orange: {x:16, y:5, z:3}
      }
    },
    blue:{
      slot:{
        red: {x:-4, y:1, z:-6},
        white: {x:-4, y:1, z:0},
        blue: {x:-4, y:1, z:6},
        object: {x:-10, y:4, z:-6}
      },
      plate:{
        red: {x:-13, y:5, z:-2},
        white: {x:-13, y:5, z:0},
        blue: {x:-13, y:5, z:2},
        pink: {x:-16, y:5, z:0},
        orange: {x:-16, y:5, z:-3}
      }
    }
  },
  queue:{
    /**
     * @type {mc.Player}
     */
    red: null,
    /**
     * @type {mc.Player}
     */
    blue: null
  }
}

//参加受付
/**
 * 
 * @param {String} color 
 * @param {mc.Player} player 
 */
function setSign(color, player=null){
  if(color == "red"){
    const block = mc.world.getDimension("minecraft:overworld").getBlock({x:-62, y:-53, z:-2});
    if(player){
      block.getComponent(mc.BlockSignComponent.componentId).setText("\n対戦予約中\n"+"§c"+player.nameTag);
    }
    else{
      block.getComponent(mc.BlockSignComponent.componentId).setText("\nボタンを押して"+"\n対戦予約");
    }
  }
  else if(color == "blue"){
    const block = mc.world.getDimension("minecraft:overworld").getBlock({x:-64, y:-53, z:-2});
    if(player){
      block.getComponent(mc.BlockSignComponent.componentId).setText("\n対戦予約中\n"+"§b"+player.nameTag);
    }
    else{
      block.getComponent(mc.BlockSignComponent.componentId).setText("\nボタンを押して"+"\n対戦予約");
    }
  }
}
//ボタンを押したときの処理
mc.world.afterEvents.buttonPush.subscribe(data=>{
  const {block, source} = data;
  if(JSON.stringify(block.location) == JSON.stringify({x:-61, y:-53, z:-2})){
    if(!mcg.queue.red){
      mcg.queue.red = source;
      if(mcg.queue.blue && mcg.queue.blue.id == source.id){
        mcg.queue.blue = null;
      }
    }
    else if(mcg.queue.red && mcg.queue.red.id == source.id){
      mcg.queue.red = null;
    }
  }
  else if(JSON.stringify(block.location) == JSON.stringify({x:-65, y:-53, z:-2})){
    if(!mcg.queue.blue){
      mcg.queue.blue = source;
      if(mcg.queue.red && mcg.queue.red.id == source.id){
        mcg.queue.red = null;
      }
    }
    else if(mcg.queue.blue && mcg.queue.blue.id == source.id){
      mcg.queue.blue = null;
    }
  }
})
//ワールドを抜けたときにキューから削除
mc.world.afterEvents.playerLeave.subscribe(data=>{
  if(data.playerId == mcg.queue.red.id){
    mcg.queue.red = null;
  }
  else if(data.playerId == mcg.queue.blue.id){
    mcg.queue.blue = null;
  }
})
//看板の文字を更新
mc.system.runInterval(()=>{
  setSign("red", mcg.queue.red);
  setSign("blue", mcg.queue.blue);
})

mc.system.runInterval(()=>{
  if(mcg.queue.red) mcg.queue.red.dimension.spawnParticle("minecraft:raid_omen_emitter",mcg.queue.red.location);
  if(mcg.queue.blue) mcg.queue.blue.dimension.spawnParticle("minecraft:trial_omen_emitter",mcg.queue.blue.location);
  //属性パーティクル
  mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"]}).forEach(entity=>{
    if(entity.hasTag("pro")){
      entity.dimension.spawnParticle("minecraft:totem_particle",entity.location);
    }
    if(entity.hasTag("guard")){
      entity.dimension.spawnParticle("minecraft:trial_omen_single", {...entity.location, y: entity.location.y+1});
    }
    if(entity.hasTag("fly")){
      entity.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", {...entity.location, y: entity.location.y-1});
    }
  })
},10)

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:initialize") return;
  initialize_config();
})

function initialize_config(){
  mc.world.setDynamicProperty("time", 150);
  mc.world.setDynamicProperty("first_draw", 5);
  mc.world.setDynamicProperty("second_draw", 6);
  mc.world.sendMessage("変数を初期化しました。")
}

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:reset") return;
  reset();
})

function reset(){
  mc.world.setDynamicProperty("status", 0);
  mc.world.sendMessage("対戦を強制終了しました。");
  mc.world.getPlayers({tags:["red"]}).forEach(red=>{
    red.teleport({x:-63, y:-53, z:-13},{dimension:mc.world.getDimension("minecraft:overworld")});
    red.removeTag("red");
    red.removeTag("turn");
    red.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
    mc.EffectTypes.getAll().forEach(effect=>{
      red.removeEffect(effect);
    })
    red.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
  })
  mc.world.getPlayers({tags:["blue"]}).forEach(blue=>{
    blue.teleport({x:-63, y:-53, z:-13},{dimension:mc.world.getDimension("minecraft:overworld")});
    blue.removeTag("blue");
    blue.removeTag("turn");
    blue.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
    mc.EffectTypes.getAll().forEach(effect=>{
      blue.removeEffect(effect);
    })
    blue.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
  })
}

mc.system.runInterval(()=>{
  //スタート
  if(mc.world.getDynamicProperty("status") == 0 && mcg.queue.red && mcg.queue.blue){
    start();
  }
})

function start(){
  //参加者の取得
  const red = mcg.queue.red;
  const blue = mcg.queue.blue;
  if(!red || !blue){
    mc.world.sendMessage("§c参加者が足りていないため、開始できませんでした。");
    return;
  }
  mc.world.sendMessage("参加者が決定しました。");
  mc.world.sendMessage("対戦を開始します…");
  mc.world.setDynamicProperty("status", 1);
  mcg.queue.red = null;
  mcg.queue.blue = null;
  //タグ付与
  red.addTag("red");
  blue.addTag("blue");
  //ゲームモード変更
  red.setGameMode(mc.GameMode.adventure);
  blue.setGameMode(mc.GameMode.adventure);
  //ポーション効果消去
  mc.EffectTypes.getAll().forEach(effect=>{
    red.removeEffect(effect);
    blue.removeEffect(effect);
  })
  //アイテム消去
  red.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
  blue.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
  //HPリセット
  red.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  blue.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  //移動禁止
  red.inputPermissions.movementEnabled = false;
  blue.inputPermissions.movementEnabled = false;
  //フォーム強制終了
  ui.uiManager.closeAllForms(red);
  ui.uiManager.closeAllForms(blue);
  //カメラ演出スタート
  red.camera.fade({
    fadeTime:{fadeInTime:1, holdTime:1, fadeOutTime:1},
    fadeColor:{red:0, green:0, blue:0}
  });
  blue.camera.fade({
    fadeTime:{fadeInTime:1, holdTime:1, fadeOutTime:1},
    fadeColor:{red:0, green:0, blue:0}
  })
  myTimeout(20,()=>{
    red.teleport({x:15.5, y:5.5, z:0.5},{rotation:{x:0, y:90}});
    blue.teleport({x:-15.5, y:5.5, z:0.5},{rotation:{x:0, y:-90}});
    red.camera.setCamera("minecraft:free",{
      location:{x:0, y:40, z:0},
      rotation:{x:90, y:90}
    });
    blue.camera.setCamera("minecraft:free",{
      location:{x:0, y:40, z:1},
      rotation:{x:90, y:-90}
    });
    myTimeout(20,()=>{
      red.camera.setCamera("minecraft:free",{
        location:{x:0, y:6, z:0},
        rotation:{x:0, y:90},
        easeOptions:{easeTime:2, easeType:"OutCirc"}
      });
      blue.camera.setCamera("minecraft:free",{
        location:{x:0, y:6, z:1},
        rotation:{x:0, y:-90},
        easeOptions:{easeTime:2, easeType:"OutCirc"}
      });
      myTimeout(40,()=>{
        red.camera.setCamera("minecraft:free",{
          location:{x:-13, y:6, z:0},
          rotation:{x:0, y:90},
          easeOptions:{easeTime:1, easeType:"InQuart"}
        });
        blue.camera.setCamera("minecraft:free",{
          location:{x:13, y:6, z:1},
          rotation:{x:0, y:-90},
          easeOptions:{easeTime:1, easeType:"InQuart"}
        });
        red.playSound("apply_effect.bad_omen",{location:{x:-13, y:6, z:0}});
        blue.playSound("apply_effect.bad_omen",{location:{x:13, y:6, z:1}});
        myTimeout(20,()=>{
          red.onScreenDisplay.setTitle("§oDUEL",{fadeInDuration:0, fadeOutDuration:20, stayDuration:40});
          blue.onScreenDisplay.setTitle("§oDUEL",{fadeInDuration:0, fadeOutDuration:20, stayDuration:40});
          red.onScreenDisplay.updateSubtitle("vs §b"+blue.nameTag);
          blue.onScreenDisplay.updateSubtitle("vs §c"+red.nameTag);
          myTimeout(40,()=>{
            red.camera.fade({
              fadeTime:{fadeInTime:1, holdTime:1, fadeOutTime:1},
              fadeColor:{red:0, green:0, blue:0}
            });
            blue.camera.fade({
              fadeTime:{fadeInTime:1, holdTime:1, fadeOutTime:1},
              fadeColor:{red:0, green:0, blue:0}
            });
            myTimeout(20,()=>{
              red.camera.clear();
              blue.camera.clear();
              red.inputPermissions.movementEnabled = true;
              blue.inputPermissions.movementEnabled = true;
              myTimeout(20,()=>{
                mc.world.setDynamicProperty("status", 2);
                mc.world.setDynamicProperty("turn", 1);
                if(Math.random < 0.5){
                  red.addTag("turn");
                  giveItem(red, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("first_draw")));
                  giveItem(blue, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("second_draw")));
                  red.onScreenDisplay.setTitle("あなたは§b先攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                  blue.onScreenDisplay.setTitle("あなたは§c後攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                }else{
                  blue.addTag("turn");
                  giveItem(red, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("second_draw")));
                  giveItem(blue, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("first_draw")));
                  blue.onScreenDisplay.setTitle("あなたは§b先攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                  red.onScreenDisplay.setTitle("あなたは§c後攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                }
                red.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
                mc.world.scoreboard.getObjective("act").setScore("timer", mc.world.getDynamicProperty("time"));
              })
            })
          })
        })
      })
    })
  })
}

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "test:test") return;
  mc.world.sendMessage("red:"+mcg.queue.red?.nameTag+" blue:"+mcg.queue.blue?.nameTag);
})
