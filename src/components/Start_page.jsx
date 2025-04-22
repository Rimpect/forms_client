// StartPage.js
import React, { useState } from 'react';
import Header from './Header';
import Modal from './Modal_window';
import Form_registration from './Form_registration';
import AuthorizationForm from './Autorization_form';

const Start_Page = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div>
      <Header openModal={openModal} />
      
      {/* Остальное содержимое StartPage */}

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
    </div>
  );
};

export default Start_Page;