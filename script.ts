import cors from '@fastify/cors';
import { createCanvas } from 'canvas';
import Fastify from 'fastify';
import GIFEncoder from 'gifencoder';

const fastify = Fastify();
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.get('/countdown', async (req, reply) => {
  const encoder = new GIFEncoder(400, 75); // Dimensions augmentées
  const canvas = createCanvas(400, 75);
  const ctx = canvas.getContext('2d');

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000);
  encoder.setQuality(10);

  reply.header('Content-Type', 'image/gif').send(encoder.createReadStream());

  let endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + 60); // 60 secondes à partir de maintenant

  for (let i = 0; i < 60; i++) {
    const simulatedTime = new Date(endTime.getTime() - i * 1000);
    const now = new Date();
    const diff = simulatedTime.getTime() - now.getTime();

    const days = String(Math.floor(diff / 86400000)).padStart(2, '0');
    const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 75);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`${days} :`, 40, 30);
    ctx.fillText(`${hours} :`, 140, 30);
    ctx.fillText(`${minutes} :`, 240, 30);
    ctx.fillText(seconds, 340, 30);

    ctx.font = '10px Arial';
    ctx.fillText('JOURS', 45, 50);
    ctx.fillText('HEURES', 145, 50);
    ctx.fillText('MINUTES', 245, 50);
    ctx.fillText('SECONDES', 345, 50);

    // @ts-ignore
    encoder.addFrame(ctx);
  }

  encoder.finish();
});

// Run the server!
fastify.listen(
  { port: Number(process.env.PORT) || 3000, host: '0.0.0.0' },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    // Server is now listening on ${address}
    console.log(`Server is now listening on ${address}`);
  }
);
