import * as mc from "@minecraft/server";
import { applyDamage, myTimeout } from "../lib";

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const applyDamageCommand = {
    name: "mcg:applydamage",
    description: "指定したプレイヤーにダメージを与えます",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {name: "damage", type:mc.CustomCommandParamType.Integer},
    ],
    optionalParameters: [
      {name: "target", type:mc.CustomCommandParamType.EntitySelector}
    ]
  }
  data.customCommandRegistry.registerCommand(applyDamageCommand, 
    /**
     * 
     * @param {mc.CustomCommandOrigin} origin 
     * @param {number} damage 
     * @param {mc.Entity[]} target 
     */
    (origin, damage, target) => {
      if (!target) {
        if (origin.sourceEntity) {
          myTimeout(0, () => {
            applyDamage(origin.sourceEntity, damage);
          });
          return {
            status: mc.CustomCommandStatus.Success
          }
        } else {
          return {
            status: mc.CustomCommandStatus.Failure,
            message: "ターゲットが見つかりません"
          }
        }
      } else {
        target.forEach(t => {
          myTimeout(0, () => {
            applyDamage(t, damage);
          });
        })
        return {
          status: mc.CustomCommandStatus.Success
        }
      }
  });
});