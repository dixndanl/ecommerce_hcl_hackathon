import { createOrderFromCart, getOrderById, listOrders } from '../services/order.service.js';

export async function checkout(req, res) {
  try {
    const userId = req.user.sub;
    const order = await createOrderFromCart(userId, req.body || {});
    return res.status(201).json(order);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Checkout failed', details: err?.details || err?.message || err });
  }
}

export async function getOrder(req, res) {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const order = await getOrderById(userId, id);
    return res.json(order);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to get order', details: err?.details || err?.message || err });
  }
}

export async function getOrders(req, res) {
  const userId = req.user.sub;
  const orders = await listOrders(userId);
  return res.json(orders);
}


