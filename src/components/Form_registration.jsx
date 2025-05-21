import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

const Form_registration = ({ onClose, onRegisterSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    setError,
    clearErrors
  } = useForm();

  const recaptchaRef = React.useRef(null);
  const password = watch('password');
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(value);
    
    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
      return "Пароль должен содержать заглавные, строчные буквы(латинские), цифры и спецсимволы";
    }
    return true;
  };

  const checkFieldAvailability = async (field, value) => {
    if (!value || errors[field]) return;
    
    setIsChecking(true);
    try {
      const response = await fetch('/lab_2/api/auth/check-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      
      const data = await response.json();
      if (!response.ok) {
        setError(field, { 
          type: 'manual', 
          message: data.message || `Этот ${field === 'email' ? 'email' : 'логин'} уже занят`
        });
      } else {
        clearErrors(field);
      }
    } catch (error) {
      console.error('Ошибка проверки:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLoginBlur = async (e) => {
    await trigger('login');
    await checkFieldAvailability('login', e.target.value);
  };

  const handleEmailBlur = async (e) => {
    await trigger('email');
    await checkFieldAvailability('email', e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      if (!data.recaptcha) {
        setError('recaptcha', { type: 'manual', message: 'Пожалуйста, подтвердите, что вы не робот' });
        return;
      }

      const response = await fetch('/lab_2/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: data.username,
          last_name: data.lastname,
          email: data.email,
          login: data.login,
          password: data.password,
          gender: data.gender,
          age: data.age,
          recaptcha_token: data.recaptcha
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach(err => {
            setError(err.field, { type: 'server', message: err.message });
          });
        } else {
          setServerError(result.message || 'Ошибка сервера при регистрации');
        }
        return;
      }

      if (result.status === 'success') {
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          onRegisterSuccess?.(result.token);
        }
        onClose?.();
      }
    } catch (error) {
      console.error('Error:', error);
      setServerError(error.message || 'Произошла ошибка при регистрации');
      recaptchaRef.current?.reset();
    }
  };

  const onRecaptchaChange = (token) => {
    setValue('recaptcha', token);
    clearErrors('recaptcha');
    trigger('recaptcha');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="registration-form">
      {serverError && <div className="server-error">{serverError}</div>}

      <div className="form-group">
        <label htmlFor="username">Имя пользователя:</label>
        <input
          type="text"
          id="username"
          {...register('username', { 
            required: 'Обязательное поле',
            minLength: { 
              value: 2, 
              message: 'Минимум 2 символа' 
            },
            maxLength: {
              value: 15,
              message: 'Максимум 15 символов'
            },
            pattern: {
              value: /^[A-Za-zА-Яа-яЁё\s-]+$/,
              message: 'Только буквы, пробелы и дефисы'
            }
          })}
        />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="lastname">Фамилия пользователя:</label>
        <input
          type="text"
          id="lastname"
          {...register('lastname', { 
            required: 'Обязательное поле',
            minLength: { 
              value: 2, 
              message: 'Минимум 2 символа' 
            },
            maxLength: {
              value: 15,
              message: 'Максимум 15 символов'
            },
            pattern: {
              value: /^[A-Za-zА-Яа-яЁё\s-]+$/,
              message: 'Только буквы, пробелы и дефисы'
            }
          })}
        />
        {errors.lastname && <span className="error">{errors.lastname.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="login">Логин пользователя:</label>
        <input
          type="text"
          id="login"
          {...register('login', { 
            required: 'Обязательное поле',
            minLength: { 
              value: 6, 
              message: 'Минимум 6 символов' 
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Только латинские буквы, цифры и подчеркивание'
            }
          })}
          onBlur={handleLoginBlur}
        />
        {errors.login && <span className="error">{errors.login.message}</span>}
        {isChecking && watch('login') && !errors.login && (
          <span className="checking">Проверка...</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'Обязательное поле',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Некорректный email'
            }
          })}
          onBlur={handleEmailBlur}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
        {isChecking && watch('email') && !errors.email && (
          <span className="checking">Проверка...</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          {...register('password', {
            required: 'Обязательное поле',
            minLength: { 
              value: 8, 
              message: 'Минимум 8 символов' 
            },
            validate: validatePassword
          })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password_check">Подтверждение пароля:</label>
        <input
          type="password"
          id="password_check"
          {...register('password_check', {
            required: 'Обязательное поле',
            validate: (value) => value === password || 'Пароли не совпадают'
          })}
        />
        {errors.password_check && <span className="error">{errors.password_check.message}</span>}
      </div>

      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="checkbox_check"
          {...register('checkbox_check', { required: 'Необходимо согласие' })}
        />
        <label htmlFor="checkbox_check">Я принимаю условия использования</label>
        {errors.checkbox_check && <span className="error">{errors.checkbox_check.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="age">Возраст:</label>
        <select 
          id="age" 
          {...register('age', { required: 'Выберите возраст' })}
        >
          <option value="">Выберите возраст</option>
          <option value="18">18-25 лет</option>
          <option value="26">26-35 лет</option>
          <option value="36">36-45 лет</option>
          <option value="46">46-55 лет</option>
          <option value="56">56-65 лет</option>
          <option value="66">66+ лет</option>
        </select>
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <div className="form-group">
        <label>Пол:</label>
        <div className="radio-group">
          <div>
            <input 
              type="radio" 
              id="male" 
              value="Male" 
              {...register('gender', { required: 'Выберите пол' })} 
            />
            <label htmlFor="male">Мужской</label>
          </div>
          <div>
            <input 
              type="radio" 
              id="female" 
              value="Female" 
              {...register('gender', { required: 'Выберите пол' })} 
            />
            <label htmlFor="female">Женский</label>
          </div>
        </div>
        {errors.gender && <span className="error">{errors.gender.message}</span>}
      </div>

      <div className="form-group">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LfCASErAAAAAMj7ASH-Piu3L_2gKVuEF36gBHb7"
          onChange={onRecaptchaChange}
        />
        {errors.recaptcha && <span className="error">{errors.recaptcha.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || isChecking}
        className="submit-button"
      >
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default Form_registration;