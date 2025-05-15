import { Router } from 'express';
import { updateTheme } from '../controllers/themeController.js'; // Исправлено
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, updateTheme); // POST /api/theme

export default router;