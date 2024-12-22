import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { myTimeout, giveItem, setAct, getAct, addAct, getCard, giveSword, sendPlayerMessage, applyDamage, clearInventory, isOnline } from "./lib";
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
    if(!block) return;
    if(player){
      block.getComponent(mc.BlockSignComponent.componentId).setText("\n対戦予約中\n"+"§c"+player.nameTag);
    }
    else{
      block.getComponent(mc.BlockSignComponent.componentId).setText("\nボタンを押して"+"\n対戦予約");
    }
  }
  else if(color == "blue"){
    const block = mc.world.getDimension("minecraft:overworld").getBlock({x:-64, y:-53, z:-2});
    if(!block) return;
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
  if(`${block.location.x} ${block.location.y} ${block.location.z}` == "-61 -53 -2"){
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
  else if(`${block.location.x} ${block.location.y} ${block.location.z}` == "-65 -53 -2"){
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
    if(entity.hasTag("call_pigman")){
      entity.dimension.spawnParticle("minecraft:infested_emitter", {...entity.location, y: entity.location.y+1});
    }
  })
},10)

mc.system.runInterval(()=>{
  let voidhelmet = new mc.ItemStack("mcg:voidhelmet",1);
  voidhelmet.lockMode = mc.ItemLockMode.slot;
  mc.world.getAllPlayers().forEach(player=>{
    player.addEffect(mc.EffectTypes.get("minecraft:saturation"),20,{showParticles:false, amplifier:1});
    player.setSpawnPoint({dimension:mc.world.getDimension("minecraft:overworld"), x:-66.5, y:-44, z:-20.5});
    player.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head, voidhelmet);
  })
})

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:init") return;
  initialize_config();
})

function initialize_config(){
  mc.world.setDynamicProperty("time", 150);
  mc.world.setDynamicProperty("first_draw", 5);
  mc.world.setDynamicProperty("second_draw", 6);
  mc.world.setDynamicProperty("start_act", 5);
  mc.world.setDynamicProperty("end_act", 3);
  mc.world.setDynamicProperty("event", false);
  mc.world.sendMessage("変数を初期化しました。")
}

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:reset") return;
  reset();
})

function reset(){
  mc.world.setDynamicProperty("status", 0);
  mc.world.scoreboard.getObjective("act").getParticipants().forEach(id=>{
    mc.world.scoreboard.getObjective("act").removeParticipant(id);
  })
  setAct("timer", 0);
  mc.world.getPlayers().forEach(player=>{
    player.teleport({x:-63, y:-53, z:-13},{dimension:mc.world.getDimension("minecraft:overworld")});
    player.removeTag("red");
    player.removeTag("blue");
    player.removeTag("turn");
    player.removeTag("nether");
    player.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
    mc.EffectTypes.getAll().forEach(effect=>{
      player.removeEffect(effect);
    })
    player.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
    player.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
    player.camera.clear();
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
                //先行後攻決定
                /**@type {mc.Player} */
                let first;
                /**@type {mc.Player} */
                let second;
                if(Math.floor(Math.random()*2) == 0){
                  first = red;
                  second = blue;
                }else{
                  first = blue;
                  second = red;
                }
                first.addTag("turn");
                //草ブロック配布
                giveItem(first, new mc.ItemStack("minecraft:grass_block", mc.world.getDynamicProperty("first_draw")));
                giveItem(second, new mc.ItemStack("minecraft:grass_block", mc.world.getDynamicProperty("second_draw")));
                //イベントアイテム配布
                giveItem(first, new mc.ItemStack("minecraft:snowball", 1));
                giveItem(second, new mc.ItemStack("minecraft:snowball", 1));
                //タイトル表示
                first.onScreenDisplay.setTitle("あなたは§b先攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                second.onScreenDisplay.setTitle("あなたは§c後攻§fです",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                mc.world.getPlayers({excludeTags:["red", "blue"]}).forEach(player=>{
                  player.onScreenDisplay.setTitle("§bDUEL §cSTART",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
                })
                mc.world.getPlayers().forEach(player=>{
                  player.onScreenDisplay.updateSubtitle(`Turn ${mc.world.getDynamicProperty("turn")}`);
                })
                mc.world.sendMessage((first.hasTag("red")?"§c":"§b")+first.nameTag+"§rが先攻です。");
                //コンパス配布
                giveItem(first, new mc.ItemStack("minecraft:compass"));
                //act付与
                setAct(first, mc.world.getDynamicProperty("start_act"));
                setAct(second, mc.world.getDynamicProperty("end_act"));
                setAct("timer", mc.world.getDynamicProperty("time"));
                //ボタン設置
                Object.values(first.hasTag("red")?mcg.const.red.button:mcg.const.blue.button).forEach(pos=>{
                  first.dimension.setBlockPermutation(pos, button_permutation);
                })
                Object.values(first.hasTag("red")?mcg.const.blue.button:mcg.const.red.button).forEach(pos=>{
                  second.dimension.setBlockType(pos, "minecraft:air");
                })
              })
            })
          })
        })
      })
    })
  })
}

//回線落ち対策
mc.world.afterEvents.playerSpawn.subscribe(data=>{
  let {player, initialSpawn} = data;
  if(!initialSpawn) return;
  if(player.hasTag("red") || player.hasTag("blue")){
    if(mc.world.getDynamicProperty("status") != 2){
      player.removeTag("red");
      player.removeTag("blue");
      player.teleport({x:-62.5, y:-53, z:-12.5},{dimension:mc.world.getDimension("minecraft:overworld")});
      mc.world.scoreboard.getObjective("act").removeParticipant(player);
      player.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
    }else{
      if(mc.world.getPlayers({tags:[(player.hasTag("red")?"red":"blue")]}).length > 1){
        player.removeTag("red");
        player.removeTag("blue");
        player.teleport({x:-62.5, y:-53, z:-12.5},{dimension:mc.world.getDimension("minecraft:overworld")});
        mc.world.scoreboard.getObjective("act").removeParticipant(player);
        player.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
      }
    }
  }
})

//ターン経過処理
mc.system.runInterval(()=>{
  if(mc.world.getDynamicProperty("status") == 2){
    if(mc.world.getDynamicProperty("anim") == true) return;
    if(isOnline()){
      mc.world.setDynamicProperty("stop", false);
    }
    if(mc.world.getDynamicProperty("stop") == true) return;
    if(!isOnline()){
      mc.world.sendMessage("§c対戦プレイヤーが見つかりません。タイマーをストップします。\n強制終了する場合は§a/scriptevent mcg:reset§cを実行してください。");
      mc.world.setDynamicProperty("stop", true);
    }
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
  if(!turnPlayer || !notTurnPlayer) {
    mc.world.sendMessage("§c対戦プレイヤーが見つかりません。強制終了する場合は§a/scriptevent mcg:reset§cを実行してください。");
  }
  //ターンタグ切り替え
  turnPlayer.removeTag("turn");
  notTurnPlayer.addTag("turn");
  //act付与
  addAct(turnPlayer, mc.world.getDynamicProperty("end_act"));
  sendPlayerMessage(turnPlayer, "act+" + mc.world.getDynamicProperty("end_act"));
  addAct(notTurnPlayer, mc.world.getDynamicProperty("start_act"));
  sendPlayerMessage(notTurnPlayer, "act+" + mc.world.getDynamicProperty("start_act"));
  //ドロップアイテム消去
  turnPlayer.dimension.getEntities({type:"minecraft:item", excludeTags:["give"]}).forEach(item=>{
    item.kill();
  })
  //ターン経過時効果
  //泣く黒曜石効果
  mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(turnPlayer.hasTag("red")?"blue":"red"), "call_pigman"]}).forEach(entity=>{
    entity.removeTag("call_pigman");
  })
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
    if(tp_inv.getItem(i)?.typeId == "minecraft:snowball"){
      tp_inv.setItem(i);
    }
  }
  switch(turnPlayer.getComponent(mc.EntityEquippableComponent.componentId).getEquipment(mc.EquipmentSlot.Offhand)?.typeId){
    case "minecraft:arrow":
      turnPlayer.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Offhand);
      break;
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
  /**@type {mc.Player}*/
  const loser = data.deadEntity;
  if(loser.typeId != "minecraft:player") return;
  /**@type {mc.Player} */
  const winner = mc.world.getPlayers({tags:[(loser.hasTag("red")?"blue":"red")]})[0];
  if(!winner) {
    mc.world.sendMessage("§c勝利プレイヤーが見つからなかったため、強制終了します。");
    reset();
    return;
  }
  mc.world.setDynamicProperty("status", 3);
  winner.teleport({x:-62.5, y:-53, z:-12.5});
  mc.world.sendMessage(`${winner.hasTag("red")?"§c":"§b"}${winner.nameTag}§rが勝利しました。`);
  winner.onScreenDisplay.setTitle("§bYOU WIN!",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
  loser.onScreenDisplay.setTitle("§cYOU LOSE…",{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
  mc.world.getPlayers({excludeTags:["red","blue"]}).forEach(player=>{
    player.onScreenDisplay.setTitle((winner.hasTag("red")?"§cRED WIN":"§bBLUE WIN"),{fadeInDuration:10, stayDuration:40, fadeOutDuration:10});
  })
  //タグ削除
  winner.removeTag("red");
  winner.removeTag("blue");
  winner.removeTag("turn");
  loser.removeTag("red");
  loser.removeTag("blue");
  loser.removeTag("turn");
  //アイテム消去
  winner.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
  loser.getComponent(mc.EntityInventoryComponent.componentId).container.clearAll();
  winner.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  loser.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Head);
  //HPリセット
  winner.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
  mc.EffectTypes.getAll().forEach(effect=>{
    winner.removeEffect(effect);
  })
  //スコアリセット
  mc.world.scoreboard.getObjective("act").removeParticipant(winner);
  mc.world.scoreboard.getObjective("act").removeParticipant(loser);
  setAct("timer", 0);
  myTimeout(60,()=>{
    mc.world.setDynamicProperty("status", 0);
  })
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