import * as mc from "@minecraft/server";
import { addAct, applyDamage, decrementSlot, getAct, getCard, giveItem, giveSword, handItem, myTimeout, sendPlayerMessage, setAct, setObject, swordDamage, swordName } from "./lib";
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
  let info = getCard(handItem(player).typeId);
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
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
            applyDamage(target, 30, {cause:mc.EntityDamageCause.projectile});
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
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
            applyDamage(target, 30, {cause:mc.EntityDamageCause.projectile});
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
          targets.forEach(target=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${target.typeId.slice(10)}.name`},
              "§r: [矢]"
            ])
            applyDamage(target, 30, {cause:mc.EntityDamageCause.projectile});
          })
          break;
        case P:
          decrementSlot(player, player.selectedSlotIndex);
          let enemies = mc.world.getDimension("minecraft:overworld").getPlayers({tags:[(player.hasTag("red")?"blue":"red")]});
          enemies.forEach(enemy=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              enemy.nameTag,
              "§r: [矢]"
            ])
            applyDamage(enemy, 1, {cause:mc.EntityDamageCause.projectile});
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
      summonCard(cardBlock, player, "minecraft:pig", (mob)=>{
        sendPlayerMessage(player, "ブタを召喚しました");
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
      summonCard(cardBlock, player, "minecraft:villager_v2", (mob)=>{
        sendPlayerMessage(player, "村人を召喚しました");
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
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"]}).forEach(entity=>{
            if(entity.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
              entity.kill();
            }
            else{
              entity.getComponent(mc.EntityHealthComponent.typeId).resetToDefaultValue();
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
        mob.teleport({...mob.location, y: mob.location.y + 2});
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
        mob.addTag("protect");
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
      let info = getCard(handItem(player).typeId);
      if(parseInt(info.Cact) > getAct(player) + 1){
        player.sendMessage(error_act);
        return;
      }
      let wolf;
      switch(cardBlock.typeId){
        case B:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotB"], type:"minecarft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "生の豚肉を使用しました");
          giveSword(player, getCard(wolf[0].typeId).atk, "オオカミ効果");
          return;
        case W:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotW"], type:"minecarft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "生の豚肉を使用しました");
          giveSword(player, getCard(wolf[0].typeId).atk, "オオカミ効果");
          return;
        case R:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotR"], type:"minecarft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "生の豚肉を使用しました");
          giveSword(player, getCard(wolf[0].typeId).atk, "オオカミ効果");
          return;
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
          /**
           * @type {mc.EntityHealthComponent}
           */
          let hp = player.getComponent(mc.EntityHealthComponent.componentId);
          hp.setCurrentValue((hp.currentValue + 6) > hp.effectiveMax ? hp.effectiveMax : hp.currentValue + 6);
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
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly", "guard"]}).forEach(entity=>{
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
      switch(cardBlock.typeId){
        case B:
          let entities = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotB"]});
          if(entities.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          addAct(player, -parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "泣く黒曜石を使用しました");
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
  }
}
