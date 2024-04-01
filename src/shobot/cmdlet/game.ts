import ShobotCmdletBase from "../ShobotCmdlet";
import { ShobotFlexMessage } from "../ShobotMessage";

const gameinfo: ShobotFlexMessage = {
  type: "flex",
  alt: "しょんぼり君のゲーム一覧(コマンド表)\n@sbn game 01...しょんぼり君とじゃんけん",
  alternative: {
    type: "text",
    text: ""
  },
  flex: {
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://media.shobot.suyoharu.net/image/game_01.png",
          "size": "full",
          "aspectRatio": "1.51:1",
          "backgroundColor": "#e1eec4"
        },
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "No. 1",
              "weight": "bold",
              "size": "md"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "しょんぼりじゃんけん",
              "size": "xl",
              "wrap": true,
              "weight": "bold"
            },
            {
              "type": "text",
              "text": "しょんぼり君とじゃんけんをします。",
              "wrap": true
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "style": "primary",
              "action": {
                "type": "message",
                "label": "プレイ",
                "text": "@しょぼん ゲーム しょんぼり君とじゃんけん"
              }
            }
          ]
        }
      },
      {
        "type": "bubble",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "その他",
              "weight": "bold"
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": "https://media.shobot.suyoharu.net/image/game_soon.png",
          "size": "full",
          "aspectRatio": "1.51:1",
          "backgroundColor": "#e3e3e3"
        },
        "body": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "spacer",
              "size": "md"
            },
            {
              "type": "text",
              "text": "Coming Soon...",
              "wrap": true,
              "size": "xl"
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "次の追加をお待ちください。",
              "size": "md",
              "align": "center",
              "color": "#bababa"
            },
            {
              "type": "spacer",
              "size": "xl"
            }
          ]
        }
      }
    ]
  }
}

export default class GameCmdlet extends ShobotCmdletBase {
  static get commandAlias(): string[] {
    return ["ゲーム", "game", "遊ぶ", "遊び"];
  }
  static get commandName(): string {
    return "game";
  }
  static get commandHelp(): string | undefined {
    return `しょんぼり君内でできるゲームを呼び出します。

　@しょぼん ゲーム [ゲームID等]
　or @sbn game [ゲームID等]

<ゲーム>コマンドを引数なしで送信すると
遊べるゲームの一覧が返信されます。`;
  }

  run(...args: string[]): Promise<void> | void {
    if(args[0]) {
      if(/(01|しょんぼり(|君と)じゃんけん|じゃんけん)/.test(args[0])) {
        this.controller.enqueue({type: "text", text: "調整中です(´・ω・`)"});
        return;
      }
      this.controller.enqueue({type: "text", text: "えらー！どのゲームかわかんないよ！"})
    } else {
      this.controller.enqueue(gameinfo);
    }
  }
}
