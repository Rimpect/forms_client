import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Personal_account.css'

const Personal_account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/lab_2/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setUserData(data.user);
          setCurrentTheme(data.user.theme || 'light');
          applyTheme(data.user.theme || 'light');
        } else {
          setError(data.message || 'Ошибка загрузки профиля');
        }
      } catch (err) {
        setError('Ошибка соединения');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'profile') {
      fetchProfile();
    }
  }, [activeTab, navigate]);

  const applyTheme = (theme) => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  };

 const handleThemeToggle = async () => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('lab_2/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ theme: newTheme }),
      });

     if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    
      if (data.status === 'success') {
        setCurrentTheme(newTheme);
        applyTheme(newTheme);
        if (userData) {
          setUserData({ ...userData, theme: newTheme });
        }
      } else {
        setError(data.message || 'Не удалось обновить тему');
      }
    } catch (err) {
      console.error('Error updating theme:', err);
      setError(`Ошибка: ${err.message}`);
    }
};

  return (
    <div className={`personal-account ${currentTheme}`}>
      <h1>Личный кабинет</h1>
      
      <div className="account-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Мой профиль
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Список пользователей
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Статистика
        </button>
        <button 
          className="theme-toggle"
          onClick={handleThemeToggle}
        >
          {currentTheme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            {loading && <p>Загрузка данных...</p>}
            {error && <p className="error">{error}</p>}
            {userData ? (
              <>
                <h2>Мои данные</h2>
                <p><strong>Имя:</strong> {userData.first_name}</p>
                <p><strong>Фамилия:</strong> {userData.last_name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Тема:</strong> {userData.theme}</p>
              </>
            ) : (
              !loading && !error && <p>Добро пожаловать в ваш личный кабинет!</p>
            )}
          </div>
        )}
        
        {activeTab === 'users' && <UsersList />}
        {activeTab === 'stats' && <Statistics />}
      </div>
    </div>
  );
}

// Компонент списка пользователей (упражнение 1)
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/lab_2/api/users', {
      'Authorization': `Bearer ${token}`
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setUsers(data.users);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="users-list">
      <h2>Список пользователей</h2>
      {loading && <p>Загрузка списка пользователей...</p>}
      {error && <p className="error">{error}</p>}
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.last_name} {user.first_name} ({user.email})
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>Нет данных о пользователях</p>
      )}
    </div>
  );
};

// Компонент статистики (упражнение 2)
const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/lab_2/api/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setStats(data.stats);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="statistics">
      <h2>Статистика сайта</h2>
      {loading && <p>Загрузка статистики...</p>}
      {error && <p className="error">{error}</p>}
      {stats && (
        <>
          <p><strong>Всего пользователей:</strong> {stats.total_users}</p>
          <p><strong>Зарегистрировано в этом месяце:</strong> {stats.month_users}</p>
          <p><strong>Последний зарегистрированный пользователь:</strong> 
            {stats.last_user.first_name} {stats.last_user.last_name} 
            ({new Date(stats.last_user.created_at).toLocaleDateString()})
          </p>
        </>
      )}
    </div>
  );
};

export default Personal_account;