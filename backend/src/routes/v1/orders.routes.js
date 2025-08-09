import { Router } from 'express';
import { checkout, getOrder, getOrders } from '../../controllers/order.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { checkoutBody, orderParams } from '../../schemas/order.schema.js';

const router = Router();

router.post('/checkout', authenticateJwt, validate({ body: checkoutBody }), checkout);
router.get('/', authenticateJwt, getOrders);
router.get('/:id', authenticateJwt, validate({ params: orderParams }), getOrder);

export default router;


