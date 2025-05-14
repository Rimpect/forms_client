import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const RECAPTCHA_SECRET = '6LfCASErAAAAAHzbmutmVNg8K63beZsdOKI_qXzI';

export const register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      login,
      password,
      gender,
      age,
      recaptcha_token
    } = req.body;

    // Validate reCAPTCHA
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptcha_token}`;
    const recaptchaResponse = await axios.post(recaptchaUrl);
    
    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: 'Подтвердите, что вы не робот' });
    }

    // Validate required fields
    const required = {
      first_name: 'Имя',
      last_name: 'Фамилия',
      email: 'Email',
      login: 'Логин',
      password: 'Пароль',
      gender: 'Пол',
      age: 'Возраст'
    };

    for (const [field, name] of Object.entries(required)) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Поле ${name} обязательно для заполнения` });
      }
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Некорректный email' });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
    }

    // Validate gender
    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ message: 'Некорректно указан пол' });
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR login = ?',
      [email, login]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Пользователь с таким email или логином уже существует' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, login, password, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, login, passwordHash, gender, age]
    );

    // Set session
    req.session.user_id = result.insertId;
    req.session.user_ip = req.ip;

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
      return res.status(400).json({ message: 'Логин и пароль обязательны' });
    }

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE login = ?', [login]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    // Set session
    req.session.user_id = user.id;
    req.session.user_ip = req.ip;

    res.json({
      status: 'success',
      message: 'Авторизация успешна',
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

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при выходе' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Вы вышли' });
  });
};