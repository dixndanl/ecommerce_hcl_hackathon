import { Router } from 'express';
import { getProfile, updateProfile, createAddress, getAddresses, editAddress, removeAddress } from '../../controllers/user.controller.js';
import { authenticateJwt, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/profile', authenticateJwt, getProfile);
router.put('/profile', authenticateJwt, updateProfile);

// Address management
router.get('/addresses', authenticateJwt, getAddresses);
router.post('/addresses', authenticateJwt, createAddress);
router.put('/addresses/:id', authenticateJwt, editAddress);
router.delete('/addresses/:id', authenticateJwt, removeAddress);
router.get('/api/private', authenticateJwt, (req, res) => {
  res.json({ message: 'This is a protected resource', sub: req.user.sub });
});
router.get('/api/admin', authenticateJwt, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin-only data', sub: req.user.sub });
});

export default router;


