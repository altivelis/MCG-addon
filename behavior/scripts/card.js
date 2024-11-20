import * as mc from "@minecraft/server";
import { giveItem, handItem } from "./lib";
import { cardList } from "./cardinfo";

/**
 * カード使用関数
 * @param {mc.Block} cardBlock 
 * @param {mc.Player} player 
 */
export function useCard(cardBlock, player){
  const card = handItem(player);
  if(!card) return;
  switch(card.typeId){
    case "minecraft:wither_skeleton_skull":
  }
}