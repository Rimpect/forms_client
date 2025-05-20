import React, { useState, useEffect } from 'react';
import Modal from './Modal_window';
import Form_registration from './Form_registration';
import AuthorizationForm from './Autorization_form';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
 useEffect(() => {
    if (localStorage.getItem('token')) {
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = () => {
        window.history.go(1);
      };
    }
    
    return () => {
      window.onpopstate = null;
    };
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token from storage:', token); // Для отладки
    setIsAuthenticated(!!token);
  }, []);

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setRegistrationSuccess(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLoginSuccess = (token) => {
    console.log('Login success with token:', token); // Для отладки
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    closeModal();
    navigate('/profile');
  };

  const handleRegisterSuccess = () => {
    closeModal();
    setRegistrationSuccess(true);
    openModal('login');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/lab_2/api/auth/logout', {
        method: 'POST', 
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Logout failed');
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">LOGO</div>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="auth-button logout-btn">
              Выйти
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <Modal 
        isOpen={activeModal === 'login'} 
        onClose={closeModal}
        title={registrationSuccess ? "Добро пожаловать!" : "Авторизация"}
      >
        {registrationSuccess && (
          <div className="success-message">
            <p>Регистрация прошла успешно! Теперь вы можете войти.</p>
          </div>
        )}
        <AuthorizationForm 
          onClose={closeModal} 
          onLoginSuccess={handleLoginSuccess} 
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={closeModal}
        title="Регистрация"
      >
        <Form_registration 
          onClose={closeModal} 
          onRegisterSuccess={handleRegisterSuccess}
        />
      </Modal>
    </header>
  );
};

export default Header;