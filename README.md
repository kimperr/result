# KIA Maker APK

Mobile app and video-render server for KIA result, lineup, roster, and video assets.

## Packages

- `apps/mobile`: Capacitor-ready mobile UI. It creates poster/video overlay assets in app and sends video render jobs to the server.
- `apps/video-server`: Node.js + ffmpeg render API.
- `packages/shared`: Shared constants and GitHub asset helpers.

## First Run

```bash
npm install
npm run dev:mobile
npm run dev:server
```

## Android APK Path

```bash
npm run build:mobile
npm run cap:add:android
npm run cap:sync
```

