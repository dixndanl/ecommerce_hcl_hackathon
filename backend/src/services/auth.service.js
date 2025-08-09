import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, sequelize } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

let cachedUserColumns = null;
async function ensureUserColumns() {
  if (cachedUserColumns) return cachedUserColumns;
  try {
    const qi = sequelize.getQueryInterface();
    cachedUserColumns = await qi.describeTable('users');
  } catch (_) {
    cachedUserColumns = {};
  }
  return cachedUserColumns;
}

export async function authenticateUser(email, password) {
  // Restrict selected columns to avoid selecting non-existent DB columns (e.g., phone)
  const record = await User.findOne({
    where: { email: String(email).toLowerCase() },
    attributes: ['id', 'email', 'role', 'name', 'passwordHash'],
  });
  if (!record) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const ok = await bcrypt.compare(password, record.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // Include phone as null to satisfy clients expecting it, without touching DB schema
  const safeUser = { id: record.id, email: record.email, role: record.role, name: record.name, phone: null };
  const payload = { sub: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name };
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  return { token, user: safeUser };
}

export async function signupUser({ email, name, password, phone }) {
  const existing = await User.findOne({ where: { email: String(email).toLowerCase() }, attributes: ['id'] });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const columns = await ensureUserColumns();
  const createPayload = { email: String(email).toLowerCase(), name, passwordHash, role: 'user' };
  // Only include phone when the column exists AND the client provided a value
  if (columns.phone && phone !== undefined) {
    createPayload.phone = phone;
  }
  await User.create(createPayload, { returning: false });
  const record = await User.findOne({ where: { email: String(email).toLowerCase() }, attributes: ['id','email','name','role'] });
  const safeUser = { id: record.id, email: record.email, role: record.role, name: record.name };
  const payload = { sub: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name };
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  return { token, user: safeUser };
}


