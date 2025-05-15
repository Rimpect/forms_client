import pool from '../config/db.js';

export const getProfile = async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Не авторизован' 
      });
    }

    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, theme FROM users WHERE id = ?', 
      [req.session.user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Пользователь не найден' 
      });
    }

    res.json({
      status: 'success',
      user: users[0]
    });
  } catch (error) {
    next(error);
  }
};