import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthorizationForm = ({ onClose }) => {
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost/forms/api/login.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Сервер вернул не JSON-ответ');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }
        navigate('/components/Personal_account');
        if (onClose) onClose(); 
      } else {
        setError(result.message || 'Неверный логин или пароль');
      }
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError('Ошибка сервера. Попробуйте позже.');
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>Вход в систему</h2>
      
      <div>
        <label htmlFor="login">Логин:</label>
        <input 
          type="text" 
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
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
        />
      </div>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <button type="submit">Войти</button>
        {onClose && (
          <button type="button" onClick={onClose}>Отмена</button>
        )}
      </div>
    </form>
  );
};

export default AuthorizationForm;