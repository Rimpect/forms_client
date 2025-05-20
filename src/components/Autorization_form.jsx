import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthorizationForm = ({ onClose, onLoginSuccess }) => {
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/lab_2/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login, password })
      });
      console.log('Полный ответ:', response);
      const data = await response.json();
      console.log('Данные ответа:', data);
      if (data.status === 'success') {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', data.token);
        console.log('Токен сохранен:', data.token); // Проверьте в консоли
        onLoginSuccess(data.user);
        navigate('/profile');
      } else {
        setError(data.message || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка соединения');
      console.error('Login error:', err);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход в систему</h2>
      
      <div>
        <label htmlFor="login">Логин:</label>
        <input 
          type="text" 
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          minLength={3}
        />
      </div>
      
      <div>
        <label htmlFor="password">Пароль:</label>
        <input 
          type="password" 
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      {error && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      
      <div style={{ marginTop: '20px' }}>
        <button 
          type="submit" 
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Войти
        </button>
        {onClose && (
          <button 
            type="button" 
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default AuthorizationForm;