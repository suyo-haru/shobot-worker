import ShobotCmdletBase from "../ShobotCmdlet";

export default class KillCmdlet extends ShobotCmdletBase {
  static get commandAlias(): string[] {
    return ["/kill"];
  }
  static get commandName(): string {
    return "kill";
  }
  static get commandHelp(): string | undefined {
    return `"しょんぼり君をトークルームやグループから退室させます。

　@しょぼん /kill`;
  }

  run(): Promise<void> | void {
    this.controller.enqueue({
      "type": "text",
      "text": "ぎゃああああああああああああああぁぁぁぁぁぁぁぁぁぁぁ",
    });
    this.controller.enqueue({ "type": "action", "action": "vanishbymyself" });
  }
}
