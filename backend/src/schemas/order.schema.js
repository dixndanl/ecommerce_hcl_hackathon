import { z } from 'zod';

export const checkoutBody = z.object({
  shippingAddressId: z.string().uuid().optional(),
  paymentMethod: z.enum(['cod']).default('cod').optional(),
  metadata: z.record(z.any()).optional(),
});

export const orderParams = z.object({ id: z.string().uuid() });


