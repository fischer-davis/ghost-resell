import { z } from 'zod';

export const zSignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
