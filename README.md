# Welcome to InRPK bot!

## Set up

From your terminal:

```sh
npm install
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

Happens automatically via a GitHub hook to letoved.ru

If you change the telegram bot route, here is how to set the webhook:

```sh
curl \
  --request POST \
  --url https://api.telegram.org/bot<BOT_TOKEN>/setWebhook \
  --header 'content-type: application/json' \
  --data '{"url": "https://inrpk.letoved.ru/telegram/<ROUTE_SUFFIX>"}'
```

Take route suffix from the filename. Not the most secure way, but will do for the time being.
