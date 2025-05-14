import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { verifyRecaptcha } from '../middlewares/recaptchaMiddleware.js';

const router = Router();

router.post('/register', verifyRecaptcha, register);
router.post('/login', login);
router.post('/logout', logout);

export default router;