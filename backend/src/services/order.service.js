import { Address, CartItem, Order, OrderItem } from '../db/index.js';
import { getOrCreateCart } from './cart.service.js';

export async function createOrderFromCart(userId, payload = {}) {
  const { shippingAddressId, paymentMethod = 'cod', metadata } = payload;

  const cart = await getOrCreateCart(userId);
  const items = await CartItem.findAll({ where: { cartId: cart.id } });
  if (!items.length) {
    const err = new Error('Cart is empty');
    err.status = 400;
    throw err;
  }

  let shippingSnapshot = null;
  if (shippingAddressId) {
    const addr = await Address.findOne({ where: { id: shippingAddressId, userId } });
    if (!addr) {
      const err = new Error('Invalid shippingAddressId');
      err.status = 400;
      throw err;
    }
    shippingSnapshot = addr.toJSON();
  }

  const currency = items[0].currency;
  const totalAmount = items.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0);

  const order = await Order.create({
    userId,
    status: 'created',
    totalAmount,
    currency,
    shippingAddressId: shippingAddressId || null,
    shippingAddressSnapshot: shippingSnapshot,
    paymentMethod,
    metadata: metadata || null,
  });

  const orderItems = items.map((it) => ({
    orderId: order.id,
    productId: it.productId,
    productTitle: it.productTitle,
    price: it.price,
    currency: it.currency,
    quantity: it.quantity,
    thumbnailUrl: it.thumbnailUrl || null,
  }));
  await OrderItem.bulkCreate(orderItems);

  // Optionally, clear the cart after order creation
  await CartItem.destroy({ where: { cartId: cart.id } });

  return getOrderById(userId, order.id);
}

export async function getOrderById(userId, orderId) {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: OrderItem, as: 'items' }],
  });
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  return order;
}

export async function listOrders(userId) {
  return Order.findAll({
    where: { userId },
    include: [{ model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']],
  });
}


