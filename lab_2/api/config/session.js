import session from 'express-session';
import MySQLStore from 'express-mysql-session';

const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lab_web'
});

export default session({
  secret: '6LfCASErAAAAAHzbmutmVNg8K63beZsdOKI_qXzI', /// ВОЗМОЖНО НЕ ТОТ КЛЮЧ
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    httpOnly: true,
    sameSite: 'lax',
    secure: false // set to true in production with HTTPS
  }
});