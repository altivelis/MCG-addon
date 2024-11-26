import * as mc from "@minecraft/server";
import { giveItem } from "./lib";

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
        mc.world.sendMessage((newPlayer.hasTag("red")?"§c":"§b") + newPlayer.nameTag + "§r:[村人]草ブロックを獲得")
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
        mc.world.sendMessage((newPlayer.hasTag("red")?"§c":"§b") + newPlayer.nameTag + "§r:[チェスト]草ブロックを獲得")
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
}

export const turnItem = {
  
}