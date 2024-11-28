import * as mc from "@minecraft/server";
import { addAct, applyDamage, getObject, giveItem, myTimeout, sendPlayerMessage, setObject } from "./lib";
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
          let oldPlayerObject = getObject(oldPlayer.hasTag("red") ? "red" : "blue");
          if(oldPlayerObject?.typeId != "minecraft:air"){
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
  },
  husk: {
    /**
     * ハスク
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  stray: {
    /**
     * ストレイ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:arrow", 2));
        sendPlayerMessage(newPlayer, "[ストレイ] 矢x2を獲得");
      }
    }
  },
  cave_spider: {
    /**
     * 洞窟クモ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  zombie_pigman: {
    /**
     * ゾンビピッグマン
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  wither_skeleton: {
    /**
     * ウィザースケルトン
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  strider: {
    /**
     * ストライダー
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  blaze: {
    /**
     * ブレイズ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      let teamBlazes = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:blaze", tags:[(entity.hasTag("red")?"red":"blue")]});
      let test = false;
      teamBlazes.forEach(blaze=>{
        if(blaze.hasTag("processed")) test = true;
      })
      if(test) return;
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        applyDamage(oldPlayer, 2, {cause:mc.EntityDamageCause.fire});
      }else{
        applyDamage(newPlayer, 2, {cause:mc.EntityDamageCause.fire});
      }
      entity.addTag("processed");
      myTimeout(20, ()=>{
        entity.removeTag("processed");
      })
    }
  },
  chicken: {
    /**
     * ニワトリ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:egg"));
        sendPlayerMessage(newPlayer, "[ニワトリ] 卵を獲得");
      }
    }
  },
  parrot: {
    /**
     * オウム
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  fox: {
    /**
     * キツネ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  frog: {
    /**
     * カエル
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  mooshroom: {
    /**
     * ムーシュルーム
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  polar_bear: [
    /**
     * ホッキョクグマ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    (newPlayer, oldPlayer, entity) => {
      if(oldPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        let snowgolems = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:snow_golem", tags:[(entity.hasTag("red")?"red":"blue")]});
        let ice = new mc.ItemStack("minecraft:packed_ice", (snowgolems.length > 0 ? 8 : 4));
        ice.lockMode = mc.ItemLockMode.inventory;
        /**
         * @type {mc.Container}
         */
        let inv = newPlayer.getComponent(mc.EntityInventoryComponent.componentId).container;
        if(inv.emptySlotsCount == 0){
          let processed = false;
          while(!processed){
            let index = Math.floor(Math.random() * inv.size);
            if(inv.getItem(index).typeId.includes("spawn_egg")){
              inv.setItem(index, ice);
              newPlayer.sendMessage("§cインベントリに空きがないため、ランダムなスポーンエッグを置き換えました。")
              processed = true;
            }
          }
        }else{
          inv.addItem(ice);
        }
      }
    }
  ]
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
  },
  crying_obsidian:{
    /**
     * 泣く黒曜石
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {}
  },
  bee_nest: {
    /**
     * ミツバチの巣
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if(newPlayer.hasTag("red") ? blockTag == "red" : blockTag == "blue"){
        giveItem(newPlayer, new mc.ItemStack("minecraft:bee_spawn_egg"));
        sendPlayerMessage(newPlayer, "[ミツバチの巣] ハチを獲得");
      }
    }
  },
  composter: {
    /**
     * コンポスター
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {
      if(newPlayer.hasTag("red") ? blockTag == "red" : blockTag == "blue"){
        switch(Math.floor(Math.random() * 4)){
          case 0:
            giveItem(newPlayer, new mc.ItemStack("minecraft:poppy"));
            sendPlayerMessage(newPlayer, "[コンポスター] ポピーを獲得");
            break;
          case 1:
            giveItem(newPlayer, new mc.ItemStack("minecraft:dandelion"));
            sendPlayerMessage(newPlayer, "[コンポスター] タンポポを獲得");
            break;
          case 2:
            giveItem(newPlayer, new mc.ItemStack("minecraft:pink_tulip"));
            sendPlayerMessage(newPlayer, "[コンポスター] 桃色のチューリップを獲得");
            break;
          case 3:
            giveItem(newPlayer, new mc.ItemStack("minecraft:cactus"));
            sendPlayerMessage(newPlayer, "[コンポスター] サボテンを獲得");
            break;
        }
      }
    }
  }
}

export const turnItem = {
  
}