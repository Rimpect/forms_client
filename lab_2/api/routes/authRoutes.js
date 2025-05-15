import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { verifyRecaptcha } from '../middlewares/recaptchaMiddleware.js';

const router = Router();
router.post('/login', login);    // POST /api/auth/login
router.post('/register', register); // POST /api/auth/register
router.post('/logout', logout);  // POST /api/auth/logout
export default router;