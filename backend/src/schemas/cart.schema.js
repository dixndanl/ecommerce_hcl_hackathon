import { z } from 'zod';

export const addItemBody = z.object({
  productId: z.string().min(1),
  productTitle: z.string().min(1),
  price: z.union([z.number(), z.string()]).transform((v) => Number(v)).refine((n) => Number.isFinite(n) && n >= 0, 'price must be >= 0'),
  currency: z.string().min(1),
  quantity: z.union([z.number().int(), z.string()]).transform((v) => Number(v)).default(1).refine((n) => Number.isInteger(n) && n >= 1, 'quantity must be >= 1'),
  thumbnailUrl: z.string().url().optional(),
});

export const updateItemParams = z.object({ id: z.string().uuid() });
export const updateItemBody = z.object({
  quantity: z.union([z.number().int(), z.string()]).transform((v) => Number(v)).refine((n) => Number.isInteger(n) && n >= 1, 'quantity must be >= 1').optional(),
  thumbnailUrl: z.string().url().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });


