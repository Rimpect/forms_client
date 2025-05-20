import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { generateToken } from '../utils/jwtUtils.js';
export const register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      login,
      password,
      gender,
      age
    } = req.body;

    // Валидация обязательных полей
    const requiredFields = {
      first_name: 'Имя',
      last_name: 'Фамилия',
      email: 'Email',
      login: 'Логин',
      password: 'Пароль',
      gender: 'Пол',
      age: 'Возраст'
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          status: 'error',
          message: `Поле ${name} обязательно для заполнения` 
        });
      }
    }


    // Валидация email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Некорректный email'
      });
    }

    // Валидация пароля
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error', 
        message: 'Пароль должен содержать минимум 6 символов'
      });
    }

    // Валидация пола
    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({
        status: 'error',
        message: 'Некорректно указан пол'
      });
    }

    // Проверка существования пользователя
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR login = ?',
      [email, login]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Пользователь с таким email или логином уже существует'
      });
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Создание пользователя
    const [result] = await pool.query(
      `INSERT INTO users 
       (first_name, last_name, email, login, password, gender, age) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, login, passwordHash, gender, age]
    );

    // Успешный ответ
    res.status(201).json({
      status: 'success',
      message: 'Регистрация успешно завершена',
      user: {
        id: result.insertId,
        first_name,
        last_name,
        email
      }
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
      maxAge: 24 * 60 * 60 * 1000, // 1 день
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