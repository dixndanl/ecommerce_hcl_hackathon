import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sequelize, User, syncAndSeed } from './db/index.js';

const app = express();

// Config
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

// Basic middlewares
app.use(morgan('dev'));
const useWildcardOrigin = CLIENT_ORIGIN === '*' || CLIENT_ORIGIN === 'null';
const corsOptions = useWildcardOrigin
  ? { origin: '*' }
  : { origin: CLIENT_ORIGIN, credentials: true };
app.use(cors(corsOptions));
app.use(express.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Initialize database
await syncAndSeed();

function generateJwt(user) {
  const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
}

function authenticateJwt(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const [, token] = authHeader.split(' ');
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ecommerce-backend', timestamp: new Date().toISOString() });
});

// Auth routes (local)
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  const record = await User.findOne({ where: { email: String(email).toLowerCase() } });
  if (!record) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, record.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const safeUser = { id: record.id, email: record.email, role: record.role, name: record.name };
  const token = generateJwt(safeUser);
  res.json({ token, user: safeUser });
});

// Stateless logout endpoint (client should discard token)
app.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

app.get('/profile', authenticateJwt, (req, res) => {
  res.json({ user: req.user });
});

// Example public route
app.get('/', (req, res) => {
  res.json({ message: 'B2B ecommerce backend up' });
});

// Protected API routes (JWT)
app.get('/api/private', authenticateJwt, (req, res) => {
  res.json({ message: 'This is a protected resource', sub: req.user.sub });
});

app.get('/api/admin', authenticateJwt, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin-only data', sub: req.user.sub });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT}`);
});


