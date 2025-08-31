import fs from 'node:fs';
import path from 'node:path';
import fastifyCors from '@fastify/cors';
import { config } from 'dotenv';
import fastify from 'fastify';
import registerTrpc from './trpc';

config({ path: '../../.env.development' });

const baseCorsConfig = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  maxAge: 86_400,
};

const app = fastify({ logger: true });

app.register(fastifyCors, baseCorsConfig);

registerTrpc(app);

// biome-ignore lint/correctness/noUndeclaredVariables: This is okay.
const port = Number(Bun.env.SERVER_PORT || Bun.env.VITE_SERVER_PORT || 3000);

app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
  app.log.info('Scheduled deletion job has been started.');
});
