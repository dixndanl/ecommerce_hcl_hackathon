import { authenticateUser } from '../services/auth.service.js';

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  try {
    const { token, user } = await authenticateUser(email, password);
    return res.json({ token, user });
  } catch (err) {
    if (err && err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export function logout(_req, res) {
  // Stateless JWT logout: client must discard the token
  return res.json({ message: 'Logged out' });
}


