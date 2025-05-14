import pool from '../config/db.js';

export const getUsersList = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email FROM users ORDER BY last_name'
    );
    
    res.json({
      status: 'success',
      users
    });
  } catch (error) {
    next(error);
  }
};