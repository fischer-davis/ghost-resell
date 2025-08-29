import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from 'packages/trpc';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
