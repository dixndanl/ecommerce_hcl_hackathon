import { Router } from 'express';
import { addItem, emptyCart, getCart, removeItem, updateItem } from '../../controllers/cart.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addItemBody, updateItemBody, updateItemParams } from '../../schemas/cart.schema.js';

const router = Router();

router.get('/', authenticateJwt, getCart);
router.post('/items', authenticateJwt, validate({ body: addItemBody }), addItem);
router.put('/items/:id', authenticateJwt, validate({ params: updateItemParams, body: updateItemBody }), updateItem);
router.delete('/items/:id', authenticateJwt, removeItem);
router.delete('/', authenticateJwt, emptyCart);

export default router;


