import { Cart, CartItem } from '../db/index.js';

export async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
}

export async function getCartWithItems(userId) {
  const cart = await getOrCreateCart(userId);
  const items = await CartItem.findAll({ where: { cartId: cart.id }, order: [['createdAt', 'DESC']] });
  return { cart, items };
}

export async function addItemToCart(userId, itemInput) {
  const requiredFields = ['productId', 'productTitle', 'price', 'currency'];
  for (const f of requiredFields) {
    if (!itemInput || itemInput[f] === undefined || itemInput[f] === null || itemInput[f] === '') {
      const err = new Error(`Missing required field: ${f}`);
      err.status = 400;
      throw err;
    }
  }
  const quantity = Number(itemInput.quantity || 1);
  if (!Number.isFinite(quantity) || quantity < 1) {
    const err = new Error('quantity must be a positive integer');
    err.status = 400;
    throw err;
  }

  const cart = await getOrCreateCart(userId);

  // Upsert on (cartId, productId) by merging quantity
  const existing = await CartItem.findOne({ where: { cartId: cart.id, productId: String(itemInput.productId) } });
  if (existing) {
    existing.quantity += quantity;
    await existing.save();
    return existing;
  }

  return CartItem.create({
    cartId: cart.id,
    productId: String(itemInput.productId),
    productTitle: String(itemInput.productTitle),
    price: itemInput.price,
    currency: String(itemInput.currency),
    quantity,
    thumbnailUrl: itemInput.thumbnailUrl || null,
  });
}

export async function updateCartItem(userId, itemId, updates) {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    const err = new Error('Cart item not found');
    err.status = 404;
    throw err;
  }
  if (updates.quantity !== undefined) {
    const q = Number(updates.quantity);
    if (!Number.isFinite(q) || q < 1) {
      const err = new Error('quantity must be a positive integer');
      err.status = 400;
      throw err;
    }
    item.quantity = q;
  }
  if (updates.thumbnailUrl !== undefined) item.thumbnailUrl = updates.thumbnailUrl;
  await item.save();
  return item;
}

export async function removeCartItem(userId, itemId) {
  const cart = await getOrCreateCart(userId);
  const deleted = await CartItem.destroy({ where: { id: itemId, cartId: cart.id } });
  if (!deleted) {
    const err = new Error('Cart item not found');
    err.status = 404;
    throw err;
  }
  return { deleted: true };
}

export async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  await CartItem.destroy({ where: { cartId: cart.id } });
  return { cleared: true };
}


