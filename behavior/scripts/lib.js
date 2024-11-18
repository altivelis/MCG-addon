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
 * 
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
 * カードテキスト取得関数
 * @param {String} name 
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