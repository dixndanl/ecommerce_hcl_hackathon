import { updateUserProfile, addAddress, listAddresses, updateAddress, deleteAddress } from '../services/user.service.js';
import { getOrCreateCart } from '../services/cart.service.js';

export async function getProfile(req, res) {
  const cart = await getOrCreateCart(req.user.sub);
  return res.json({ user: req.user, cartId: cart.id });
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.sub;
    const updated = await updateUserProfile(userId, req.body || {});
    return res.json({ user: updated });
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to update profile', details: err?.message || err });
  }
}

export async function createAddress(req, res) {
  try {
    const userId = req.user.sub;
    const created = await addAddress(userId, req.body || {});
    return res.status(201).json(created);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to add address', details: err?.details || err?.message || err });
  }
}

export async function getAddresses(req, res) {
  const userId = req.user.sub;
  const rows = await listAddresses(userId);
  return res.json(rows);
}

export async function editAddress(req, res) {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const updated = await updateAddress(userId, id, req.body || {});
    return res.json(updated);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to update address', details: err?.details || err?.message || err });
  }
}

export async function removeAddress(req, res) {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const result = await deleteAddress(userId, id);
    return res.json(result);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ error: 'Failed to delete address', details: err?.details || err?.message || err });
  }
}


