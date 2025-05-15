import React, { useState, useEffect } from 'react'; // Правильный импорт
import './PersonalAccount.css';

const Personal_account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost/forms/api/profile.php', {
        credentials: 'include'
      });
      
      // Проверяем Content-Type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Неверный формат ответа');
      }
      
      const data = await response.json();
      
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Ошибка загрузки профиля');
      }
      
      setUserData(data.user);
      setTheme(data.user.theme || 'light');
      document.body.className = data.user.theme || 'light';
      
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);
  const handleThemeChange = async (newTheme) => {
  try {
    const response = await fetch('http://localhost/forms/api/update_theme.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: newTheme })
    });
    
    // Проверка статуса ответа
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      setTheme(newTheme);
      document.body.className = newTheme;
      
      // Обновляем данные пользователя
      setUserData(prev => ({
        ...prev,
        theme: newTheme
      }));
    } else {
      throw new Error(data.message || 'Ошибка сохранения темы');
    }
  } catch (error) {
    console.error('Ошибка смены темы:', error);
    alert('Не удалось сохранить тему: ' + error.message);
  }
};
   return (
    <div className={`personal-account ${theme}`}>
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
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            {loading && <p>Загрузка данных...</p>}
            {error && <p className="error">{error}</p>}
            {userData && (
              <>
                <h2>Мои данные</h2>
                <p><strong>Имя:</strong> {userData.first_name}</p>
                <p><strong>Фамилия:</strong> {userData.last_name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                
                <div className="theme-selector">
                  <strong>Тема:</strong>
                  <div className="theme-options">
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={theme === 'light'}
                        onChange={() => handleThemeChange('light')}
                      />
                      Светлая
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={() => handleThemeChange('dark')}
                      />
                      Темная
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'users' && <UsersList theme={theme} />}
        {activeTab === 'stats' && <Statistics theme={theme} />}
      </div>
    </div>
  );
};

// Компонент списка пользователей (упражнение 1)
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    fetch('http://localhost/forms/api/users_list.php', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setUsers(data.users);
        } else {
          setError(data.message || 'Ошибка загрузки данных');
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
    fetch('http://localhost/forms/api/statistics.php', {
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.status === 'success') {
          setStats(data.stats);
        } else {
          setError(data.message || 'Ошибка загрузки статистики');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>Нет данных</div>;

  return (
    <div className="statistics">
      <h2>Статистика сайта</h2>
      <p><strong>Всего пользователей:</strong> {stats.total_users}</p>
      <p><strong>Зарегистрировано в этом месяце:</strong> {stats.month_users}</p>
      <p><strong>Последний зарегистрированный пользователь:</strong> 
        {stats.last_user?.first_name} {stats.last_user?.last_name} 
        ({stats.last_user?.created_at ? new Date(stats.last_user.created_at).toLocaleDateString() : 'N/A'})
      </p>
    </div>
  );
};

export default Personal_account;