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
    const response = await fetch('http://localhost/forms/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      localStorage.setItem('authToken', result.token);
      if (onLoginSuccess) {
        onLoginSuccess(result.token); // Важно: вызываем колбэк
      }
      // navigate вызывается в Header после onLoginSuccess
    } else {
      setError(result.message || 'Неверный логин или пароль');
    }
  } catch (err) {
    setError('Ошибка соединения');
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