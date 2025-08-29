import { randomBytes } from 'node:crypto';
import { db } from '@repo/db';
import { apiKeys } from '@repo/db/schema';
// biome-ignore lint/performance/noNamespaceImport: ignoring
import * as bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 10;
const API_KEY_PREFIX = 'ak1';

export async function generateApiKey(name: string, userId: string) {
  const id = randomBytes(10).toString('hex');
  const secret = randomBytes(10).toString('hex');
  const secretHash = await bcrypt.hash(secret, BCRYPT_SALT_ROUNDS);

  const plain = `${API_KEY_PREFIX}_${id}_${secret}`;

  const key = (
    await db
      .insert(apiKeys)
      .values({
        name,
        userId,
        keyId: id,
        keyHash: secretHash,
      })
      .returning()
  )[0] ?? { id: '', name: '', createdAt: new Date() };

  return {
    id: key.id,
    name: key.name,
    createdAt: key.createdAt,
    key: plain,
  };
}

function parseApiKey(plain: string) {
  const parts = plain.split('_');
  if (parts.length !== 3) {
    throw new Error(
      `Malformed API key. API keys should have 3 segments, found ${parts.length} instead.`
    );
  }
  if (parts[0] !== API_KEY_PREFIX) {
    throw new Error('Malformed API key. Got unexpected key prefix.');
  }
  return {
    keyId: parts[1],
    keySecret: parts[2],
  };
}

export async function authenticateApiKey(key: string) {
  const { keyId = '', keySecret = '' } = parseApiKey(key);
  const apiKey = await db.query.apiKeys.findFirst({
    where: (k, { eq }) => eq(k.keyId, keyId),
    with: {
      user: true,
    },
  });

  if (!apiKey) {
    throw new Error('API key not found');
  }

  // Check if key is expired
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    throw new Error('API key has expired');
  }

  const hash = apiKey.keyHash;

  const validation = await bcrypt.compare(keySecret, hash);
  if (!validation) {
    throw new Error('Invalid API Key');
  }

  // Increment usage count
  await db
    .update(apiKeys)
    .set({ usageCount: apiKey.usageCount + 1 })
    .where((k, { eq }) => eq(k.id, apiKey.id));

  return {
    user: apiKey.user,
    apiKey: {
      id: apiKey.id,
      name: apiKey.name,
      permissions: JSON.parse(apiKey.permissions),
    },
  };
}

export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.includes(required) || permissions.includes('admin');
}

export async function validateApiKeyFromHeader(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  try {
    return await authenticateApiKey(token);
  } catch (error) {
    return null;
  }
}
