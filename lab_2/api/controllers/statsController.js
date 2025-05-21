import pool from '../config/db.js';

export const getStats = async (req, res, next) => {
  try {

    const [totalResult] = await pool.query('SELECT COUNT(id) AS total_users FROM users');
    const total = totalResult[0].total_users;
    

    const begin_date = new Date().toISOString().slice(0, 7) + '-01';
    const end_date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);
    
    const [monthResult] = await pool.query(
      'SELECT COUNT(id) AS month_users FROM users WHERE created_at BETWEEN ? AND ?',
      [begin_date, end_date]
    );
    const month_users = monthResult[0].month_users;
    
    const [lastUserResult] = await pool.query(
      'SELECT first_name, last_name, created_at FROM users ORDER BY created_at DESC LIMIT 1'
    );
    const last_user = lastUserResult[0];
    
    res.json({
      status: 'success',
      stats: {
        total_users: total,
        month_users: month_users,
        last_user: last_user
      }
    });
  } catch (error) {
    next(error);
  }
};