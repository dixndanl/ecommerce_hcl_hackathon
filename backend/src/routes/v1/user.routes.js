import { Router } from 'express';
import { getProfile, updateProfile, createAddress, getAddresses, editAddress, removeAddress } from '../../controllers/user.controller.js';
import { authenticateJwt, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addressBody, addressParams, updateProfileBody } from '../../schemas/user.schema.js';

const router = Router();

router.get('/profile', authenticateJwt, getProfile);
router.put('/profile', authenticateJwt, validate({ body: updateProfileBody }), updateProfile);

// Address management
router.get('/addresses', authenticateJwt, getAddresses);
router.post('/addresses', authenticateJwt, validate({ body: addressBody }), createAddress);
router.put('/addresses/:id', authenticateJwt, validate({ params: addressParams, body: addressBody.partial() }), editAddress);
router.delete('/addresses/:id', authenticateJwt, validate({ params: addressParams }), removeAddress);
router.get('/api/private', authenticateJwt, (req, res) => {
  res.json({ message: 'This is a protected resource', sub: req.user.sub });
});
router.get('/api/admin', authenticateJwt, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin-only data', sub: req.user.sub });
});

export default router;


