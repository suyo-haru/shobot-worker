import ShobotCmdletBase from "../ShobotCmdlet";

export default class DiceCmdlet extends ShobotCmdletBase {
  static get commandAlias(): string[] {
    return ["ダイス", "さいころ", "dice"];
  }
  static get commandName(): string {
    return "dice";
  }
  static get commandHelp(): string | undefined {
    return `ランダムな数値を返信します。

　@しょぼん ダイス [最大の数値]
　or @sbn dice [最大の数値]

[最大の数値]が指定されていない場合
1~6の数値を返信します。`;
  }

  run(...args: string[]): Promise<void> | void {
    if (args[0]) {
      this.controller.enqueue({
        type: "text",
        text: (Math.floor(Math.random() * parseInt(args[0])) + 1).toString(),
      });
    } else {this.controller.enqueue({
        type: "text",
        text: (Math.floor(Math.random() * 6) + 1).toString(),
      });}
  }
}
