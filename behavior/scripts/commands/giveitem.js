import * as mc from "@minecraft/server"
import { giveItem, myTimeout } from "../lib";

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const giveItemCommand = {
    name: "mcg:giveitem",
    description: "指定したプレイヤーに説明付きアイテムを与えます",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {name: "target", type:mc.CustomCommandParamType.PlayerSelector},
      {name: "item", type:mc.CustomCommandParamType.ItemType},
    ],
    optionalParameters: [
      {name: "quantity", type:mc.CustomCommandParamType.Integer}
    ]
  }
  data.customCommandRegistry.registerCommand(giveItemCommand, 
    /**
     * 
     * @param {mc.CustomCommandOrigin} origin 
     * @param {mc.Player[]} target 
     * @param {mc.ItemType} item 
     * @param {number} quantity 
     */
    (origin, target, item, quantity) => {
      target.forEach(t => {
        myTimeout(0, () => {
          giveItem(t, new mc.ItemStack(item), quantity ?? 1);
        })
      })
      return {
        status: mc.CustomCommandStatus.Success,
        message: `アイテム ${item.id} を ${target.length} 人のプレイヤーに与えました`
      }
  });
});