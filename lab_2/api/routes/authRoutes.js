import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { verifyRecaptcha } from '../middlewares/recaptchaMiddleware.js';
import { checkDuplicateLoginOrEmail } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);  
router.post('/register', verifyRecaptcha, checkDuplicateLoginOrEmail, register); 
router.post('/logout', logout); 
router.post('/check-credentials', checkDuplicateLoginOrEmail, (req, res) => {
  res.json({ status: 'success', message: 'Данные доступны' });
});

export default router;