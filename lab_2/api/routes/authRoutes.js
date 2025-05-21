import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { verifyRecaptcha } from '../middlewares/recaptchaMiddleware.js';

const router = Router();
router.post('/login', login);  
router.post('/register', register); 
router.post('/logout', logout); 
export default router;