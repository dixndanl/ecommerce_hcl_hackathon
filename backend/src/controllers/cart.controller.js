import { addItemToCart, clearCart, getCartWithItems, removeCartItem, updateCartItem } from '../services/cart.service.js';

export async function getCart(req, res) {
  const userId = req.user.sub;
  const data = await getCartWithItems(userId);
  return res.json(data);
}

export async function addItem(req, res) {
  try {
    const userId = req.user.sub;
    const created = await addItemToCart(userId, req.body || {});
    return res.status(201).json(created);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to add item', details: err?.details || err?.message || err });
  }
}

export async function updateItem(req, res) {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const updated = await updateCartItem(userId, id, req.body || {});
    return res.json(updated);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to update item', details: err?.details || err?.message || err });
  }
}

export async function removeItem(req, res) {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const result = await removeCartItem(userId, id);
    return res.json(result);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to delete item', details: err?.details || err?.message || err });
  }
}

export async function emptyCart(req, res) {
  try {
    const userId = req.user.sub;
    const result = await clearCart(userId);
    return res.json(result);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to clear cart', details: err?.details || err?.message || err });
  }
}


