import ShobotCmdletBase from "../ShobotCmdlet";

export default class EchoCmdlet extends ShobotCmdletBase {
  static get commandAlias(): string[] {
    return ["やまびこ", "echo"];
  }
  static get commandName(): string {
    return "echo";
  }
  static get commandHelp(): string | undefined {
    return `echoを返します。

　@しょぼん やまびこ <文章>
　or @sbn echo <文章>`;
  }

  run(...args: string[]): Promise<void> | void {
    if (args[0]) {
      this.controller.enqueue({ type: "text", text: args.join(" ") });
    } else this.controller.enqueue({ type: "text", text: "やほー。" });
  }
}
