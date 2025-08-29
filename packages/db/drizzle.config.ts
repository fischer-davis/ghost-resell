import type { Config } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL || 'file:./db.sqlite';

export default {
  schema: './schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: ['ghost-drop_*'],
} satisfies Config;
