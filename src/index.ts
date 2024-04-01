export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
  Shobot_KV: KVNamespace;
  Shobot_DB: D1Database;
  LINE_CHANNEL_SECRET: string | null;
  LINE_CHANNEL_ACCESS_TOKEN: string | null;
  CLAUDE_API_KEY: string | undefined;
}

//@ts-ignore
import indexPage from "./index.html";
//@ts-ignore
import inputPage from "./input.html";
import { validateSignature } from "./line/util";
import ShobotLineAdapter from "./line/ShobotLineAdapter";
import Shobot from "./shobot/Shobot";
import { ShobotMessageToHTMLTransformStream } from "./util";
import { CLAUDE } from "./claude";

const LAST_MODIFIYED_DATE = new Date(2024, 4, 1);
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    CLAUDE.API_KEY = env.CLAUDE_API_KEY ?? "";
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/api/webhook":
        {
          const bodyText = await request.text();
          if (request.method !== "POST") {
            return new Response("405 Method Not Allowed", {
              status: 405,
              headers: { "allow": "POST" },
            });
          } else if (!env.LINE_CHANNEL_SECRET) {
            return new Response("500 Internal Error", { status: 500 });
          } else if (
            !request.headers.has("x-line-signature") ||
            !validateSignature(
              bodyText,
              env.LINE_CHANNEL_SECRET,
              request.headers.get("x-line-signature")!,
            )
          ) {
            return new Response("400 Bad Request", { status: 400 });
          } else {
            console.log("Signature OK");
            ctx.waitUntil(
              ShobotLineAdapter(
                env.LINE_CHANNEL_ACCESS_TOKEN!,
                JSON.parse(bodyText),
              ),
            );
            return new Response("200 OK", { status: 200 });
          }
        }
        break;
      case "/api/reply": {
        if (request.method === "POST") {
          const shobot = new Shobot();
          return new Response(
            shobot.request("communicate", (await request.text()).replace(/text|おはなし|お話/, "")).pipeThrough(
              new ShobotMessageToHTMLTransformStream(),
            ).pipeThrough(new TextEncoderStream()),
          );
        } else if (request.method === "GET") {
        } else {
          return new Response("405 Method Not Allowed", {
            status: 405,
            headers: { "allow": "GET, POST" },
          });
        }
        return new Response(inputPage, {
          headers: {
            "Content-Type": "text/html",
            "Last-Modified": LAST_MODIFIYED_DATE.toUTCString(),
            "Cache-Control": "max-age=" + (60 * 60 * 24 * 7),
          },
        });
      }
      case "/":
        {
          if (
            request.headers.has("if-modified-since") &&
            (new Date(request.headers.get("If-Modified-Since")!) <=
              LAST_MODIFIYED_DATE)
          ) {
            return new Response(null, {
              status: 304,
              headers: {
                "Last-Modified": LAST_MODIFIYED_DATE.toUTCString(),
                "Cache-Control": "max-age=" + (60 * 60 * 24 * 7),
              },
            });
          }
          return new Response(indexPage, {
            headers: {
              "Content-Type": "text/html",
              "Last-Modified": LAST_MODIFIYED_DATE.toUTCString(),
              "Cache-Control": "max-age=" + (60 * 60 * 24 * 7),
            },
          });
        }
        break;
    }
    return new Response("404 Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env, unknown, unknown>;
