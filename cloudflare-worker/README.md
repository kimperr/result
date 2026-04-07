# KBO Worker

Cloudflare Worker proxy for the roster-moves importer.

## Deploy

1. Install dependencies.
2. Authenticate Wrangler.
3. Deploy the worker.

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler deploy
```

After deploy, copy the generated `https://...workers.dev` URL into the app's `API URL` field.

## API

`GET /api/kbo/roster-moves?date=YYYY-MM-DD&team=KIA`

Example:

```text
https://your-worker.workers.dev/api/kbo/roster-moves?date=2026-04-04&team=KIA
```
