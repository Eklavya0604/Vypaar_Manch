import { Router } from 'express';
import { register, login, googleAuth, me, logout, updateRole } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', me);
router.post('/logout', logout);
router.put('/role', updateRole);

export default router;
