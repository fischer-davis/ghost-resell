// biome-ignore lint/performance/noNamespaceImport: ignore
import * as process from 'node:process';
import { type Client, createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
// biome-ignore lint/performance/noNamespaceImport: ignore
import * as schema from './schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

const databaseUrl = process.env.DATABASE_URL || 'file:../../packages/db/db.sqlite';

export const client =
  globalForDb.client ??
  createClient({ url: databaseUrl });
if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
