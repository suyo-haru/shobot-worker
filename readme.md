# Shobot-worker

## なにこれ

* 昔作ったチャットボットのリメイク

## 起動

```bash
npm install
npx wrangler dev
# or
bun install
bun x wrangler dev
```

起動後、 http://localhost:8787/api/reply でテストできる

コマンドの一覧は `./src/shobot/cmdlet` フォルダーを参照

## Backend

### Server

* Cloudflare Workers
  * Cloudflare D1
  * ~~Cloudflare KV~~

### Service

* LINE Messaging API
  * Webhookは /api/webhook 
