import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

const config_form = new ui.ModalFormData()
  .title("設定")
  .slider("制限時間", 30, 300, 10, mc.world.getDynamicProperty("time"))
  .slider("先攻ドロー", 1, 10, 1, mc.world.getDynamicProperty("first_draw"))
  .slider("後攻ドロー", 1, 10, 1, mc.world.getDynamicProperty("second_draw"))

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id != "mcg:config") return;
  /**
   * @type {{sourceEntity: mc.Player}}
   */
  const {sourceEntity:player} = data;
  config_form.show(player).then(res=>{
    if(res.canceled) return;
    mc.world.setDynamicProperty("time", res.formValues[0]);
    mc.world.setDynamicProperty("first_draw", res.formValues[1]);
    mc.world.setDynamicProperty("second_draw", res.formValues[2]);
    mc.world.sendMessage([
      "§e設定が変更されました\n",
      `§b制限時間§r: ${res.formValues[0]}秒\n`,
      `§b先攻ドロー§r: ${res.formValues[1]}回\n`,
      `§b後攻ドロー§r: ${res.formValues[2]}回`
    ]);
  })
})