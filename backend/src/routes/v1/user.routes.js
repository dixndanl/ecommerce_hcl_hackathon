import { Router } from 'express';
import { getProfile } from '../../controllers/user.controller.js';
import { authenticateJwt, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/profile', authenticateJwt, getProfile);
router.get('/api/private', authenticateJwt, (req, res) => {
  res.json({ message: 'This is a protected resource', sub: req.user.sub });
});
router.get('/api/admin', authenticateJwt, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin-only data', sub: req.user.sub });
});

export default router;


