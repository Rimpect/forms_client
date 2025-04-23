import React, { useState } from 'react';
// import './PersonalAccount.css'; // Создадим файл стилей

const Personal_account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Состояние для данных пользователя
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных пользователя (если нужно)
  React.useEffect(() => {
    // Здесь можно добавить запрос к вашему profile.php
    // fetch('http://localhost/profile.php', { credentials: 'include' })
    //   .then(...)
  }, []);

  return (
    <div className="personal-account">
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

  React.useEffect(() => {
    fetch('http://localhost/forms/api/statistics.php', {
      credentials: 'include'
    })
      .then(response => response.json())
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