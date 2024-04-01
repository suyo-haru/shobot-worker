import ShobotCmdletBase from "../ShobotCmdlet";
import { waitTimeOut } from "../util";

export default class TimerCmdlet extends ShobotCmdletBase {
  static get commandAlias() {
    return ["timer", "タイマー"];
  }
  static get commandName() {
    return "timer";
  }

  static get commandHelp() {
    return `短いタイマーを設定します。

　@しょぼん タイマー [秒数]
　or @sbn timer [秒数]

[秒数]は1~30(秒)までの数値です。`;
  }

  async run(...args: string[]) {
    if (args.length < 1) {
      this.controller.enqueue({
        type: "text",
        text: "えらー！秒数が指定されてない！",
      });
      return;
    }
    if (isNaN(parseInt(args[0]))) {
      this.controller.enqueue({
        type: "text",
        text: "えらー！秒数がよくわかんない！",
      });
      return;
    }
    if (parseInt(args[0]) > 30) {
      this.controller.enqueue({
        type: "text",
        text: "えらー！秒数は30秒以下で！",
      });
      return;
    }
    await waitTimeOut(parseFloat(args[0]) * 1000);
    this.controller.enqueue({
      type: "text",
      text: `${parseFloat(args[0])}秒が経過したよ。`,
    });
    return;
  }
}
