import { apiKeyRouter } from './routers/api-key';
import { createTRPCRouter, t } from './trpc';

export const appRouter = createTRPCRouter({
  apiKey: apiKeyRouter,
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

// export type definition of API
export type AppRouter = typeof appRouter;
