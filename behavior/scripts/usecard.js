import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { addAct, applyDamage, changeHealthBoost, createColor, decrementContainer, decrementSlot, getAct, getCard, getObject, giveItem, giveSword, handItem, lineParticle, myTimeout, sendPlayerMessage, setAct, setObject, swordDamage, swordName } from "./lib";
import { mcg } from "./system";

const error_slot = "§cこのスロットには使用できません",
      error_act = "§4actが足りません",
      error_mob = "§4このスロットには既にモブが存在します",
      error_directAttack = "§4相手の場にモブが存在します",
      B = "minecraft:blue_concrete",
      W = "minecraft:white_concrete",
      R = "minecraft:red_concrete",
      P = "minecraft:pink_concrete",
      O = "minecraft:orange_concrete";

/**
 * モブ召喚カード用の関数
 * @param {mc.Block} cardBlock ボタンのブロック
 * @param {mc.Player} player 使用者
 * @param {String} identifier 召喚するモブのid 
 * @param {function} event
 */
function summonCard(cardBlock, player, identifier, event){
  let info = getCard(identifier);
  if(identifier == "minecraft:villager_v2"){
    if(getObject(player.hasTag("red") ? "red" : "blue").typeId == "minecraft:bell"){
      addAct(player, parseInt(info.Sact));
    }
  }
  if(parseInt(info.Sact) > getAct(player) + 1){
    player.sendMessage(error_act);
    return;
  }
  if(parseInt(info.Sact) == 1 && getAct(player) == 0){
    player.sendMessage(error_act);
    player.sendMessage("§cこのカードはオーバーコストして使用できません");
    return;
  }
  let mob;
  switch(cardBlock.typeId){
    case B:
      if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"red":"blue"), "slotB"]}).length > 0){
        player.sendMessage(error_mob);
        return;
      }
      addAct(player, -parseInt(info.Sact));
      decrementSlot(player, player.selectedSlotIndex);
      mob = mc.world.getDimension("minecraft:overworld").spawnEntity(identifier, (player.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue));
      mob.addTag((player.hasTag("red") ? "red" : "blue"));
      mob.addTag("slotB");
      event(mob);
      lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      break;
    case W:
      if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"red":"blue"), "slotW"]}).length > 0){
        player.sendMessage(error_mob);
        return;
      }
      addAct(player, -parseInt(info.Sact));
      decrementSlot(player, player.selectedSlotIndex);
      mob = mc.world.getDimension("minecraft:overworld").spawnEntity(identifier, (player.hasTag("red") ? mcg.const.red.slot.white : mcg.const.blue.slot.white));
      mob.addTag((player.hasTag("red") ? "red" : "blue"));
      mob.addTag("slotW");
      event(mob);
      lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      break;
    case R:
      if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"red":"blue"), "slotR"]}).length > 0){
        player.sendMessage(error_mob);
        return;
      }
      addAct(player, -parseInt(info.Sact));
      decrementSlot(player, player.selectedSlotIndex);
      mob = mc.world.getDimension("minecraft:overworld").spawnEntity(identifier, (player.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red));
      mob.addTag((player.hasTag("red") ? "red" : "blue"));
      mob.addTag("slotR");
      event(mob);
      lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      break;
    case P:
    case O:
      player.sendMessage(error_slot);
      return;
  }
}

export const useCard = {
  wither_skeleton_skull: {
    /**
     * ウィザー
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player)){
        player.sendMessage(error_act);
        return;
      }
      addAct(player, -parseInt(info.Cact));
      decrementSlot(player, player.selectedSlotIndex);
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
  },
  wooden_sword: {
    /**
     * 木の剣(全部の剣を統合)
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      let sword = handItem(player).typeId;
      if(!sword.includes("sword")) return;
      let targets;
      switch(cardBlock.typeId){
        case B:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotB"], excludeTags:["fly"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              `§r[${swordName[sword.slice(10)]}]`
            ])
            lineParticle(target.dimension, player.location, target.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            target.dimension.spawnParticle("mcg:knockback_roar_particle", target.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(target,swordDamage[sword.slice(10)]);
            target.dimension.playSound("random.glass", target.location, {volume: 10});
          })
          break;
        case W:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotW"], excludeTags:["fly"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              `§r[${swordName[sword.slice(10)]}]`
            ])
            lineParticle(target.dimension, player.location, target.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            target.dimension.spawnParticle("mcg:knockback_roar_particle", target.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(target,swordDamage[sword.slice(10)]);
            target.dimension.playSound("random.glass", target.location, {volume: 10});
          })
          break;
        case R:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotR"], excludeTags:["fly"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              `§r[${swordName[sword.slice(10)]}]`
            ])
            lineParticle(target.dimension, player.location, target.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            target.dimension.spawnParticle("mcg:knockback_roar_particle", target.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(target,swordDamage[sword.slice(10)]);
            target.dimension.playSound("random.glass", target.location, {volume: 10});
          })
          break;
        case P:
          let mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly"]});
          if(mobs.length > 0){
            player.sendMessage(error_directAttack);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          decrementContainer(player, "minecraft:packed_ice");
          let enemies = mc.world.getDimension("minecraft:overworld").getPlayers({tags:[(player.hasTag("red")?"blue":"red")]});
          enemies.forEach(enemy=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              enemy.nameTag,
              `§r[${swordName[sword.slice(10)]}]`
            ])
            lineParticle(enemy.dimension, player.location, enemy.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            enemy.dimension.spawnParticle("mcg:knockback_roar_particle", enemy.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(enemy, swordDamage[sword.slice(10)] / 5);
            enemy.dimension.playSound("random.glass", enemy.location, {volume: 10});
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  stone_sword: {
    /**
     * 石の剣
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      useCard.wooden_sword.run(cardBlock, player);
    }
  },
  golden_sword: {
    /**
     * 金の剣
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      useCard.wooden_sword.run(cardBlock, player);
    }
  },
  iron_sword: {
    /**
     * 鉄の剣
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      useCard.wooden_sword.run(cardBlock, player);
    }
  },
  diamond_sword: {
    /**
     * ダイヤの剣
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      useCard.wooden_sword.run(cardBlock, player);
    }
  },
  netherite_sword: {
    /**
     * ネザライトの剣
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      useCard.wooden_sword.run(cardBlock, player);
    }
  },
  wooden_pickaxe: {
    /**
     * 木のツルハシ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if(cardBlock.typeId != P){
        player.sendMessage(error_slot);
        return;
      }
      sendPlayerMessage(player, "木のツルハシを使用しました")
      decrementSlot(player, player.selectedSlotIndex);
      giveItem(player, new mc.ItemStack("minecraft:cobblestone"));
      player.sendMessage("[入手] 丸石");
      giveItem(player, new mc.ItemStack("minecraft:coal"));
      player.sendMessage("[入手] 石炭");
    }
  },
  //石のツルハシ
  stone_pickaxe: {
    /**
     * 石のツルハシ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if(cardBlock.typeId != P){
        player.sendMessage(error_slot);
        return;
      }
      sendPlayerMessage(player, "石のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItem(player, new mc.ItemStack("minecraft:iron_ingot"));
      player.sendMessage("[入手] 鉄インゴット")
    }
  },
  iron_pickaxe: {
    /**
     * 鉄のツルハシ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if(cardBlock.typeId != P){
        player.sendMessage(error_slot);
        return;
      }
      sendPlayerMessage(player, "鉄のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItem(player, new mc.ItemStack("minecraft:diamond"));
      player.sendMessage("[入手] ダイヤモンド")
    }
  },
  carrot_on_a_stick: {
    /**
     * ニンジン付きの棒
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let targets;
      switch(cardBlock.typeId){
        case B:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotB"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          sendPlayerMessage(player, "ニンジン付きの棒を使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          targets.forEach(target=>{
            target.dimension.playSound("random.fizz", target.location, {volume: 10});
            target.kill();
          })
          break;
        case W:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotW"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          sendPlayerMessage(player, "ニンジン付きの棒を使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          targets.forEach(target=>{
            target.dimension.playSound("random.fizz", target.location, {volume: 10});
            target.kill();
          })
          break;
        case R:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotR"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          sendPlayerMessage(player, "ニンジン付きの棒を使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          targets.forEach(target=>{
            target.dimension.playSound("random.fizz", target.location, {volume: 10});
            target.kill();
          })
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  arrow: {
    /**
     * 矢
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let targets;
      switch(cardBlock.typeId){
        case B:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotB"], excludeTags:["guard"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.bow", player.location, {volume: 10});
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
            lineParticle(target.dimension, player.location, target.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(target, 30);
          })
          break;
        case W:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotW"], excludeTags:["guard"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.bow", player.location, {volume: 10});
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
            lineParticle(target.dimension, player.location, target.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(target, 30);
          })
          break;
        case R:
          targets = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotR"], excludeTags:["guard"]});
          if(targets.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.bow", player.location, {volume: 10});
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
            lineParticle(target.dimension, player.location, target.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(target, 30);
          })
          break;
        case P:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.bow", player.location, {volume: 10});
          decrementContainer(player, "minecraft:packed_ice");
          let enemies = mc.world.getDimension("minecraft:overworld").getPlayers({tags:[(player.hasTag("red")?"blue":"red")]});
          enemies.forEach(enemy=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              enemy.nameTag,
              "§r: [矢]"
            ])
            lineParticle(enemy.dimension, player.location, enemy.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(enemy, 1);
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  //現世カード
  pig_spawn_egg: {
    /**
     * ブタ
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:pig", 
        /**
         * @param {mc.Entity} mob 
         */
        (mob)=>{
        sendPlayerMessage(player, "ブタを召喚しました");
        mob.dimension.playSound("mob.chicken.plop", mob.location, {volume: 10});
        giveItem(player, new mc.ItemStack("minecraft:porkchop"));
        player.sendMessage("[入手] 生の豚肉");
      });
    }
  },
  villager_spawn_egg: {
    /**
     * 村人
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:villager_v2",
        /**
         * @param {mc.Entity} mob 
         */
        (mob)=>{
        sendPlayerMessage(player, "村人を召喚しました");
        mob.dimension.playSound("mob.chicken.plop", mob.location, {volume: 10});
        giveItem(player, new mc.ItemStack("minecraft:grass_block"), 2);
        player.sendMessage("[入手] 草ブロック x2");
      });
    }
  },
  chest: {
    /**
     * チェスト
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "チェストを使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.chestopen", player.location, {volume: 10});
          if(getObject(player.hasTag("red") ? "blue" : "red").typeId == "minecraft:trapped_chest"){
            if(Math.floor(Math.random() * 2) == 0){
              player.dimension.playSound("mob.zombie.woodbreak", player.location, {volume: 10});
              sendPlayerMessage(player, "トラップチェストだ！！");
              setObject(mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]}[0]), "minecraft:air");
              sendPlayerMessage(player, "相手のオブジェクトを破壊しました");
              return;
            }
          }
          giveItem(player, new mc.ItemStack("minecraft:wooden_sword"));
          player.sendMessage("[入手] 木の剣");
          giveItem(player, new mc.ItemStack("minecraft:wooden_pickaxe"));
          player.sendMessage("[入手] 木のツルハシ");
          giveItem(player, new mc.ItemStack("minecraft:carrot_on_a_stick"));
          player.sendMessage("[入手] ニンジン付きの棒");
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "チェストを設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          setObject(player, "minecraft:chest");
          player.dimension.playSound("random.chestopen", player.location, {volume: 10});
          break;
      }
    }
  },
  carved_pumpkin: {
    /**
     * くり抜かれたカボチャ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "くり抜かれたカボチャを使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("pumpkin.carve", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:snow_golem_spawn_egg"));
          player.sendMessage("[入手] スノーゴーレム");
          giveItem(player, new mc.ItemStack("minecraft:iron_golem_spawn_egg"));
          player.sendMessage("[入手] アイアンゴーレム");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  wolf_spawn_egg: {
    /**
     * オオカミ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:wolf", 
        /**
         * @param {mc.Entity} mob 
         */
        (mob)=>{
        sendPlayerMessage(player, "オオカミを召喚しました");
        mob.dimension.playSound("beacon.activate", mob.location, {volume: 10});
        giveSword(player, getCard(mob.typeId).atk, "速攻効果");
      });
    }
  },
  bell: {
    /**
     * ベル
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "鐘を使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("block.bell.hit", player.location, {volume: 10});
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player", "minecraft:item"]}).forEach(entity=>{
            entity.dimension.spawnParticle("mcg:knockback_roar_particle", entity.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            if(entity.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
              applyDamage(entity, 999, {cause: mc.EntityDamageCause.magic});
            }
            else{
              entity.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
              entity.removeTag("protect");
            }
          })
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "鐘を設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          setObject(player, "minecraft:bell");
          player.dimension.playSound("block.bell.hit", player.location, {volume: 10});
          break;
      }
    }
  },
  allay_spawn_egg: {
    /**
     * アレイ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:allay", 
        /**
         * @param {mc.Entity} mob 
         */
        (mob)=>{
        sendPlayerMessage(player, "アレイを召喚しました");
        mob.addTag("fly");
        mob.teleport({...mob.location, y: mob.location.y + 1});
        mob.dimension.playSound("beacon.activate", mob.location, {volume: 10});
        giveSword(player, getCard(mob.typeId).atk, "速攻効果");
      })
    }
  },
  panda_spawn_egg: {
    /**
     * パンダ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:panda", 
        /**
         * @param {mc.Entity} mob 
         */
        (mob)=>{
        sendPlayerMessage(player, "パンダを召喚しました");
        mob.dimension.playSound("random.explode", mob.location, {volume: 10});
        mob.addTag("protect");
        mc.world.getPlayers().forEach(p=>{
          p.onScreenDisplay.setTitle([(player.hasTag("red")?"§c":"§b"), "パンダ"], {fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 20});
          p.onScreenDisplay.updateSubtitle("§3呪術高専二年 準二級呪術師");
        })
      })
    }
  },
  porkchop: {
    /**
     * 生の豚肉
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let wolf;
      switch(cardBlock.typeId){
        case B:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotB"], type:"minecraft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "生の豚肉を使用しました");
          wolf[0].dimension.playSound("mob.wolf.bark", wolf[0].location, {volume: 10});
          giveSword(player, getCard(wolf[0].typeId).atk, "オオカミ効果");
          break;
        case W:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotW"], type:"minecraft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "生の豚肉を使用しました");
          wolf[0].dimension.playSound("mob.wolf.bark", wolf[0].location, {volume: 10});
          giveSword(player, getCard(wolf[0].typeId).atk, "オオカミ効果");
          break;
        case R:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotR"], type:"minecraft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "生の豚肉を使用しました");
          wolf[0].dimension.playSound("mob.wolf.bark", wolf[0].location, {volume: 10});
          giveSword(player, getCard(wolf[0].typeId).atk, "オオカミ効果");
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  cooked_porkchop: {
    /**
     * 焼き豚
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "焼き豚を使用しました");
          player.dimension.playSound("random.eat", player.location, {volume: 10});
          player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
          /**
           * @type {mc.EntityHealthComponent}
           */
          let hp = player.getComponent(mc.EntityHealthComponent.componentId);
          hp.setCurrentValue(hp.currentValue + 6);
          sendPlayerMessage(player, "HP+6");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  snow_golem_spawn_egg: {
    /**
     * スノーゴーレム
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:snow_golem",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "スノーゴーレムを召喚しました");
          mob.dimension.playSound("beacon.activate", mob.location, {volume: 10});
          mob.addTag("protect");
        }
      )
    }
  },
  iron_golem_spawn_egg: {
    /**
     * アイアンゴーレム
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:iron_golem",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "アイアンゴーレムを召喚しました");
          mob.dimension.playSound("beacon.power", mob.location, {volume: 10});
          mc.world.getPlayers().forEach(p=>{
            p.onScreenDisplay.setTitle([(player.hasTag("red")?"§c":"§b"), "アイアンゴーレム"], {fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 20});
            p.onScreenDisplay.updateSubtitle("§3村の守護神");
          })
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue")], type:"minecraft:villager_v2"}).length > 0){
            addAct(player, 40);
            sendPlayerMessage(player, "村人がいるため、actを40回復しました");
          }
        }
      )
    }
  },
  zombie_spawn_egg: {
    /**
     * ゾンビ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:zombie",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ゾンビを召喚しました");
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:grass_block"), 2);
          player.sendMessage("[入手] 草ブロック x2");
        }
      )
    }
  },
  skeleton_spawn_egg: {
    /**
     * スケルトン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:skeleton",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "スケルトンを召喚しました");
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:arrow"));
          player.sendMessage("[入手] 矢");
        }
      )
    }
  },
  creeper_spawn_egg: {
    /**
     * クリーパー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:creeper",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "クリーパーを召喚しました");
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 10});
          mob.addTag("guard");
        }
      )
    }
  },
  witch_spawn_egg: {
    /**
     * ウィッチ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:witch",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ウィッチを召喚しました");
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 10});
        }
      )
    }
  },
  mob_spawner: {
    /**
     * モンスタースポナー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "モンスタースポナーを使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("trial_spawner.open_shutter", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:husk_spawn_egg"));
          player.sendMessage("[入手] ハスク");
          giveItem(player, new mc.ItemStack("minecraft:stray_spawn_egg"));
          player.sendMessage("[入手] ストレイ");
          giveItem(player, new mc.ItemStack("minecraft:cave_spider_spawn_egg"));
          player.sendMessage("[入手] 洞窟グモ");
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "モンスタースポナーを設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("trial_spawner.open_shutter", player.location, {volume: 10});
          setObject(player, "minecraft:mob_spawner");
          return;
      }
    }
  },
  phantom_spawn_egg: {
    /**
     * ファントム
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:phantom",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ファントムを召喚しました");
          mob.addTag("fly");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 10});
          giveSword(player, getCard(mob.typeId).atk, "速攻効果");
        }
      )
    }
  },
  breeze_spawn_egg: {
    /**
     * ブリーズ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:breeze",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ブリーズを召喚しました");
          mob.addTag("fly");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          mob.dimension.playSound("wind_charge.burst", mob.location, {volume: 10});
          mob.dimension.spawnParticle("minecraft:breeze_wind_explosion_emitter", mob.location);
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player", "minecraft:item"]}).forEach(entity=>{
            if(entity.id == mob.id) return;
            if(entity.hasTag("protect")){
              entity.removeTag("protect");
            }
            else{
              entity.kill();
            }
          })
        }
      )
    }
  },
  ender_chest: {
    /**
     * エンダーチェスト
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "エンダーチェストを使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.enderchestopen", player.location, {volume: 10});
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly", "guard"]}).forEach(entity=>{
            lineParticle(player.dimension, player.location, entity.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            entity.dimension.spawnParticle("mcg:knockback_roar_particle", entity.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(entity, 10);
          })
          switch(Math.floor(Math.random() * 4)){
            case 0:
              giveItem(player, new mc.ItemStack("minecraft:enchanted_golden_apple"));
              player.sendMessage("[入手] エンチャントされた金のリンゴ");
              break;
            case 1:
              giveItem(player, new mc.ItemStack("minecraft:stray_spawn_egg"),2);
              player.sendMessage("[入手] ストレイ x2");
              break;
            case 2:
              giveItem(player, new mc.ItemStack("minecraft:husk_spawn_egg"),2);
              player.sendMessage("[入手] ハスク x2");
              break;
            case 3:
              giveItem(player, new mc.ItemStack("minecraft:phantom_spawn_egg"),2);
              player.sendMessage("[入手] ファントム x2");
              break;
          }
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "エンダーチェストを設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.enderchestopen", player.location, {volume: 10});
          setObject(player, "minecraft:ender_chest");
          return;
      }
    }
  },
  husk_spawn_egg: {
    /**
     * ハスク
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:husk",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ハスクを召喚しました");
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 10});
          mob.addTag("guard");
        }
      )
    }
  },
  stray_spawn_egg: {
    /**
     * ストレイ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:stray",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ストレイを召喚しました");
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:arrow"), 2);
          player.sendMessage("[入手] 矢 x2");
        }
      )
    }
  },
  cave_spider_spawn_egg: {
    /**
     * 洞窟グモ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:cave_spider",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "洞窟グモを召喚しました");
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:web"));
          player.sendMessage("[入手] クモの巣");
        }
      )
    }
  },
  enchanted_golden_apple: {
    /**
     * エンチャントされた金のリンゴ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "エンチャントされた金のリンゴを使用しました");
          player.dimension.playSound("random.eat", player.location, {volume: 10});
          changeHealthBoost(player, 4);
          player.getComponent(mc.EntityHealthComponent.componentId).setCurrentValue(40);
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  web: {
    /**
     * クモの巣
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "クモの巣を使用しました");
          sendPlayerMessage(player, "相手にクモの巣が絡まる！");
          player.dimension.playSound("step.web", player.location, {volume: 10});
          mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]}).forEach(enemy=>{
            addAct(enemy, -15)
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  zombie_pigman_spawn_egg: {
    /**
     * ゾンビピッグマン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:zombie_pigman",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ゾンビピッグマンを召喚しました");
          mob.dimension.playSound("mob.blaze.shoot", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:grass_block"), 2);
          player.sendMessage("[入手] 草ブロック x2");
          if(!player.hasTag("nether")){
            player.addTag("nether");
            player.sendMessage("ネザーカードがドロー可能になりました");
            player.onScreenDisplay.setTitle("§cネザーゲートが開放された...");
            player.playSound("portal.portal", {location:player.location});
          }
        }
      )
    }
  },
  wither_skeleton_spawn_egg: {
    /**
     * ウィザースケルトン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:wither_skeleton",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ウィザースケルトンを召喚しました");
          mob.dimension.playSound("mob.blaze.shoot", mob.location, {volume: 10});
          if(!player.hasTag("nether")){
            player.addTag("nether");
            player.sendMessage("ネザーカードがドロー可能になりました");
            player.onScreenDisplay.setTitle("§cネザーゲートが開放された...");
            player.playSound("portal.portal", {location:player.location});
          }
        }
      )
    }
  },
  crying_obsidian: {
    /**
     * 泣く黒曜石
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let entities;
      switch(cardBlock.typeId){
        case B:
          entities = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotB"]});
          if(entities.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "泣く黒曜石を使用しました");
          player.dimension.playSound("mob.ghast.scream", player.location, {volume: 10});
          lineParticle(player.dimension, player.location, entities[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].dimension.spawnParticle("mcg:knockback_roar_particle", entities[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].addTag("call_pigman");
          break;
        case W:
          entities = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotW"]});
          if(entities.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "泣く黒曜石を使用しました");
          player.dimension.playSound("mob.ghast.scream", player.location, {volume: 10});
          lineParticle(player.dimension, player.location, entities[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].dimension.spawnParticle("mcg:knockback_roar_particle", entities[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].addTag("call_pigman");
          break;
        case R:
          entities = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotR"]});
          if(entities.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "泣く黒曜石を使用しました");
          player.dimension.playSound("mob.ghast.scream", player.location, {volume: 10});
          lineParticle(player.dimension, player.location, entities[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].dimension.spawnParticle("mcg:knockback_roar_particle", entities[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].addTag("call_pigman");
          break;
        case P:
          player.sendMessage(error_slot);
          return;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "泣く黒曜石を設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          setObject(player, "minecraft:crying_obsidian");
          return;
      }
    }
  },
  wither_rose: {
    /**
     * ウィザーローズ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          let enemyEntities = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")]});
          if(enemyEntities.length < 3){
            player.sendMessage("§c相手のスロットが埋まっていないため使用できません");
            return;
          }
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue")]}).length > 0){
            player.sendMessage("§c自分のスロットにモブが存在しているため使用できません");
            return;
          }
          let enemy = mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]})[0];
          if(getAct(enemy) < 30){
            player.sendMessage("§c相手のactが30未満のため使用できません");
            return;
          }
          if(getAct(player) > 10){
            player.sendMessage("§cactが10より多いため使用できません");
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ウィザーローズを使用しました");
          player.dimension.playSound("mob.wither.shoot", player.location, {volume: 10});
          setAct(player, 40);
          setAct(enemy, 30);
          player.dimension.spawnParticle("mcg:knockback_roar_particle", player.location, createColor({red:0, green:0, blue:0}));
          enemy.dimension.spawnParticle("mcg:knockback_roar_particle", enemy.location, createColor({red:0, green:0, blue:0}));
          applyDamage(player, 8, {cause:mc.EntityDamageCause.wither});
          giveItem(player, new mc.ItemStack("minecraft:grass_block"), 3);
          player.sendMessage("[入手] 草ブロック x3");
          enemyEntities.forEach(entity=>{
            entity.dimension.spawnParticle("mcg:knockback_roar_particle", entity.location, createColor({red:0, green:0, blue:0}));
            applyDamage(entity, 20);
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  strider_spawn_egg: {
    /**
     * ストライダー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:strider",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ストライダーを召喚しました");
          mob.dimension.playSound("respawn_anchor.charge", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:saddle"));
          player.sendMessage("[入手] 鞍");
        }
      )
    }
  },
  lava_bucket: {
    /**
     * 溶岩入りバケツ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "溶岩入りバケツを使用しました");
          player.dimension.playSound("bucket.fill_lava", player.location, {volume: 10});
          mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]}).forEach(enemy=>{
            applyDamage(enemy, 4, {cause:mc.EntityDamageCause.lava});
          })
          giveItem(player, new mc.ItemStack("minecraft:crying_obsidian"));
          player.sendMessage("[入手] 泣く黒曜石");
          giveItem(player, new mc.ItemStack("minecraft:potato"));
          player.sendMessage("[入手] ジャガイモ");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  potato: {
    /**
     * ジャガイモ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:blaze",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ジャガイモを使用しました");
          sendPlayerMessage(player, "ブレイズを召喚しました");
          mob.addTag("fly");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          mob.dimension.playSound("respawn_anchor.charge", mob.location, {volume: 10});
          mc.world.getPlayers().forEach(p=>{
            p.onScreenDisplay.setTitle([(player.hasTag("red")?"§c":"§b"), "ブレイズ"], {fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 20});
            p.onScreenDisplay.updateSubtitle("§3上手に揚がりました!!");
          })
        }
      )
    }
  },
  saddle: {
    /**
     * 鞍
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let myStriders = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:strider", tags:[(player.hasTag("red")?"red":"blue")]});
      if(myStriders.length == 0){
        player.sendMessage("§c自分のスロットにストライダーが存在しないため使用できません");
        return;
      }
      let target;
      switch(cardBlock.typeId){
        case B:
          target = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotB"]});
          if(target.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "鞍を使用しました");
          myStriders.forEach(strider=>{
            lineParticle(strider.dimension, strider.location, target[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            if(!strider.hasTag("protect")) strider.kill();
            strider.dimension.playSound("random.fizz", strider.location, {volume: 10});
          })
          target.forEach(entity=>{
            if(!entity.hasTag("protect")) entity.kill();
          })
          break;
        case W:
          target = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotW"]});
          if(target.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "鞍を使用しました");
          myStriders.forEach(strider=>{
            lineParticle(strider.dimension, strider.location, target[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            if(!strider.hasTag("protect")) strider.kill();
            strider.dimension.playSound("random.fizz", strider.location, {volume: 10});
          })
          target.forEach(entity=>{
            if(!entity.hasTag("protect")) entity.kill();
          })
          break;
        case R:
          target = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotR"]});
          if(target.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "鞍を使用しました");
          myStriders.forEach(strider=>{
            lineParticle(strider.dimension, strider.location, target[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            if(!strider.hasTag("protect")) strider.kill();
            strider.dimension.playSound("random.fizz", strider.location, {volume: 10});
          })
          target.forEach(entity=>{
            if(!entity.hasTag("protect")) entity.kill();
          })
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  chicken_spawn_egg: {
    /**
     * ニワトリ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:chicken",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ニワトリを召喚しました");
          mob.dimension.playSound("block.beehive.exit", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:egg"));
          player.sendMessage("[入手] 卵");
        }
      )
    }
  },
  parrot_spawn_egg: {
    /**
     * オウム
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:parrot",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "オウムを召喚しました");
          mob.dimension.playSound("block.beehive.exit", mob.location, {volume: 10});
          mob.addTag("fly");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          giveItem(player, new mc.ItemStack("minecraft:grass_block"), 2);
          player.sendMessage("[入手] 草ブロック x2");
          switch(Math.floor(Math.random() * 4)){
            case 0:
              giveItem(player, new mc.ItemStack("minecraft:poppy"));
              player.sendMessage("[入手] ポピー");
              break;
            case 1:
              giveItem(player, new mc.ItemStack("minecraft:dandelion"));
              player.sendMessage("[入手] タンポポ");
              break;
            case 2:
              giveItem(player, new mc.ItemStack("minecraft:pink_tulip"));
              player.sendMessage("[入手] 桃色のチューリップ");
              break;
            case 3:
              giveItem(player, new mc.ItemStack("minecraft:cactus"));
              player.sendMessage("[入手] サボテン");
              break;
          }
        }
      )
    }
  },
  bee_nest: {
    /**
     * ミツバチの巣
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ミツバチの巣を使用しました");
          player.dimension.playSound("block.beehive.enter", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:bee_spawn_egg"), 2);
          player.sendMessage("[入手] ミツバチ x2");
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "ミツバチの巣を設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("block.beehive.enter", player.location, {volume: 10});
          setObject(player, "minecraft:bee_nest");
          return;
      }
    }
  },
  composter: {
    /**
     * コンポスター
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "コンポスターを使用しました");
          player.dimension.playSound("block.composter.ready", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("wooden_pickaxe"));
          player.sendMessage("[入手] 木のツルハシ");
          giveItem(player, new mc.ItemStack("minecraft:wooden_hoe"));
          player.sendMessage("[入手] 木のクワ");
          giveItem(player, new mc.ItemStack("minecraft:carrot_on_a_stick"));
          player.sendMessage("[入手] ニンジン付きの棒");
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "コンポスターを設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("block.composter.ready", player.location, {volume: 10});
          setObject(player, "minecraft:composter");
          return;
      }
    }
  },
  fox_spawn_egg: {
    /**
     * キツネ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:fox",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "キツネを召喚しました");
          mob.dimension.playSound("dig.grass", mob.location, {volume: 10});
          giveSword(player, getCard(mob.typeId).atk, "速攻効果");
          let object = getObject(player.hasTag("red")?"red":"blue");
          if(object?.typeId != "minecraft:air"){
            giveItem(player, object.getItemStack());
            sendPlayerMessage(player, "キツネがアイテムを持ってきた！");
          }
        }
      )
    }
  },
  frog_spawn_egg: {
    /**
     * カエル
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:frog",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "カエルを召喚しました");
          mob.dimension.playSound("dig.grass", mob.location, {volume: 10});
          let object = getObject(player.hasTag("red")?"blue":"red");
          if(object.typeId != "minecraft:air"){
            lineParticle(object.dimension, mob.location, object.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            setObject(mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]})[0], "minecraft:air");
            sendPlayerMessage(player, "カエルが相手のオブジェクトを食べてしまった！");
            mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), (mob.hasTag("slotB")?"slotB":mob.hasTag("slotW")?"slotW":"slotR")]}).forEach(entity=>{
              if(!entity.hasTag("protect")) entity.kill();
            })
          }
        }
      )
    }
  },
  mooshroom_spawn_egg: {
    /**
     * ムーシュルーム
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:mooshroom",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ムーシュルームを召喚しました");
          mob.dimension.playSound("dig.grass", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:red_mushroom"));
          player.sendMessage("[入手] 赤いキノコ");
        }
      )
    }
  },
  polar_bear_spawn_egg: {
    /**
     * ホッキョクグマ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:polar_bear",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ホッキョクグマを召喚しました");
          mob.dimension.playSound("random.explode", mob.location, {volume: 10});
          mc.world.getPlayers().forEach(p=>{
            p.onScreenDisplay.setTitle([(player.hasTag("red")?"§c":"§b"), "ホッキョクグマ"], {fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 20});
            p.onScreenDisplay.updateSubtitle("§3氷界の猛獣");
          })
        }
      )
    }
  },
  egg: {
    /**
     * 卵
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "卵を使用しました");
          player.dimension.playSound("random.eat", player.location, {volume: 10});
          player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
          /**
           * @type {mc.EntityHealthComponent}
           */
          let hp = player.getComponent(mc.EntityHealthComponent.componentId);
          hp.setCurrentValue(hp.currentValue + 1);
          sendPlayerMessage(player, "HP+1");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  poppy: {
    /**
     * ポピー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          if(getObject(player.hasTag("red")?"red":"blue")?.typeId != "minecraft:bee_nest" ||
          mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:bee", tags:[(player.hasTag("red")?"red":"blue")]}).length == 0) {
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ポピーを使用しました");
          giveItem(player, new mc.ItemStack("minecraft:honey_bottle"));
          player.sendMessage("[入手] ハチミツ入りの瓶");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  dandelion: {
    /**
     * タンポポ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          if(getObject(player.hasTag("red")?"red":"blue")?.typeId != "minecraft:bee_nest" ||
          mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:bee", tags:[(player.hasTag("red")?"red":"blue")]}).length == 0) {
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "タンポポを使用しました");
          giveItem(player, new mc.ItemStack("minecraft:honey_bottle"));
          player.sendMessage("[入手] ハチミツ入りの瓶");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  pink_tulip: {
    /**
     * 桃色のチューリップ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          if(getObject(player.hasTag("red")?"red":"blue")?.typeId != "minecraft:bee_nest" ||
          mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:bee", tags:[(player.hasTag("red")?"red":"blue")]}).length == 0) {
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "桃色のチューリップを使用しました");
          giveItem(player, new mc.ItemStack("minecraft:honey_bottle"));
          player.sendMessage("[入手] ハチミツ入りの瓶");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  cactus: {
    /**
     * サボテン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "サボテンを使用しました");
          sendPlayerMessage(player, "サボテンのトゲを撒き散らした！");
          player.dimension.playSound("block.sweet_berry_bush.hurt", player.location, {volume: 10});
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly", "guard"]}).forEach(entity=>{
            lineParticle(player.dimension, player.location, entity.location, "minecraft:critical_hit_emitter", 1);
            applyDamage(entity, 5);
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  bee_spawn_egg: {
    /**
     * ミツバチ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:bee",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ミツバチを召喚しました");
          mob.addTag("fly");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          mob.dimension.playSound("block.beehive.exit", mob.location, {volume: 10});
          giveSword(player, getCard(mob.typeId).atk, "速攻効果");
          if(getObject(player.hasTag("red")?"red":"blue").typeId == "minecraft:bee_nest"){
            giveItem(player, new mc.ItemStack("minecraft:honey_bottle"));
            player.sendMessage("[入手] ハチミツ入りの瓶");
          }
        }
      )
    }
  },
  wooden_hoe: {
    /**
     * 木のクワ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "木のクワを使用しました");
          player.dimension.playSound("dig.gravel", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:wheat"));
          player.sendMessage("[入手] 小麦");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  stone_hoe: {
    /**
     * 石のクワ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "石のクワを使用しました");
          player.dimension.playSound("dig.gravel", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:wheat"));
          player.sendMessage("[入手] 小麦");
          giveItem(player, new mc.ItemStack("minecraft:grass_block"));
          player.sendMessage("[入手] 草ブロック");
          switch(Math.floor(Math.random() * 4)){
            case 0:
              giveItem(player, new mc.ItemStack("minecraft:poppy"));
              player.sendMessage("[入手] ポピー");
              break;
            case 1:
              giveItem(player, new mc.ItemStack("minecraft:dandelion"));
              player.sendMessage("[入手] タンポポ");
              break;
            case 2:
              giveItem(player, new mc.ItemStack("minecraft:pink_tulip"));
              player.sendMessage("[入手] 桃色のチューリップ");
              break;
            case 3:
              giveItem(player, new mc.ItemStack("minecraft:cactus"));
              player.sendMessage("[入手] サボテン");
              break;
          }
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  iron_hoe: {
    /**
     * 鉄のクワ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "鉄のクワを使用しました");
          player.dimension.playSound("dig.gravel", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:wheat"), 2);
          player.sendMessage("[入手] 小麦 x2");
          giveItem(player, new mc.ItemStack("minecraft:grass_block"), 3);
          player.sendMessage("[入手] 草ブロック x3");
          for(let i=0; i<2; i++){
            switch(Math.floor(Math.random() * 4)){
              case 0:
                giveItem(player, new mc.ItemStack("minecraft:poppy"));
                player.sendMessage("[入手] ポピー");
                break;
              case 1:
                giveItem(player, new mc.ItemStack("minecraft:dandelion"));
                player.sendMessage("[入手] タンポポ");
                break;
              case 2:
                giveItem(player, new mc.ItemStack("minecraft:pink_tulip"));
                player.sendMessage("[入手] 桃色のチューリップ");
                break;
              case 3:
                giveItem(player, new mc.ItemStack("minecraft:cactus"));
                player.sendMessage("[入手] サボテン");
                break;
            }
          }
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  wheat: {
    /**
     * 小麦
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "小麦を使用しました");
          giveItem(player, new mc.ItemStack("minecraft:cow_spawn_egg"));
          player.sendMessage("[入手] ウシ");
          giveItem(player, new mc.ItemStack("minecraft:sheep_spawn_egg"));
          player.sendMessage("[入手] ヒツジ");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  packed_ice: {
    /**
     * 氷塊
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      addAct(player, -parseInt(info.Cact));
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "氷塊を消費しました");
    }
  },
  bread: {
    /**
     * パン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "パンを使用しました");
          player.dimension.playSound("random.eat", player.location, {volume: 10});
          player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
          /**
           * @type {mc.EntityHealthComponent}
           */
          let hp = player.getComponent(mc.EntityHealthComponent.componentId);
          hp.setCurrentValue(hp.currentValue + 3);
          sendPlayerMessage(player, "HP+3");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  cake: {
    /**
     * ケーキ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ケーキを使用しました");
          player.dimension.playSound("random.eat", player.location, {volume: 10});
          player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
          /**
           * @type {mc.EntityHealthComponent}
           */
          let hp = player.getComponent(mc.EntityHealthComponent.componentId);
          hp.setCurrentValue(hp.currentValue + 9);
          sendPlayerMessage(player, "HP+9");
          mc.world.sendMessage("おめでとう！プレゼントもあるよ！");
          giveItem(player, new mc.ItemStack("minecraft:chest"));
          player.sendMessage("[入手] チェスト");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  sheep_spawn_egg: {
    /**
     * ヒツジ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:sheep",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ヒツジを召喚しました");
          mob.dimension.playSound("dig.grass", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:white_wool"));
          player.sendMessage("[入手] 白色の羊毛");
        }
      )
    }
  },
  cow_spawn_egg: {
    /**
     * ウシ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:cow",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ウシを召喚しました");
          mob.dimension.playSound("dig.grass", mob.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:milk_bucket"));
          player.sendMessage("[入手] ミルクバケツ");
        }
      )
    }
  },
  milk_bucket: {
    /**
     * ミルクバケツ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let mobs;
      switch(cardBlock.typeId){
        case B:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotB"], excludeTags:["fly", "guard"]});
          if(mobs.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ミルクバケツを使用しました");
          player.dimension.playSound("random.drink", player.location, {volume: 10});
          mobs.forEach(mob=>{
            lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.addTag("guard");
          })
          break;
        case W:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotW"], excludeTags:["fly", "guard"]});
          if(mobs.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ミルクバケツを使用しました");
          player.dimension.playSound("random.drink", player.location, {volume: 10});
          mobs.forEach(mob=>{
            lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.addTag("guard");
          })
          break;
        case R:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotR"], excludeTags:["fly", "guard"]});
          if(mobs.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ミルクバケツを使用しました");
          player.dimension.playSound("random.drink", player.location, {volume: 10});
          mobs.forEach(mob=>{
            lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.addTag("guard");
          })
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  bogged_spawn_egg: {
    /**
     * ボグド
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:bogged",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          sendPlayerMessage(player, "ボグドを召喚しました");
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 10});
          if(getObject(player.hasTag("red")?"red":"blue").typeId != "minecraft:air"){
            giveItem(player, new mc.ItemStack("minecraft:arrow"), 3);
            player.sendMessage("[入手] 矢 x3");
          }
        }
      )
    }
  },
  lit_pumpkin: {
    /**
     * ジャック・オ・ランタン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
        case O:
          if(mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:snow_golem", tags:[(player.hasTag("red")?"red":"blue")]}).length == 0 &&
            mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:iron_golem", tags:[(player.hasTag("red")?"red":"blue")]}).length == 0
          ){
            player.sendMessage("§c自分のスロットにゴーレムが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ジャック・オ・ランタンを設置しました");
          setObject(player, mc.world.getDimension("minecraft:overworld").getBlock(player.hasTag("red")?mcg.const.blue.slot.object:mcg.const.red.slot.object)?.typeId);
          setObject(mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]})[0], "minecraft:lit_pumpkin");
          sendPlayerMessage(player, "オブジェクトが入れ替わった！");
          return;
      }
    }
  },
  pillager_spawn_egg: {
    /**
     * 略奪者
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
          player.sendMessage(error_slot);
          return;
        case R:
          let villager = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:villager_v2", tags:[(player.hasTag("red")?"red":"blue"), "slotR"]});
          if(villager.length == 0){
            player.sendMessage("§c赤スロットに村人が存在しないため使用できません。");
            return;
          }
          let info = getCard(handItem(player).typeId);
          if(parseInt(info.Sact) > getAct(player) + 1){
            player.sendMessage(error_act);
            return;
          }
          addAct(player, -parseInt(info.Sact));
          decrementSlot(player, player.selectedSlotIndex);
          let mob = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:pillager", (player.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red));
          mob.addTag((player.hasTag("red") ? "red" : "blue"));
          mob.addTag("slotR");
          mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
          villager.forEach(v=>{
            v.kill();
          })
          sendPlayerMessage(player, "略奪者を召喚しました");
          mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
          applyDamage(player, 3);
          giveItem(player, new mc.ItemStack("minecraft:grass_block"), 2);
          player.sendMessage("[入手] 草ブロック x2");
          lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  trapped_chest: {
    /**
     * トラップチェスト
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          if(!mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue")]}).find(entity=>{
            return getCard(entity.typeId)?.attribute?.includes("残虐");
          })){
            player.sendMessage("§c自分のスロットに残虐属性のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "トラップチェストを使用しました");
          player.dimension.playSound("random.chestopen", player.location, {volume: 10});
          giveItem(player, new mc.ItemStack("minecraft:ominous_bottle"));
          player.sendMessage("[入手] 不吉な瓶");
          giveItem(player, new mc.ItemStack("mcg:totem"));
          player.sendMessage("[入手] 不死のトーテム");
          giveItem(player, new mc.ItemStack("minecraft:carrot_on_a_stick"));
          player.sendMessage("[入手] ニンジン付きの棒");
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          setObject(player, "minecraft:trapped_chest");
          player.dimension.playSound("random.chestopen", player.location, {volume: 10});
          sendPlayerMessage(player, "トラップチェストを設置しました");
          break;
      }
    }
  },
  vindicator_spawn_egg: {
    /**
     * ヴィンディケーター
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
          let villager = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:villager_v2", tags:[(player.hasTag("red")?"red":"blue"), "slotB"]});
          if(villager.length == 0){
            player.sendMessage("§c青スロットに村人が存在しないため使用できません。");
            return;
          }
          let info = getCard(handItem(player).typeId);
          if(parseInt(info.Sact) > getAct(player) + 1){
            player.sendMessage(error_act);
            return;
          }
          addAct(player, -parseInt(info.Sact));
          decrementSlot(player, player.selectedSlotIndex);
          let mob = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:vindicator", (player.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue));
          mob.addTag((player.hasTag("red") ? "red" : "blue"));
          mob.addTag("slotB");
          mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
          villager.forEach(v=>{
            v.kill();
          })
          sendPlayerMessage(player, "ヴィンディケーターを召喚しました");
          mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
          applyDamage(player, 4);
          giveItem(player, new mc.ItemStack("minecraft:iron_axe"));
          player.sendMessage("[入手] 鉄の斧");
          lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          break;
        case W:
        case R:
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  vex_spawn_egg: {
    /**
     * ヴェックス
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:vex",
        /**
         * @param {mc.Entity} mob
         */
        (mob)=>{
          mob.addTag("fly");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          sendPlayerMessage(player, "ヴェックスを召喚しました");
          mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
        }
      )
    }
  },
  evoker_spawn_egg: {
    /**
     * エヴォーカー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
          player.sendMessage(error_slot);
          return;
        case W:
          let villager = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:villager_v2", tags:[(player.hasTag("red")?"red":"blue"), "slotW"]});
          if(villager.length == 0){
            player.sendMessage("§c白スロットに村人が存在しないため使用できません。");
            return;
          }
          let info = getCard(handItem(player).typeId);
          if(parseInt(info.Sact) > getAct(player) + 1){
            player.sendMessage(error_act);
            return;
          }
          addAct(player, -parseInt(info.Sact));
          decrementSlot(player, player.selectedSlotIndex);
          let mob = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:evocation_illager", (player.hasTag("red") ? mcg.const.red.slot.white : mcg.const.blue.slot.white));
          mob.addTag((player.hasTag("red") ? "red" : "blue"));
          mob.addTag("slotW");
          mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
          villager.forEach(v=>{
            v.kill();
          })
          sendPlayerMessage(player, "エヴォーカーを召喚しました");
          mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
          applyDamage(player, 3);
          giveItem(player, new mc.ItemStack("mcg:totem"));
          player.sendMessage("[入手] 不死のトーテム");
          lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotB"]}).length == 0){
            let mobb = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:vex", (player.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue));
            mobb.addTag((player.hasTag("red") ? "red" : "blue"));
            mobb.addTag("slotB");
            mobb.addTag("fly");
            mobb.teleport(mobb.location, {facingLocation: {x:0, y:0, z:0}});
            sendPlayerMessage(player, "ヴェックスを召喚しました");
            mobb.dimension.playSound("apply_effect.raid_omen", mobb.location, {volume: 10});
          }
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotR"]}).length == 0){
            let mobr = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:vex", (player.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red));
            mobr.addTag((player.hasTag("red") ? "red" : "blue"));
            mobr.addTag("slotR");
            mobr.addTag("fly");
            mobr.teleport(mobr.location, {facingLocation: {x:0, y:0, z:0}});
            sendPlayerMessage(player, "ヴェックスを召喚しました");
            mobr.dimension.playSound("apply_effect.raid_omen", mobr.location, {volume: 10});
          }
          break;
        case R:
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  armor_stand: {
    /**
     * 防具立て
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let mob;
      switch(cardBlock.typeId){
        case B:
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"blue":"red"), "slotB"]}).length > 0){
            player.sendMessage(error_mob);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          mob = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:armor_stand", (player.hasTag("red") ? mcg.const.blue.slot.blue : mcg.const.red.slot.blue));
          mob.addTag((player.hasTag("red") ? "blue" : "red"));
          mob.addTag("slotB");
          break;
        case W:
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"blue":"red"), "slotW"]}).length > 0){
            player.sendMessage(error_mob);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          mob = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:armor_stand", (player.hasTag("red") ? mcg.const.blue.slot.white : mcg.const.red.slot.white));
          mob.addTag((player.hasTag("red") ? "blue" : "red"));
          mob.addTag("slotW");
          break;
        case R:
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"blue":"red"), "slotR"]}).length > 0){
            player.sendMessage(error_mob);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          mob = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:armor_stand", (player.hasTag("red") ? mcg.const.blue.slot.red : mcg.const.red.slot.red));
          mob.addTag((player.hasTag("red") ? "blue" : "red"));
          mob.addTag("slotR");
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
      mob.addTag("fly");
      mob.addTag("guard");
      mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
      applyDamage(player, 5);
      sendPlayerMessage(player, "防具立てを設置しました");
      lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
    }
  },
  ravager_spawn_egg: {
    /**
     * ラヴェジャー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
          player.sendMessage(error_slot);
          return;
        case W:
          let geno = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue")]}).filter(e=>{
            return getCard(e.typeId)?.attribute?.includes("残虐");
          })
          if(geno.length == 0){
            player.sendMessage("§c自分の場に残虐属性のモブが存在しないため使用できません。");
            return;
          }
          summonCard(cardBlock, player, "minecraft:ravager",
            /**
             * @param {mc.Entity} mob
             */
            (mob)=>{
              sendPlayerMessage(player, "ラヴェジャーを召喚しました");
              mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
              applyDamage(player, 4);
            }
          )
      }
    }
  },
  banner: {
    /**
     * 不吉な旗
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      if(mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "ace"]}).length > 0){
        player.sendMessage("§c既に大将が存在するため使用できません。");
        return;
      }
      let mobs;
      switch(cardBlock.typeId){
        case B:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotB"]}).filter(e=>{
            return ["pillager", "vindicator", "evocation_illager"].includes(e.typeId.slice(10));
          });
          if(mobs.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "不吉な旗を使用しました");
          mobs.forEach(mob=>{
            lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.addTag("ace");
          })
          player.addTag("raid");
          player.dimension.playSound("raid.horn", player.location, {volume: 10});
          mc.world.getPlayers().forEach(p=>{
            p.onScreenDisplay.setTitle("§c§l襲撃モード");
          })
          changeHealthBoost(player, 2);
          break;
        case W:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotW"]}).filter(e=>{
            return ["pillager", "vindicator", "evocation_illager"].includes(e.typeId.slice(10));
          });
          if(mobs.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "不吉な旗を使用しました");
          mobs.forEach(mob=>{
            lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.addTag("ace");
          })
          player.addTag("raid");
          player.dimension.playSound("raid.horn", player.location, {volume: 10});
          mc.world.getPlayers().forEach(p=>{
            p.onScreenDisplay.setTitle("§c§l襲撃モード");
          })
          changeHealthBoost(player, 2);
          break;
        case R:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotR"]}).filter(e=>{
            return ["pillager", "vindicator", "evocation_illager"].includes(e.typeId.slice(10));
          });
          if(mobs.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "不吉な旗を使用しました");
          mobs.forEach(mob=>{
            lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.addTag("ace");
          })
          player.addTag("raid");
          player.dimension.playSound("raid.horn", player.location, {volume: 10});
          mc.world.getPlayers().forEach(p=>{
            p.onScreenDisplay.setTitle("§c§l襲撃モード");
          })
          changeHealthBoost(player, 2);
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  iron_axe: {
    /**
     * 鉄の斧
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
        case P:
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly", "guard"]}).length == 0){
            player.sendMessage("§c相手の場に攻撃可能なモブが存在しません");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "鉄の斧を使用しました");
          player.dimension.playSound("mace.smash_ground", player.location, {volume: 10});
          lineParticle(player.dimension, player.location, player.hasTag("red")?mcg.const.blue.slot.white:mcg.const.red.slot.white, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          player.dimension.spawnParticle("minecraft:smash_ground_particle", player.hasTag("red")?mcg.const.blue.slot.white:mcg.const.red.slot.white);
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotB"], excludeTags:["fly", "guard"]}).forEach(mob=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${mob.typeId.slice(10)}.name`},
              `§r[鉄の斧]`
            ])
            applyDamage(mob, 15);
            mob.dimension.playSound("random.glass", mob.location, {volume: 10});
          });
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotW"], excludeTags:["fly", "guard"]}).forEach(mob=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${mob.typeId.slice(10)}.name`},
              `§r[鉄の斧]`
            ])
            applyDamage(mob, 35);
            mob.dimension.playSound("random.glass", mob.location, {volume: 10});
          });
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotR"], excludeTags:["fly", "guard"]}).forEach(mob=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${mob.typeId.slice(10)}.name`},
              `§r[鉄の斧]`
            ])
            applyDamage(mob, 15);
            mob.dimension.playSound("random.glass", mob.location, {volume: 10});
          });
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  totem: {
    /**
     * 不死のトーテム
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          if(!player.hasTag("raid")){
            player.sendMessage("§c襲撃モード中でないため使用できません");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "不死のトーテムを使用しました");
          player.dimension.playSound("random.totem", player.location, {volume: 10});
          player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
          /**@type {mc.EntityHealthComponent} */
          let health = player.getComponent(mc.EntityHealthComponent.componentId);
          sendPlayerMessage(player, `HP+${health.effectiveMax - health.currentValue}`);
          health.setCurrentValue(health.effectiveMax);
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  ominous_bottle: {
    /**
     * 不吉な瓶
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let mobs;
      /**@type {mc.EntityHealthComponent} */
      let health;
      let hp;
      switch(cardBlock.typeId){
        case B:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:witch", tags:[(player.hasTag("red")?"red":"blue"), "slotB"]});
          if(mobs.length == 0){
            player.sendMessage("§c青スロットにウィッチが存在しないため使用できません。");
            return;
          }
          if(mobs[0].hasTag("enhance")){
            player.sendMessage("§cすでに強化されているため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "不吉な瓶を使用しました");
          health = mobs[0].getComponent(mc.EntityHealthComponent.componentId);
          hp = health.currentValue;
          mobs[0].triggerEvent("enhance");
          mobs[0].addTag("enhance");
          lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          myTimeout(1,()=>{
            health.setCurrentValue(hp);
          })
          mobs[0].dimension.playSound("block.enchanting_table.use", mobs[0].location, {volume: 10});
          sendPlayerMessage(player, "ウィッチを強化しました");
          giveItem(player, new mc.ItemStack("mcg:awkward_potion"), 2);
          player.sendMessage("[入手] 奇妙なポーション x2");
          break;
        case W:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:witch", tags:[(player.hasTag("red")?"red":"blue"), "slotW"]});
          if(mobs.length == 0){
            player.sendMessage("§c白スロットにウィッチが存在しないため使用できません。");
            return;
          }
          if(mobs[0].hasTag("enhance")){
            player.sendMessage("§cすでに強化されているため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "不吉な瓶を使用しました");
          health = mobs[0].getComponent(mc.EntityHealthComponent.componentId);
          hp = health.currentValue;
          mobs[0].triggerEvent("enhance");
          mobs[0].addTag("enhance");
          lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          myTimeout(1,()=>{
            health.setCurrentValue(hp);
          })
          mobs[0].dimension.playSound("block.enchanting_table.use", mobs[0].location, {volume: 10});
          sendPlayerMessage(player, "ウィッチを強化しました");
          giveItem(player, new mc.ItemStack("mcg:awkward_potion"), 2);
          player.sendMessage("[入手] 奇妙なポーション x2");
          break;
        case R:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:witch", tags:[(player.hasTag("red")?"red":"blue"), "slotR"]});
          if(mobs.length == 0){
            player.sendMessage("§c赤スロットにウィッチが存在しないため使用できません。");
            return;
          }
          if(mobs[0].hasTag("enhance")){
            player.sendMessage("§cすでに強化されているため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "不吉な瓶を使用しました");
          health = mobs[0].getComponent(mc.EntityHealthComponent.componentId);
          hp = health.currentValue;
          mobs[0].triggerEvent("enhance");
          mobs[0].addTag("enhance");
          lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          myTimeout(1,()=>{
            health.setCurrentValue(hp);
          })
          mobs[0].dimension.playSound("block.enchanting_table.use", mobs[0].location, {volume: 10});
          sendPlayerMessage(player, "ウィッチを強化しました");
          giveItem(player, new mc.ItemStack("mcg:awkward_potion"), 2);
          player.sendMessage("[入手] 奇妙なポーション x2");
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  awkward_potion: {
    /**
     * 奇妙なポーション
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      const allow_mobs = ["zombie", "skeleton", "creeper", "witch"];
      let mobs;
      switch(cardBlock.typeId){
        case B:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotB"]}).filter(e=>{
            return allow_mobs.includes(e.typeId.slice(10));
          })
          if(mobs.length == 0){
            player.sendMessage("§c青スロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "奇妙なポーションを使用しました");
          lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          enhance[mobs[0].typeId.slice(10)].run(mobs[0], player);
          break;
        case W:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotW"]}).filter(e=>{
            return allow_mobs.includes(e.typeId.slice(10));
          })
          if(mobs.length == 0){
            player.sendMessage("§c白スロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "奇妙なポーションを使用しました");
          lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          enhance[mobs[0].typeId.slice(10)].run(mobs[0], player);
          break;
        case R:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotR"]}).filter(e=>{
            return allow_mobs.includes(e.typeId.slice(10));
          })
          if(mobs.length == 0){
            player.sendMessage("§c赤スロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "奇妙なポーションを使用しました");
          lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          enhance[mobs[0].typeId.slice(10)].run(mobs[0], player);
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  heal_potion: {
    /**
     * 治癒のポーション
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let mobs = [];
      switch(cardBlock.typeId){
        case B:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotB"]});
          if(mobs.length == 0){
            player.sendMessage("§c青スロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のポーションを使用しました");
          break;
        case W:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotW"]});
          if(mobs.length == 0){
            player.sendMessage("§c白スロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のポーションを使用しました");
          break;
        case R:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotR"]});
          if(mobs.length == 0){
            player.sendMessage("§c赤スロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のポーションを使用しました");
          break;
        case P:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のポーションを使用しました");
          player.dimension.playSound("random.drink", player.location, {volume: 10});
          player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
          /**@type {mc.EntityHealthComponent} */
          let health = player.getComponent(mc.EntityHealthComponent.componentId);
          health.setCurrentValue(health.currentValue + 5);
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
      if(mobs?.length == 0) return;
      mobs.forEach(mob=>{
        mob.dimension.playSound("random.drink", mob.location, {volume: 10});
        lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
        mob.dimension.spawnParticle("minecraft:crop_growth_area_emitter", mob.location);
        if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
          applyDamage(mob, 15, {cause:mc.EntityDamageCause.magic});
        }else{
          /**@type {mc.EntityHealthComponent} */
          let health = mob.getComponent(mc.EntityHealthComponent.componentId);
          health.setCurrentValue(health.currentValue + 15);
        }
      })
    }
  },
  heal_splash_potion: {
    /**
     * 治癒のスプラッシュポーション
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let mobs;
      switch(cardBlock.typeId){
        case B:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"blue":"red"), "slotB"], excludeTags:["fly"]});
          if(mobs.length == 0){
            player.sendMessage("§c相手の場に対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のスプラッシュポーションを使用しました");
          break;
        case W:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"blue":"red"), "slotW"], excludeTags:["fly"]});
          if(mobs.length == 0){
            player.sendMessage("§c相手の場に対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のスプラッシュポーションを使用しました");
          break;
        case R:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"blue":"red"), "slotR"], excludeTags:["fly"]});
          if(mobs.length == 0){
            player.sendMessage("§c相手の場に対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のスプラッシュポーションを使用しました");
          break;
        case P:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue")]});
          if(mobs.length == 0){
            player.sendMessage("§c自分の場に対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "治癒のスプラッシュポーションを使用しました");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
      mobs.forEach(mob=>{
        mob.dimension.playSound("random.glass", mob.location, {volume: 10});
        lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
        mob.dimension.spawnParticle("minecraft:crop_growth_area_emitter", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
        if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
          applyDamage(mob, 15, {cause:mc.EntityDamageCause.magic});
        }else{
          /**@type {mc.EntityHealthComponent} */
          let health = mob.getComponent(mc.EntityHealthComponent.componentId);
          health.setCurrentValue(health.currentValue + 15);
        }
      })
    }
  },
  damage_potion: {
    /**
     * 負傷のポーション
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: async (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let mobs;
      let res;
      let select_form = new ui.MessageFormData();
      select_form.title("負傷のポーション")
        .body("対象のスロットを選択してください")
        .button1("§l§b自分§r§lのスロット")
        .button2("§l§c相手§r§lのスロット");
      switch(cardBlock.typeId){
        case B:
          res = await select_form.show(player);
          if(res.canceled) return;
          if(res.selection == 0){
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotB"]});
          }else{
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"blue":"red"), "slotB"], excludeTags:["fly"]});
          }
          if(mobs.length == 0){
            player.sendMessage("§c対象のスロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "負傷のポーションを使用しました");
          break;
        case W:
          res = await select_form.show(player);
          if(res.canceled) return;
          if(res.selection == 0){
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotW"]});
          }else{
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"blue":"red"), "slotW"], excludeTags:["fly"]});
          }
          if(mobs.length == 0){
            player.sendMessage("§c対象のスロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "負傷のポーションを使用しました");
          break;
        case R:
          res = await select_form.show(player);
          if(res.canceled) return;
          if(res.selection == 0){
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotR"]});
          }else{
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"blue":"red"), "slotR"], excludeTags:["fly"]});
          }
          if(mobs.length == 0){
            player.sendMessage("§c対象のスロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "負傷のポーションを使用しました");
          break;
        case P:
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly"]}).length > 0){
            player.sendMessage("§c相手の場に攻撃可能なモブが存在するため使用できません");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "負傷のポーションを使用しました");
          mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]}).forEach(p=>{
            p.dimension.playSound("random.drink", p.location, {volume: 10});
            p.dimension.spawnParticle("mcg:knockback_roar_particle", p.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            applyDamage(p, 3, {cause:mc.EntityDamageCause.magic});
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
      if(mobs.length == 0) return;
      mobs.forEach(mob=>{
        mob.dimension.playSound("random.drink", mob.location, {volume: 10});
        lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
        mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
        if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
          /**@type {mc.EntityHealthComponent} */
          let health = mob.getComponent(mc.EntityHealthComponent.componentId);
          health.setCurrentValue(health.currentValue + 20);
        }else{
          applyDamage(mob, 20, {cause:mc.EntityDamageCause.magic});
        }
      })
    }
  },
  damage_splash_potion: {
    /**
     * 負傷のスプラッシュポーション
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: async (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let mobs;
      let res;
      let select_form = new ui.MessageFormData();
      select_form.title("負傷のスプラッシュポーション")
        .body("対象のスロットを選択してください")
        .button1("§l§b自分§r§lのスロット")
        .button2("§l§c相手§r§lのスロット");
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          res = await select_form.show(player);
          if(res.canceled) return;
          if(res.selection == 0){
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue")]});
          }else{
            mobs = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly"]});
          }
          if(mobs.length == 0){
            player.sendMessage("§c対象のスロットに対象のモブが存在しないため使用できません。");
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "負傷のスプラッシュポーションを使用しました");
          mobs.forEach(mob=>{
            mob.dimension.playSound("random.glass", mob.location, {volume: 10});
            lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
              /**@type {mc.EntityHealthComponent} */
              let health = mob.getComponent(mc.EntityHealthComponent.componentId);
              health.setCurrentValue(health.currentValue + 20);
            }else{
              applyDamage(mob, 20, {cause:mc.EntityDamageCause.magic});
            }
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  speed_potion: {
    /**
     * 俊敏のポーション
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "俊敏のポーションを使用しました");
          player.dimension.playSound("random.drink", player.location, {volume: 10});
          addAct(player, 25);
          sendPlayerMessage(player, "act+25");
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  },
  fireresistance_potion: {
    /**
     * 耐火のポーション
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let mobs;
      switch(cardBlock.typeId){
        case B:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotB"], excludeTags:["fly"]});
          break;
        case W:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotW"], excludeTags:["fly"]});
          break;
        case R:
          mobs = mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "slotR"], excludeTags:["fly"]});
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
          return;
      }
      if(mobs.length == 0){
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "耐火のポーションを使用しました");
      mobs.forEach(mob=>{
        mob.dimension.playSound("random.drink", mob.location, {volume: 10});
        mob.addTag("guard");
        lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
        mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      })
    }
  },
  snowball: {
    /**
     * 雪玉
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "雪玉を使用しました");
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"red":"blue"), "slotB"]}).length == 0){
            let mobb = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:snow_golem", (player.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue));
            mobb.addTag((player.hasTag("red") ? "red" : "blue"));
            mobb.addTag("slotB");
            lineParticle(player.dimension, player.location, mobb.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mobb.dimension.spawnParticle("mcg:knockback_roar_particle", mobb.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            sendPlayerMessage(player, "スノーゴーレムを召喚しました");
            mobb.dimension.playSound("beacon.activate", mobb.location, {volume: 10});
            mobb.addTag("protect");
          }
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"red":"blue"), "slotW"]}).length == 0){
            let mobw = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:snow_golem", (player.hasTag("red") ? mcg.const.red.slot.white : mcg.const.blue.slot.white));
            mobw.addTag((player.hasTag("red") ? "red" : "blue"));
            mobw.addTag("slotW");
            lineParticle(player.dimension, player.location, mobw.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mobw.dimension.spawnParticle("mcg:knockback_roar_particle", mobw.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            sendPlayerMessage(player, "スノーゴーレムを召喚しました");
            mobw.dimension.playSound("beacon.activate", mobw.location, {volume: 10});
            mobw.addTag("protect");
          }
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"],tags:[(player.hasTag("red")?"red":"blue"), "slotR"]}).length == 0){
            let mobr = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:snow_golem", (player.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red));
            mobr.addTag((player.hasTag("red") ? "red" : "blue"));
            mobr.addTag("slotR");
            lineParticle(player.dimension, player.location, mobr.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mobr.dimension.spawnParticle("mcg:knockback_roar_particle", mobr.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            sendPlayerMessage(player, "スノーゴーレムを召喚しました");
            mobr.dimension.playSound("beacon.activate", mobr.location, {volume: 10});
            mobr.addTag("protect");
          }
          break;
        case O:
          player.sendMessage(error_slot);
          return;
      }
    }
  }
}

const enhance = {
  zombie: {
    /**
     * ゾンビ
     * @param {mc.Entity} mob
     * @param {mc.Player} player
     */
    run: (mob, player) => {
      mob.triggerEvent("enhance");
      mob.addTag("enhance");
      /**@type {mc.EntityHealthComponent} */
      let health = mob.getComponent(mc.EntityHealthComponent.componentId);
      health.resetToMaxValue();
      mob.dimension.playSound("block.enchanting_table.use", mob.location, {volume: 10});
      sendPlayerMessage(player, "ゾンビを強化しました");
      giveItem(player, new mc.ItemStack("minecraft:grass_block"), 3);
      player.sendMessage("[入手] 草ブロック x3");
    }
  },
  skeleton: {
    /**
     * スケルトン
     * @param {mc.Entity} mob
     * @param {mc.Player} player
     */
    run: (mob, player) => {
      /**@type {mc.EntityHealthComponent} */
      let health = mob.getComponent(mc.EntityHealthComponent.componentId);
      let hp = health.currentValue;
      mob.triggerEvent("enhance");
      mob.addTag("enhance");
      myTimeout(1,()=>{
        health.setCurrentValue(hp);
      })
      mob.dimension.playSound("block.enchanting_table.use", mob.location, {volume: 10});
      sendPlayerMessage(player, "スケルトンを強化しました");
      giveItem(player, new mc.ItemStack("minecraft:arrow"));
      player.sendMessage("[入手] 矢");
    }
  },
  creeper: {
    /**
     * クリーパー
     * @param {mc.Entity} mob
     * @param {mc.Player} player
     */
    run: (mob, player) => {
      sendPlayerMessage(player, "クリーパーを強化しました");
      sendPlayerMessage(player, "[クリーパー] ドカーン！");
      mob.dimension.spawnParticle("minecraft:huge_explosion_emitter", mob.location);
      mob.dimension.playSound("cauldron.explode", mob.location, {volume: 10});
      mob.dimension.getEntities({excludeTypes:["minecraft:player", "minecraft:item"], excludeTags:["fly", "guard"]}).forEach(e=>{
        applyDamage(e, 20);
      })
      setObject(player, "minecraft:air");
      setObject(mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]})[0], "minecraft:air");
      sendPlayerMessage(player, "全てのオブジェクトが破壊された！");
      mob.kill();
    }
  },
  witch: {
    /**
     * ウィッチ
     * @param {mc.Entity} mob
     * @param {mc.Player} player
     */
    run: (mob, player) => {
      switch(Math.floor(Math.random() * 4)){
        case 0:
          giveItem(player, new mc.ItemStack("mcg:heal_potion"));
          player.sendMessage("[入手] 治癒のポーション");
          break;
        case 1:
          giveItem(player, new mc.ItemStack("mcg:damage_potion"));
          player.sendMessage("[入手] 負傷のポーション");
          break;
        case 2:
          giveItem(player, new mc.ItemStack("mcg:speed_potion"));
          player.sendMessage("[入手] 俊敏のポーション");
          break;
        case 3:
          giveItem(player, new mc.ItemStack("mcg:fireresistance_potion"));
          player.sendMessage("[入手] 耐火のポーション");
          break;
      }
    }
  }
}