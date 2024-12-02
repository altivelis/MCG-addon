import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { myTimeout, giveItem, setAct, getAct, addAct, getCard, giveSword, sendPlayerMessage, applyDamage, clearInventory } from "./lib";
import { turnItem, turnMob, turnObject } from "./turncard";

export const mcg = {
  const:{
    red:{
      slot:{
        red: {x:4.5, y:1, z:-5.5},
        white: {x:4.5, y:1, z:0.5},
        blue: {x:4.5, y:1, z:6.5},
        object: {x:10.5, y:4, z:6.5}
      },
      button:{
        red: {x:13, y:5, z:-2},
        white: {x:13, y:5, z:0},
        blue: {x:13, y:5, z:2},
        pink: {x:16, y:5, z:0},
        orange: {x:16, y:5, z:3}
      },
      lever:{x:15, y:5, z:-5},
      wool:{
        red: {x:8, y:0, z:2},
        yellow: {x:8, y:0, z:1},
        pink: {x:8, y:0, z:0},
        green: {x:8, y:0, z:-1},
        black: {x:8, y:0, z:-2}
      }
    },
    blue:{
      slot:{
        red: {x:-3.5, y:1, z:-5.5},
        white: {x:-3.5, y:1, z:0.5},
        blue: {x:-3.5, y:1, z:6.5},
        object: {x:-9.5, y:4, z:-5.5}
      },
      button:{
        red: {x:-13, y:5, z:-2},
        white: {x:-13, y:5, z:0},
        blue: {x:-13, y:5, z:2},
        pink: {x:-16, y:5, z:0},
        orange: {x:-16, y:5, z:-3}
      },
      lever:{x:-15, y:5, z:-5},
      wool:{
        red: {x:-8, y:0, z:-2},
        yellow: {x:-8, y:0, z:-1},
        pink: {x:-8, y:0, z:0},
        green: {x:-8, y:0, z:1},
        black: {x:-8, y:0, z:2}
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

const button_permutation = mc.BlockPermutation.resolve("wooden_button",{"facing_direction":1});

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
//看板の文字を更新
mc.system.runInterval(()=>{
  if(!mcg.queue.red?.isValid()) mcg.queue.red = null;
  if(!mcg.queue.blue?.isValid()) mcg.queue.blue = null;
  setSign("red", mcg.queue.red);
  setSign("blue", mcg.queue.blue);
})

mc.system.runInterval(()=>{
  //プレイヤーパーティクル
  if(mcg.queue.red && mcg.queue.red.getGameMode() != mc.GameMode.spectator) mcg.queue.red.dimension.spawnParticle("minecraft:raid_omen_emitter",mcg.queue.red.location);
  if(mcg.queue.blue && mcg.queue.blue.getGameMode() != mc.GameMode.spectator) mcg.queue.blue.dimension.spawnParticle("minecraft:trial_omen_emitter",mcg.queue.blue.location);
  mc.world.getPlayers({tags:["turn"]}).forEach(tp=>{
    tp.dimension.spawnParticle("minecraft:heart_particle",{...tp.location, y:tp.location.y+2});
  })
  //属性パーティクル
  mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"]}).forEach(entity=>{
    if(entity.hasTag("protect")){
      entity.dimension.spawnParticle("minecraft:trial_spawner_detection",{...entity.location, x:entity.location.x-0.5, z:entity.location.z-0.5});
    }
    if(entity.hasTag("fly")){
      entity.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", {...entity.location, y: entity.location.y-1});
    }
    if(entity.hasTag("guard")){
      entity.dimension.spawnParticle("minecraft:trial_spawner_detection_ominous", {...entity.location, x:entity.location.x-0.5, z:entity.location.z-0.5});
    }
  })
},10)

mc.system.runInterval(()=>{
  mc.world.getAllPlayers().forEach(player=>{
    player.addEffect(mc.EffectTypes.get("minecraft:saturation"),20,{showParticles:false, amplifier:1});
    player.setSpawnPoint({dimension:mc.world.getDimension("minecraft:overworld"), x:-66.5, y:-44, z:-20.5});
  })
})

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:initialize") return;
  initialize_config();
})

function initialize_config(){
  mc.world.setDynamicProperty("time", 150);
  mc.world.setDynamicProperty("first_draw", 5);
  mc.world.setDynamicProperty("second_draw", 6);
  mc.world.setDynamicProperty("anim", false);
  mc.world.sendMessage("変数を初期化しました。")
}

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:reset") return;
  reset();
})

function reset(){
  mc.world.setDynamicProperty("status", 0);
  setAct("timer", 0);
  mc.world.getPlayers({tags:["red"]}).forEach(red=>{
    red.teleport({x:-63, y:-53, z:-13},{dimension:mc.world.getDimension("minecraft:overworld")});
    red.removeTag("red");
    red.removeTag("turn");
    red.removeTag("nether");
    red.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
    mc.EffectTypes.getAll().forEach(effect=>{
      red.removeEffect(effect);
    })
    red.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
    red.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  })
  mc.world.getPlayers({tags:["blue"]}).forEach(blue=>{
    blue.teleport({x:-63, y:-53, z:-13},{dimension:mc.world.getDimension("minecraft:overworld")});
    blue.removeTag("blue");
    blue.removeTag("turn");
    blue.removeTag("nether");
    blue.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
    mc.EffectTypes.getAll().forEach(effect=>{
      blue.removeEffect(effect);
    })
    blue.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
    blue.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  })
  mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"]}).forEach(entity=>{
    entity.remove();
  })
  Object.values(mcg.const.red.button).forEach(pos=>{
    mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
  })
  Object.values(mcg.const.blue.button).forEach(pos=>{
    mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
  })
  mc.world.getDimension("minecraft:overworld").setBlockType(mcg.const.red.slot.object, "minecraft:air");
  mc.world.getDimension("minecraft:overworld").setBlockType(mcg.const.blue.slot.object, "minecraft:air");
  Object.values(mcg.const.red.wool).forEach(pos=>{
    mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
  })
  Object.values(mcg.const.blue.wool).forEach(pos=>{
    mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
  })
  mc.world.getPlayers().forEach(player=>{
    player.camera.clear();
  })
  mc.world.sendMessage("対戦を強制終了しました。");
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
  red.removeTag("nether");
  blue.removeTag("nether");
  //ゲームモード変更
  red.setGameMode(mc.GameMode.adventure);
  blue.setGameMode(mc.GameMode.adventure);
  //ポーション効果消去
  mc.EffectTypes.getAll().forEach(effect=>{
    red.removeEffect(effect);
    blue.removeEffect(effect);
  })
  //アイテム消去
  clearInventory(red);
  clearInventory(blue);
  red.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  blue.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  //HPリセット
  red.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  blue.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  //レバーリセット
  mc.world.getDimension("minecraft:overworld").setBlockPermutation(mcg.const.red.lever, mc.BlockPermutation.resolve("minecraft:lever", {"lever_direction":"south"}));
  mc.world.getDimension("minecraft:overworld").setBlockPermutation(mcg.const.blue.lever, mc.BlockPermutation.resolve("minecraft:lever", {"lever_direction":"south"}));
  //オブジェクト削除
  mc.world.getDimension("minecraft:overworld").setBlockType(mcg.const.red.slot.object, "minecraft:air");
  mc.world.getDimension("minecraft:overworld").setBlockType(mcg.const.blue.slot.object, "minecraft:air");
  //羊毛削除
  Object.values(mcg.const.red.wool).forEach(pos=>{
    mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
  })
  Object.values(mcg.const.blue.wool).forEach(pos=>{
    mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
  })
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
    mc.world.setDynamicProperty("anim", true);
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
          mc.world.sendMessage("対戦を開始しました");
          mc.world.sendMessage("§l§c"+red.nameTag+"§r vs §l§b"+blue.nameTag);
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
              mc.world.setDynamicProperty("anim", false);
              red.inputPermissions.movementEnabled = true;
              blue.inputPermissions.movementEnabled = true;
              myTimeout(20,()=>{
                mc.world.setDynamicProperty("status", 2);
                mc.world.setDynamicProperty("turn", 1);
                //望遠鏡配布
                let spyglass = new mc.ItemStack("minecraft:spyglass",1);
                spyglass.lockMode = mc.ItemLockMode.inventory;
                giveItem(red, spyglass);
                giveItem(blue, spyglass);
                //ウィザー頭蓋骨配布
                let wither_skull = new mc.ItemStack("minecraft:wither_skeleton_skull",1);
                wither_skull.lockMode = mc.ItemLockMode.inventory;
                giveItem(red, wither_skull);
                giveItem(blue, wither_skull);
                //コンパス配布
                let compass = new mc.ItemStack("minecraft:compass",1);
                if(Math.floor(Math.random()*2) == 0){
                  red.addTag("turn");
                  giveItem(red, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("first_draw")));
                  giveItem(blue, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("second_draw")));
                  red.onScreenDisplay.setTitle("あなたは§b先攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                  blue.onScreenDisplay.setTitle("あなたは§c後攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                  mc.world.sendMessage("§c"+red.nameTag+"§rが先攻です。");
                  giveItem(red, compass);
                  setAct(red, 5);
                  setAct(blue, 3);
                  //ボタン設置
                  Object.values(mcg.const.red.button).forEach(pos=>{
                    red.dimension.setBlockPermutation(pos, button_permutation);
                  })
                  Object.values(mcg.const.blue.button).forEach(pos=>{
                    blue.dimension.setBlockType(pos, "minecraft:air");
                  })
                }else{
                  blue.addTag("turn");
                  giveItem(red, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("second_draw")));
                  giveItem(blue, new mc.ItemStack("minecraft:grass_block",mc.world.getDynamicProperty("first_draw")));
                  blue.onScreenDisplay.setTitle("あなたは§b先攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                  red.onScreenDisplay.setTitle("あなたは§c後攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                  mc.world.sendMessage("§b"+blue.nameTag+"§rが先攻です。");
                  giveItem(blue, compass);
                  setAct(blue, 5);
                  setAct(red, 3);
                  //ボタン設置
                  Object.values(mcg.const.blue.button).forEach(pos=>{
                    blue.dimension.setBlockPermutation(pos, button_permutation);
                  })
                  Object.values(mcg.const.red.button).forEach(pos=>{
                    red.dimension.setBlockType(pos, "minecraft:air");
                  })
                }
                red.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
                blue.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
                setAct("timer", mc.world.getDynamicProperty("time"));
                mc.world.getPlayers({excludeTags:["red","blue"]}).forEach(player=>{
                  player.onScreenDisplay.setTitle("§bDUEL §cSTART",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                  player.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
                })
              })
            })
          })
        })
      })
    })
  })
}

//ターン経過処理
mc.system.runInterval(()=>{
  if(mc.world.getDynamicProperty("status") == 2){
    if(mc.world.getDynamicProperty("anim") == true) return;
    if(getAct("timer") > 0){
      //時間切れ前
      if(getAct("timer") <= 10){
        mc.world.getPlayers({tags:["turn"]}).forEach(player=>{
          player.playSound("random.click",{location:player.location});
        })
      }
      addAct("timer", -1);
    }
    else{
      //時間切れ
      turnChange();
    }
  }
},20)

export function turnChange(){
  let turnPlayer = mc.world.getPlayers({tags:["turn"]})[0];
  /**
   * @type {mc.Player}
   */
  let notTurnPlayer;
  if(turnPlayer.hasTag("red")){
    notTurnPlayer = mc.world.getPlayers({tags:["blue"]})[0];
    Object.values(mcg.const.red.button).forEach(pos=>{
      turnPlayer.dimension.setBlockType(pos, "minecraft:air");
    })
    Object.values(mcg.const.blue.button).forEach(pos=>{
      notTurnPlayer.dimension.setBlockPermutation(pos, button_permutation);
    })
  }
  else{
    notTurnPlayer = mc.world.getPlayers({tags:["red"]})[0];
    Object.values(mcg.const.blue.button).forEach(pos=>{
      turnPlayer.dimension.setBlockType(pos, "minecraft:air");
    })
    Object.values(mcg.const.red.button).forEach(pos=>{
      notTurnPlayer.dimension.setBlockPermutation(pos, button_permutation);
    })
  }
  //ターンタグ切り替え
  turnPlayer.removeTag("turn");
  notTurnPlayer.addTag("turn");
  //act付与
  addAct(turnPlayer, 3);
  sendPlayerMessage(turnPlayer, "act+3");
  addAct(notTurnPlayer, 5);
  sendPlayerMessage(notTurnPlayer, "act+5");
  //ドロップアイテム消去
  turnPlayer.dimension.getEntities({type:"minecraft:item", excludeTags:["give"]}).forEach(item=>{
    item.kill();
  })
  //ターン経過時効果
  //モブ
  mc.world.getDimension("minecraft:overworld").getEntities({families:["mob"], excludeTypes:["minecraft:player"]}).forEach(entity=>{
    turnMob[entity.typeId.slice(10)]?.run(notTurnPlayer, turnPlayer, entity);
  })
  //オブジェクト
  turnObject[mc.world.getDimension("minecraft:overworld").getBlock(mcg.const.red.slot.object).typeId.slice(10)]?.run(notTurnPlayer, turnPlayer, "red");
  turnObject[mc.world.getDimension("minecraft:overworld").getBlock(mcg.const.blue.slot.object).typeId.slice(10)]?.run(notTurnPlayer, turnPlayer, "blue");
  //アイテム効果
  turnItem(notTurnPlayer, turnPlayer);
  //Bact、攻撃力変換
  mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player", "minecraft:item"], tags:[(notTurnPlayer.hasTag("red")?"red":"blue")]}).forEach(entity=>{
    let info = getCard(entity.typeId);
    if(info){
      addAct(notTurnPlayer, parseInt(info.Bact));
      giveSword(notTurnPlayer, info.atk, {translate: `entity.${entity.typeId.slice(10)}.name`});
    }
  })
  //タイマーリセット
  setAct("timer", mc.world.getDynamicProperty("time"));
  mc.world.setDynamicProperty("turn", mc.world.getDynamicProperty("turn")+1);
  //コンパス交換
  /**
   * @type {mc.Container}
   */
  let tp_inv = turnPlayer.getComponent(mc.EntityInventoryComponent.componentId).container;
  for(let i=0; i<tp_inv.size; i++){
    if(tp_inv.getItem(i)?.typeId == "minecraft:compass"){
      tp_inv.setItem(i);
    }
    if(tp_inv.getItem(i)?.typeId != "minecraft:wooden_sword" && tp_inv.getItem(i)?.typeId.includes("sword")){
      tp_inv.setItem(i);
    }
    if(tp_inv.getItem(i)?.typeId == "minecraft:arrow"){
      tp_inv.setItem(i);
    }
  }
  giveItem(notTurnPlayer, new mc.ItemStack("minecraft:compass", 1));
  giveItem(notTurnPlayer, new mc.ItemStack("minecraft:grass_block", 1));
  //タイトル表示
  turnPlayer.onScreenDisplay.setTitle("Turn End",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
  notTurnPlayer.onScreenDisplay.setTitle("Your Turn",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
  turnPlayer.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
  notTurnPlayer.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
  mc.world.getPlayers({excludeTags:["red","blue"]}).forEach(player=>{
    player.onScreenDisplay.setTitle((notTurnPlayer.hasTag("red")?"§cRed Turn":"§bBlue Turn"),{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
    player.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
  })
  notTurnPlayer.playSound("random.levelup",{location:notTurnPlayer.location});
  //ui削除
  ui.uiManager.closeAllForms(turnPlayer);
}

//勝敗判定
mc.world.afterEvents.entityDie.subscribe(data=>{
  if(mc.world.getDynamicProperty("status") != 2) return;
  /**
   * @type {mc.Player}
   */
  const entity = data.deadEntity;
  if(entity.typeId == "minecraft:player"){
    if(entity.hasTag("red")){
      const blue = mc.world.getPlayers({tags:["blue"]})[0];
      mc.world.setDynamicProperty("status", 3);
      blue.teleport({x:-62.5, y:-53, z:-12.5});
      mc.world.sendMessage(`§b${blue.nameTag}§rが勝利しました。`);
      blue.onScreenDisplay.setTitle("§bYOU WIN!",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
      entity.onScreenDisplay.setTitle("§cYOU LOSE…",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
      mc.world.getPlayers({excludeTags:["red","blue"]}).forEach(player=>{
        player.onScreenDisplay.setTitle("§bBLUE WIN",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
      })
      //タグ削除
      entity.removeTag("red");
      entity.removeTag("turn");
      blue.removeTag("blue");
      blue.removeTag("turn");
      //アイテム消去
      entity.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
      blue.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
      entity.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
      blue.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
      //HPリセット
      blue.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
      mc.EffectTypes.getAll().forEach(effect=>{
        blue.removeEffect(effect);
      })
      //スコアリセット
      mc.world.scoreboard.getObjective("act").removeParticipant(entity);
      mc.world.scoreboard.getObjective("act").removeParticipant(blue);
      setAct("timer", 0);
      myTimeout(60,()=>{
        mc.world.setDynamicProperty("status", 0);
      })
    }
    else if(entity.hasTag("blue")){
      const red = mc.world.getPlayers({tags:["red"]})[0];
      mc.world.setDynamicProperty("status", 3);
      red.teleport({x:-62.5, y:-53, z:-12.5});
      mc.world.sendMessage(`§c${red.nameTag}§rが勝利しました。`);
      red.onScreenDisplay.setTitle("§bYOU WIN!",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
      entity.onScreenDisplay.setTitle("§cYOU LOSE…",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
      mc.world.getPlayers({excludeTags:["red","blue"]}).forEach(player=>{
        player.onScreenDisplay.setTitle("§cRED WIN",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
      })
      //タグ削除
      entity.removeTag("blue");
      entity.removeTag("turn");
      red.removeTag("red");
      red.removeTag("turn");
      //アイテム消去
      entity.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
      red.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
      entity.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
      red.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
      //HPリセット
      red.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
      mc.EffectTypes.getAll().forEach(effect=>{
        red.removeEffect(effect);
      })
      //スコアリセット
      mc.world.scoreboard.getObjective("act").removeParticipant(entity);
      mc.world.scoreboard.getObjective("act").removeParticipant(red);
      setAct("timer", 0);
      myTimeout(60,()=>{
        mc.world.setDynamicProperty("status", 0);
      })
    }
    //ボタン削除
    Object.values(mcg.const.red.button).forEach(pos=>{
      mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
    })
    Object.values(mcg.const.blue.button).forEach(pos=>{
      mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
    })
    //オブジェクト削除
    mc.world.getDimension("minecraft:overworld").setBlockType(mcg.const.red.slot.object, "minecraft:air");
    mc.world.getDimension("minecraft:overworld").setBlockType(mcg.const.blue.slot.object, "minecraft:air");
    //羊毛削除
    Object.values(mcg.const.red.wool).forEach(pos=>{
      mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
    })
    Object.values(mcg.const.blue.wool).forEach(pos=>{
      mc.world.getDimension("minecraft:overworld").setBlockType(pos, "minecraft:air");
    })
    //エンティティ削除
    mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"]}).forEach(entity=>{
      entity.kill();
    })
    //カメラリセット
    mc.world.getPlayers().forEach(player=>{
      player.camera.clear();
    })
  }
})

const surrender_form = new ui.MessageFormData()
  .title("§l§cサレンダー")
  .body("降参しようとしています。\n本当によろしいですか?")
  .button1("§l§cはい")
  .button2("§lいいえ");

//サレンダー
mc.world.afterEvents.buttonPush.subscribe(data=>{
  /**
   * @type {{source: mc.Player, block: mc.Block, dimension: mc.Dimension}}
   */
  let {source, block, dimension} = data;
  if(block.typeId != "minecraft:spruce_button") return;
  if(source.typeId != "minecraft:player") return;
  surrender_form.show(source).then(res=>{
    if(res.canceled) return;
    if(res.selection == 1) return;
    if(res.selection == 0) {
      mc.world.sendMessage("サレンダーボタンが押されました。");
      source.kill();
    }
  })
})

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:test") return;
  data.sourceEntity.getComponent(mc.EntityHealthComponent.componentId).setCurrentValue(40);
})