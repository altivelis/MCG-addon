import * as mc from "@minecraft/server";
import { addAct, myTimeout, sendPlayerMessage } from "../lib";

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const addActCommand = {
    name: "mcg:addact",
    description: "指定したプレイヤーにactを追加します",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {name: "value", type:mc.CustomCommandParamType.Integer},
    ],
    optionalParameters: [
      {name: "target", type:mc.CustomCommandParamType.PlayerSelector}
    ]
  }
  data.customCommandRegistry.registerCommand(addActCommand, 
    /**
     * 
     * @param {mc.CustomCommandOrigin} origin 
     * @param {number} value 
     * @param {mc.Player[]} target 
     */
    (origin, value, target) => {
      if (!target) {
        if (origin.sourceEntity) {
          if (!origin.sourceEntity.hasTag("red") && !origin.sourceEntity.hasTag("blue")) {
            return {
              status: mc.CustomCommandStatus.Failure,
              message: "このコマンドはゲーム参加者のみが使用できます。"
            }
          }
          myTimeout(0, () => {
            addAct(origin.sourceEntity, value);
            sendPlayerMessage(origin.sourceEntity, `act+${value}`);
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
        let success = 0;
        target.forEach(t => {
          if (!t.hasTag("red") && !t.hasTag("blue")) {
            return;
          }
          myTimeout(0, () => {
            addAct(t, value);
            sendPlayerMessage(t, `act+${value}`);
          });
          success++;
        });
        if (success > 0) {
          return {
            status: mc.CustomCommandStatus.Success
          }
        } else {
          return {
            status: mc.CustomCommandStatus.Failure,
            message: "ターゲットが見つかりません"
          }
        }
      }
  });
});