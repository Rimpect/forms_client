import React, { useState } from 'react';
import Modal from './Modal_window';
import Form_registration from './Form_registration';
import AuthorizationForm from './Autorization_form';
import './Header.css';

const Header = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

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

      <Modal 
        isOpen={activeModal === 'login'} 
        onClose={closeModal}
        title="Авторизация"
      >
        <AuthorizationForm onClose={closeModal} />
      </Modal>

      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={closeModal}
        title="Регистрация"
      >
        <Form_registration onClose={closeModal} />
      </Modal>
    </header>
  );
};

export default Header;