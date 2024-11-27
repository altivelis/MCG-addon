import * as mc from "@minecraft/server";
import { addAct, giveItem, myTimeout, sendPlayerMessage, setObject } from "./lib";
import { mcg } from "./system";

export const turnMob = {
  pig: {
    /**
     * ブタ
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {mc.Entity} entity 
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  villager_v2: {
    /**
     * 村人
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:grass_block"));
        sendPlayerMessage(newPlayer, "[村人] 草ブロックを獲得");
      }
    }
  },
  wolf: {
    /**
     * オオカミ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  allay: {
    /**
     * アレイ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  panda: {
    /**
     * パンダ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  snow_golem: {
    /**
     * スノーゴーレム
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  iron_golem: {
    /**
     * アイアンゴーレム
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  zombie: {
    /**
     * ゾンビ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  skeleton: {
    /**
     * スケルトン
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:arrow"));
        sendPlayerMessage(newPlayer, "[スケルトン] 矢を獲得");
      }
    }
  },
  creeper: {
    /**
     * クリーパー
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        myTimeout(entity.hasTag("slotB") ? 0 : entity.hasTag("slotW") ? 20 : 40, ()=>{
          sendPlayerMessage(newPlayer, "[クリーパー] ドカーン！");
          entity.dimension.spawnParticle("minecraft:huge_explosion_emitter", entity.location);
          entity.dimension.playSound("cauldron.explode", entity.location);
          mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(entity.hasTag("red")?"blue":"red")], excludeTags:["fly", "guard"]}).forEach(target=>{
            target.applyDamage(5, {cause:mc.EntityDamageCause.entityExplosion});
          })
          let oldPlayerObject = mc.world.getDimension("minecraft:overworld").getBlock((entity.hasTag("red")?mcg.const.blue.slot.object:mcg.const.red.slot.object));
          if(oldPlayerObject.typeId != "minecraft:air"){
            setObject(oldPlayer, "minecraft:air");
            sendPlayerMessage(newPlayer, "[クリーパー] 相手のオブジェクトを破壊");
          }
        })
      }
    }
  },
  witch: {
    /**
     * ウィッチ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        entity.getComponent(mc.EntityHealthComponent.componentId).resetToDefaultValue();
        sendPlayerMessage(newPlayer, "[ウィッチ] 体力回復");
      }
    }
  },
  phantom: {
    /**
     * ファントム
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  breeze: {
    /**
     * ブリーズ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  }
}

export const turnObject = {
  chest: {
    /**
     * チェスト
     * @param {mc.Player} newPlayer 
     * @param {mc.Player} oldPlayer 
     * @param {String} blockTag 
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if(newPlayer.hasTag("red") ? blockTag == "red" : blockTag == "blue"){
        giveItem(newPlayer, new mc.ItemStack("minecraft:grass_block"));
        sendPlayerMessage(newPlayer, "[チェスト] 草ブロックを獲得");
      }
    }
  },
  carved_pumpkin: {
    /**
     * くり抜かれたカボチャ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {}
  },
  bell: {
    /**
     * 鐘
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {}
  },
  mob_spawner: {
    /**
     * モンスタースポナー
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if(newPlayer.hasTag("red") ? blockTag == "red" : blockTag == "blue"){
        addAct(newPlayer, 15);
        sendPlayerMessage(newPlayer, "[モンスタースポナー] act+15");
      }
    }
  },
  ender_chest: {
    /**
     * エンダーチェスト
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if(newPlayer.hasTag("red") ? blockTag == "red" : blockTag == "blue"){
        giveItem(newPlayer, new mc.ItemStack("minecraft:grass_block", 3));
        sendPlayerMessage(newPlayer, "[エンダーチェスト] 草ブロックx3を獲得");
      }
    }
  }
}

export const turnItem = {
  
}