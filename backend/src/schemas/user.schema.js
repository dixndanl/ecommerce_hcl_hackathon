import { z } from 'zod';

export const updateProfileBody = z.object({
  name: z.string().min(1).max(200).optional(),
  phone: z.string().min(5).max(30).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export const addressBody = z.object({
  label: z.string().max(100).optional(),
  type: z.enum(['shipping', 'billing']).default('shipping').optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(2).default('IN').optional(),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const addressParams = z.object({ id: z.string().uuid() });


