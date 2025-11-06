import * as mc from "@minecraft/server";
import { getTime, myTimeout, setTime } from "../lib";

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const addTimeCommand = {
    name: "mcg:addtime",
    description: "制限時間を追加します",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {name: "value", type:mc.CustomCommandParamType.Integer},
    ],
    optionalParameters: [
    ]
  }
  data.customCommandRegistry.registerCommand(addTimeCommand, 
    /**
     * 
     * @param {mc.CustomCommandOrigin} origin 
     * @param {number} value 
     */
    (origin, value) => {
      if (mc.world.getDynamicProperty("status") != 2) {
        return {
          status: mc.CustomCommandStatus.Failure,
          message: "ゲーム進行中のみ使用できます。"
        }
      }
      myTimeout(0, () => {
        setTime(getTime() + value);
      })
      return {
        status: mc.CustomCommandStatus.Success,
        message: `制限時間を${value}秒追加しました`
      }
  });
});

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const setTimeCommand = {
    name: "mcg:settime",
    description: "制限時間を設定します",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {name: "value", type:mc.CustomCommandParamType.Integer},
    ],
    optionalParameters: [
    ]
  }
  data.customCommandRegistry.registerCommand(setTimeCommand,
    /**
     * @param {mc.CustomCommandOrigin} origin
     * @param {number} value
     */
    (origin, value) => {
      if (mc.world.getDynamicProperty("status") != 2) {
        return {
          status: mc.CustomCommandStatus.Failure,
          message: "ゲーム進行中のみ使用できます。"
        }
      }
      myTimeout(0, () => {
        setTime(value);
      })
      return {
        status: mc.CustomCommandStatus.Success,
        message: `制限時間を${value}秒に設定しました`
      } 
    }
  )
})