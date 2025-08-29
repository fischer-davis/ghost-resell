import { reset } from 'drizzle-seed';
import { db } from './index';
// biome-ignore lint/performance/noNamespaceImport: Allowing for now
import * as schema from './schema';

const main = async () => {
  // @ts-expect-error
  await reset(db, schema);

};

main();
