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
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setRegistrationSuccess(false); // Сбрасываем статус успеха при открытии любой модалки
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    closeModal();
    navigate('/components/Personal_account');
  };

  const handleRegisterSuccess = () => {
    closeModal();
    setRegistrationSuccess(true); // Устанавливаем флаг успешной регистрации
    openModal('login'); // Открываем форму входа
  };

  const handleLogout = async () => {
    try {
      await fetch('/lab_2/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
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

      {/* Модальное окно авторизации */}
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

      {/* Модальное окно регистрации */}
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