import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import ffmpegPath from 'ffmpeg-static';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const uploadsDir = join(rootDir, 'uploads');
const rendersDir = join(rootDir, 'renders');
const port = Number(process.env.PORT || 8787);

await mkdir(uploadsDir, { recursive: true });
await mkdir(rendersDir, { recursive: true });

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(multipart, {
  limits: {
    fileSize: 300 * 1024 * 1024,
    files: 2
  }
});
await app.register(fastifyStatic, {
  root: rendersDir,
  prefix: '/videos/'
});

app.get('/health', async () => ({ ok: true }));

app.post('/api/render-video', async (request, reply) => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const videoPath = join(uploadsDir, `${id}-source`);
  const overlayPath = join(uploadsDir, `${id}-overlay.png`);
  const outputName = `${id}.mp4`;
  const outputPath = join(rendersDir, outputName);
  let layout = null;
  let start = 0;
  let duration = 0;

  for await (const part of request.parts()) {
    if (part.type === 'file' && part.fieldname === 'video') {
      await pipeline(part.file, createWriteStream(videoPath));
    } else if (part.type === 'file' && part.fieldname === 'overlay') {
      await pipeline(part.file, createWriteStream(overlayPath));
    } else if (part.type === 'field' && part.fieldname === 'layout') {
      layout = JSON.parse(String(part.value || '{}'));
    } else if (part.type === 'field' && part.fieldname === 'start') {
      start = Number(part.value) || 0;
    } else if (part.type === 'field' && part.fieldname === 'duration') {
      duration = Number(part.value) || 0;
    }
  }

  const frame = layout?.frame;
  if (!frame) {
    reply.code(400);
    return { error: 'layout.frame is required' };
  }

  await renderVideo({
    videoPath,
    overlayPath,
    outputPath,
    frame,
    start,
    duration
  });

  await Promise.allSettled([unlink(videoPath), unlink(overlayPath)]);

  return {
    status: 'done',
    videoUrl: `/videos/${outputName}`
  };
});

async function renderVideo({ videoPath, overlayPath, outputPath, frame, start, duration }) {
  const filter = [
    `[1:v]scale=${frame.width}:${frame.height}:force_original_aspect_ratio=increase`,
    `crop=${frame.width}:${frame.height}`,
    'setsar=1[vid]',
    `[0:v][vid]overlay=${frame.x}:${frame.y}:format=auto[outv]`
  ].join(',');

  const args = [
    '-y',
    '-loop',
    '1',
    '-i',
    overlayPath,
    '-ss',
    String(Math.max(0, start || 0)),
    ...(duration > 0 ? ['-t', String(duration)] : []),
    '-i',
    videoPath,
    '-filter_complex',
    filter,
    '-map',
    '[outv]',
    '-map',
    '1:a?',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-preset',
    'veryfast',
    '-crf',
    '18',
    '-shortest',
    outputPath
  ];

  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(ffmpegPath, args);
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(stderr || `ffmpeg exited with ${code}`));
      }
    });
  });

  await readFile(outputPath);
}

app.listen({ host: '0.0.0.0', port });
