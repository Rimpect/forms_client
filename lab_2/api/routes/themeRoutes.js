import { Router } from 'express';
import { updateTheme } from '../controllers/themeController.js'; 
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, updateTheme); 

export default router;