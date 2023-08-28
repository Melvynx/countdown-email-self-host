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

const dateEndMapping: Record<string, Date> = {
  beginjs: new Date('2023-09-19T23:59:00+02:00'),
};

fastify.get('/countdown', async (req, reply) => {
  const encoder = new GIFEncoder(310, 84); // Dimensions augmentées pour la hauteur
  const canvas = createCanvas(310, 84);
  const ctx = canvas.getContext('2d');

  // get query params dateEnd
  const dateEnd = (req.query as Record<string, string>).type;

  encoder.start();
  encoder.setRepeat(-1);
  encoder.setDelay(1000);
  encoder.setQuality(2); // Une valeur plus petite signifie une qualité inférieure

  let endTime = dateEndMapping[dateEnd];
  if (!endTime) {
    return reply.code(400).send('Bad request');
  }

  reply.header('Content-Type', 'image/gif').send(encoder.createReadStream());

  for (let i = 0; i < 60; i++) {
    const simulatedTime = new Date(endTime.getTime() - i * 1000);
    const now = new Date();
    const diff = simulatedTime.getTime() - now.getTime();

    const days = String(Math.floor(diff / 86400000)).padStart(2, '0');
    const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 100);

    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    // Positionnement précis avec 75 px pour chaque texte et 20 px pour les ':'
    const textY = 40;
    ctx.fillText(days, 32, textY);
    ctx.fillText(':', 75, textY - 4);
    ctx.fillText(hours, 115, textY);
    ctx.fillText(':', 155, textY - 4);
    ctx.fillText(minutes, 200, textY);
    ctx.fillText(':', 240, textY - 4);
    ctx.fillText(seconds, 280, textY);

    const labelY = 70;

    ctx.font = 'thin 14px Arial';
    ctx.fillText('JOURS', 32, labelY);
    ctx.fillText('HEURES', 115, labelY);
    ctx.fillText('MIN', 200, labelY);
    ctx.fillText('SEC', 280, labelY);

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
