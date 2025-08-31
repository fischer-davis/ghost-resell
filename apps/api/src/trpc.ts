import { verifySession } from '@repo/auth';
import { type AppRouter, appRouter } from '@repo/trpc';
import {
  type CreateFastifyContextOptions,
  type FastifyTRPCPluginOptions,
  fastifyTRPCPlugin,
} from '@trpc/server/adapters/fastify';
import type { FastifyInstance } from 'fastify';

export async function createContext({ req }: CreateFastifyContextOptions) {
  const authHeader = req.headers.authorization;
  const session = await verifySession(authHeader);
  return { session };
}
export type Context = Awaited<ReturnType<typeof createContext>>;

// Register tRPC router with Fastify
const registerTrpc = (app: FastifyInstance) => {
  app.register(fastifyTRPCPlugin, {
    prefix: '/api/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        // biome-ignore lint/suspicious/noConsole: Okay to log error.
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });
};

export default registerTrpc;
