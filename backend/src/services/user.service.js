import { Address, User } from '../db/index.js';

export async function updateUserProfile(userId, updates) {
  const allowed = ['name', 'phone'];
  const payload = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) payload[key] = updates[key];
  }
  const [count] = await User.update(payload, { where: { id: userId } });
  if (count === 0) throw new Error('User not found');
  return User.findByPk(userId, { attributes: ['id', 'email', 'name', 'role'] });
}

export async function addAddress(userId, addressInput) {
  if (!addressInput || !addressInput.line1 || !addressInput.city || !addressInput.postalCode) {
    const err = new Error('Missing required address fields: line1, city, postalCode');
    err.status = 400;
    throw err;
  }
  if (addressInput.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }
  const created = await Address.create({ ...addressInput, userId });
  return created;
}

export async function listAddresses(userId) {
  return Address.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
}

export async function updateAddress(userId, addressId, updates) {
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) {
    const err = new Error('Address not found');
    err.status = 404;
    throw err;
  }
  if (updates.isDefault === true) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }
  await address.update(updates);
  return address;
}

export async function deleteAddress(userId, addressId) {
  const deleted = await Address.destroy({ where: { id: addressId, userId } });
  if (!deleted) {
    const err = new Error('Address not found');
    err.status = 404;
    throw err;
  }
  return { deleted: true };
}


