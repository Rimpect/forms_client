import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

const Form_registration = ({ onClose, onRegisterSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger
  } = useForm();

  const recaptchaRef = React.useRef(null);
  const password = watch('password');
  const navigate = useNavigate();

  // Проверка пароля на сложность
  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
      return "Пароль должен содержать заглавные, строчные буквы(латинские), цифры и спецсимволы";
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      if (!data.recaptcha) {
        alert('Пожалуйста, подтвердите, что вы не робот');
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

      const text = await response.text();
      let result;
      
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON:", text);
        throw new Error("Ошибка сервера: неверный формат данных");
      }

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка сервера');
      }

      if (result.status === 'success') {
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          if (onRegisterSuccess) {
            onRegisterSuccess(result.token);
          }
        }
        if (onClose) onClose();
      } else {
        throw new Error(result.message || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    }
  };

  const onRecaptchaChange = (token) => {
    setValue('recaptcha', token);
    trigger('recaptcha');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {/* Имя пользователя */}
      <label htmlFor="username">Имя пользователя:</label>
      <br />
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
      <br />

      {/* Фамилия пользователя */}
      <label htmlFor="lastname">Фамилия пользователя:</label>
      <br />
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
      <br />

      {/* Логин */}
      <label htmlFor="login">Логин пользователя:</label>
      <br />
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
      />
      {errors.login && <span className="error">{errors.login.message}</span>}
      <br />

      {/* Email */}
      <label htmlFor="email">Email:</label>
      <br />
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
      />
      {errors.email && <span className="error">{errors.email.message}</span>}
      <br />

      {/* Пароль */}
      <label htmlFor="password">Пароль:</label>
      <br />
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
      <br />

      {/* Подтверждение пароля */}
      <label htmlFor="password_check">Подтверждение пароля:</label>
      <br />
      <input
        type="password"
        id="password_check"
        {...register('password_check', {
          required: 'Обязательное поле',
          validate: (value) => value === password || 'Пароли не совпадают'
        })}
      />
      {errors.password_check && <span className="error">{errors.password_check.message}</span>}
      <br />

      {/* Чекбокс */}
      <label htmlFor="checkbox_check">Я принимаю условия использования:</label>
      <br />
      <input
        type="checkbox"
        id="checkbox_check"
        {...register('checkbox_check', { required: 'Необходимо согласие' })}
      />
      {errors.checkbox_check && <span className="error">{errors.checkbox_check.message}</span>}
      <br />

      {/* Возраст */}
      <label htmlFor="age">Возраст:</label>
      <br />
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
      <br />

      {/* Пол */}
      <label>Пол:</label>
      <br />
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
      {errors.gender && <span className="error">{errors.gender.message}</span>}
      <br />

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LfCASErAAAAAMj7ASH-Piu3L_2gKVuEF36gBHb7"
        onChange={onRecaptchaChange}
      />
      {errors.recaptcha && <span className="error">Подтвердите, что вы не робот</span>}
      <br />

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Form_registration;