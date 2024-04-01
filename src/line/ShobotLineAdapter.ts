import type { EventSource, Message, WebhookRequestBody } from "@line/bot-sdk";
import Shobot from "../shobot/Shobot";
import { ShobotMessage } from "../shobot/ShobotMessage";
import { LINEMessageClient } from "./util";
import ShobotDataStore from "../shobot/ShobotDataStore";

export default async function ShobotLineAdapter(
  channelAccessToken: string,
  body: WebhookRequestBody,
  dataStore?: ShobotDataStore
) {
  const shobot = new Shobot(dataStore);
  await Promise.all(body.events.map(async (event) => {
    switch (event.type) {
      case "message":
        {
          switch (event.message.type) {
            case "text": {
              if (event.source.type !== "user") {
                if (/^[@＠](しょぼん|sbn)/.test(event.message.text)) {
                  await shobot.request(
                    "communicate",
                    event.message.text.replace(
                      /^[@＠](しょぼん|sbn)([ 　]|)/,
                      "",
                    ),
                  ).pipeTo(
                    new LINEShobotMessageStream(
                      channelAccessToken,
                      event.source,
                      event.replyToken,
                    ),
                  );
                }
              } else {
                await shobot.request("communicate", event.message.text).pipeTo(
                  new LINEShobotMessageStream(
                    channelAccessToken,
                    event.source,
                    event.replyToken,
                  ),
                );
              }
              break;
            }
          }
        }
        break;
      case "postback":
        {
          await shobot.request("select", event.postback.data).pipeTo(
            new LINEShobotMessageStream(
              channelAccessToken,
              event.source,
              event.replyToken,
            ),
          );
        }
        break;
      case "join":
        {
          await shobot.request("wake").pipeTo(
            new LINEShobotMessageStream(
              channelAccessToken,
              event.source,
              event.replyToken,
            ),
          );
        }
        break;
      case "follow":
        {
          await shobot.request("wake", "first").pipeTo(
            new LINEShobotMessageStream(
              channelAccessToken,
              event.source,
              event.replyToken,
            ),
          );
        }
        break;
    }
  }))
}

class LINEShobotMessageStream extends WritableStream<ShobotMessage> {
  constructor(
    channelAccessToken: string,
    eventSource: EventSource,
    replyToken?: string,
  ) {
    let messagesQueue: Message[] = [];
    const client = new LINEMessageClient(channelAccessToken, replyToken);
    super({
      async write(chunk, controller) {
        if (chunk.type === "push" && messagesQueue.length > 0) {
          try {
            await client.sendMessage(messagesQueue, eventSource);
          } catch (e) {
            controller.error(e);
          } finally {
            messagesQueue = [];
            console.log("Empty OK");
          }
          return;
        } else {
          switch (chunk.type) {
            case "text":
              messagesQueue.push({ type: "text", text: chunk.text });
              break;
            case "image":
              messagesQueue.push({
                type: "image",
                originalContentUrl: chunk.url,
                previewImageUrl: chunk.url,
              });
              break;
            case "anchor":
              break;
            case "flex":
              messagesQueue.push({
                type: "flex",
                altText: chunk.alt,
                contents: chunk.flex,
              });
              break;
            case "action":
              switch (chunk.action) {
                case "vanishbymyself":
                  if (messagesQueue.length > 0) {
                    try {
                      await client.sendMessage(messagesQueue, eventSource);
                    } catch (e) {
                      controller.error(e);
                    }
                  }
                  if (
                    eventSource.type === "group" || eventSource.type === "room"
                  ) {
                    let line_leave_endpoint: string;
                    if (eventSource.type === "group") {
                      line_leave_endpoint = "https://api.line.me/v2/bot/" +
                        eventSource.type + "/" + eventSource.groupId + "/leave";
                    } else {
                      line_leave_endpoint = "https://api.line.me/v2/bot/" +
                        eventSource.type + "/" + eventSource.roomId + "/leave";
                    }
                    await fetch(line_leave_endpoint, {
                      "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + channelAccessToken,
                      },
                      "method": "post",
                    });
                  }
                  break;
              }
              break;
          }
        }
      },
      async close() {
        if (messagesQueue.length > 0) {
          try {
            await client.sendMessage(messagesQueue, eventSource);
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log("no message sent");
        }
      },
    } as UnderlyingSink<ShobotMessage>);
  }
}
