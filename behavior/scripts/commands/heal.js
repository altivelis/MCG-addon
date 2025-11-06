import * as mc from "@minecraft/server";
import { myTimeout, sendPlayerMessage } from "../lib";

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const healCommand = {
    name: "mcg:heal",
    description: "指定したプレイヤーを回復させます",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {name: "value", type:mc.CustomCommandParamType.Integer},
    ],
    optionalParameters: [
      {name: "target", type:mc.CustomCommandParamType.EntitySelector}
    ]
  }
  data.customCommandRegistry.registerCommand(healCommand, 
    /**
     * 
     * @param {mc.CustomCommandOrigin} origin 
     * @param {number} value 
     * @param {mc.Entity[]} target 
     */
    (origin, value, target) => {
      if (!target) {
        if (origin.sourceEntity) {
          myTimeout(0, () => {
            let health = origin.sourceEntity.getComponent(mc.EntityHealthComponent.componentId);
            health.setCurrentValue(Math.min(health.currentValue + value, health.effectiveMax));
            sendPlayerMessage(origin.sourceEntity, `HP+${value}`);
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
            let health = t.getComponent(mc.EntityHealthComponent.componentId);
            health.setCurrentValue(Math.min(health.currentValue + value, health.effectiveMax));
            sendPlayerMessage(t, `HP+${value}`);
          });
        })
        return {
          status: mc.CustomCommandStatus.Success
        }
      }
  });
});