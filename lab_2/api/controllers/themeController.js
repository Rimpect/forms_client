import pool from '../config/db.js';

export const updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;
    
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Недопустимая тема' });
    }

    await pool.query('UPDATE users SET theme = ? WHERE id = ?', [
      theme,
      req.session.user_id
    ]);

    res.json({ status: 'success', theme });
  } catch (error) {
    next(error);
  }
};