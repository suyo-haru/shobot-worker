import ShobotCmdletBase from "../ShobotCmdlet";
import { waitTimeOut } from "../util";

export default class GreedingsCmdlet extends ShobotCmdletBase {
  static get commandAlias() {
    return ["あいさつ", "greedings"];
  }
  static get commandName() {
    return "greedings";
  }

  async run() {
    const greedings = (function (date: Date) {
      const jpHours = date.getUTCHours() + 9 > 24
        ? date.getUTCHours() + 9 - 24
        : date.getUTCHours() + 9;
      if (17 < jpHours || jpHours < 4) {
        return "こんばんは";
      } else if (jpHours >= 5) {
        return "おはよう";
      } else {
        return "こんにちは";
      }
    })(new Date());
    this.controller.enqueue({
      type: "text",
      text: `あ...えと、${greedings}。`,
    });
    this.controller.enqueue({ type: "push" });
    await waitTimeOut(3000);
    this.controller.enqueue({
      type: "text",
      text: `しょんぼり君、また新しくなったよ`,
    });
    this.controller.enqueue({ type: "push" });
    await waitTimeOut(2000);
    this.controller.enqueue({
      type: "text",
      text: `これからよろしくね？`,
    });
    return;
  }
}
