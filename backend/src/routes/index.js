import { Router } from 'express';
import authRoutes from './v1/auth.routes.js';
import userRoutes from './v1/user.routes.js';
import productsRoutes from './v1/products.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', userRoutes);
router.use('/products', productsRoutes);

export default router;


