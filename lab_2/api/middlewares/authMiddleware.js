import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import pool from '../config/db.js';

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Время токена вышло' });
    }
    
    req.user = decoded; 
    next();
  });
};

export const checkDuplicateLoginOrEmail = async (req, res, next) => {
  try {
    const { login, email } = req.body;
    
    if (login) {
      const [loginRows] = await pool.query(
        'SELECT id FROM users WHERE login = ? LIMIT 1',
        [login]
      );
      
      if (loginRows.length > 0) {
        return res.status(400).json({ 
          status: 'error',
          field: 'login',
          message: 'Пользователь с таким логином уже существует' 
        });
      }
    }
    
    if (email) {
      const [emailRows] = await pool.query(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      
      if (emailRows.length > 0) {
        return res.status(400).json({ 
          status: 'error',
          field: 'email',
          message: 'Пользователь с таким email уже существует' 
        });
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};