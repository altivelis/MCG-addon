import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:config") return;
  /**
   * @type {{sourceEntity: mc.Player}}
   */
  const config_form = new ui.ModalFormData()
    .title("設定")
    .slider("制限時間", 30, 300, {valueStep:10, defaultValue:mc.world.getDynamicProperty("time")})
    .slider("先攻ドロー", 1, 10, {valueStep:1, defaultValue:mc.world.getDynamicProperty("first_draw")})
    .slider("後攻ドロー", 1, 10, {valueStep:1, defaultValue:mc.world.getDynamicProperty("second_draw")})
    .slider("ターン開始時act", 1, 20, {valueStep:1, defaultValue:mc.world.getDynamicProperty("start_act")})
    .slider("ターン終了時act", 1, 20, {valueStep:1, defaultValue:mc.world.getDynamicProperty("end_act")})
    .toggle("イベントモード", {defaultValue:mc.world.getDynamicProperty("event1")});
  const {sourceEntity:player} = data;
  config_form.show(player).then(res=>{
    if(res.canceled) return;
    mc.world.setDynamicProperty("time", res.formValues[0]);
    mc.world.setDynamicProperty("first_draw", res.formValues[1]);
    mc.world.setDynamicProperty("second_draw", res.formValues[2]);
    mc.world.setDynamicProperty("start_act", res.formValues[3]);
    mc.world.setDynamicProperty("end_act", res.formValues[4]);
    mc.world.setDynamicProperty("event1", res.formValues[5]);
    mc.world.sendMessage([
      "§e設定が変更されました\n",
      `§b制限時間§r: ${res.formValues[0]}秒\n`,
      `§b先攻ドロー§r: ${res.formValues[1]}回\n`,
      `§b後攻ドロー§r: ${res.formValues[2]}回\n`,
      `§bターン開始時act§r: ${res.formValues[3]}\n`,
      `§bターン終了時act§r: ${res.formValues[4]}\n`,
      `§bイベントモード§r: ${res.formValues[5]?"オン":"オフ"}\n`
    ]);
  })
})

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * @type {mc.CustomCommand}
   */
  const configCommand = {
    name: "mcg:config",
    description: "ゲームの設定を変更します",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [],
    optionalParameters: [],
  };
  data.customCommandRegistry.registerCommand(configCommand, (origin) => {
    if (origin.sourceEntity === undefined) {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "このコマンドはプレイヤーのみが使用できます。"
      }
    }
    mc.system.run(() => {
      /**
       * @type {{sourceEntity: mc.Player}}
       */
      const player = origin.sourceEntity;
      const config_form = new ui.ModalFormData()
        .title("設定")
        .slider("制限時間", 30, 300, {valueStep:10, defaultValue:mc.world.getDynamicProperty("time")})
        .slider("先攻ドロー", 1, 10, {valueStep:1, defaultValue:mc.world.getDynamicProperty("first_draw")})
        .slider("後攻ドロー", 1, 10, {valueStep:1, defaultValue:mc.world.getDynamicProperty("second_draw")})
        .slider("ターン開始時act", 1, 20, {valueStep:1, defaultValue:mc.world.getDynamicProperty("start_act")})
        .slider("ターン終了時act", 1, 20, {valueStep:1, defaultValue:mc.world.getDynamicProperty("end_act")})
        .toggle("イベントモード", {defaultValue:mc.world.getDynamicProperty("event1")});
      config_form.show(player).then(res=>{
        if(res.canceled) return;
        mc.world.setDynamicProperty("time", res.formValues[0]);
        mc.world.setDynamicProperty("first_draw", res.formValues[1]);
        mc.world.setDynamicProperty("second_draw", res.formValues[2]);
        mc.world.setDynamicProperty("start_act", res.formValues[3]);
        mc.world.setDynamicProperty("end_act", res.formValues[4]);
        mc.world.setDynamicProperty("event1", res.formValues[5]);
        mc.world.sendMessage([
          "§e設定が変更されました\n",
          `§b制限時間§r: ${res.formValues[0]}秒\n`,
          `§b先攻ドロー§r: ${res.formValues[1]}回\n`,
          `§b後攻ドロー§r: ${res.formValues[2]}回\n`,
          `§bターン開始時act§r: ${res.formValues[3]}\n`,
          `§bターン終了時act§r: ${res.formValues[4]}\n`,
          `§bイベントモード§r: ${res.formValues[5]?"オン":"オフ"}\n`
        ]);
      })
    })
    return {
      status: mc.CustomCommandStatus.Success,
      message: "設定フォームを開きました。"
    }
  })
})