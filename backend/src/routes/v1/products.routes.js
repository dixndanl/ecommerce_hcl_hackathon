import { Router } from 'express';
import { listProducts, getProductById, getProductBySlug, getProductCreationStructure, createProductsBulkController } from '../../controllers/products.controller.js';

const router = Router();

// GET /products
router.get('/', listProducts);

// GET /products/structure : For internal Purposes
// router.get('/structure', getProductCreationStructure);

// POST /products/bulk : For internal Purposes
// router.post('/bulk', createProductsBulkController);

// GET /products/:id
router.get('/:id(\\d+)', getProductById);

// GET /products/slug/:slug
router.get('/slug/:slug', getProductBySlug);

export default router;


