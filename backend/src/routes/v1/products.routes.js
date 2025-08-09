import { Router } from 'express';
import { listProducts, getProductById, getProductBySlug } from '../../controllers/products.controller.js';

const router = Router();

// GET /products
router.get('/', listProducts);

// GET /products/:id
router.get('/:id(\\d+)', getProductById);

// GET /products/slug/:slug
router.get('/slug/:slug', getProductBySlug);

export default router;


