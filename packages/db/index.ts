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

// Use connection pooling URL from Supabase
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres.rlrpwoojxkdxywedquvp:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres';

export const client =
  globalForDb.client ??
  postgres(databaseUrl);
if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
