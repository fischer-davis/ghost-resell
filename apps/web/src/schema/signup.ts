import { z } from 'zod';

export const PASSWORD_MAX_LENGTH = 100;

export const zSignUpSchema = z.object({
  firstName: z.string().min(1, { message: "First name can't be empty" }),
  lastName: z.string().min(1, { message: "Last name can't be empty" }),
  email: z.string().email(),
  password: z.string().min(8).max(PASSWORD_MAX_LENGTH),
  confirmPassword: z.string(),
});
