import * as mc from "@minecraft/server";
import { addAct, applyDamage, decrementContainer, decrementSlot, getAct, getCard, getObject, giveItem, giveSword, handItem, myTimeout, sendPlayerMessage, setAct, setObject, swordDamage, swordName } from "./lib";
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
  if(parseInt(info.Sact) > getAct(player) + 1){
    player.sendMessage(error_act);
    return;
  }
  if(parseInt(info.Cact) == 1 && getAct(player) == 0){
    player.sendMessage(error_act);
    player.sendMessage("§c必要actが1のカードはオーバーコストして使用できません");
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
            applyDamage(target,swordDamage[sword.slice(10)]);
            target.dimension.playSound("random.glass", target.location, {volume: 3});
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
            applyDamage(target,swordDamage[sword.slice(10)]);
            target.dimension.playSound("random.glass", target.location, {volume: 3});
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
            applyDamage(target,swordDamage[sword.slice(10)]);
            target.dimension.playSound("random.glass", target.location, {volume: 3});
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
            applyDamage(enemy, swordDamage[sword.slice(10)] / 5);
            enemy.dimension.playSound("random.glass", enemy.location, {volume: 3});
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
            target.dimension.playSound("random.fizz", target.location, {volume: 3});
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
            target.dimension.playSound("random.fizz", target.location, {volume: 3});
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
            target.dimension.playSound("random.fizz", target.location, {volume: 3});
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
          player.dimension.playSound("random.bow", player.location, {volume: 3});
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
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
          player.dimension.playSound("random.bow", player.location, {volume: 3});
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
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
          player.dimension.playSound("random.bow", player.location, {volume: 3});
          decrementContainer(player, "minecraft:packed_ice");
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
            applyDamage(target, 30);
          })
          break;
        case P:
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.bow", player.location, {volume: 3});
          decrementContainer(player, "minecraft:packed_ice");
          let enemies = mc.world.getDimension("minecraft:overworld").getPlayers({tags:[(player.hasTag("red")?"blue":"red")]});
          enemies.forEach(enemy=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              enemy.nameTag,
              "§r: [矢]"
            ])
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
        mob.dimension.playSound("mob.chicken.plop", mob.location, {volume: 3});
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
        mob.dimension.playSound("mob.chicken.plop", mob.location, {volume: 3});
        giveItem(player, new mc.ItemStack("minecraft:grass_block", 2));
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
          player.dimension.playSound("random.chestopen", player.location, {volume: 3});
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
          player.dimension.playSound("random.chestopen", player.location, {volume: 3});
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
          player.dimension.playSound("pumpkin.carve", player.location, {volume: 3});
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
        mob.dimension.playSound("beacon.activate", mob.location, {volume: 3});
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
          player.dimension.playSound("block.bell.hit", player.location, {volume: 3});
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"]}).forEach(entity=>{
            if(entity.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
              entity.kill();
            }
            else{
              entity.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
              entity.removeTag("protect");
            }
          })
          break;
        case O:
          player.sendMessage(error_slot);
          return;
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
        mob.dimension.playSound("beacon.activate", mob.location, {volume: 3});
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
        mob.dimension.playSound("random.explode", mob.location, {volume: 3});
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
          wolf[0].dimension.playSound("mob.wolf.bark", wolf[0].location, {volume: 3});
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
          wolf[0].dimension.playSound("mob.wolf.bark", wolf[0].location, {volume: 3});
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
          wolf[0].dimension.playSound("mob.wolf.bark", wolf[0].location, {volume: 3});
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
          player.dimension.playSound("random.eat", player.location, {volume: 3});
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
          mob.dimension.playSound("beacon.activate", mob.location, {volume: 3});
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
          mob.dimension.playSound("beacon.power", mob.location, {volume: 3});
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
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 3});
          giveItem(player, new mc.ItemStack("minecraft:grass_block", 2));
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
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 3});
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
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 3});
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
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 3});
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
          player.dimension.playSound("trial_spawner.open_shutter", player.location, {volume: 3});
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
          player.dimension.playSound("trial_spawner.open_shutter", player.location, {volume: 3});
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
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 3});
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
          mob.dimension.playSound("wind_charge.burst", mob.location, {volume: 3});
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
          player.dimension.playSound("random.enderchestopen", player.location, {volume: 3});
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly", "guard"]}).forEach(entity=>{
            applyDamage(entity, 10);
          })
          switch(Math.floor(Math.random() * 4)){
            case 0:
              giveItem(player, new mc.ItemStack("minecraft:enchanted_golden_apple"));
              player.sendMessage("[入手] エンチャントされた金のリンゴ");
              break;
            case 1:
              giveItem(player, new mc.ItemStack("minecraft:stray_spawn_egg",2));
              player.sendMessage("[入手] ストレイ x2");
              break;
            case 2:
              giveItem(player, new mc.ItemStack("minecraft:husk_spawn_egg",2));
              player.sendMessage("[入手] ハスク x2");
              break;
            case 3:
              giveItem(player, new mc.ItemStack("minecraft:phantom_spawn_egg",2));
              player.sendMessage("[入手] ファントム x2");
              break;
          }
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "エンダーチェストを設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("random.enderchestopen", player.location, {volume: 3});
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
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 3});
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
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 3});
          giveItem(player, new mc.ItemStack("minecraft:arrow", 2));
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
          mob.dimension.playSound("trial_spawner.spawn_mob", mob.location, {volume: 3});
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
          player.dimension.playSound("random.eat", player.location, {volume: 3});
          player.addEffect(mc.EffectTypes.get("minecraft:health_boost"), 20000000, {amplifier: 4, showParticles: false});
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
          player.dimension.playSound("step.web", player.location, {volume: 3});
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
          mob.dimension.playSound("mob.blaze.shoot", mob.location, {volume: 3});
          giveItem(player, new mc.ItemStack("minecraft:grass_block", 2));
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
          mob.dimension.playSound("mob.blaze.shoot", mob.location, {volume: 3});
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
          player.dimension.playSound("mob.ghast.scream", player.location, {volume: 3});
          entities.forEach(entity=>{
            entity.addTag("protect");
          })
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
          player.dimension.playSound("mob.ghast.scream", player.location, {volume: 3});
          entities.forEach(entity=>{
            entity.addTag("protect");
          })
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
          player.dimension.playSound("mob.ghast.scream", player.location, {volume: 3});
          entities.forEach(entity=>{
            entity.addTag("protect");
          })
          break;
        case P:
        case O:
          player.sendMessage(error_slot);
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
          player.dimension.playSound("mob.wither.shoot", player.location, {volume: 3});
          setAct(player, 40);
          setAct(enemy, 30);
          applyDamage(player, 8, {cause:mc.EntityDamageCause.wither});
          giveItem(player, new mc.ItemStack("minecraft:grass_block", 3));
          player.sendMessage("[入手] 草ブロック x3");
          enemyEntities.forEach(entity=>{
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
          mob.dimension.playSound("respawn_anchor.charge", mob.location, {volume: 3});
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
          player.dimension.playSound("bucket.fill_lava", player.location, {volume: 3});
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
          mob.dimension.playSound("respawn_anchor.charge", mob.location, {volume: 3});
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
            if(!strider.hasTag("protect")) strider.kill();
            strider.dimension.playSound("random.fizz", strider.location, {volume: 3});
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
            if(!strider.hasTag("protect")) strider.kill();
            strider.dimension.playSound("random.fizz", strider.location, {volume: 3});
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
            if(!strider.hasTag("protect")) strider.kill();
            strider.dimension.playSound("random.fizz", strider.location, {volume: 3});
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
          mob.dimension.playSound("block.beehive.exit", mob.location, {volume: 3});
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
          mob.dimension.playSound("block.beehive.exit", mob.location, {volume: 3});
          mob.addTag("fly");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          giveItem(player, new mc.ItemStack("minecraft:grass_block", 2));
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
          player.dimension.playSound("block.beehive.enter", player.location, {volume: 3});
          giveItem(player, new mc.ItemStack("minecraft:bee_spawn_egg", 2));
          player.sendMessage("[入手] ミツバチ x2");
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          sendPlayerMessage(player, "ミツバチの巣を設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          player.dimension.playSound("block.beehive.enter", player.location, {volume: 3});
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
          player.dimension.playSound("block.composter.ready", player.location, {volume: 3});
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
          player.dimension.playSound("block.composter.ready", player.location, {volume: 3});
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
          mob.dimension.playSound("dig.grass", mob.location, {volume: 3});
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
          mob.dimension.playSound("dig.grass", mob.location, {volume: 3});
          let object = getObject(player.hasTag("red")?"blue":"red");
          if(object.typeId != "minecraft:air"){
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
          mob.dimension.playSound("dig.grass", mob.location, {volume: 3});
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
          mob.dimension.playSound("random.explode", mob.location, {volume: 3});
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
          player.dimension.playSound("random.eat", player.location, {volume: 3});
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
          if(getObject(player.hasTag("red")?"red":"blue")?.typeId != "minecraft:bee_nest") {
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
          if(getObject(player.hasTag("red")?"red":"blue")?.typeId != "minecraft:bee_nest") {
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
          if(getObject(player.hasTag("red")?"red":"blue")?.typeId != "minecraft:bee_nest") {
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
          player.dimension.playSound("block.sweet_berry_bush.hurt", player.location, {volume: 3});
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly", "guard"]}).forEach(entity=>{
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
          mob.dimension.playSound("block.beehive.exit", mob.location, {volume: 3});
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
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "木のクワを使用しました");
          player.dimension.playSound("dig.gravel", player.location, {volume: 3});
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
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "石のクワを使用しました");
          player.dimension.playSound("dig.gravel", player.location, {volume: 3});
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
      switch(cardBlock.typeId){
        case B:
        case W:
        case R:
          player.sendMessage(error_slot);
          return;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "鉄のクワを使用しました");
          player.dimension.playSound("dig.gravel", player.location, {volume: 3});
          giveItem(player, new mc.ItemStack("minecraft:wheat", 2));
          player.sendMessage("[入手] 小麦 x2");
          giveItem(player, new mc.ItemStack("minecraft:grass_block", 3));
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
          player.dimension.playSound("random.eat", player.location, {volume: 3});
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
          player.dimension.playSound("random.eat", player.location, {volume: 3});
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
          mob.dimension.playSound("dig.grass", mob.location, {volume: 3});
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
          mob.dimension.playSound("dig.grass", mob.location, {volume: 3});
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
          player.dimension.playSound("random.drink", player.location, {volume: 3});
          mobs.forEach(mob=>{
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
          player.dimension.playSound("random.drink", player.location, {volume: 3});
          mobs.forEach(mob=>{
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
          player.dimension.playSound("random.drink", player.location, {volume: 3});
          mobs.forEach(mob=>{
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
          mob.dimension.playSound("ominous_item_spawner.spawn_item", mob.location, {volume: 3});
          if(getObject(player.hasTag("red")?"red":"blue").typeId != "minecraft:air"){
            giveItem(player, new mc.ItemStack("minecraft:arrow", 3));
            player.sendMessage("[入手] 矢 x3");
          }
        }
      )
    }
  }
}
