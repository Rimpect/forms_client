import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { generateToken } from '../utils/jwtUtils.js';
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
