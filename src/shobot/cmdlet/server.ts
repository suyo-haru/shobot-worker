import ShobotCmdletBase from "../ShobotCmdlet";

export default class ServerManageCmdlet extends ShobotCmdletBase {
  static get commandAlias(): string[] {
    return ["サーバー", "server"];
  }
  static get commandName(): string {
    return "server";
  }
  static get commandHelp(): string | undefined {
    return `サーバーのステータスを返します。

　@しょぼん サーバー
　or @sbn server`;
  }

  run(...args: string[]): Promise<void> | void {
    this.controller.enqueue({ type: "text", text: "実装中です(´・ω・`)" });
  }
}
