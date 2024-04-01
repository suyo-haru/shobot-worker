import ShobotCmdletBase from "../ShobotCmdlet";
import Cmdlets from ".";
import { searchCmdlet } from "../util";

export default class HelpCmdlet extends ShobotCmdletBase {
  static get commandAlias() {
    return ["help", "ヘルプ"];
  }
  static get commandName() {
    return "ヘルプ";
  }
  static get commandHelp() {
    return `しょんぼり君のヘルプを表示します。

　@しょぼん ヘルプ [コマンド]
　or @sbn help [コマンド]

もしくは
　@しょぼん ヘルプ [-hidden]
　or @sbn help [-h]

 [コマンド]は略式でも構いません。`;
  }

  async run(...arg: string[]) {
    if (arg.length < 1) {
      this.controller.enqueue({
        type: "text",
        text: `～ しょんぼり君のコマンド一覧 ～
"@しょぼん" …"@"と省略
@ ヘルプ [-h]
…コマンドの一覧を表示します。
@ ヘルプ <コマンド>
…<コマンド> についての詳細なヘルプを表示します。
@ ゲーム
…ゲームの一覧を表示します。
@ サーバー
…サーバーのステータスを表示します。
@ ゲーム決め
…ゲームを決めます。
@ Yes/No
…"Yes!"か"No!"のどちらかを返信します。
@ ダイス <最大数値>
…1～<最大数値>の中のランダムな数字を返信します。
@ Ver
…しょんぼり君のバージョン表示します。

その他のコマンド一覧は↓
"@しょぼん ヘルプ -h"を参照`,
      });
      return;
    } else if (arg.findIndex((value) => value.includes("-h")) > -1) {
      this.controller.enqueue({
        type: "text",
        text: `～ しょんぼり君の(隠し)コマンド一覧 ～
"@しょぼん" または "@sbn"
…"@"と省略
@ /kill
…しょんぼり君を強制退出させます。
@ timer
…時間を測ります。
@ talk
…？？？
@ profile
…プロファイル情報を取得します。`,
      });
      return;
    }

    const Cmdlet = searchCmdlet(Cmdlets, arg[0]);

    if (Cmdlet) {
      if (Cmdlet.commandHelp) {
        this.controller.enqueue({
          type: "text",
          text: Cmdlet.commandHelp,
        });
      } else {
        this.controller.enqueue({
          type: "text",
          text: "このコマンドの説明はありません。",
        });
      }
    } else {
      this.controller.enqueue({
        type: "text",
        text: "えらー！コマンド(" + arg[0] + ")なし！",
      });
    }
    return;
  }
}
