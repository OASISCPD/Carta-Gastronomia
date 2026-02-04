import { Router } from 'express';
import { loginUser, logoutUser } from '../controller/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
const router = Router();

router.post('/login', loginUser);

router.post('/logout', authenticateToken, logoutUser);

export default router;