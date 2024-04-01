import Cmdlets from "./cmdlet";
import { ShobotMessage } from "./ShobotMessage";
import ShobotDataStore from "./ShobotDataStore";
import GreedingsCmdlet from "./cmdlet/greedings";
import { searchCmdlet } from "./util";

export default class Shobot {
  constructor(userDataStore?: ShobotDataStore) {
  }

  request(event: "communicate" | "select" | "wake", arg?: string) {
    return new ShobotResponseStream(event, arg);
  }
}

class ShobotResponseStream extends ReadableStream<ShobotMessage> {
  constructor(event: "communicate" | "select" | "wake", arg?: string) {
    super({
      async start(controller) {
        if (event === "communicate") {
          if (!arg || arg.length < 2) {
            controller.enqueue({
              type: "text",
              text: [
                "どしたー?",
                "なんか用?",
                "(´・ω・`)",
              ][Math.floor(Math.random() * 3)],
            });
            controller.close();
            return;
          }
          const argArray = arg.split(/[ 　]/);

          const Cmdlet = searchCmdlet(Cmdlets, argArray[0]);

          if (Cmdlet) {
            await new Cmdlet(controller).run(...argArray.slice(1));
            controller.close();
            return;
          } else {
            controller.enqueue({
              type: "text",
              text: "えらー！こまんどない！ヘルプ見て！",
            });
          }
          controller.close();
        } else if (event === "select") {
          controller.close();
          return;
        } else if (event === "wake") {
          if (arg && arg === "first") {
            await new GreedingsCmdlet(controller).run();
          } else {
            controller.enqueue({ type: "text", text: "呼んだ(´・ω・`)?" });
          }
          controller.close();
          return;
        }
      },
    });
  }
}
