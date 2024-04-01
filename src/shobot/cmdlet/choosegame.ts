import ShobotCmdletBase from "../ShobotCmdlet";

export default class ChooseGameCmdlet extends ShobotCmdletBase {
  static get commandAlias() {
    return ["choose", "ゲーム選", "ゲーム決め"];
  }
  static get commandName() {
    return "choosegame";
  }
  static get commandHelp() {
    return `ゲーム一覧の中から一つを選びます。

　@しょぼん ゲーム決め
　or @sbn choose
  
ゲーム一覧を参照するには
<リスト>コマンドを使用してください。`;
  }

  async run() {
    this.controller.enqueue({
      type: "text",
      text: [
        "Minecraft",
        "ToramOnline",
        "Milkchoco",
        "Something",
      ][Math.floor(Math.random() * 4)],
    });
    return;
  }
}
