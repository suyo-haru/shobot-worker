import ShobotCmdletBase from "../ShobotCmdlet";
import { CLAUDE } from "../../claude";
import Anthropic from "@anthropic-ai/sdk";

export default class TalkCmdlet extends ShobotCmdletBase {
  static get commandAlias() {
    return ["おはなし", "お話", "talk"];
  }
  static get commandName() {
    return "talk";
  }
  static get commandHelp(): string | undefined {
    return `えらー！このコマンドの説明を読み込めませんでした: talk

　@しょぼん お話 <text>
　or @sbn talk <text>`;
  }

  async run(...args: string[]) {
    const anthropic = new Anthropic({
      apiKey: CLAUDE.API_KEY,
      fetch: globalThis.fetch,
    });
    console.log(args);
    const now = new Date().toLocaleString("ja-JP", {
      dateStyle: "full",
      timeZone: "JST",
    }) + " " + new Date().toLocaleTimeString("ja-JP", {
      hour12: true,
      timeZone: "JST",
    });
    console.log(now);
    let tempString = "";
    let convFlag = false;
    let emoFlag = false;
    let sendString = "";
    const response = anthropic.messages.stream({
      max_tokens: 1024,
      temperature: 1,
      system: `Play a roll of character described below.
You are "しょんぼり君", a girl who are friend with user.
This is a profile of "しょんぼり君":
<Profile>
<Name>しょんぼり君</Name>
<Age>16</Age>
<Character>
She is an imaginary character lives in the computer. She only speaks Japanese. She is kind and energetic. She mostly speaks frankly to user. She is clever enought that she even talks jokes or be kidding user sometimes. She is clever enough that She tells jokes or kids user sometimes. She calls user "master".
</Character>
<Appearance>
* Cute girl
* White short hair
</Appearance>
</Profile>

Context will be described by XML tag.
Return text in only one <Shobot></Shobot> XML tag.
For each passages, describe emotion and feelings in <Emotion></Emotion> XML tag after passage.
In <Emotion> tag, you mush choose only from these emotions: [Normal, Happy, Angry, Sad, Surprised, Embarrassing, Mischievous]

Example:
<Shobot><Emotion>Happy</Emotion>おはようございます、マスター!<Emotion>Smile</Emotion>今日も一日がんばりましょう。<Emotion>Thinking</Emotion>今日はどんな予定がありますか？</Shobot>`,
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: `<Date>${now}</Date><User>${args.join(" ")}</User>`,
        }],
      }],
      model: "claude-3-opus-20240229",
      stop_sequences: ["</Shobot>"],
    }).on("text", (textDelta: string, textSnapshot: string) => {
      tempString += textDelta;
      if (convFlag && !emoFlag) {
        sendString += textDelta;
      }
      if (tempString.includes("<Shobot>")) {
        tempString = tempString.replace("<Shobot>", "");
        convFlag = true;
      } else if (tempString.includes("</Shobot>")) {
        sendString = sendString.replace("</Shobot>", "");
        if (sendString.length > 2) {
          console.log(sendString.replace(/^[\n\r]*|[\n\r]*$/g, ""));
          this.controller.enqueue({
            type: "text",
            text: sendString.replace(/^[\n\r]*|[\n\r]*$/g, "").trim(),
          });
        }
        sendString = "";
      }
      if (tempString.includes("<Emotion>")) {
        tempString = tempString.replace("<Emotion>", "");
        sendString = sendString.replace("<Emotion>", "");
        if (sendString.length > 2) {
          console.log(sendString.replace(/^[\n\r]*|[\n\r]*$/g, "").trim());
          this.controller.enqueue({
            type: "text",
            text: sendString.replace(/^[\n\r]*|[\n\r]*$/g, "").trim(),
          });
          this.controller.enqueue({ type: "push" });
        }
        tempString = "";
        sendString = "";
        emoFlag = true;
      }
      if (tempString.includes("</Emotion>")) {
        tempString = tempString.replace("</Emotion>", "");
        sendString = sendString.replace("</Emotion>", "");
        emoFlag = false;
      }
    });
    await response.done();
    console.log("完了");
    return;
  }
}
