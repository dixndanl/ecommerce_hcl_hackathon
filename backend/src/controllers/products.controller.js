import { fetchProductsList, fetchProductById, fetchProductBySlug } from '../services/products.service.js';

export async function listProducts(req, res) {
  try {
    const query = req.url.split('?')[1] || '';
    const data = await fetchProductsList(query);
    return res.json(data);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to fetch products', details: err?.details || err?.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const query = req.url.split('?')[1] || '';
    const data = await fetchProductById(id, query);
    return res.json(data);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to fetch product', details: err?.details || err?.message });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    const extraQuery = req.url.split('?')[1] || '';
    const data = await fetchProductBySlug(slug, extraQuery);
    return res.json(data);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to fetch product by slug', details: err?.details || err?.message });
  }
}


