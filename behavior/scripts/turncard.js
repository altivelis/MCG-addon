import * as mc from "@minecraft/server";
import { addAct, applyDamage, hasItem, giveSword, giveItem, sendPlayerMessage, myTimeout, setObject, getObject } from "./lib";
import { 
  isSameTeam, isOpponentTeam, getPlayerTeam, getOpponentTeam,
  playCardEffect, giveItemWithMessage, getAllTeamMobs, summonMobInSlot
} from "./card-helpers";
import { mcg } from "./system";

/**
 * ターン経過時のモブ効果
 * 同じチームのモブならnewPlayerに効果、相手チームならoldPlayerに効果
 */
export const turnMob = {
  pig: { run: () => {} },
  
  villager_v2: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (isSameTeam(entity, newPlayer)) {
        giveItemWithMessage(newPlayer, "minecraft:grass_block", 1, "草ブロック");
        sendPlayerMessage(newPlayer, "[村人] 草ブロックを獲得");
      }
    }
  },
  
  wolf: { run: () => {} },
  allay: { run: () => {} },
  panda: { run: () => {} },
  snow_golem: { run: () => {} },
  iron_golem: { run: () => {} },
  zombie: { run: () => {} },
  
  skeleton: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (!isSameTeam(entity, newPlayer)) return;
      
      if (entity.hasTag("enhance")) {
        const team = getPlayerTeam(newPlayer);
        const amount = getAllTeamMobs(newPlayer).length;
        if (amount > 0) {
          giveItemWithMessage(newPlayer, "minecraft:arrow", amount, "矢");
          sendPlayerMessage(newPlayer, `[エンハンススケルトン] 矢x${amount}を獲得`);
        }
      } else {
        giveItemWithMessage(newPlayer, "minecraft:arrow", 1, "矢");
        sendPlayerMessage(newPlayer, "[スケルトン] 矢を獲得");
      }
    }
  },
  
  creeper: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (!isSameTeam(entity, newPlayer)) return;
      
      const delay = entity.hasTag("slotB") ? 0 : entity.hasTag("slotW") ? 20 : 40;
      const opponentTeam = getOpponentTeam(newPlayer);
      
      myTimeout(delay, () => {
        sendPlayerMessage(newPlayer, "[クリーパー] ドカーン！");
        entity.dimension.spawnParticle("minecraft:huge_explosion_emitter", entity.location);
        entity.dimension.playSound("cauldron.explode", entity.location, { volume: 10 });
        // 相手チームの全モブにダメージ
        mc.world.getDimension("minecraft:overworld")
          .getEntities({ excludeTypes: ["minecraft:player"], tags: [opponentTeam], excludeTags: ["fly", "guard"] })
          .forEach(target => target.applyDamage(5, { cause: mc.EntityDamageCause.entityExplosion }));
        
        // 相手のオブジェクトを破壊
        const opponentObjectTeam = getPlayerTeam(oldPlayer);
        const opponentObject = getObject(opponentObjectTeam);
        if (opponentObject?.typeId !== "minecraft:air") {
          setObject(oldPlayer, "minecraft:air");
          sendPlayerMessage(newPlayer, "[クリーパー] 相手のオブジェクトを破壊");
        }
      });
    }
  },
  
  witch: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (!isSameTeam(entity, newPlayer)) return;
      
      if (entity.hasTag("enhance")) {
        giveItemWithMessage(newPlayer, "mcg:awkward_potion", 1, "奇妙なポーション");
        sendPlayerMessage(newPlayer, "[ウィッチロード] 奇妙なポーションを獲得");
        entity.getComponent(mc.EntityHealthComponent.componentId).resetToMaxValue();
        sendPlayerMessage(newPlayer, "[ウィッチロード] 体力回復");
      }
      else {
        entity.getComponent(mc.EntityHealthComponent.componentId).resetToMaxValue();
        sendPlayerMessage(newPlayer, "[ウィッチ] 体力回復");
      }
    }
  },
  
  phantom: { run: () => {} },
  breeze: { run: () => {} },
  husk: { run: () => {} },
  
  stray: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (isSameTeam(entity, newPlayer)) {
        giveItemWithMessage(newPlayer, "minecraft:arrow", 2, "矢");
        sendPlayerMessage(newPlayer, "[ストレイ] 矢x2を獲得");
      }
    }
  },
  
  cave_spider: { run: () => {} },
  zombie_pigman: { run: () => {} },
  wither_skeleton: { run: () => {} },
  strider: { run: () => {} },
  blaze: { run: () => {} },
  
  chicken: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (isSameTeam(entity, newPlayer)) {
        giveItemWithMessage(newPlayer, "minecraft:egg", 1, "卵");
        sendPlayerMessage(newPlayer, "[ニワトリ] 卵を獲得");
      }
    }
  },
  
  parrot: { run: () => {} },
  fox: { run: () => {} },
  frog: { run: () => {} },
  mooshroom: { run: () => {} },
  
  polar_bear: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (!isOpponentTeam(entity, newPlayer)) return;
      
      const team = getPlayerTeam(entity);
      const snowgolems = mc.world.getDimension("minecraft:overworld")
        .getEntities({ type: "minecraft:snow_golem", tags: [team] });
      
      const ice = new mc.ItemStack("minecraft:packed_ice", 4 + snowgolems.length * 4);
      ice.lockMode = mc.ItemLockMode.inventory;
      
      const inv = newPlayer.getComponent(mc.EntityInventoryComponent.componentId).container;
      if (inv.emptySlotsCount === 0) {
        // インベントリ満杯時：最後から順に探索してlockModeがないアイテムを放出して置き換え
        for (let i = inv.size - 1; i >= 0; i--) {
          const item = inv.getItem(i);
          if (item && item.lockMode === mc.ItemLockMode.none) {
            newPlayer.dimension.spawnItem(item, newPlayer.location);
            inv.setItem(i, ice);
            newPlayer.sendMessage("§cインベントリに空きがないため、アイテムを放出しました。");
            break;
          }
        }
      } else {
        inv.addItem(ice);
      }
    }
  },
  
  bee: { run: () => {} },
  sheep: { run: () => {} },
  
  bogged: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (isSameTeam(entity, newPlayer)) {
        giveItemWithMessage(newPlayer, "minecraft:arrow", 1, "矢");
        sendPlayerMessage(newPlayer, "[ボグド] 矢を獲得");
      }
    }
  },
  
  pillager: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (!isSameTeam(entity, newPlayer)) return;
      
      giveItemWithMessage(newPlayer, "minecraft:grass_block", 1, "草ブロック");
      sendPlayerMessage(newPlayer, "[ピリジャー] 草ブロックを獲得");
      giveItemWithMessage(newPlayer, "minecraft:arrow", 1, "矢");
      sendPlayerMessage(newPlayer, "[ピリジャー] 矢を獲得");
      sendPlayerMessage(newPlayer, "[ピリジャー] スリップダメージ");
      applyDamage(newPlayer, 2);
    }
  },
  
  vindicator: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (!isSameTeam(entity, newPlayer)) return;
      
      giveItemWithMessage(newPlayer, "minecraft:iron_axe", 1, "鉄の斧");
      sendPlayerMessage(newPlayer, "[ヴィンディケーター] 鉄の斧を獲得");
      sendPlayerMessage(newPlayer, "[ヴィンディケーター] スリップダメージ");
      applyDamage(newPlayer, 2);
    }
  },
  
  vex: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (isSameTeam(entity, newPlayer)) {
        sendPlayerMessage(newPlayer, "[ヴェックス] スリップダメージ");
        applyDamage(newPlayer, 1);
      }
    }
  },
  
  evocation_illager: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      const team = getPlayerTeam(entity);
      const opponentTeam = getOpponentTeam(newPlayer);
      
      // ターン終了プレイヤーと同じチーム → ヴェックス召喚
      if (isOpponentTeam(entity, newPlayer)) {
        const dimension = mc.world.getDimension("minecraft:overworld");
        
        // 青スロットにヴェックス召喚
        if (dimension.getEntities({ excludeTypes: ["minecraft:player"], tags: [team, "slotB"] }).length === 0) {
          const pos = entity.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue;
          const mob = dimension.spawnEntity("minecraft:vex", pos);
          mob.addTag(team);
          mob.addTag("slotB");
          mob.addTag("fly");
          mob.teleport({ ...mob.location, y: mob.location.y + 1 });
          sendPlayerMessage(oldPlayer, "ヴェックスを召喚しました");
          mob.dimension.playSound("apply_effect.raid_omen", mob.location, { volume: 10 });
        }
        
        // 赤スロットにヴェックス召喚
        if (dimension.getEntities({ excludeTypes: ["minecraft:player"], tags: [team, "slotR"] }).length === 0) {
          const pos = entity.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red;
          const mob = dimension.spawnEntity("minecraft:vex", pos);
          mob.addTag(team);
          mob.addTag("slotR");
          mob.addTag("fly");
          mob.teleport({ ...mob.location, y: mob.location.y + 1 });
          sendPlayerMessage(oldPlayer, "ヴェックスを召喚しました");
          mob.dimension.playSound("apply_effect.raid_omen", mob.location, { volume: 10 });
        }
      }
      // ターン開始プレイヤーと同じチーム → 攻撃
      else if (isSameTeam(entity, newPlayer)) {
        sendPlayerMessage(newPlayer, "[エヴォーカー] スリップダメージ");
        applyDamage(newPlayer, 5);
        
        // 相手の青・赤スロットに攻撃
        ["slotB", "slotR"].forEach(slot => {
          mc.world.getDimension("minecraft:overworld")
            .getEntities({ excludeTypes: ["minecraft:player"], tags: [opponentTeam, slot], excludeTags: ["guard", "fly"] })
            .forEach(target => {
              playCardEffect(entity, target.location);
              target.dimension.playSound("mob.evocation_fangs.attack", target.location, { volume: 10 });
              applyDamage(target, 15);
            });
        });
      }
    }
  },
  
  armor_stand: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (isOpponentTeam(entity, newPlayer)) {
        sendPlayerMessage(oldPlayer, "[防具立て] 破壊");
        entity.kill();
      }
    }
  },
  
  ravager: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     * @returns 
     */
    run: (newPlayer, oldPlayer, entity) => {
      if (isSameTeam(entity, newPlayer)) {
        sendPlayerMessage(newPlayer, "[ラヴェジャー] スリップダメージ");
        applyDamage(newPlayer, 4);
      }
    }
  }
};

/**
 * ターン経過時のオブジェクト効果
 */
export const turnObject = {
  chest: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {string} blockTag
     * @returns 
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if (getPlayerTeam(newPlayer) === blockTag) {
        giveItemWithMessage(newPlayer, "minecraft:grass_block", 1, "草ブロック");
        sendPlayerMessage(newPlayer, "[チェスト] 草ブロックを獲得");
      }
    }
  },
  
  carved_pumpkin: { run: () => {} },
  
  bell: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {string} blockTag
     * @returns 
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if (getPlayerTeam(newPlayer) === blockTag) {
        giveItemWithMessage(newPlayer, "minecraft:villager_spawn_egg", 1, "村人");
        sendPlayerMessage(newPlayer, "[鐘] 村人を獲得");
      }
    }
  },
  
  mob_spawner: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {string} blockTag
     * @returns 
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if (getPlayerTeam(newPlayer) === blockTag) {
        addAct(newPlayer, 15);
        sendPlayerMessage(newPlayer, "[モンスタースポナー] act+15");
      }
    }
  },
  
  ender_chest: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {string} blockTag
     * @returns 
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if (getPlayerTeam(newPlayer) === blockTag) {
        giveItemWithMessage(newPlayer, "minecraft:grass_block", 3, "草ブロック");
        sendPlayerMessage(newPlayer, "[エンダーチェスト] 草ブロックx3を獲得");
      }
    }
  },
  
  crying_obsidian: { run: () => {} },
  
  bee_nest: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {string} blockTag
     * @returns 
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if (getPlayerTeam(newPlayer) === blockTag) {
        giveItemWithMessage(newPlayer, "minecraft:bee_spawn_egg", 1, "ハチ");
        sendPlayerMessage(newPlayer, "[ミツバチの巣] ハチを獲得");
      }
    }
  },
  
  composter: {
    /**
     * 
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {string} blockTag
     * @returns 
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if (getPlayerTeam(newPlayer) !== blockTag) return;
      
      const flowers = [
        { id: "minecraft:poppy", name: "ポピー" },
        { id: "minecraft:dandelion", name: "タンポポ" },
        { id: "minecraft:pink_tulip", name: "桃色のチューリップ" },
        { id: "minecraft:cactus", name: "サボテン" }
      ];
      
      const selected = flowers[Math.floor(Math.random() * flowers.length)];
      giveItemWithMessage(newPlayer, selected.id, 1, selected.name);
      sendPlayerMessage(newPlayer, `[コンポスター] ${selected.name}を獲得`);
    }
  },
  
  lit_pumpkin: { run: () => {} },
  trapped_chest: { run: () => {} }
};

/**
 * ターン開始時のハンドアイテム、キープアイテムの処理
 * @param {mc.Player} newPlayer ターンを開始するプレイヤー
 * @param {mc.Player} oldPlayer ターンを終了したプレイヤー
 */
export function turnItem(newPlayer, oldPlayer) {
  // 羊毛効果
  if (hasItem(newPlayer, "minecraft:red_wool")) {
    giveSword(newPlayer, "15", "赤色の羊毛");
  }
  if (hasItem(newPlayer, "minecraft:yellow_wool")) {
    addAct(newPlayer, 10);
    sendPlayerMessage(newPlayer, "[黄色の羊毛] act+10");
  }
  if (hasItem(newPlayer, "minecraft:pink_wool")) {
    giveItemWithMessage(newPlayer, "minecraft:grass_block", 1, "草ブロック");
    sendPlayerMessage(newPlayer, "[桃色の羊毛] 草ブロックを獲得");
  }
  if (hasItem(newPlayer, "minecraft:green_wool")) {
    const hp = newPlayer.getComponent(mc.EntityHealthComponent.componentId);
    hp.setCurrentValue(Math.min(hp.currentValue + 3, hp.effectiveMax));
    sendPlayerMessage(newPlayer, "[緑色の羊毛] HP+3");
  }
  if (hasItem(newPlayer, "minecraft:black_wool")) {
    sendPlayerMessage(newPlayer, "[黒色の羊毛] スリップダメージ");
    applyDamage(oldPlayer, 3, { cause: mc.EntityDamageCause.wither });
  }
  
  // 氷塊の凍結ダメージ
  const inv_old = oldPlayer.getComponent(mc.EntityInventoryComponent.componentId).container;
  for (let i = 0; i < inv_old.size; i++) {
    const item = inv_old.getItem(i);
    if (item?.typeId === "minecraft:packed_ice") {
      sendPlayerMessage(oldPlayer, "[凍結ダメージ]");
      applyDamage(oldPlayer, item.amount);
      inv_old.setItem(i);
    }
  }
}
