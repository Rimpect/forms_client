import pool from '../config/db.js';

export const getProfile = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.session.user_id]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      status: 'success',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        theme: user.theme
      }
    });
  } catch (error) {
    next(error);
  }
};