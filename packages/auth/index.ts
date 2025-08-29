import { db } from '@repo/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

const clientPort = process.env.CLIENT_PORT || 5173;
const corsOrigin = process.env.CORS_ORIGIN || `http://localhost:${clientPort}`;

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "mysql", "sqlite"
  }),
  trustedOrigins: [corsOrigin],
});
