import * as mc from "@minecraft/server";
import { cardList } from "./cardinfo";

/**
 * Timeoutを見やすくする関数
 * @param {number} tick 
 * @param {()=>void} func
 */
export function myTimeout(tick, func){
  mc.system.runTimeout(func, tick);
}

/**
 * テキスト付きアイテムを渡す関数
 * @param {mc.Player} player 
 * @param {mc.ItemStack} item 
 * @param {number} count 
 */
export function giveItem(player, item){
  if(cardInfo(item.typeId).length > 0){
    item.setLore(cardInfo(item.typeId));
  }
  player.getComponent(mc.EntityInventoryComponent.componentId).container.addItem(item);
}

/**
 * カード情報取得関数
 * @param {String} name identifier
 */
export function getCard(name){
  return cardList.find((element) => element.name.includes(name));
}

/**
 * カードテキスト取得関数
 * @param {String} name identifier
 * @returns {String[]} カードテキスト
 */
export function cardInfo(name){
  const card = cardList.find((element) => element.name.includes(name));
  if(!card) return [];
  let text = [];
  if(card.type == "entity"){
    text.push(`§3属性:${card.attribute}`);
    text.push(`§aHP§r:${card.hp} §cATK§r:${card.atk} §eSact§r:${card.Sact} §6Bact§r:${card.Bact}`);
    card.text.forEach(t => text.push(t));
  }
  else if(card.type == "item"){
    text.push(`§3属性:${card.attribute}`);
    text.push(`§eCact§r:${card.Cact}`);
    card.text.forEach(t => text.push(t));
  }
  else return [];
  return text;
}

/**
 * アイテムの所有確認関数
 * @param {mc.Player} player 
 * @param {String} item 
 */
export function hasItem(player, item){
  /**
   * @type {mc.Container}
   */
  const container = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  for(let i=0; i<container.size; i++){
    if(container.getItem(i)?.typeId == item) return true;
  }
  return false;
}

/**
 * スロットからアイテムを1つ減らす関数
 * @param {mc.Player} player 
 * @param {Number} index 
 */
export function decrementSlot(player, index){
  /**
   * @type {mc.Container}
   */
  const container = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  const item = container.getItem(index);
  if(item.amount > 1){
    item.amount--;
    container.setItem(index, item);
  }
  else{
    container.setItem(index);
  }
}

/**
 * インベントリからアイテムを1つ減らす関数
 * @param {mc.Player} player 
 * @param {String} item 
 */
export function decrementContainer(player, item){
  /**
   * @type {mc.Container}
   */
  const container = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  for(let i=0; i<container.size; i++){
    if(container.getItem(i).typeId == item){
      decrementSlot(player, i);
      return;
    }
  }
}

/**
 * 手に持っているアイテムを取得する関数
 * @param {mc.Player} player 
 * @returns {mc.ItemStack | undefined}
 */
export function handItem(player){
  return player.getComponent(mc.EntityInventoryComponent.componentId).container.getItem(player.selectedSlotIndex);
}

/**
 * act取得関数
 * @param {mc.Player | mc.Entity | mc.ScoreboardIdentity | String} target
 */
export function getAct(target){
  return mc.world.scoreboard.getObjective("act").getScore(target);
}

/**
 * act変更関数
 * @param {mc.Player | mc.Entity | mc.ScoreboardIdentity | String} target 
 * @param {Number} value 
 */
export function setAct(target, value){
  return mc.world.scoreboard.getObjective("act").setScore(target, value);
}

/**
 * act加算関数
 * @param {mc.Player | mc.Entity | mc.ScoreboardIdentity | String} target 
 * @param {Number} value 
 */
export function addAct(target, value){
  return mc.world.scoreboard.getObjective("act").addScore(target, value);
}

/**
 * atkテキストから剣を渡す関数
 * @param {mc.Player} player 
 * @param {String} atk 
 */
export function giveSword(player, atk){
  if(atk == "-" || atk == "0") return;
  const texts = atk.split("x");
  let sword;
  switch(texts[0]){
    case "5":
      sword = new mc.ItemStack("minecraft:wooden_sword");
      break;
    case "15":
      sword = new mc.ItemStack("minecraft:stone_sword");
      break;
    case "20":
      sword = new mc.ItemStack("minecraft:golden_sword");
      break;
    case "30":
      sword = new mc.ItemStack("minecraft:iron_sword");
      break;
    case "50":
      sword = new mc.ItemStack("minecraft:diamond_sword");
      break;
    case "70":
      sword = new mc.ItemStack("minecraft:netherite_sword");
      break;
    default:
      return;
  }
  if(texts.length == 2){
    for(let i=0; i<parseInt(texts[1]); i++){
      giveItem(player, sword);
    }
  }else{
    giveItem(player, sword);
  }
  return;
}