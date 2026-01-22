import * as mc from "@minecraft/server";
import { cardList } from "./cardinfo";
import { mcg } from "./system";
import { SWORD_DAMAGE_MAP, SWORD_NAMES } from "./constants";
import { getAllOpponentMobs, getAllTeamMobs, getOpponentPlayers, giveItemWithMessage } from "./card-helpers";
import { cardLibrary } from "./cardbook";

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
 * アイテム個数を取得する関数
 * @param {mc.Player} player 
 * @param {String} item 
 * @returns {number}
 */
export function getItemCount(player, item) {
  /**
   * @type {mc.Container}
   */
  const container = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  let count = 0;
  for(let i=0; i<container.size; i++){
    const itemStack = container.getItem(i);
    if(itemStack?.typeId == item) {
      count += itemStack.amount;
    }
  }
  return count;
}

/**
 * スロットからアイテムを指定した数減らす関数
 * @param {mc.Player} player 
 * @param {Number} index 
 * @param {Number} amount 減らす数（デフォルト: 1）
 * @returns {Number} 実際に減らした数
 */
export function decrementSlot(player, index, amount = 1){
  /**
   * @type {mc.Container}
   */
  const container = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  const item = container.getItem(index);
  if(!item || amount <= 0) return 0;
  
  const decrementAmount = Math.min(amount, item.amount);
  
  if(item.amount > decrementAmount){
    item.amount -= decrementAmount;
    container.setItem(index, item);
  }
  else{
    container.setItem(index);
  }
  
  return decrementAmount;
}

/**
 * インベントリから指定した数のアイテムを減らす関数
 * @param {mc.Player} player 
 * @param {String} item 
 * @param {Number} amount 減らす数（デフォルト: 1）
 * @returns {Number} 実際に減らした数
 */
export function decrementContainer(player, item, amount = 1){
  /**
   * @type {mc.Container}
   */
  const container = player.getComponent(mc.EntityInventoryComponent.componentId).container;
  let remainingAmount = amount;
  let totalDecremented = 0;
  
  for(let i = 0; i < container.size && remainingAmount > 0; i++){
    if(container.getItem(i)?.typeId == item){
      const decremented = decrementSlot(player, i, remainingAmount);
      totalDecremented += decremented;
      remainingAmount -= decremented;
    }
  }
  
  return totalDecremented;
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
    applyDamage(target, 5, {cause:mc.EntityDamageCause.none});
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
  }else{
    giveItem(player, sword);
    mc.world.sendMessage([
      (player.hasTag("red")?"§c":"§b")+player.nameTag+"§r: [", name, "] ", {translate:`item.${sword.typeId.slice(10)}.name`}
    ])
  }
  return;
}

// DEPRECATED: これらの定数はconstants.jsに移動されました
// 後方互換性のため再エクスポート
export const swordDamage = SWORD_DAMAGE_MAP;
export const swordName = SWORD_NAMES;

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
    let honey_count = 0;
    for(let i=0; i<inv.size; i++){
      if(inv.getItem(i)?.typeId == "minecraft:honey_bottle"){
        honey_count += inv.getItem(i).amount;
        addAct(player, 10 * inv.getItem(i).amount);
        inv.setItem(i);
      }
    }
    if(honey_count > 0) sendPlayerMessage(player, "[ミツバチの巣] ハチミツ入りの瓶をすべて消費しました");
  }
  mc.world.getDimension("minecraft:overworld").setBlockPermutation((player.hasTag("red")?mcg.const.red.slot.object:mcg.const.blue.slot.object), mc.BlockPermutation.resolve(blockid));
  mc.world.getDimension("minecraft:overworld").spawnParticle("mcg:knockback_roar_particle", player.hasTag("red")?mcg.const.red.slot.object:mcg.const.blue.slot.object, createColor(player.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue));
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
 * @param {Number} maxRetries 最大再試行回数（内部使用）
 */
export async function applyDamage(target, value, options={cause:mc.EntityDamageCause.entityAttack}, maxRetries = 100){
  // エンティティの有効性チェック
  if(!target || !target.isValid) return;
  if(target.getDynamicProperty("lastDamageTick") !== undefined && target.getDynamicProperty("lastDamageTick") > mc.system.currentTick - 10 && maxRetries > 0) {
    await mc.system.waitTicks(1);
    await applyDamage(target, value, options, maxRetries - 1);
    return;
  }

  const healthComponent = target.getComponent(mc.EntityHealthComponent.componentId);
  if(!healthComponent) return;
  
  const before = healthComponent.currentValue;
  
  // 旧ヴェックスダメージ半減処理
  // if(getCard(target.typeId)?.attribute?.includes("残虐") && target.typeId != "minecraft:vex"){
  //   if(mc.world.getDimension("minecraft:overworld").getEntities({type:"minecraft:vex", tags:[target.hasTag("red")?"red":"blue"]}).length > 0){
  //     value = Math.floor(value / 2.0);
  //   }
  // }
  
  if(target instanceof mc.Player) {
    // トーテム発動処理
    if(before - value <= 0) {
      let inv = target.getComponent(mc.EntityInventoryComponent.componentId).container;
      let totemCount = 0;
      for(let i=0; i<inv.size; i++) {
        let item = inv.getItem(i);
        if(item?.typeId == "mcg:totem") {
          totemCount += item.amount;
          inv.setItem(i);
        }
      }
      if(totemCount > 0) {
        healthComponent.setCurrentValue(Math.min(totemCount, healthComponent.effectiveMax));
        mc.world.sendMessage([target.nameTag, `に${value}ダメージ!`]);
        sendPlayerMessage(target, `[トーテム] 蘇生 +${totemCount}HP`)
        target.dimension.spawnParticle("minecraft:totem_particle", target.location)
        target.dimension.spawnParticle("minecraft:totem_manual", target.location)
        target.dimension.playSound("random.totem", target.location, {volume: 10})
        return;
      }
    }
  }
  
  // ダメージを適用
  target.applyDamage(value, options);

  // ダメージ適用後のHP取得
  const after = healthComponent.currentValue;
  // mc.world.sendMessage(`${after.toString()}`);
  if(target instanceof mc.Player) {
    if(after <= 15 && !target.hasTag("genocide")){
      target.addTag("genocide");
      target.sendMessage("残虐カードがドロー可能になりました");
      target.onScreenDisplay.setTitle("§c不吉な予感がする...");
      target.playSound("raid.horn", {location:target.location, volume:0.1});
    }
  }
  
  // 無敵時間でダメージが入らなかった場合、再試行
  // 条件: ダメージ値が正、HP変化量不足、対象が生存中、再試行回数が残っている
  if(value > 0 && before-value != after && after > 0 && maxRetries > 0){
    await mc.system.waitTicks(1);
    await applyDamage(target, value - (before - after), options, maxRetries - 1);
    return;
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
 * @param {mc.MolangVariableMap} molang
 */
export function lineParticle(dimension, from, to, particleName, interval, molang = undefined){
  let vec = {x:to.x-from.x, y:to.y-from.y, z:to.z-from.z};
  let distance = Math.sqrt(vec.x**2 + vec.y**2 + vec.z**2);
  let count = Math.ceil(distance / interval);
  vec.x /= count; vec.y /= count; vec.z /= count;
  for(let i=0; i<count; i++){
    dimension.spawnParticle(particleName, {x:from.x+vec.x*i, y:from.y+vec.y*i, z:from.z+vec.z*i}, molang);
  }
  return;
}

/**
 * 体力増強レベル変更関数
 * @param {mc.Player} player 
 * @param {Number} value 
 * @param {Boolean} force 強制変更フラグ
 */
export function changeHealthBoost(player, value, force=false){
  /**@type {mc.EntityHealthComponent} */
  let health = player.getComponent(mc.EntityHealthComponent.componentId);
  let beforeHp = health.currentValue;
  let level = value - 1;
  if (!force) {
    let currentLevel = player.getEffect(mc.EffectTypes.get("minecraft:health_boost"))?.amplifier;
    level = (!currentLevel) ? value - 1 : currentLevel + value;
  }
  if(level < 0) {
    player.removeEffect(mc.EffectTypes.get("minecraft:health_boost"));
    return;
  }
  player.removeEffect(mc.EffectTypes.get("minecraft:health_boost"));
  player.addEffect(mc.EffectTypes.get("minecraft:health_boost"), 20000000, {amplifier:level, showParticles:false});
  health.setCurrentValue(beforeHp);
}

/**
 * パーティクル用変数生成関数
 * @param {mc.RGB} color
 */
export function createColor(color){
  let variable = new mc.MolangVariableMap();
  variable.setColorRGB("variable.color", color);
  return variable;
}

/**
 * エンティティの表示名を取得（プレイヤーはnameTag、それ以外は翻訳キー）
 * @param {mc.Entity | mc.Player} entity
 * @returns {(mc.RawMessage | string)[]}
 */
export function getEntityDisplayName(entity){
  /**@type {(mc.RawMessage | string)} */
  let name = entity.typeId === "minecraft:player" ? entity.nameTag : { translate: entity.localizationKey };
  if(!entity.hasTag("enhance")) {
    return [name];
  }
  let enhanceList = ["zombie", "skeleton", "creeper", "witch"];
  if(enhanceList.includes(entity.typeId.slice(10))) {
    if(entity.typeId === "minecraft:witch") {
      return [{translate: entity.localizationKey}, "ロード"]
    } else {
      return ["エンハンス", {translate: entity.localizationKey}];
    }
  }
  return [name];
}

/**
 * プレイヤーのカラーコード付き名前を取得
 * @param {mc.Player} player
 * @returns {string}
 */
export function getPlayerColoredName(player){
  const colorCode = player.hasTag("red") ? "§c" : "§b";
  return colorCode + player.nameTag + "§r";
}

/**
 * 残り時間設定関数
 * @param {number} time 
 */
export function setTime(time){
  mc.world.scoreboard.getObjective("time").setScore("timer", time)
}

/**
 * 残り時間取得関数
 * @returns {number}
 */
export function getTime(){
  return mc.world.scoreboard.getObjective("time").getScore("timer");
}

/**
 * 残り時間進行関数
 */
export function progressTime(){
  return mc.world.scoreboard.getObjective("time").addScore("timer", -1);
}

/**
 * * @param {string} key ハッシュ化する文字列
 * @param {number} [seed=0] シード値 (オプション)
 * @returns {number} 32ビット整数のハッシュ値
 */
export function createHash(key, seed = 0) {
  function rotl32(val, bits) {
    return (val << bits) | (val >>> (32 - bits));
  }
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  const r1 = 15;
  const r2 = 13;
  const m = 5;
  const n = 0xe6546b64;

  let hash = seed;
  let len = key.length;
  let i = 0;
  const nblocks = Math.floor(len / 4);
  
  for (i = 0; i < nblocks; i++) {
    const i_4 = i * 4;
    let k = (key.charCodeAt(i_4) & 0xff) |
            ((key.charCodeAt(i_4 + 1) & 0xff) << 8) |
            ((key.charCodeAt(i_4 + 2) & 0xff) << 16) |
            ((key.charCodeAt(i_4 + 3) & 0xff) << 24);
    k = Math.imul(k, c1);
    k = rotl32(k, r1);
    k = Math.imul(k, c2);
    hash ^= k;
    hash = rotl32(hash, r2);
    hash = Math.imul(hash, m) + n;
  }
  const tail = key.substring(nblocks * 4);
  let k1 = 0;
  switch (tail.length) {
    case 3:
      k1 ^= (tail.charCodeAt(2) & 0xff) << 16;
    case 2:
      k1 ^= (tail.charCodeAt(1) & 0xff) << 8;
    case 1:
      k1 ^= (tail.charCodeAt(0) & 0xff);
      k1 = Math.imul(k1, c1);
      k1 = rotl32(k1, r1);
      k1 = Math.imul(k1, c2);
      hash ^= k1;
  }
  hash ^= len;
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

/**
 * ウーパールーパー処理
 * @param {mc.Player} attacker 
 * @param {number} damage 
 * @returns 
 */
export function axolotlEffect(attacker, damage) {
  // ウーパールーパー処理
  if (damage < 20) return;
  const axolotls = getAllTeamMobs(attacker, {type: "minecraft:axolotl"});
  axolotls.forEach(entity => {
    giveItemWithMessage(attacker, "minecraft:heart_of_the_sea", 1, "海洋の心");
    sendPlayerMessage(attacker, `[ウーパールーパー] 海洋の心を1つ獲得しました`);
    lineParticle(entity.dimension, entity.location, attacker.location, "mcg:custom_explosion_emitter", 1.0, createColor(attacker.hasTag("red")?mcg.const.rgb.red:mcg.const.rgb.blue))
  })
}

/**
 * IDからカード情報を取得する（cardLibraryから、旧関数のレガシー互換性のため）
 * @param {string} cardId - カードID
 * @returns {Object|null} カード情報（見つからない場合はnull）
 */
export function getCardById(cardId) {
  // 新しい構造では、cardLibraryには文字列のIDのみが格納されている
  // カードが存在するかチェックして、存在すればID情報を含むオブジェクトを返す
  for (const category of Object.values(cardLibrary)) {
    if (Array.isArray(category)) {
      if (category.includes(cardId)) {
        return { id: cardId, name: getDisplayName(cardId) };
      }
    } else {
      for (const subCategory of Object.values(category)) {
        if (subCategory.includes(cardId)) {
          return { id: cardId, name: getDisplayName(cardId) };
        }
      }
    }
  }
  return null;
}

/**
 * IDから表示名を取得する（cardinfo.jsのdisplayNameから）
 * @param {string} cardId - カードID
 * @returns {string} 表示名（見つからない場合は「不明なカード」）
 */
export function getDisplayName(cardId) {
  const card = getCard(cardId);
  if (card && card.displayName) {
    return card.displayName;
  }
  return "不明なカード";
}

/**
 * エンティティを回復する
 * @param {mc.Entity} entity
 * @param {number} amount 回復量
 */
export function healEntity(entity, amount) {
  /**@type {mc.EntityHealthComponent} */
  let health = entity.getComponent(mc.EntityHealthComponent.componentId);
  if (!health) return;
  let newHp = Math.min(health.currentValue + amount, health.effectiveMax);
  health.setCurrentValue(newHp);
}

/**
 * 
 * @param {string} itemType 
 * @param {mc.Container} container 
 */
export function findItem(itemType, container) {
  for (let i=0; i<container.size; i++) {
    if(container.getItem(i)?.typeId == itemType) {
      return i;
    }
  }
  return undefined;
}