import ShobotCmdletBase from "../ShobotCmdlet";

export default class VersionInfoCmdlet extends ShobotCmdletBase {
  static get commandAlias(): string[] {
    return ["Ver", "ver", "バージョン"];
  }
  static get commandName(): string {
    return "ver";
  }
  static get commandHelp(): string | undefined {
    return `しょんぼり君のバージョン情報と
変更ログを返信します。

　@しょぼん ver
　or @しょぼん ver [バージョン番号]
　or @しょぼん ver [-l]

[バージョン番号]を指定すると
そのバージョンの変更ログが表示されます。
また、-l オプションを指定すると
すべてのバージョン番号の一覧を表示できます。`;
  }

  run(...args: string[]): Promise<void> | void {
    if (args[0]) {
      if(args.findIndex((arg) => arg.includes("-l")) > -1) {
        this.controller.enqueue({ type: "text", text: "バージョン情報がありません" });
        return;
      } else {
        this.controller.enqueue({ type: "text", text: "バージョン情報がありません" });
      }
    } else {
      this.controller.enqueue({ type: "text", text: "バージョン: 2024.4.1(γ)" });
    }
  }
}
