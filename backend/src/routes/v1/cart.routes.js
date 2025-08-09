import { Router } from 'express';
import { addItem, emptyCart, getCart, removeItem, updateItem } from '../../controllers/cart.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticateJwt, getCart);
router.post('/items', authenticateJwt, addItem);
router.put('/items/:id', authenticateJwt, updateItem);
router.delete('/items/:id', authenticateJwt, removeItem);
router.delete('/', authenticateJwt, emptyCart);

export default router;


