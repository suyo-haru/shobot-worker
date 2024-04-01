import ShobotCmdletBase from "../ShobotCmdlet";

export default class YesNoCmdlet extends ShobotCmdletBase {
  static get commandAlias(): string[] {
    return ["yes/no", "yes／no", "yesno", "二択", "○×", "マルバツ"];
  }
  static get commandName(): string {
    return "yesno";
  }
  static get commandHelp(): string | undefined {
    return `"〇!"か"×!"のどちらかを返信します。

　@しょぼん 二択
　or @しょぼん マルバツ
　or @sbn 〇×
　or @sbn yes/no`;
  }

  run(): Promise<void> | void {
    this.controller.enqueue({
      type: "text",
      text: ["〇!", "×!"][Math.floor(Math.random() * 2)],
    });
  }
}
