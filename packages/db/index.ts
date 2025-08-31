// biome-ignore lint/performance/noNamespaceImport: ignore
import * as process from 'node:process';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// biome-ignore lint/performance/noNamespaceImport: ignore
import * as schema from './schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined;
};

const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/ghost-resell';

export const client =
  globalForDb.client ??
  postgres(databaseUrl);
if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
