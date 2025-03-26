import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Autorization_form.css';

const AuthorizationForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost/api/login.php', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/personal_account');
        onClose();
      } else {
        setError('root', {
          type: 'manual',
          message: response.data.message || 'Неверный логин или пароль'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Ошибка сервера. Попробуйте позже.'
      });
      console.error('Authorization error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>Вход в систему</h2>
      
      <div className="form-group">
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          {...register('login')}
          className="form-input"
          placeholder="Введите ваш логин" /* Добавлено */
        />
      </div>
  
      <div className="form-group">
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className="form-input"
          placeholder="Введите пароль" /* Добавлено */
        />
      </div>
  
      <div className="form-actions">
        <button type="submit" className="submit-btn">Войти</button>
        <button type="button" onClick={onClose} className="cancel-btn">Отмена</button>
      </div>
    </form>

  );
};

export default AuthorizationForm;