import { Address, User, sequelize } from '../db/index.js';

let cachedUserTableColumns = null;
async function ensureUserTableColumns() {
  if (cachedUserTableColumns) return cachedUserTableColumns;
  try {
    const qi = sequelize.getQueryInterface();
    cachedUserTableColumns = await qi.describeTable('users');
  } catch (_) {
    cachedUserTableColumns = {};
  }
  return cachedUserTableColumns;
}

export async function updateUserProfile(userId, updates) {
  const allowed = ['name', 'phone'];
  const payload = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) payload[key] = updates[key];
  }
  // Guard against DBs that don't have the 'phone' column yet
  const columns = await ensureUserTableColumns();
  if (!columns.phone) {
    delete payload.phone;
  }
  const [count] = await User.update(payload, { where: { id: userId }, fields: Object.keys(payload) });
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


