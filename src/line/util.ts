function base64ToArrayBuffer(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export async function validateSignature(
  body: string | ArrayBuffer,
  channelSecret: string,
  base64Signature: string,
) {
  const _body = typeof body === "string"
    ? new TextEncoder().encode(body)
    : body;
  return crypto.subtle.verify(
    "HMAC",
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(channelSecret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      true,
      ["verify"],
    ),
    base64ToArrayBuffer(base64Signature),
    _body,
  );
}

import type { EventSource, Message, WebhookRequestBody } from "@line/bot-sdk";
export function validateBody(json: any) {
  return json as WebhookRequestBody;
}

export class LINEMessageClient {
  static readonly #LINE_ReplyEndpoint =
    "https://api.line.me/v2/bot/message/reply";
  static readonly #LINE_PushEndpoint =
    "https://api.line.me/v2/bot/message/push";

  #CHANNEL_ACCESS_TOKEN: string;
  #hasSentReplyMessage: boolean;
  #replyToken?: string;

  constructor(channelAccessToken: string, replyToken?: string) {
    this.#CHANNEL_ACCESS_TOKEN = channelAccessToken;
    if (replyToken) {
      this.#hasSentReplyMessage = false;
      this.#replyToken = replyToken;
    } else {
      this.#hasSentReplyMessage = true;
    }
  }

  async sendMessage(messages: Array<Message>, eventSource: EventSource) {
    if (!this.#hasSentReplyMessage) {
      await this.sendReplyMessage(messages);
      this.#hasSentReplyMessage = true;
    } else {
      switch (eventSource.type) {
        case "user":
          await this.sendPushMessage(messages, eventSource.userId);
          break;
        case "group":
          await this.sendPushMessage(messages, eventSource.groupId);
          break;
        case "room":
          await this.sendPushMessage(messages, eventSource.roomId);
          break;
      }
    }
  }

  async sendReplyMessage(messages: Array<Message>) {
    const response = await fetch(LINEMessageClient.#LINE_ReplyEndpoint, {
      "headers": {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + this.#CHANNEL_ACCESS_TOKEN,
      },
      "method": "POST",
      "body": JSON.stringify({
        "replyToken": this.#replyToken,
        "messages": messages,
        "notificationDisabled": true,
      }),
    });
    if (!response.ok) {
      console.log("Send Failed: " + await response.text());
      throw Error("Send Failed: " + await response.text());
    } else {
      return;
    }
  }

  async sendPushMessage(messgaes: Array<Message>, id: string) {
    const response = await fetch(LINEMessageClient.#LINE_PushEndpoint, {
      "headers": {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + this.#CHANNEL_ACCESS_TOKEN,
      },
      "method": "POST",
      "body": JSON.stringify({
        "to": id,
        "messages": messgaes,
        "notificationDisabled": true,
      }),
    });
    if (!response.ok) {
      console.log("Send Failed: " + await response.text());
      throw Error("Send Failed: " + await response.text());
    } else {
      return;
    }
  }
}
