import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export async function authenticateUser(email, password) {
  const record = await User.findOne({ where: { email: String(email).toLowerCase() } });
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

  const safeUser = { id: record.id, email: record.email, role: record.role, name: record.name };
  const payload = { sub: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name };
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  return { token, user: safeUser };
}

export async function signupUser({ email, name, password, phone }) {
  const existing = await User.findOne({ where: { email: String(email).toLowerCase() } });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const created = await User.create({ email: String(email).toLowerCase(), name, passwordHash, role: 'user', phone: phone || null });
  const safeUser = { id: created.id, email: created.email, role: created.role, name: created.name };
  const payload = { sub: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name };
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  return { token, user: safeUser };
}


