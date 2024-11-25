import * as mc from "@minecraft/server";
import { addAct, decrementSlot, getAct, getCard, giveItem, giveSword, handItem, myTimeout, swordDamage, swordName } from "./lib";
import { cardList } from "./cardinfo";
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
            target.applyDamage(swordDamage[sword.slice(10)], {cause:mc.EntityDamageCause.entityAttack, damagingEntity: player});
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
            target.applyDamage(swordDamage[sword.slice(10)], {cause:mc.EntityDamageCause.entityAttack, damagingEntity: player});
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
            target.applyDamage(swordDamage[sword.slice(10)], {cause:mc.EntityDamageCause.entityAttack, damagingEntity: player});
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
            enemy.applyDamage(swordDamage[sword.slice(10)] / 5, {cause:mc.EntityDamageCause.entityAttack});
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
      mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 木のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItem(player, new mc.ItemStack("minecraft:cobblestone"));
      giveItem(player, new mc.ItemStack("minecraft:coal"));
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
      mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 石のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItem(player, new mc.ItemStack("minecraft:iron_ingot"));
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
      mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 鉄のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItem(player, new mc.ItemStack("minecraft:diamond"));
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: ニンジン付きの棒を使用しました");
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: ニンジン付きの棒を使用しました");
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: ニンジン付きの棒を使用しました");
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
            target.applyDamage(30, {cause:mc.EntityDamageCause.projectile, damagingEntity: player});
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
            target.applyDamage(30, {cause:mc.EntityDamageCause.projectile, damagingEntity: player});
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
            target.applyDamage(30, {cause:mc.EntityDamageCause.projectile, damagingEntity: player});
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
            enemy.applyDamage(1, {cause:mc.EntityDamageCause.projectile, damagingEntity: player});
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
        giveItem(p, new mc.ItemStack("minecraft:porkchop"));
        mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: ブタを召喚しました");
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
        giveItem(player, new mc.ItemStack("minecraft:grass_block", 2));
        mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 村人を召喚しました");
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: チェストを使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          giveItem(player, new mc.ItemStack("minecraft:wooden_sword"));
          giveItem(player, new mc.ItemStack("minecraft:wooden_pickaxe"));
          giveItem(player, new mc.ItemStack("minecraft:carrot_on_a_stick"));
          break;
        case O:
          addAct(player, -parseInt(info.Cact));
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: チェストを設置しました");
          decrementSlot(player, player.selectedSlotIndex);
          mc.world.getDimension("minecraft:overworld").setBlockPermutation((player.hasTag("red")?mcg.const.red.slot.object:mcg.const.blue.slot.object), mc.BlockPermutation.resolve("minecraft:chest"));
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: くり抜かれたカボチャを使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          giveItem(player, new mc.ItemStack("minecraft:snow_golem_spawn_egg"));
          giveItem(player, new mc.ItemStack("minecraft:iron_golem_spawn_egg"));
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
        mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: オオカミを召喚しました");
        giveSword(player, getCard(mob.typeId).atk);
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: ベルを使用しました");
          decrementSlot(player, player.selectedSlotIndex);
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"]}).forEach(entity=>{
            if(entity.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
              entity.kill();
            }
            else{
              entity.getComponent(mc.EntityHealthComponent.typeId).resetToDefaultValue();
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
        mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: アレイを召喚しました");
        mob.addTag("fly");
        mob.teleport({...mob.location, y: mob.location.y + 2});
        giveSword(player, getCard(mob.typeId).atk);
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
        mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: パンダを召喚しました");
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 生の豚肉を使用しました");
          giveSword(player, getCard(wolf[0].typeId).atk);
          return;
        case W:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotW"], type:"minecarft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 生の豚肉を使用しました");
          giveSword(player, getCard(wolf[0].typeId).atk);
          return;
        case R:
          wolf = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue"), "slotR"], type:"minecarft:wolf"});
          if(wolf.length == 0){
            player.sendMessage(error_slot);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 生の豚肉を使用しました");
          giveSword(player, getCard(wolf[0].typeId).atk);
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: 焼き豚を使用しました");
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: スノーゴーレムを召喚しました");
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
          mc.world.sendMessage((player.hasTag("red")?"§c":"§b") + player.nameTag + "§r: アイアンゴーレムを召喚しました");
          if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"red":"blue")], type:"minecraft:villager_v2"}).length > 0){
            addAct(player, 40);
          }
        }
      )
    }
  }
}
