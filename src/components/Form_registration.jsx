import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Form_registration.css';

const Form_registration = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { password_check, checkbox_check, ...userData } = data;
      
      const response = await axios.post('http://localhost/api/register.php', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        navigate('/personal_account');
        onClose();
      } else {
        alert(response.data.message || 'Ошибка регистрации');
      }
    } catch (error) {
      alert('Произошла ошибка при регистрации');
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
      <h2>Регистрация</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="username">Имя:</label>
          <input
            type="text"
            id="username"
            {...register('username', { 
              required: 'Обязательное поле', 
              minLength: { 
                value: 3, 
                message: 'Минимум 3 символа' 
              } 
            })}
          />
          {errors.username && <span className="error-message">{errors.username.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Фамилия:</label>
          <input
            type="text"
            id="lastname"
            {...register('lastname', { 
              required: 'Обязательное поле', 
              minLength: { 
                value: 3, 
                message: 'Минимум 3 символа' 
              } 
            })}
          />
          {errors.lastname && <span className="error-message">{errors.lastname.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          {...register('login', { 
            required: 'Обязательное поле', 
            minLength: { 
              value: 3, 
              message: 'Минимум 3 символа' 
            } 
          })}
        />
        {errors.login && <span className="error-message">{errors.login.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'Обязательное поле',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Некорректный email',
            },
          })}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Обязательное поле',
              minLength: { 
                value: 6, 
                message: 'Минимум 6 символов' 
              },
            })}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password_check">Подтверждение:</label>
          <input
            type="password"
            id="password_check"
            {...register('password_check', {
              validate: (value) => value === password || 'Пароли не совпадают',
            })}
          />
          {errors.password_check && <span className="error-message">{errors.password_check.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="age">Возраст:</label>
        <select 
          id="age" 
          {...register('age', { required: 'Выберите возраст' })}
        >
          <option value="">Выберите возраст</option>
          <option value="18-25">18-25 лет</option>
          <option value="26-35">26-35 лет</option>
          <option value="36-45">36-45 лет</option>
          <option value="46-55">46-55 лет</option>
          <option value="56-65">56-65 лет</option>
          <option value="66+">66+ лет</option>
        </select>
        {errors.age && <span className="error-message">{errors.age.message}</span>}
      </div>

      <div className="form-group">
        <fieldset className="gender-fieldset">
          <legend>Пол:</legend>
          <div className="gender-options">
            <label className="gender-label">
              <input 
                type="radio" 
                value="Male" 
                {...register('gender', { required: 'Выберите пол' })} 
                className="gender-input"
              />
              <span className="gender-text">Мужской</span>
            </label>
            <label className="gender-label">
              <input 
                type="radio" 
                value="Female" 
                {...register('gender')} 
                className="gender-input"
              />
              <span className="gender-text">Женский</span>
            </label>
          </div>
          {errors.gender && <span className="error-message">{errors.gender.message}</span>}
        </fieldset>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            {...register('checkbox_check', { 
              required: 'Необходимо согласие' 
            })}
            className="checkbox-input"
          />
          <span className="checkbox-text">Я принимаю условия использования</span>
        </label>
        {errors.checkbox_check && <span className="error-message">{errors.checkbox_check.message}</span>}
      </div>

      <button type="submit" className="submit-btn">Зарегистрироваться</button>
    </form>
  );
};

export default Form_registration;