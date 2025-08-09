import { Router } from 'express';
import { login, logout, signup } from '../../controllers/auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { signupBody } from '../../schemas/auth.schema.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', validate({ body: signupBody }), signup);

export default router;


