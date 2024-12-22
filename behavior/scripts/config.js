import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";


mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:config") return;
  /**
   * @type {{sourceEntity: mc.Player}}
   */
  const config_form = new ui.ModalFormData()
    .title("設定")
    .slider("制限時間", 30, 300, 10, mc.world.getDynamicProperty("time"))
    .slider("先攻ドロー", 1, 10, 1, mc.world.getDynamicProperty("first_draw"))
    .slider("後攻ドロー", 1, 10, 1, mc.world.getDynamicProperty("second_draw"))
    .slider("ターン開始時act", 1, 20, 1, mc.world.getDynamicProperty("start_act"))
    .slider("ターン終了時act", 1, 20, 1, mc.world.getDynamicProperty("end_act"))
    .toggle("イベントモード", mc.world.getDynamicProperty("event"));
  const {sourceEntity:player} = data;
  config_form.show(player).then(res=>{
    if(res.canceled) return;
    mc.world.setDynamicProperty("time", res.formValues[0]);
    mc.world.setDynamicProperty("first_draw", res.formValues[1]);
    mc.world.setDynamicProperty("second_draw", res.formValues[2]);
    mc.world.setDynamicProperty("start_act", res.formValues[3]);
    mc.world.setDynamicProperty("end_act", res.formValues[4]);
    mc.world.setDynamicProperty("event", res.formValues[5]);
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