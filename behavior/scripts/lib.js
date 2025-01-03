import * as mc from "@minecraft/server";
import { cardList } from "./cardinfo";
import { mcg } from "./system";

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
 * @param {number} amount
 */
export function giveItem(player, item, amount = 1){
  if(item.typeId == "minecraft:banner"){
    if(player.runCommand("/loot spawn ~~~ loot ominous_banner")){
      player.dimension.getEntities({type:"minecraft:item"}).forEach(e => {
        /**@type {mc.ItemStack} */
        let itemstack = e.getComponent(mc.EntityItemComponent.componentId).itemStack;
        if(itemstack.typeId == "minecraft:banner" && itemstack.getLore().length == 0){
          itemstack.setLore(cardInfo(itemstack.typeId));
          e.dimension.spawnItem(itemstack, e.location);
          e.remove();
        }
      })
    }
    return;
  }
  if(cardInfo(item.typeId).length > 0){
    item.setLore(cardInfo(item.typeId));
  }
  for(let i=0; i<amount; i++){
    player.dimension.spawnItem(item, player.location).addTag("give");
  }
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
 * @param {Boolean} enhance 強化情報表示
 * @returns {String[]} カードテキスト
 */
export function cardInfo(name, enhance = false){
  const card = getCard(name);
  if(!card) return [];
  let text = [];
  if(card.type == "entity"){
    if(enhance) {
      text.push(`§3属性:${card.enhance.attribute}`);
      text.push(`§aHP§r:${card.enhance.hp} §cATK§r:${card.enhance.atk} §eSact§r:${card.enhance.Sact} §6Bact§r:${card.enhance.Bact}`);
      card.enhance.text.forEach(t => text.push(t));
    }
    else {
      text.push(`§3属性:${card.attribute}`);
      text.push(`§aHP§r:${card.hp} §cATK§r:${card.atk} §eSact§r:${card.Sact} §6Bact§r:${card.Bact}`);
      card.text.forEach(t => text.push(t));
    }
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
    target.applyDamage(5, {cause:mc.EntityDamageCause.suicide});
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
export function giveSword(player, atk, name="不明"){
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
    giveItem(player, sword, parseInt(texts[1]));
    mc.world.sendMessage([
      (player.hasTag("red")?"§c":"§b")+player.nameTag+"§r: [", name, "] ", {translate:`item.${sword.typeId.slice(10)}.name`}, " x", texts[1]
    ])
    // for(let i=0; i<parseInt(texts[1]); i++){
    //   giveItem(player, sword);
    //   mc.world.sendMessage([
    //     (player.hasTag("red")?"§c":"§b")+player.nameTag+"§r: [", name, "] ", {translate:`item.${sword.typeId.slice(10)}.name`}
    //   ])
    // }
  }else{
    giveItem(player, sword);
    mc.world.sendMessage([
      (player.hasTag("red")?"§c":"§b")+player.nameTag+"§r: [", name, "] ", {translate:`item.${sword.typeId.slice(10)}.name`}
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
 * 全体通知ログ関数
 * @param {mc.Player} player 
 * @param {(mc.RawMessage | string)[] | mc.RawMessage | string} message 
 */
export function sendPlayerMessage(player, message){
  let text = [(player.hasTag("red")?"§c":"§b")+player.nameTag+"§r: "];
  if(Array.isArray(message)){
    text.push(...message);
  }
  else{
    text.push(message);
  }
  mc.world.sendMessage(text);
}

/**
 * オブジェクト設置関数
 * @param {mc.Player} player 使用者
 * @param {String} blockid ブロックID
 */
export function setObject(player, blockid){
  if(getObject(player.hasTag("red")?"red":"blue")?.typeId == "minecraft:bee_nest" && blockid != "minecraft:bee_nest"){
    /**
     * @type {mc.Container}
     */
    let inv = player.getComponent(mc.EntityInventoryComponent.componentId).container;
    let test = false;
    for(let i=0; i<inv.size; i++){
      if(inv.getItem(i)?.typeId == "minecraft:honey_bottle"){
        test = true;
        addAct(player, 10 * inv.getItem(i).amount);
        inv.setItem(i);
        break;
      }
    }
    if(test) sendPlayerMessage(player, "[ミツバチの巣] ハチミツ入りの瓶をすべて消費しました");
  }
  mc.world.getDimension("minecraft:overworld").setBlockPermutation((player.hasTag("red")?mcg.const.red.slot.object:mcg.const.blue.slot.object), mc.BlockPermutation.resolve(blockid));
}

/**
 * オブジェクト取得関数
 * @param {String} tag 
 */
export function getObject(tag){
  return mc.world.getDimension("minecraft:overworld").getBlock(tag == "red" ? mcg.const.red.slot.object : mcg.const.blue.slot.object);
}

/**
 * 無敵時間対策用ダメージ適用関数
 * @param {mc.Entity | mc.Player} target 
 * @param {Number} value 
 * @param {mc.EntityApplyDamageByProjectileOptions | mc.EntityApplyDamageOptions} options
 */
export function applyDamage(target, value, options={cause:mc.EntityDamageCause.entityAttack}){
  let before = target.getComponent(mc.EntityHealthComponent.componentId).currentValue;
  if(getCard(target.typeId)?.attribute?.includes("残虐") && target.typeId != "minecraft:vex"){
    if(mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:vex", tags:[target.hasTag("red")?"red":"blue"]}).length > 0){
      value = Math.floor(value / 2.0);
    }
  }
  if(!target.applyDamage(value, options)) return;
  if(value > 0 && before == target.getComponent(mc.EntityHealthComponent.componentId).currentValue){
    myTimeout(1, ()=>{
      applyDamage(target, value, options);
    })
  }
}

/**
 * インベントリクリア関数
 * @param {mc.Player} player
 */
export function clearInventory(player){
  /**
   * @type {mc.Container}
   */
  let inv = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  for(let i=0; i<inv.size; i++){
    let item = inv.getItem(i);
    if(item?.typeId == "minecraft:book") continue;
    inv.setItem(i);
  }
}

/**
 * 対戦プレイヤー検知関数
 */
export function isOnline(){
  return (mc.world.getPlayers({tags:["red"]}).length > 0 && mc.world.getPlayers({tags:["blue"]}).length > 0);
}

/**
 * 直線上にパーティクルを等間隔で生成する関数
 * @param {mc.Dimension} dimension 
 * @param {mc.Vector3} from 
 * @param {mc.Vector3} to 
 * @param {String} particleName 
 * @param {Number} interval 
 */
export function lineParticle(dimension, from, to, particleName, interval){
  let vec = {x:to.x-from.x, y:to.y-from.y, z:to.z-from.z};
  let distance = Math.sqrt(vec.x**2 + vec.y**2 + vec.z**2);
  let count = Math.ceil(distance / interval);
  vec.x /= count; vec.y /= count; vec.z /= count;
  for(let i=0; i<count; i++){
    dimension.spawnParticle(particleName, {x:from.x+vec.x*i, y:from.y+vec.y*i, z:from.z+vec.z*i});
  }
  return;
}

/**
 * 体力増強レベル変更関数
 * @param {mc.Player} player 
 * @param {Number} value 
 */
export function changeHealthBoost(player, value){
  /**@type {mc.EntityHealthComponent} */
  let health = player.getComponent(mc.EntityHealthComponent.componentId);
  let beforeHp = health.currentValue;
  let currentLevel = player.getEffect(mc.EffectTypes.get("minecraft:health_boost"))?.amplifier;
  let level = (!currentLevel) ? value-1 : currentLevel + value;
  if(level < 0) return;
  player.removeEffect(mc.EffectTypes.get("minecraft:health_boost"));
  player.addEffect(mc.EffectTypes.get("minecraft:health_boost"), 20000000, {amplifier:level, showParticles:false});
  health.setCurrentValue(beforeHp);
}