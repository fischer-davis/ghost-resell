import { createId } from '@paralleldrive/cuid2';
import { db } from '@repo/db';
import { apiKeys } from '@repo/db/schema';
import bcrypt from 'bcryptjs';
import { and, eq, gte, isNotNull, lte, sql } from 'drizzle-orm';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { randomBytes } from "node:crypto";

export const apiKeyRouter = router({
  createApiKey: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        permissions: z.array(z.string()),
        expiresAt: z.date().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {

      const id = randomBytes(10).toString("hex");
      const secret = randomBytes(10).toString("hex");
      const secretHash = await bcrypt.hash(secret, 10);

      const plain = `gd_${id}_${secret}`;

      await db.insert(apiKeys).values({
        name: input.name,
        permissions: JSON.stringify(input.permissions),
        expiresAt: input.expiresAt,
        keyId: id,
        keyHash: secretHash,
        userId: ctx.session.user.id,
      });

      return { success: true, key: plain };
    }),

  listApiKeys: protectedProcedure.query(async ({ ctx }) => {
    const keys = await db.query.apiKeys.findMany({
      where: eq(apiKeys.userId, ctx.session.user.id),
    });

    return keys.map((key) => ({
      ...key,
      status: key.expiresAt && key.expiresAt < new Date() ? 'expired' : 'active',
      displayKey: `gd_${key.keyId}_${'X'.repeat(20)}`, // Add a formatted display key with placeholder for secret
    }));
  }),

  revokeApiKey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(apiKeys).where(eq(apiKeys.id, input.id));
      return { success: true };
    }),

  getApiKeyStats: protectedProcedure.query(async ({ ctx }) => {
    const allKeys = await db.query.apiKeys.findMany({
      where: eq(apiKeys.userId, ctx.session.user.id),
    });

    const totalKeys = allKeys.length;
    const activeKeys = allKeys.filter(
      (key) => !key.expiresAt || key.expiresAt > new Date()
    ).length;
    const expiringSoon = allKeys.filter((key) => {
      if (!key.expiresAt) return false;
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return key.expiresAt > new Date() && key.expiresAt <= thirtyDaysFromNow;
    }).length;

    const totalUsage = allKeys.reduce((acc, key) => acc + (key.usageCount || 0), 0);

    return {
      totalKeys,
      activeKeys,
      expiringSoon,
      totalUsage,
    };
  }),

  updateApiKey: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        permissions: z.array(z.string()).optional(),
        expiresAt: z.date().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(apiKeys)
        .set({
          name: input.name,
          permissions: input.permissions ? JSON.stringify(input.permissions) : undefined,
          expiresAt: input.expiresAt,
        })
        .where(eq(apiKeys.id, input.id));
      return { success: true };
    }),
});