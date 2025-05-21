import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { generateToken } from '../utils/jwtUtils.js';

export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, login, password, gender, age } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, login, password, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, login, hashedPassword, gender, age]
    );
    
    const token = jwt.sign(
      { login, email }, 
      jwtConfig.secret, 
      { expiresIn: jwtConfig.expiresIn }
    );
    
    res.status(201).json({ 
      status: 'success',
      message: 'Регистрация успешна',
      token 
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Логин и пароль обязательны'
      });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE login = ?', [login]);
    
    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Неверный логин или пароль'
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Неверный логин или пароль'
      });
    }

    const token = generateToken(user.id);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({
      status: 'success',
      message: 'Авторизация успешна',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        theme: user.theme || 'light'
      }
    });

  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ 
    status: 'success',
    message: 'Вы вышли',
    clearLocalStorage: true
  });
};