import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { addAct, applyDamage, axolotlEffect, changeHealthBoost, createColor, decrementContainer, decrementSlot, getAct, getCard, getDisplayName, getItemCount, getObject, giveItem, giveSword, handItem, healEntity, lineParticle, myTimeout, sendPlayerMessage, setAct, setObject, swordDamage, swordName } from "./lib";
import { mcg } from "./system";
import { 
  getPlayerTeam, getOpponentTeam, getSlotFromBlock, handleSlotAction,
  getMobsInSlot, getOpponentMobsInSlot, attackSlot, attackAllSlots,
  playCardEffect, sendDamageMessage, payCost, canPayCost, getOpponentPlayers,
  summonMobInSlot, isSlotOccupied, giveItemWithMessage, getPlayerObject,
  getAllOpponentMobs, killMobsInSlot, handleKillMobInSlots,
  getAllTeamMobs,
  getOpponentObject
} from "./card-helpers";
import { ERROR_MESSAGES } from "./constants";

// スロット定数（後方互換性のため残す）
const B = "minecraft:blue_concrete";
const W = "minecraft:white_concrete";
const R = "minecraft:red_concrete";
const P = "minecraft:pink_concrete";
const O = "minecraft:orange_concrete";

// エラーメッセージ（後方互換性のため残す）
const error_act = ERROR_MESSAGES.INSUFFICIENT_ACT;
const error_mob = ERROR_MESSAGES.SLOT_OCCUPIED;
const error_slot = ERROR_MESSAGES.INVALID_SLOT;

/**
 * モブ召喚カード用の共通処理
 * @param {mc.Block} cardBlock ボタンのブロック
 * @param {mc.Player} player 使用者
 * @param {string} identifier 召喚するモブのid 
 * @param {Function} onSummon 召喚後のコールバック (mob) => void
 */
function summonCard(cardBlock, player, identifier, onSummon) {
  const info = getCard(identifier);
  const slot = getSlotFromBlock(cardBlock.typeId);
  
  // 村人特殊処理：鐘があればact回復
  if (identifier === "minecraft:villager_v2") {
    if (getPlayerObject(player).typeId === "minecraft:bell") {
      addAct(player, parseInt(info.Sact));
    }
  }
  
  // P/Oスロットは不可
  if (!["B", "W", "R"].includes(slot)) {
    player.sendMessage(ERROR_MESSAGES.INVALID_SLOT);
    return;
  }
  
  // コストチェック
  const cost = parseInt(info.Sact);
  if (!canPayCost(player, cost)) {
    player.sendMessage(ERROR_MESSAGES.INSUFFICIENT_ACT);
    return;
  }
  if (cost === 1 && getAct(player) === 0) {
    player.sendMessage(ERROR_MESSAGES.INSUFFICIENT_ACT);
    player.sendMessage("§cこのカードはオーバーコストして使用できません");
    return;
  }
  
  // スロット占有チェック
  if (isSlotOccupied(player, slot)) {
    player.sendMessage(ERROR_MESSAGES.SLOT_OCCUPIED);
    return;
  }
  
  // コスト支払い
  payCost(player, cost);
  
  // モブ召喚
  const mob = summonMobInSlot(player, slot, identifier);
  onSummon(mob);
}

export const useCard = {
  wither_skeleton_skull: {
    /**
     * ウィザー
     * @param {mc.Block} cardBlock 
     * @param {mc.Player} player 
     */
    run: (cardBlock, player) => {
      const info = getCard(handItem(player).typeId);
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(ERROR_MESSAGES.INSUFFICIENT_ACT);
        return;
      }
      payCost(player, parseInt(info.Cact));
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
      const sword = handItem(player).typeId;
      if(!sword.includes("sword")) return;
      
      const swordKey = sword.slice(10);
      const damage = swordDamage[swordKey];
      const weaponName = swordName[swordKey];
      
      handleSlotAction(cardBlock.typeId, player,
        // B/W/Rスロット - モブ攻撃
        (slot) => {
          const targets = getOpponentMobsInSlot(player, slot, { excludeTags: ["fly"] });
          if(targets.length === 0){
            player.sendMessage(ERROR_MESSAGES.INVALID_SLOT);
            return;
          }
          decrementSlot(player, player.selectedSlotIndex);
          decrementContainer(player, "minecraft:packed_ice");
          attackSlot(player, slot, damage, weaponName);
          axolotlEffect(player, damage);
        },
        // Pスロット - プレイヤー直接攻撃
        () => {
          const enemyMobs = mc.world.getDimension("minecraft:overworld")
            .getEntities({excludeTypes:["minecraft:player"], tags:[getOpponentTeam(player)], excludeTags:["fly"]});
          if(enemyMobs.length > 0){
            player.sendMessage(ERROR_MESSAGES.DIRECT_ATTACK_BLOCKED);
            return;
          }
          
          decrementSlot(player, player.selectedSlotIndex);
          decrementContainer(player, "minecraft:packed_ice");
          
          const enemies = getOpponentPlayers(player);
          enemies.forEach(enemy=>{
            mc.world.sendMessage([
              (player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              enemy.nameTag,
              `§r[${weaponName}]`
            ]);
            playCardEffect(player, enemy.location);
            applyDamage(enemy, damage / 5);
            enemy.dimension.playSound("random.glass", enemy.location, {volume: 10});
            axolotlEffect(player, damage / 5);
          });
        }
      );
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
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      sendPlayerMessage(player, "木のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItemWithMessage(player, "minecraft:cobblestone", 1, "丸石");
      giveItemWithMessage(player, "minecraft:coal", 1, "石炭");
    }
  },
  stone_pickaxe: {
    /**
     * 石のツルハシ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      sendPlayerMessage(player, "石のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItemWithMessage(player, "minecraft:iron_ingot", 1, "鉄インゴット");
    }
  },
  iron_pickaxe: {
    /**
     * 鉄のツルハシ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      sendPlayerMessage(player, "鉄のツルハシを使用しました");
      decrementSlot(player, player.selectedSlotIndex);
      giveItemWithMessage(player, "minecraft:diamond", 1, "ダイヤモンド");
    }
  },
  carrot_on_a_stick: {
    /**
     * ニンジン付きの棒
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      handleKillMobInSlots(player, cardBlock.typeId, error_slot, (slot) => {
        sendPlayerMessage(player, "ニンジン付きの棒を使用しました");
        decrementSlot(player, player.selectedSlotIndex);
        killMobsInSlot(player, slot);
      });
    }
  },
  arrow: {
    /**
     * 矢
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      const info = getCard(handItem(player).typeId);
      const cost = parseInt(info.Cact);
      
      if (!canPayCost(player, cost)) {
        player.sendMessage(error_act);
        return;
      }
      
      handleSlotAction(cardBlock.typeId, player,
        // B/W/Rスロット - モブ攻撃
        (slot) => {
          const targets = getOpponentMobsInSlot(player, slot, { excludeTags: ["guard", "water"] });
          if (targets.length === 0) {
            player.sendMessage(error_slot);
            return;
          }
          
          payCost(player, cost);
          player.dimension.playSound("random.bow", player.location, { volume: 10 });
          decrementContainer(player, "minecraft:packed_ice");
          
          targets.forEach(target => {
            sendDamageMessage(player, target, "矢");
            playCardEffect(player, target.location);
            applyDamage(target, 30);
          });
          axolotlEffect(player, 30);
        },
        // Pスロット - プレイヤー直接攻撃
        () => {
          payCost(player, cost);
          player.dimension.playSound("random.bow", player.location, { volume: 10 });
          decrementContainer(player, "minecraft:packed_ice");
          
          const enemies = getOpponentPlayers(player);
          enemies.forEach(enemy => {
            mc.world.sendMessage([
              (player.hasTag("red") ? "§c" : "§b") + player.nameTag + "§r=>" + (player.hasTag("red") ? "§b" : "§c"),
              enemy.nameTag,
              "§r: [矢]"
            ]);
            playCardEffect(player, enemy.location);
            applyDamage(enemy, 1);
          });
        }
      );
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      player.dimension.playSound("random.chestopen", player.location, {volume: 10});
      
      if (cardBlock.typeId === P) {
        sendPlayerMessage(player, "チェストを使用しました");
        if (getObject(player.hasTag("red") ? "blue" : "red").typeId === "minecraft:trapped_chest") {
          if (Math.floor(Math.random() * 2) === 0) {
            player.dimension.playSound("mob.zombie.woodbreak", player.location, {volume: 10});
            sendPlayerMessage(player, "トラップチェストだ！！");
            applyDamage(player, 4);
            setObject(mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]})[0], "minecraft:air");
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
      } else {
        setObject(player, "minecraft:chest");
        sendPlayerMessage(player, "チェストを設置しました");
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "くり抜かれたカボチャを使用しました");
      player.dimension.playSound("pumpkin.carve", player.location, {volume: 10});
      giveItem(player, new mc.ItemStack("minecraft:snow_golem_spawn_egg"));
      player.sendMessage("[入手] スノーゴーレム");
      giveItem(player, new mc.ItemStack("minecraft:iron_golem_spawn_egg"));
      player.sendMessage("[入手] アイアンゴーレム");
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      player.dimension.playSound("block.bell.hit", player.location, {volume: 10});
      
      if (cardBlock.typeId === P) {
        sendPlayerMessage(player, "鐘を使用しました");
        let attacked = false;
        mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player", "minecraft:item"]}).forEach(entity => {
          let info = getCard(entity.typeId);
          entity.dimension.spawnParticle("mcg:knockback_roar_particle", entity.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          if (entity.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead") || (info.attribute.includes("残虐") && !entity.hasTag("ace"))) {
            applyDamage(entity, 999, {cause: mc.EntityDamageCause.magic});
            attacked = true;
          } else {
            if (!entity.hasTag("ace")) entity.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
            entity.removeTag("protect");
          }
        });
        if (attacked) {
          axolotlEffect(player, 999);
        }
      } else {
        setObject(player, "minecraft:bell");
        sendPlayerMessage(player, "鐘を設置しました");
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
      handleSlotAction(cardBlock.typeId, player,
        (slot) => {
          const wolf = getMobsInSlot(player, slot, { type: "minecraft:wolf" });
          if (wolf.length === 0) {
            player.sendMessage(error_slot);
            return;
          }
          
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "生の豚肉を使用しました");
          wolf[0].dimension.playSound("mob.wolf.bark", wolf[0].location, { volume: 10 });
          giveSword(player, getCard(wolf[0].typeId).atk, "オオカミ効果");
        }
      );
    }
  },
  cooked_porkchop: {
    /**
     * 焼き豚
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "焼き豚を使用しました");
      player.dimension.playSound("random.eat", player.location, {volume: 10});
      player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
      healEntity(player, 6);
      sendPlayerMessage(player, "HP+6");
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      player.dimension.playSound("trial_spawner.open_shutter", player.location, {volume: 10});
      
      if (cardBlock.typeId === P) {
        sendPlayerMessage(player, "モンスタースポナーを使用しました");
        giveItem(player, new mc.ItemStack("minecraft:husk_spawn_egg"));
        player.sendMessage("[入手] ハスク");
        giveItem(player, new mc.ItemStack("minecraft:stray_spawn_egg"));
        player.sendMessage("[入手] ストレイ");
        giveItem(player, new mc.ItemStack("minecraft:cave_spider_spawn_egg"));
        player.sendMessage("[入手] 洞窟グモ");
      } else {
        setObject(player, "minecraft:mob_spawner");
        sendPlayerMessage(player, "モンスタースポナーを設置しました");
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      player.dimension.playSound("random.enderchestopen", player.location, {volume: 10});
      
      if (cardBlock.typeId === P) {
        sendPlayerMessage(player, "エンダーチェストを使用しました");
        getAllOpponentMobs(player, { excludeTags: ["fly", "guard"] }).forEach(entity => {
          lineParticle(player.dimension, player.location, entity.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entity.dimension.spawnParticle("mcg:knockback_roar_particle", entity.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          applyDamage(entity, 10);
        });
        switch (Math.floor(Math.random() * 4)) {
          case 0:
            giveItem(player, new mc.ItemStack("minecraft:enchanted_golden_apple"));
            player.sendMessage("[入手] エンチャントされた金のリンゴ");
            break;
          case 1:
            giveItem(player, new mc.ItemStack("minecraft:stray_spawn_egg"), 2);
            player.sendMessage("[入手] ストレイ x2");
            break;
          case 2:
            giveItem(player, new mc.ItemStack("minecraft:husk_spawn_egg"), 2);
            player.sendMessage("[入手] ハスク x2");
            break;
          case 3:
            giveItem(player, new mc.ItemStack("minecraft:phantom_spawn_egg"), 2);
            player.sendMessage("[入手] ファントム x2");
            break;
        }
      } else {
        setObject(player, "minecraft:ender_chest");
        sendPlayerMessage(player, "エンダーチェストを設置しました");
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "エンチャントされた金のリンゴを使用しました");
      player.dimension.playSound("random.eat", player.location, {volume: 10});
      changeHealthBoost(player, 5, true);
      myTimeout(1, () => {
      player.getComponent(mc.EntityHealthComponent.componentId).resetToMaxValue();
      })
    }
  },
  web: {
    /**
     * クモの巣
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "クモの巣を使用しました");
      sendPlayerMessage(player, "相手にクモの巣が絡まる！");
      player.dimension.playSound("step.web", player.location, {volume: 10});
      mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]}).forEach(enemy=>{
        addAct(enemy, -15)
      })
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId === O) {
        payCost(player, parseInt(info.Cact));
        setObject(player, "minecraft:crying_obsidian");
        sendPlayerMessage(player, "泣く黒曜石を設置しました");
        return;
      }
      
      handleSlotAction(cardBlock.typeId, player,
        (slot) => {
          const entities = getMobsInSlot(player, slot);
          if (entities.length === 0) {
            player.sendMessage(error_slot);
            return;
          }
          
          payCost(player, parseInt(info.Cact));
          sendPlayerMessage(player, "泣く黒曜石を使用しました");
          player.dimension.playSound("mob.ghast.scream", player.location, {volume: 10});
          lineParticle(player.dimension, player.location, entities[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].dimension.spawnParticle("mcg:knockback_roar_particle", entities[0].location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          entities[0].addTag("call_pigman");
        }
      );
    }
  },
  wither_rose: {
    /**
     * ウィザーローズ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      
      const enemyEntities = mc.world.getDimension("minecraft:overworld").getEntities({
        excludeTypes: ["minecraft:player"], 
        tags: [getOpponentTeam(player)]
      });
      if (enemyEntities.length < 3) {
        player.sendMessage("§c相手のスロットが埋まっていないため使用できません");
        return;
      }
      
      const myMobs = mc.world.getDimension("minecraft:overworld").getEntities({
        excludeTypes: ["minecraft:player"], 
        tags: [getPlayerTeam(player)]
      });
      if (myMobs.length > 0) {
        player.sendMessage("§c自分のスロットにモブが存在しているため使用できません");
        return;
      }
      
      const enemy = getOpponentPlayers(player)[0];
      if (getAct(enemy) < 30) {
        player.sendMessage("§c相手のactが30未満のため使用できません");
        return;
      }
      if (getAct(player) > 10) {
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
      enemyEntities.forEach(entity => {
        entity.dimension.spawnParticle("mcg:knockback_roar_particle", entity.location, createColor({red:0, green:0, blue:0}));
        applyDamage(entity, 20);
      });
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "溶岩入りバケツを使用しました");
      player.dimension.playSound("bucket.fill_lava", player.location, {volume: 10});
      getOpponentPlayers(player).forEach(enemy => {
        applyDamage(enemy, 6, {cause:mc.EntityDamageCause.lava});
      });
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
          giveSword(player, getCard(mob.typeId).atk, "速攻効果");
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
      const myStriders = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:strider", tags:[getPlayerTeam(player)]});
      if (myStriders.length === 0) {
        player.sendMessage("§c自分のスロットにストライダーが存在しないため使用できません");
        return;
      }
      
      handleSlotAction(cardBlock.typeId, player,
        (slot) => {
          const target = getOpponentMobsInSlot(player, slot);
          if (target.length === 0) {
            player.sendMessage(error_slot);
            return;
          }
          
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "鞍を使用しました");
          
          myStriders.forEach(strider => {
            lineParticle(strider.dimension, strider.location, target[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            if (!strider.hasTag("protect")) strider.kill();
            strider.dimension.playSound("random.fizz", strider.location, {volume: 10});
          });
          
          target.forEach(entity => {
            if (!entity.hasTag("protect")) entity.kill();
          });
        }
      );
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      player.dimension.playSound("block.beehive.enter", player.location, {volume: 10});
      
      if (cardBlock.typeId === P) {
        sendPlayerMessage(player, "ミツバチの巣を使用しました");
        giveItem(player, new mc.ItemStack("minecraft:bee_spawn_egg"), 2);
        player.sendMessage("[入手] ミツバチ x2");
      } else {
        setObject(player, "minecraft:bee_nest");
        sendPlayerMessage(player, "ミツバチの巣を設置しました");
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      player.dimension.playSound("block.composter.ready", player.location, {volume: 10});
      
      if (cardBlock.typeId === P) {
        sendPlayerMessage(player, "コンポスターを使用しました");
        giveItem(player, new mc.ItemStack("minecraft:wooden_pickaxe"));
        player.sendMessage("[入手] 木のツルハシ");
        giveItem(player, new mc.ItemStack("minecraft:wooden_hoe"));
        player.sendMessage("[入手] 木のクワ");
        giveItem(player, new mc.ItemStack("minecraft:carrot_on_a_stick"));
        player.sendMessage("[入手] ニンジン付きの棒");
      } else {
        setObject(player, "minecraft:composter");
        sendPlayerMessage(player, "コンポスターを設置しました");
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
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "卵を使用しました");
      player.dimension.playSound("random.eat", player.location, {volume: 10});
      player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
      healEntity(player, 1);
      sendPlayerMessage(player, "HP+1");
    }
  },
  poppy: {
    /**
     * ポピー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      if (getObject(player.hasTag("red")?"red":"blue")?.typeId !== "minecraft:bee_nest" ||
          mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:bee", tags:[(player.hasTag("red")?"red":"blue")]}).length === 0) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "ポピーを使用しました");
      giveItemWithMessage(player, "minecraft:honey_bottle", 1, "ハチミツ入りの瓶");
    }
  },
  dandelion: {
    /**
     * タンポポ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      if (getObject(player.hasTag("red")?"red":"blue")?.typeId !== "minecraft:bee_nest" ||
          mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:bee", tags:[(player.hasTag("red")?"red":"blue")]}).length === 0) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "タンポポを使用しました");
      giveItemWithMessage(player, "minecraft:honey_bottle", 1, "ハチミツ入りの瓶");
    }
  },
  pink_tulip: {
    /**
     * 桃色のチューリップ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      if (getObject(player.hasTag("red")?"red":"blue")?.typeId !== "minecraft:bee_nest" ||
          mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:bee", tags:[(player.hasTag("red")?"red":"blue")]}).length === 0) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "桃色のチューリップを使用しました");
      giveItemWithMessage(player, "minecraft:honey_bottle", 1, "ハチミツ入りの瓶");
    }
  },
  cactus: {
    /**
     * サボテン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "サボテンを使用しました");
      sendPlayerMessage(player, "サボテンのトゲを撒き散らした！");
      player.dimension.playSound("block.sweet_berry_bush.hurt", player.location, {volume: 10});
      getAllOpponentMobs(player, { excludeTags: ["fly", "guard"] }).forEach(entity => {
        lineParticle(player.dimension, player.location, entity.location, "minecraft:critical_hit_emitter", 1);
        applyDamage(entity, 5);
      });
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "木のクワを使用しました");
      player.dimension.playSound("dig.gravel", player.location, {volume: 10});
      giveItem(player, new mc.ItemStack("minecraft:wheat"));
      player.sendMessage("[入手] 小麦");
    }
  },
  stone_hoe: {
    /**
     * 石のクワ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "石のクワを使用しました");
      player.dimension.playSound("dig.gravel", player.location, {volume: 10});
      giveItem(player, new mc.ItemStack("minecraft:wheat"));
      player.sendMessage("[入手] 小麦");
      giveItem(player, new mc.ItemStack("minecraft:grass_block"));
      player.sendMessage("[入手] 草ブロック");
      const flowers = ["minecraft:poppy", "minecraft:dandelion", "minecraft:pink_tulip", "minecraft:cactus"];
      const flowerNames = ["ポピー", "タンポポ", "桃色のチューリップ", "サボテン"];
      const randomIndex = Math.floor(Math.random() * 4);
      giveItem(player, new mc.ItemStack(flowers[randomIndex]));
      player.sendMessage(`[入手] ${flowerNames[randomIndex]}`);
    }
  },
  iron_hoe: {
    /**
     * 鉄のクワ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "鉄のクワを使用しました");
      player.dimension.playSound("dig.gravel", player.location, {volume: 10});
      giveItem(player, new mc.ItemStack("minecraft:wheat"), 2);
      player.sendMessage("[入手] 小麦 x2");
      giveItem(player, new mc.ItemStack("minecraft:grass_block"), 3);
      player.sendMessage("[入手] 草ブロック x3");
      const flowers = ["minecraft:poppy", "minecraft:dandelion", "minecraft:pink_tulip", "minecraft:cactus"];
      const flowerNames = ["ポピー", "タンポポ", "桃色のチューリップ", "サボテン"];
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * 4);
        giveItem(player, new mc.ItemStack(flowers[randomIndex]));
        player.sendMessage(`[入手] ${flowerNames[randomIndex]}`);
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
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "小麦を使用しました");
      giveItem(player, new mc.ItemStack("minecraft:cow_spawn_egg"));
      player.sendMessage("[入手] ウシ");
      giveItem(player, new mc.ItemStack("minecraft:sheep_spawn_egg"));
      player.sendMessage("[入手] ヒツジ");
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
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      payCost(player, parseInt(info.Cact));
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
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "パンを使用しました");
      player.dimension.playSound("random.eat", player.location, {volume: 10});
      player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
      healEntity(player, 3);
      sendPlayerMessage(player, "HP+3");
    }
  },
  cake: {
    /**
     * ケーキ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "ケーキを使用しました");
      player.dimension.playSound("random.eat", player.location, {volume: 10});
      player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
      healEntity(player, 9);
      sendPlayerMessage(player, "HP+9");
      mc.world.sendMessage("おめでとう！プレゼントもあるよ！");
      giveItem(player, new mc.ItemStack("minecraft:chest"));
      player.sendMessage("[入手] チェスト");
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
      handleSlotAction(cardBlock.typeId, player,
        (slot) => {
          const mobs = getMobsInSlot(player, slot, { excludeTags: ["fly", "guard"] });
          if (mobs.length === 0) {
            player.sendMessage(error_slot);
            return;
          }
          
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "ミルクバケツを使用しました");
          player.dimension.playSound("random.drink", player.location, { volume: 10 });
          
          mobs.forEach(mob => {
            playCardEffect(player, mob.location);
            mob.addTag("guard");
          });
        }
      );
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
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      // ゴーレム存在チェック
      const hasSnowGolem = mc.world.getDimension("minecraft:overworld").getEntities({
        type: "minecraft:snow_golem", 
        tags: [getPlayerTeam(player)]
      }).length > 0;
      const hasIronGolem = mc.world.getDimension("minecraft:overworld").getEntities({
        type: "minecraft:iron_golem", 
        tags: [getPlayerTeam(player)]
      }).length > 0;
      
      if (!hasSnowGolem && !hasIronGolem) {
        player.sendMessage("§c自分のスロットにゴーレムが存在しないため使用できません。");
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      
      // オブジェクトの入れ替え
      const enemyTeam = getOpponentTeam(player);
      const enemyObjectBlock = mc.world.getDimension("minecraft:overworld").getBlock(
        player.hasTag("red") ? mcg.const.blue.slot.object : mcg.const.red.slot.object
      );
      const enemyPlayer = mc.world.getPlayers({tags: [enemyTeam]})[0];
      
      setObject(player, enemyObjectBlock?.typeId);
      setObject(enemyPlayer, "minecraft:lit_pumpkin");
      sendPlayerMessage(player, "ジャック・オ・ランタンを設置しました");
      sendPlayerMessage(player, "オブジェクトが入れ替わった！");
    }
  },
  pillager_spawn_egg: {
    /**
     * ピリジャー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== R) {
        player.sendMessage(error_slot);
        return;
      }
      
      const villager = mc.world.getDimension("minecraft:overworld").getEntities({
        type: "minecraft:villager_v2", 
        tags: [getPlayerTeam(player), "slotR"]
      });
      if (villager.length === 0) {
        player.sendMessage("§c赤スロットに村人が存在しないため使用できません。");
        return;
      }
      
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Sact))) {
        player.sendMessage(error_act);
        return;
      }
      
      payCost(player, parseInt(info.Sact));
      
      const mob = mc.world.getDimension("minecraft:overworld").spawnEntity(
        "minecraft:pillager", 
        player.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red
      );
      mob.addTag(getPlayerTeam(player));
      mob.addTag("slotR");
      mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
      
      villager.forEach(v => v.kill());
      
      sendPlayerMessage(player, "ピリジャーを召喚しました");
      mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
      applyDamage(player, 3);
      giveItem(player, new mc.ItemStack("minecraft:grass_block"), 1);
      player.sendMessage("[入手] 草ブロック");
      giveItem(player, new mc.ItemStack("minecraft:arrow"), 1);
      player.sendMessage("[入手] 矢");
      lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
    }
  },
  trapped_chest: {
    /**
     * トラップチェスト
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      
      if (cardBlock.typeId === P) {
        // 残虐属性チェック
        const hasGenocideMob = mc.world.getDimension("minecraft:overworld")
          .getEntities({excludeTypes: ["minecraft:player"], tags: [getPlayerTeam(player)]})
          .some(entity => getCard(entity.typeId)?.attribute?.includes("残虐"));
        
        if (!hasGenocideMob) {
          player.sendMessage("§c自分のスロットに残虐属性のモブが存在しないため使用できません。");
          return;
        }
        
        payCost(player, parseInt(info.Cact));
        player.dimension.playSound("random.chestopen", player.location, {volume: 10});
        
        sendPlayerMessage(player, "トラップチェストを使用しました");
        giveItem(player, new mc.ItemStack("minecraft:ominous_bottle"));
        player.sendMessage("[入手] 不吉な瓶");
        giveItem(player, new mc.ItemStack("mcg:totem"));
        player.sendMessage("[入手] 不死のトーテム");
        giveItem(player, new mc.ItemStack("minecraft:carrot_on_a_stick"));
        player.sendMessage("[入手] ニンジン付きの棒");
      } else {
        payCost(player, parseInt(info.Cact));
        player.dimension.playSound("random.chestopen", player.location, {volume: 10});

        setObject(player, "minecraft:trapped_chest");
        sendPlayerMessage(player, "トラップチェストを設置しました");
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
      if (cardBlock.typeId !== B) {
        player.sendMessage(error_slot);
        return;
      }
      
      const villager = mc.world.getDimension("minecraft:overworld").getEntities({
        type: "minecraft:villager_v2", 
        tags: [getPlayerTeam(player), "slotB"]
      });
      if (villager.length === 0) {
        player.sendMessage("§c青スロットに村人が存在しないため使用できません。");
        return;
      }
      
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Sact))) {
        player.sendMessage(error_act);
        return;
      }

      payCost(player, parseInt(info.Sact));

      const mob = mc.world.getDimension("minecraft:overworld").spawnEntity(
        "minecraft:vindicator", 
        player.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue
      );
      mob.addTag(getPlayerTeam(player));
      mob.addTag("slotB");
      mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
      
      villager.forEach(v => v.kill());
      
      sendPlayerMessage(player, "ヴィンディケーターを召喚しました");
      mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
      applyDamage(player, 4);
      lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
    }
  },
  goat_horn: {
    /**
     * ヤギの角笛
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if (cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      payCost(player, parseInt(info.Cact));
      player.dimension.playSound(`horn.call.${Math.floor(Math.random() * 8)}`, player.location, {volume: 0.5});
      applyDamage(player, 10);
      addAct(player, 10);
      sendPlayerMessage(player, "ヤギの角笛を使用しました");
      sendPlayerMessage(player, "act+10");
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
      if (cardBlock.typeId !== W) {
        player.sendMessage(error_slot);
        return;
      }
      
      const villager = mc.world.getDimension("minecraft:overworld").getEntities({
        type: "minecraft:villager_v2", 
        tags: [getPlayerTeam(player), "slotW"]
      });
      if (villager.length === 0) {
        player.sendMessage("§c白スロットに村人が存在しないため使用できません。");
        return;
      }
      
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Sact))) {
        player.sendMessage(error_act);
        return;
      }
      
      payCost(player, parseInt(info.Sact));
      
      const mob = mc.world.getDimension("minecraft:overworld").spawnEntity(
        "minecraft:evocation_illager", 
        player.hasTag("red") ? mcg.const.red.slot.white : mcg.const.blue.slot.white
      );
      mob.addTag(getPlayerTeam(player));
      mob.addTag("slotW");
      mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
      
      villager.forEach(v => v.kill());
      
      sendPlayerMessage(player, "エヴォーカーを召喚しました");
      mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
      applyDamage(player, 3);
      giveItem(player, new mc.ItemStack("mcg:totem"));
      player.sendMessage("[入手] 不死のトーテム");
      lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
      
      // ヴェックス召喚
      const teamTag = getPlayerTeam(player);
      const blueSlotPos = player.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue;
      const redSlotPos = player.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red;
      
      if (mc.world.getDimension("minecraft:overworld").getEntities({
        excludeTypes: ["minecraft:player"], 
        tags: [teamTag, "slotB"]
      }).length === 0) {
        const mobb = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:vex", blueSlotPos);
        mobb.addTag(teamTag);
        mobb.addTag("slotB");
        mobb.addTag("fly");
        mobb.teleport({...mobb.location, y: mobb.location.y + 1}, {facingLocation: {x:0, y:0, z:0}});
        sendPlayerMessage(player, "ヴェックスを召喚しました");
        mobb.dimension.playSound("apply_effect.raid_omen", mobb.location, {volume: 10});
      }
      
      if (mc.world.getDimension("minecraft:overworld").getEntities({
        excludeTypes: ["minecraft:player"], 
        tags: [teamTag, "slotR"]
      }).length === 0) {
        const mobr = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:vex", redSlotPos);
        mobr.addTag(teamTag);
        mobr.addTag("slotR");
        mobr.addTag("fly");
        mobr.teleport({...mobr.location, y: mobr.location.y + 1}, {facingLocation: {x:0, y:0, z:0}});
        sendPlayerMessage(player, "ヴェックスを召喚しました");
        mobr.dimension.playSound("apply_effect.raid_omen", mobr.location, {volume: 10});
      }

      // 相手の青・赤スロットに攻撃
      const opponentTeam = getOpponentTeam(player);
      ["slotB", "slotR"].forEach(slot => {
        mc.world.getDimension("minecraft:overworld")
          .getEntities({ excludeTypes: ["minecraft:player"], tags: [opponentTeam, slot], excludeTags: ["guard", "fly"] })
          .forEach(target => {
            playCardEffect(mob, target.location);
            target.dimension.playSound("mob.evocation_fangs.attack", target.location, { volume: 10 });
            applyDamage(target, 15);
          });
      });
    }
  },
  armor_stand: {
    /**
     * 防具立て
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      const info = getCard(handItem(player).typeId);
      if (!canPayCost(player, parseInt(info.Cact))) {
        player.sendMessage(error_act);
        return;
      }
      
      if (cardBlock.typeId !== B && cardBlock.typeId !== W && cardBlock.typeId !== R) {
        player.sendMessage(error_slot);
        return;
      }
      
      const enemyTeam = getOpponentTeam(player);
      const slot = getSlotFromBlock(cardBlock.typeId);
      const slotTag = slot === "B" ? "slotB" : slot === "W" ? "slotW" : "slotR";
      
      // 相手スロットの占有チェック
      if (mc.world.getDimension("minecraft:overworld").getEntities({
        excludeTypes: ["minecraft:player"],
        tags: [enemyTeam, slotTag]
      }).length > 0) {
        player.sendMessage(error_mob);
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      
      // 相手スロットの座標を取得
      const slotPos = player.hasTag("red") ? 
        (slot === "B" ? mcg.const.blue.slot.blue : slot === "W" ? mcg.const.blue.slot.white : mcg.const.blue.slot.red) :
        (slot === "B" ? mcg.const.red.slot.blue : slot === "W" ? mcg.const.red.slot.white : mcg.const.red.slot.red);
      
      const mob = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:armor_stand", slotPos);
      mob.addTag(enemyTeam);
      mob.addTag(slotTag);
      mob.addTag("fly");
      mob.addTag("guard");
      mob.teleport(mob.location, {facingLocation: {x:0, y:0, z:0}});
      
      applyDamage(player, 3);
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
      if (cardBlock.typeId !== W) {
        player.sendMessage(error_slot);
        return;
      }
      
      const geno = mc.world.getDimension("minecraft:overworld").getEntities({
        excludeTypes: ["minecraft:player"], 
        tags: [getPlayerTeam(player)]
      }).filter(e => getCard(e.typeId)?.attribute?.includes("残虐"));
      
      if (geno.length === 0) {
        player.sendMessage("§c自分の場に残虐属性のモブが存在しないため使用できません。");
        return;
      }
      
      summonCard(cardBlock, player, "minecraft:ravager",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "ラヴェジャーを召喚しました");
          mob.dimension.playSound("apply_effect.raid_omen", mob.location, {volume: 10});
          applyDamage(player, 4);
          mc.world.getPlayers().forEach(p=>{
            p.onScreenDisplay.setTitle([(player.hasTag("red")?"§c":"§b"), "ラヴェジャー"], {fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 20});
            p.onScreenDisplay.updateSubtitle("§3破壊に飢えた獣");
          })
        }
      );
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
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      if(mc.world.getDimension("minecraft:overworld").getEntities({tags:[(player.hasTag("red")?"red":"blue"), "ace"]}).length > 0){
        player.sendMessage("§c既に大将が存在するため使用できません。");
        return;
      }
      
      // スロットタイプのマッピング
      const slotMap = {
        [B]: "slotB",
        [W]: "slotW",
        [R]: "slotR"
      };
      
      const slotTag = slotMap[cardBlock.typeId];
      
      // P, Oスロットは使用不可
      if(!slotTag){
        player.sendMessage(error_slot);
        return;
      }
      
      // 対象のmobを取得
      const playerTeam = player.hasTag("red") ? "red" : "blue";
      const mobs = mc.world.getDimension("minecraft:overworld")
        .getEntities({excludeTypes:["minecraft:player"], tags:[playerTeam, slotTag]})
        .filter(e => ["pillager", "vindicator", "evocation_illager"].includes(e.typeId.slice(10)));
      
      if(mobs.length == 0){
        player.sendMessage(error_slot);
        return;
      }
      
      // コストの支払いと効果の適用
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "不吉な旗を使用しました");
      
      const teamColor = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
      
      mobs.forEach(mob => {
        lineParticle(mob.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(teamColor));
        mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(teamColor));
        mob.addTag("ace");
        mob.addTag("protect");
        mob.triggerEvent("ace");
        // let healthComponent = mob.getComponent(mc.EntityHealthComponent.componentId);
        // healthComponent.resetToMaxValue();
        switch(mob.typeId.slice(10)) {
          case "pillager":
            mob.dimension.playSound("mob.pillager.celebrate", mob.location, {volume: 10});
            break;
          case "vindicator":
            mob.dimension.playSound("mob.vindicator.celebrate", mob.location, {volume: 10});
            break;
          case "evocation_illager":
            mob.dimension.playSound("mob.evocation_illager.celebrate", mob.location, {volume: 10});
            break;
        }
        myTimeout(1, () => {
          let healthComponent = mob.getComponent(mc.EntityHealthComponent.componentId);
          healthComponent.resetToMaxValue();
        })
      });
      
      // player.addTag("raid");
      // player.dimension.playSound("raid.horn", player.location, {volume: 10});
      // mc.world.getPlayers().forEach(p => {
      //   p.onScreenDisplay.setTitle("§c§l襲撃モード");
      // });
      // changeHealthBoost(player, 2);
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
      if(!canPayCost(player, parseInt(info.Cact))){
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
          payCost(player, parseInt(info.Cact));
          sendPlayerMessage(player, "鉄の斧を使用しました");
          player.dimension.playSound("mace.smash_ground", player.location, {volume: 10});
          lineParticle(player.dimension, player.location, player.hasTag("red")?mcg.const.blue.slot.white:mcg.const.red.slot.white, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
          player.dimension.spawnParticle("minecraft:smash_ground_particle", player.hasTag("red")?mcg.const.blue.slot.white:mcg.const.red.slot.white);
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotB"], excludeTags:["fly", "guard"]}).forEach(mob=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${mob.typeId.slice(10)}.name`},
              `§r[鉄の斧]`
            ])
            applyDamage(mob, 10);
            mob.dimension.playSound("random.glass", mob.location, {volume: 10});
          });
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotW"], excludeTags:["fly", "guard"]}).forEach(mob=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${mob.typeId.slice(10)}.name`},
              `§r[鉄の斧]`
            ])
            applyDamage(mob, 25);
            mob.dimension.playSound("random.glass", mob.location, {volume: 10});
            axolotlEffect(player, 25);
          });
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red"), "slotR"], excludeTags:["fly", "guard"]}).forEach(mob=>{
            mc.world.sendMessage([(player.hasTag("red")?"§c":"§b") + player.nameTag + "§r=>" + (player.hasTag("red")?"§b":"§c"),
              {translate: `entity.${mob.typeId.slice(10)}.name`},
              `§r[鉄の斧]`
            ])
            applyDamage(mob, 10);
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
      // let info = getCard(handItem(player).typeId);
      // if(parseInt(info.Cact) > getAct(player)){
      //   player.sendMessage(error_act);
      //   return;
      // }
      // switch(cardBlock.typeId){
      //   case B:
      //   case W:
      //   case R:
      //     player.sendMessage(error_slot);
      //     return;
      //   case P:
      //     if(!player.hasTag("raid")){
      //       player.sendMessage("§c襲撃モード中でないため使用できません");
      //       return;
      //     }
      //     payCost(player, parseInt(info.Cact));
      //     sendPlayerMessage(player, "不死のトーテムを使用しました");
      //     player.dimension.playSound("random.totem", player.location, {volume: 10});
      //     player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
      //     /**@type {mc.EntityHealthComponent} */
      //     let health = player.getComponent(mc.EntityHealthComponent.componentId);
      //     sendPlayerMessage(player, `HP+${health.effectiveMax - health.currentValue}`);
      //     health.setCurrentValue(health.effectiveMax);
      //     break;
      //   case O:
      //     player.sendMessage(error_slot);
      //     return;
      // }
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
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      // スロットタイプのマッピング
      const slotMap = {
        [B]: { tag: "slotB", name: "青" },
        [W]: { tag: "slotW", name: "白" },
        [R]: { tag: "slotR", name: "赤" }
      };
      
      const slotInfo = slotMap[cardBlock.typeId];
      
      // P, Oスロットは使用不可
      if(!slotInfo){
        player.sendMessage(error_slot);
        return;
      }
      
      // ウィッチの取得
      const playerTeam = player.hasTag("red") ? "red" : "blue";
      const mobs = mc.world.getDimension("minecraft:overworld")
        .getEntities({type:"minecraft:witch", tags:[playerTeam, slotInfo.tag]});
      
      if(mobs.length == 0){
        player.sendMessage(`§c${slotInfo.name}スロットにウィッチが存在しないため使用できません。`);
        return;
      }
      
      if(mobs[0].hasTag("enhance")){
        player.sendMessage("§cすでに強化されているため使用できません。");
        return;
      }
      
      // コストの支払いと効果の適用
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "不吉な瓶を使用しました");
      
      const teamColor = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
      
      mobs[0].triggerEvent("enhance");
      mobs[0].addTag("enhance");
      lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(teamColor));
      mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(teamColor));
      myTimeout(1, () => {
        /**@type {mc.EntityHealthComponent} */
        const health = mobs[0].getComponent(mc.EntityHealthComponent.componentId);
        health.resetToMaxValue();
      });
      mobs[0].dimension.playSound("block.enchanting_table.use", mobs[0].location, {volume: 10});
      sendPlayerMessage(player, "ウィッチを強化しました");
      giveItem(player, new mc.ItemStack("mcg:awkward_potion"), 1);
      player.sendMessage("[入手] 奇妙なポーション");
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
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      const allow_mobs = ["zombie", "skeleton", "creeper", "witch"];
      
      // スロットタイプのマッピング
      const slotMap = {
        [B]: { tag: "slotB", name: "青" },
        [W]: { tag: "slotW", name: "白" },
        [R]: { tag: "slotR", name: "赤" }
      };
      
      const slotInfo = slotMap[cardBlock.typeId];
      
      // P, Oスロットは使用不可
      if(!slotInfo){
        player.sendMessage(error_slot);
        return;
      }
      
      // 対象のmobを取得
      const playerTeam = player.hasTag("red") ? "red" : "blue";
      const mobs = mc.world.getDimension("minecraft:overworld")
        .getEntities({tags:[playerTeam, slotInfo.tag]})
        .filter(e => allow_mobs.includes(e.typeId.slice(10)));
      
      if(mobs.length == 0){
        player.sendMessage(`§c${slotInfo.name}スロットに対象のモブが存在しないため使用できません。`);
        return;
      }

      if(mobs[0].hasTag("enhance")){
        if(mobs[0].typeId == "minecraft:witch") {
          player.sendMessage("§cこのカードはエンハンスウィッチには使用できません。")
          return;
        }
        player.sendMessage("§cすでに強化されているため使用できません。");
        return;
      }
      
      // コストの支払いと効果の適用
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "奇妙なポーションを使用しました");
      
      const teamColor = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
      lineParticle(player.dimension, player.location, mobs[0].location, "mcg:custom_explosion_emitter", 1.0, createColor(teamColor));
      mobs[0].dimension.spawnParticle("mcg:knockback_roar_particle", mobs[0].location, createColor(teamColor));
      enhance[mobs[0].typeId.slice(10)].run(mobs[0], player);
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
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      // スロットタイプのマッピング
      const slotMap = {
        [B]: { tag: "slotB", name: "青" },
        [W]: { tag: "slotW", name: "白" },
        [R]: { tag: "slotR", name: "赤" }
      };
      
      // Pスロットの処理（プレイヤー自身）
      if(cardBlock.typeId === P){
        payCost(player, parseInt(info.Cact));
        sendPlayerMessage(player, "治癒のポーションを使用しました");
        player.dimension.playSound("random.drink", player.location, {volume: 10});
        player.dimension.spawnParticle("minecraft:crop_growth_area_emitter", player.location);
        healEntity(player, 5);
        sendPlayerMessage(player, "HP+5");
        return;
      }
      
      const slotInfo = slotMap[cardBlock.typeId];
      
      // Oスロットは使用不可
      if(!slotInfo){
        player.sendMessage(error_slot);
        return;
      }
      
      // 対象のmobを取得
      const playerTeam = player.hasTag("red") ? "red" : "blue";
      const mobs = mc.world.getDimension("minecraft:overworld")
        .getEntities({tags:[playerTeam, slotInfo.tag]});
      
      if(mobs.length == 0){
        player.sendMessage(`§c${slotInfo.name}スロットに対象のモブが存在しないため使用できません。`);
        return;
      }
      
      // コストの支払いと効果の適用
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "治癒のポーションを使用しました");
      
      const teamColor = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
      mobs.forEach(mob => {
        mob.dimension.playSound("random.drink", mob.location, {volume: 10});
        lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(teamColor));
        mob.dimension.spawnParticle("minecraft:crop_growth_area_emitter", mob.location);
        if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
          applyDamage(mob, 15, {cause:mc.EntityDamageCause.magic});
        }else{
          healEntity(mob, 15);
        }
      });
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
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      // スロットタイプのマッピング
      const slotMap = {
        [B]: "slotB",
        [W]: "slotW",
        [R]: "slotR"
      };
      
      let mobs;
      const slotTag = slotMap[cardBlock.typeId];
      
      // Pスロットの処理（自分の場の全モブ）
      if(cardBlock.typeId === P){
        const playerTeam = player.hasTag("red") ? "red" : "blue";
        mobs = mc.world.getDimension("minecraft:overworld")
          .getEntities({excludeTypes:["minecraft:player"], tags:[playerTeam]});
        if(mobs.length == 0){
          player.sendMessage("§c自分の場に対象のモブが存在しないため使用できません。");
          return;
        }
      } else if(cardBlock.typeId === O){
        // Oスロットは使用不可
        player.sendMessage(error_slot);
        return;
      } else {
        // B, W, Rスロットの処理（相手の場の特定スロット）
        const opponentTeam = player.hasTag("red") ? "blue" : "red";
        mobs = mc.world.getDimension("minecraft:overworld")
          .getEntities({tags:[opponentTeam, slotTag], excludeTags:["fly"]});
        if(mobs.length == 0){
          player.sendMessage("§c相手の場に対象のモブが存在しないため使用できません。");
          return;
        }
      }
      
      // コストの支払いと効果の適用
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "治癒のスプラッシュポーションを使用しました");
      
      const teamColor = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
      mobs.forEach(mob => {
        mob.dimension.playSound("random.glass", mob.location, {volume: 10});
        lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(teamColor));
        mob.dimension.spawnParticle("minecraft:crop_growth_area_emitter", mob.location, createColor(teamColor));
        if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
          applyDamage(mob, 15, {cause:mc.EntityDamageCause.magic});
        }else{
          /**@type {mc.EntityHealthComponent} */
          let health = mob.getComponent(mc.EntityHealthComponent.componentId);
          health.setCurrentValue(Math.min(health.currentValue + 15, health.effectiveMax));
        }
      });
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
      if(!canPayCost(player, parseInt(info.Cact))){
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
      
      // スロットタイプのマッピング
      const slotMap = {
        [B]: "slotB",
        [W]: "slotW",
        [R]: "slotR"
      };
      
      const slotTag = slotMap[cardBlock.typeId];
      
      // P, Oスロットの処理
      if(cardBlock.typeId === P){
        if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(player.hasTag("red")?"blue":"red")], excludeTags:["fly"]}).length > 0){
          player.sendMessage("§c相手の場に攻撃可能なモブが存在するため使用できません");
          return;
        }
        payCost(player, parseInt(info.Cact));
        sendPlayerMessage(player, "負傷のポーションを使用しました");
        const teamColor = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
        mc.world.getPlayers({tags:[(player.hasTag("red")?"blue":"red")]}).forEach(p=>{
          p.dimension.playSound("random.drink", p.location, {volume: 10});
          p.dimension.spawnParticle("mcg:knockback_roar_particle", p.location, createColor(teamColor));
          applyDamage(p, 3, {cause:mc.EntityDamageCause.magic});
        });
        return;
      } else if(cardBlock.typeId === O){
        player.sendMessage(error_slot);
        return;
      }
      
      // B, W, Rスロットの処理
      res = await select_form.show(player);
      if(res.canceled) return;
      
      const playerTeam = player.hasTag("red") ? "red" : "blue";
      const targetTeam = res.selection == 0 ? playerTeam : (player.hasTag("red") ? "blue" : "red");
      
      mobs = mc.world.getDimension("minecraft:overworld").getEntities({
        tags: [targetTeam, slotTag],
        excludeTags: res.selection == 0 ? [] : ["fly"]
      });
      
      if(mobs.length == 0){
        player.sendMessage("§c対象のスロットに対象のモブが存在しないため使用できません。");
        return;
      }
      
      payCost(player, parseInt(info.Cact));
      sendPlayerMessage(player, "負傷のポーションを使用しました");
      
      const teamColor = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
      mobs.forEach(mob=>{
        mob.dimension.playSound("random.drink", mob.location, {volume: 10});
        lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(teamColor));
        mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(teamColor));
        if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
          healEntity(mob, 20);
        }else{
          applyDamage(mob, 20, {cause:mc.EntityDamageCause.magic});
          axolotlEffect(player, 20);
        }
      });
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
      if(!canPayCost(player, parseInt(info.Cact))){
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
          payCost(player, parseInt(info.Cact));
          sendPlayerMessage(player, "負傷のスプラッシュポーションを使用しました");
          let axolotl_done = false;
          mobs.forEach(mob=>{
            mob.dimension.playSound("random.glass", mob.location, {volume: 10});
            lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
            if(mob.getComponent(mc.EntityTypeFamilyComponent.componentId).hasTypeFamily("undead")){
              healEntity(mob, 20);
            }else{
              applyDamage(mob, 20, {cause:mc.EntityDamageCause.magic});
              if(!axolotl_done){
                axolotlEffect(player, 20);
                axolotl_done = true;
              }
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
  tropical_fish_spawn_egg: {
    /**
     * 熱帯魚
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:tropicalfish",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "熱帯魚を召喚しました");
          mob.dimension.playSound("bubble.upinside", mob.location, {volume: 10});
          mob.addTag("water");
          giveItemWithMessage(player, "minecraft:grass_block", 2, "草ブロック");
          sendPlayerMessage(player, "[熱帯魚] 草ブロックを2つ獲得");
        }
      );
    }
  },
  turtle_spawn_egg: {
    /**
     * カメ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:turtle",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "カメを召喚しました");
          mob.dimension.playSound("mob.chicken.plop", mob.location, {volume: 10});
          mob.addTag("water");
          
          // 海洋の心の所持数が3つ以上の時、カメの甲羅を入手
          const heartCount = getItemCount(player, "minecraft:heart_of_the_sea");
          if (heartCount >= 3) {
            giveItemWithMessage(player, "minecraft:turtle_helmet", 1, "カメの甲羅");
            sendPlayerMessage(player, "[カメ] カメの甲羅を獲得");
          }
        }
      );
    }
  },
  squid_spawn_egg: {
    /**
     * イカ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:squid",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "イカを召喚しました");
          mob.dimension.playSound("bubble.upinside", mob.location, {volume: 10});
          mob.addTag("water");
          mob.teleport({...mob.location, y: mob.location.y + 1});
        }
      )
    }
  },
  barrel: {
    /**
     * 樽
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(!canPayCost(player, parseInt(info.Cact))){
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
          payCost(player, parseInt(info.Cact));
          sendPlayerMessage(player, "樽を使用しました");
          giveItemWithMessage(player, "minecraft:fishing_rod", 1, "釣り竿");
          giveItemWithMessage(player, "minecraft:cartography_table", 1, "製図台");
          giveItemWithMessage(player, "minecraft:carrot_on_a_stick", 1, "ニンジン付きの棒");
          return;
        case O:
          payCost(player, parseInt(info.Cact));
          setObject(player, "minecraft:barrel");
          sendPlayerMessage(player, "樽を設置しました");
          return;
      }
    }
  },
  guardian_spawn_egg: {
    /**
     * ガーディアン
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:guardian",
        /**
         * @param {mc.Entity} mob
         **/
        (mob) => {
          sendPlayerMessage(player, "ガーディアンを召喚しました");
          mob.dimension.playSound("bubble.upinside", mob.location, {volume: 10});
          mob.addTag("water");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          giveItemWithMessage(player, "minecraft:heart_of_the_sea", 1, "海洋の心");
          sendPlayerMessage(player, "[ガーディアン] 海洋の心を獲得");
        }
      );
    }
  },
  axolotl_spawn_egg: {
    /**
     * ウーパールーパー
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:axolotl",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "ウーパールーパーを召喚しました");
          mob.dimension.playSound("bubble.upinside", mob.location, {volume: 10});
          mob.addTag("water");
          giveSword(player, getCard(mob.typeId).atk, "速攻効果");
        }
      )
    }
  },
  glow_squid_spawn_egg: {
    /**
     * 発光するイカ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:glow_squid",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "発光するイカを召喚しました");
          mob.dimension.playSound("bubble.upinside", mob.location, {volume: 10});
          mob.addTag("water");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          let waterCount = getAllTeamMobs(player).filter(m => m.hasTag("water")).length;
          if(waterCount > 0) {
            giveItemWithMessage(player, "minecraft:diamond", waterCount, "ダイヤモンド");
            sendPlayerMessage(player, `[発光するイカ] ダイヤモンドを${waterCount}つ獲得`);
          }
        }
      );
    }
  },
  dolphin_spawn_egg: {
    /**
     * イルカ
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:dolphin",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "イルカを召喚しました");
          mob.dimension.playSound("bubble.upinside", mob.location, {volume: 10});
          mob.addTag("water");
          mob.teleport({...mob.location, y: mob.location.y + 1});
          giveSword(player, getCard(mob.typeId).atk, "速攻効果");
          if (getItemCount(player, "minecraft:heart_of_the_sea") >= 10) {
            addAct(player, 30);
            sendPlayerMessage(player, "[イルカ] act+30");
          }
        }
      );
    }
  },
  turtle_helmet: {
    /**
     * カメの甲羅
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      if(cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      payCost(player, parseInt(info.Cact));
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "カメの甲羅を使用しました");
      player.addEffect(mc.EffectTypes.get("minecraft:absorption"), 20000000, {amplifier: 1, showParticles: true});
      player.dimension.playSound("armor.equip_leather", player.location, {volume: 10});
      player.dimension.spawnParticle("mcg:knockback_roar_particle", player.location, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
    }
  },
  fishing_rod: {
    /**
     * 釣り竿
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      if(cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      payCost(player, parseInt(info.Cact));
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "釣り竿を使用しました");
      giveItemWithMessage(player, "minecraft:grass_block", (getItemCount(player, "minecraft:heart_of_the_sea") > 5) ? 2 : 1, "草ブロック");
      player.dimension.playSound("random.pop", player.location, {volume: 10});
    }
  },
  cartography_table: {
    /**
     * 製図台
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      let info = getCard(handItem(player).typeId);
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      if(cardBlock.typeId !== P && cardBlock.typeId !== O) {
        player.sendMessage(error_slot);
        return;
      }
      switch(cardBlock.typeId){
        case P:
          if (getOpponentObject(player).typeId === "minecraft:air") {
            player.sendMessage("§c相手のオブジェクトが存在しないため使用できません。");
            return;
          }
          payCost(player, parseInt(info.Cact));
          decrementSlot(player, player.selectedSlotIndex);
          sendPlayerMessage(player, "製図台を使用しました");
          let OpponentObject = getOpponentObject(player);
          giveItemWithMessage(player, OpponentObject.typeId, 1, getDisplayName(OpponentObject.typeId));
          player.dimension.playSound("random.pop", player.location, {volume: 10});
          return;

        case O:
          payCost(player, parseInt(info.Cact));
          setObject(player, "minecraft:cartography_table");
          sendPlayerMessage(player, "製図台を設置しました");
          return;
      }
    }
  },
  cod: {
    /**
     * 生鱈
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if(cardBlock.typeId === P || cardBlock.typeId === O) {
        player.sendMessage(error_slot);
        return;
      }
      let blockTag = "";
      switch(cardBlock.typeId){
        case B:
          blockTag = "B";
          break;
        case W:
          blockTag = "W";
          break;
        case R:
          blockTag = "R";
          break;
      }
      let mobs = getMobsInSlot(player, blockTag).filter(m => m.hasTag("water"));
      if(mobs.length == 0){
        player.sendMessage(ERROR_MESSAGES.NO_TARGET_MOB);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "生鱈を使用しました");
      mobs.forEach(mob => {
        mob.dimension.playSound("random.pop", mob.location, {volume: 10});
        healEntity(mob, 10);
      });
    }
  },
  cooked_cod: {
    /**
     * 焼き鱈
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if(cardBlock.typeId !== P) {
        player.sendMessage(error_slot);
        return;
      }
      decrementSlot(player, player.selectedSlotIndex);
      sendPlayerMessage(player, "焼き鱈を使用しました");
      player.dimension.playSound("random.pop", player.location, {volume: 10});
      healEntity(player, 3);
      sendPlayerMessage(player, "HP+3");
    }
  },
  heart_of_the_sea: {},
  drowned_spawn_egg: {
    /**
     * ドラウンド
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      summonCard(cardBlock, player, "minecraft:drowned",
        /**
         * @param {mc.Entity} mob
         */
        (mob) => {
          sendPlayerMessage(player, "ドラウンドを召喚しました");
          mob.dimension.playSound("bubble.upinside", mob.location, {volume: 10});
          mob.addTag("water");
          giveItemWithMessage(player, "minecraft:grass_block", 1, "草ブロック");
          giveItemWithMessage(player, "minecraft:trident", 1, "トライデント");
          sendPlayerMessage(player, "[ドラウンド] 草ブロックとトライデントを獲得");
        });
    }
  },
  trident: {
    /**
     * トライデント
     * @param {mc.Block} cardBlock
     * @param {mc.Player} player
     */
    run: (cardBlock, player) => {
      if(cardBlock.typeId === O) {
        player.sendMessage(error_slot);
        return;
      }
      if(getItemCount(player, "minecraft:heart_of_the_sea") < 6) {
        player.sendMessage("§c海洋の心が6つ未満のため使用できません。");
        return;
      }
      let info = getCard(handItem(player).typeId);
      if(!canPayCost(player, parseInt(info.Cact))){
        player.sendMessage(error_act);
        return;
      }
      const drownedEffectFlag = getAllTeamMobs(player, {type:"minecraft:drowned"}).length === 3;
      if(cardBlock.typeId === P) {
        payCost(player, parseInt(info.Cact));
        decrementSlot(player, player.selectedSlotIndex);
        decrementContainer(player, "minecraft:heart_of_the_sea", 1);
        const opponentPlayer = getOpponentPlayers(player)[0];
        const color = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
        lineParticle(player.dimension, player.location, opponentPlayer.location, "mcg:custom_explosion_emitter", 1.0, createColor(color));
        player.dimension.spawnParticle("mcg:knockback_roar_particle", opponentPlayer.location, createColor(color));
        player.dimension.playSound("item.trident.throw", player.location, {volume: 10});
        opponentPlayer.dimension.playSound("item.trident.hit", opponentPlayer.location, {volume: 10});
        applyDamage(opponentPlayer, 3);
        decrementContainer(player, "minecraft:packed_ice", 1);
        sendPlayerMessage(player, "トライデントを使用しました");
        if(drownedEffectFlag) {
          giveItemWithMessage(player, "minecraft:heart_of_the_sea", 1, "海洋の心");
          sendPlayerMessage(player, "[ドラウンド] 海洋の心を獲得");
        }
      } else {
        let slot = "";
        switch(cardBlock.typeId){
          case B:
            slot = "B";
            break;
          case W:
            slot = "W";
            break;
          case R:
            slot = "R";
            break;
        }
        let mobs = getOpponentMobsInSlot(player, slot, {excludeTags:["guard"]});
        if(mobs.length == 0){
          player.sendMessage(ERROR_MESSAGES.NO_TARGET_MOB);
          return;
        }
        payCost(player, parseInt(info.Cact));
        decrementSlot(player, player.selectedSlotIndex);
        decrementContainer(player, "minecraft:heart_of_the_sea", 1);
        const color = player.hasTag("red") ? mcg.const.rgb.red : mcg.const.rgb.blue;
        player.dimension.playSound("item.trident.throw", player.location, {volume: 10});
        mobs.forEach(mob => {
          lineParticle(player.dimension, player.location, mob.location, "mcg:custom_explosion_emitter", 1.0, createColor(color));
          mob.dimension.spawnParticle("mcg:knockback_roar_particle", mob.location, createColor(color));
          mob.dimension.playSound("item.trident.hit", mob.location, {volume: 10});
          if(mob.hasTag("water")) {
            mob.remove();
          } else {
            applyDamage(mob, 30);
            axolotlEffect(player, 30);
          }
        })
        decrementContainer(player, "minecraft:packed_ice", 1);
        sendPlayerMessage(player, "トライデントを使用しました");
        if(drownedEffectFlag) {
          giveItemWithMessage(player, "minecraft:heart_of_the_sea", 1, "海洋の心");
          sendPlayerMessage(player, "[ドラウンド] 海洋の心を獲得");
        }
      }
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
      myTimeout(1, () => {
        /**@type {mc.EntityHealthComponent} */
        let health = mob.getComponent(mc.EntityHealthComponent.componentId);
        health.resetToMaxValue();
      })
      mob.dimension.playSound("block.enchanting_table.use", mob.location, {volume: 10});
      sendPlayerMessage(player, "ゾンビを強化しました");
      giveItem(player, new mc.ItemStack("minecraft:grass_block"), 2);
      player.sendMessage("[入手] 草ブロック x2");
    }
  },
  skeleton: {
    /**
     * スケルトン
     * @param {mc.Entity} mob
     * @param {mc.Player} player
     */
    run: (mob, player) => {
      mob.triggerEvent("enhance");
      mob.addTag("enhance");
      myTimeout(1,()=>{
        /**@type {mc.EntityHealthComponent} */
        let health = mob.getComponent(mc.EntityHealthComponent.componentId);
        health.resetToMaxValue();
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
