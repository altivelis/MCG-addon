import * as mc from "@minecraft/server";
import { addAct, applyDamage, getObject, giveItem, giveSword, hasItem, myTimeout, sendPlayerMessage, setObject } from "./lib";
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
        if(entity.hasTag("enhance")){
          let amount = mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(entity.hasTag("red")?"red":"blue")]}).length;
          if(amount){
            giveItem(newPlayer, new mc.ItemStack("minecraft:arrow"), amount);
            sendPlayerMessage(newPlayer, "[スケルトン] 矢x" + amount + "を獲得");
          }
        }
        else{
          giveItem(newPlayer, new mc.ItemStack("minecraft:arrow"));
          sendPlayerMessage(newPlayer, "[スケルトン] 矢を獲得");
        }
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
        if(entity.hasTag("enhance")){
          giveItem(newPlayer, new mc.ItemStack("mcg:awkward_potion"));
          sendPlayerMessage(newPlayer, "[ウィッチ] 奇妙なポーションを獲得");
        }
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
        giveItem(newPlayer, new mc.ItemStack("minecraft:arrow"), 2);
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
      // let teamBlazes = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:blaze", tags:[(entity.hasTag("red")?"red":"blue")]});
      // let test = false;
      // teamBlazes.forEach(blaze=>{
      //   if(blaze.hasTag("processed")) test = true;
      // })
      // if(test) return;
      // if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
      //   applyDamage(oldPlayer, 2, {cause:mc.EntityDamageCause.fire});
      // }else{
      //   applyDamage(newPlayer, 2, {cause:mc.EntityDamageCause.fire});
      // }
      // entity.addTag("processed");
      // myTimeout(20, ()=>{
      //   entity.removeTag("processed");
      // })
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
  polar_bear: {
    /**
     * ホッキョクグマ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(oldPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        let snowgolems = mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:snow_golem", tags:[(entity.hasTag("red")?"red":"blue")]});
        let ice = new mc.ItemStack("minecraft:packed_ice", 4 + snowgolems.length * 4);
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
  },
  bee: {
    /**
     * ミツバチ
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  sheep: {
    /**
     * 羊
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {}
  },
  bogged: {
    /**
     * ボグド
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:arrow"));
        sendPlayerMessage(newPlayer, "[ボグド] 矢を獲得");
      }
    }
  },
  pillager: {
    /**
     * 略奪者
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:grass_block"));
        sendPlayerMessage(newPlayer, "[略奪者] 草ブロックを獲得");
        giveItem(newPlayer, new mc.ItemStack("minecraft:arrow"), 2);
        sendPlayerMessage(newPlayer, "[略奪者] 矢x2を獲得");
        sendPlayerMessage(newPlayer, "[略奪者] スリップダメージ");
        applyDamage(newPlayer, 2);
      }
    }
  },
  vindicator: {
    /**
     * ヴィンディケーター
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:iron_axe"));
        sendPlayerMessage(newPlayer, "[ヴィンディケーター] 鉄の斧を獲得");
        sendPlayerMessage(newPlayer, "[ヴィンディケーター] スリップダメージ");
        applyDamage(newPlayer, 2);
      }
    }
  },
  vex: {
    /**
     * ヴェクス
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(oldPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        sendPlayerMessage(oldPlayer, "[ヴェクス] スリップダメージ");
        applyDamage(oldPlayer, 1);
      }
    }
  },
  evocation_illager: {
    /**
     * エヴォーカー
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(oldPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(entity.hasTag("red")?"red":"blue"), "slotB"]}).length == 0){
          let mobb = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:vex", (entity.hasTag("red") ? mcg.const.red.slot.blue : mcg.const.blue.slot.blue));
          mobb.addTag((entity.hasTag("red") ? "red" : "blue"));
          mobb.addTag("slotB");
          sendPlayerMessage(oldPlayer, "ヴェックスを召喚しました");
          mobb.dimension.playSound("apply_effect.raid_omen", mobb.location, {volume: 10});
        }
        if(mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(entity.hasTag("red")?"red":"blue"), "slotR"]}).length == 0){
          let mobr = mc.world.getDimension("minecraft:overworld").spawnEntity("minecraft:vex", (player.hasTag("red") ? mcg.const.red.slot.red : mcg.const.blue.slot.red));
          mobr.addTag((entity.hasTag("red") ? "red" : "blue"));
          mobr.addTag("slotR");
          sendPlayerMessage(oldPlayer, "ヴェックスを召喚しました");
          mobr.dimension.playSound("apply_effect.raid_omen", mobr.location, {volume: 10});
        }
      }
      else if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        sendPlayerMessage(newPlayer, "[エヴォーカー] スリップダメージ");
        applyDamage(newPlayer, 5);
        mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(entity.hasTag("red")?"blue":"red"), "slotB"]}).forEach(target=>{
          applyDamage(target, 20);
        })
        mc.world.getDimension("minecraft:overworld").getEntities({excludeTypes:["minecraft:player"], tags:[(entity.hasTag("red")?"blue":"red"), "slotR"]}).forEach(target=>{
          applyDamage(target, 20);
        })
      }
    }
  },
  armor_stand: {
    /**
     * 防具立て
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(oldPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        sendPlayerMessage(oldPlayer, "[防具立て] 破壊");
        entity.kill();
      }
    }
  },
  ravager: {
    /**
     * ラヴェジャー
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {mc.Entity} entity
     */
    run: (newPlayer, oldPlayer, entity) => {
      if(newPlayer.hasTag("red") ? entity.hasTag("red") : entity.hasTag("blue")){
        giveItem(newPlayer, new mc.ItemStack("minecraft:grass_block"), 2);
        sendPlayerMessage(newPlayer, "[ラヴェジャー] 草ブロックx2を獲得");
      }
    }
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
    run: (newPlayer, oldPlayer, blockTag) => {
      if(newPlayer.hasTag("red") ? blockTag == "red" : blockTag == "blue"){
        giveItem(newPlayer, new mc.ItemStack("minecraft:villager_spawn_egg"));
        sendPlayerMessage(newPlayer, "[鐘] 村人を獲得");
      }
    }
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
        giveItem(newPlayer, new mc.ItemStack("minecraft:grass_block"), 3);
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
  },
  lit_pumpkin: {
    /**
     * ジャック・オ・ランタン
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {}
  },
  trapped_chest: {
    /**
     * トラップチェスト
     * @param {mc.Player} newPlayer
     * @param {mc.Player} oldPlayer
     * @param {String} blockTag
     */
    run: (newPlayer, oldPlayer, blockTag) => {}
  }
}

/**
 * ターン開始時のハンドアイテム、キープアイテムの処理
 * @param {mc.Player} newPlayer ターンを開始するプレイヤー
 * @param {mc.Player} oldPlayer ターンを終了したプレイヤー
 */
export function turnItem(newPlayer, oldPlayer){
  if(hasItem(newPlayer, "minecraft:red_wool")){
    giveSword(newPlayer, "15", "赤色の羊毛");
  }
  if(hasItem(newPlayer, "minecraft:yellow_wool")){
    addAct(newPlayer, 10);
    sendPlayerMessage(newPlayer, "[黄色の羊毛] act+10");
  }
  if(hasItem(newPlayer, "minecraft:pink_wool")){
    giveItem(newPlayer, new mc.ItemStack("minecraft:grass_block"));
    sendPlayerMessage(newPlayer, "[桃色の羊毛] 草ブロックを獲得");
  }
  if(hasItem(newPlayer, "minecraft:green_wool")){
    /**
     * @type {mc.EntityHealthComponent}
     */
    let hp = newPlayer.getComponent(mc.EntityHealthComponent.componentId);
    hp.setCurrentValue(hp.currentValue + 3);
    sendPlayerMessage(newPlayer, "[緑色の羊毛] HP+3");
  }
  if(hasItem(newPlayer, "minecraft:black_wool")){
    sendPlayerMessage(newPlayer, "[黒色の羊毛] スリップダメージ");
    applyDamage(oldPlayer, 3, {cause:mc.EntityDamageCause.wither});
  }
  /**
   * @type {mc.Container}
   */
  let inv_old = oldPlayer.getComponent(mc.EntityInventoryComponent.componentId).container;
  for(let i=0; i<inv_old.size; i++){
    let item = inv_old.getItem(i);
    if(item?.typeId == "minecraft:packed_ice"){
      sendPlayerMessage(oldPlayer, "[凍結ダメージ]");
      applyDamage(oldPlayer, item.amount);
      inv_old.setItem(i);
    }
  }
}