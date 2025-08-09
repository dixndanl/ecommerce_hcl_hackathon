import { Router } from 'express';
import { checkout, getOrder, getOrders } from '../../controllers/order.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/checkout', authenticateJwt, checkout);
router.get('/', authenticateJwt, getOrders);
router.get('/:id', authenticateJwt, getOrder);

export default router;


