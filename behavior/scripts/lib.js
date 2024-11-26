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
  //player.getComponent(mc.EntityInventoryComponent.componentId).container.addItem(item);
  //player.playSound("random.pop",{location:player.location, pitch:1.2});
  player.dimension.spawnItem(item, player.location);
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
  const card = getCard(name);
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
    if(container.getItem(i)?.typeId == item){
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
  if(getAct(target) + value < 0){
    mc.world.sendMessage((target.hasTag("red")?"§c":"§b")+target.nameTag+"§r:[オーバーコストペナルティー]");
    target.applyDamage(5);
    return mc.world.scoreboard.getObjective("act").setScore(target, 0);
  }
  return mc.world.scoreboard.getObjective("act").addScore(target, value);
}

/**
 * atkテキストから剣を渡す関数
 * @param {mc.Player} player 
 * @param {String} atk 
 * @param {String | mc.RawMessage} name
 */
export function giveSword(player, atk, name){
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
      mc.world.sendMessage([
        (player.hasTag("red")?"§c":"§b")+player.nameTag+"§r:[", name, "]", {translate:`item.${sword.typeId.slice(10)}.name`}
      ])
    }
  }else{
    giveItem(player, sword);
    mc.world.sendMessage([
      (player.hasTag("red")?"§c":"§b")+player.nameTag+"§r:[", name, "]", {translate:`item.${sword.typeId.slice(10)}.name`}
    ])
  }
  return;
}

export const swordDamage = {
  wooden_sword: 5,
  stone_sword: 15,
  golden_sword: 20,
  iron_sword: 30,
  diamond_sword: 50,
  netherite_sword: 70
}

export const swordName = {
  wooden_sword: "木の剣",
  stone_sword: "石の剣",
  golden_sword: "金の剣",
  iron_sword: "鉄の剣",
  diamond_sword: "ダイヤモンドの剣",
  netherite_sword: "ネザライトの剣"
}

/**
 * 
 * @param {mc.Player} player 
 * @param {(mc.RawMessage | string)[] | mc.RawMessage | string} message 
 */
export function sendPlayerMessage(player, message){
  let text = [(player.hasTag("red")?"§c":"§b")+player.nameTag+"§r:"];
  if(Array.isArray(message)){
    text.push(...message);
  }
  else{
    text.push(message);
  }
  mc.world.sendMessage(text);
}