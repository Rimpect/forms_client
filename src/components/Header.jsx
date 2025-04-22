import React from 'react';
import './Header.css';

const Header = ({ openModal }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">LOGO</div>
        <div className="auth-buttons">
          <button 
            onClick={() => openModal('login')}
            className="auth-button login-btn"
          >
            Вход
          </button>
          <button 
            onClick={() => openModal('register')}
            className="auth-button register-btn"
          >
            Регистрация
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;