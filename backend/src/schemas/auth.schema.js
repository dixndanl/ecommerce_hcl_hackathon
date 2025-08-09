import { z } from 'zod';

export const signupBody = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(200),
  password: z.string().min(8).max(200),
  phone: z.string().min(5).max(30).optional(),
});


