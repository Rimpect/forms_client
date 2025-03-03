import React, { useState } from 'react';
import Modal from './Modal_window';
import Form_registration from './Form_registration';
import Form_Autorization from './Autorization_form';
import './Header.css'; 
const Header = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const openLoginModal = () => {
    setLoginModalOpen(true); // Открываем окно входа
    setRegisterModalOpen(false); // Закрываем окно регистрации
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true); // Открываем окно регистрации
    setLoginModalOpen(false); // Закрываем окно входа
  };

  return (
    <header className="border-2 border-red-500">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <div>Header content</div>
        <div>LOGO</div>
        <button onClick={openLoginModal}>Вход</button>
        <button onClick={openRegisterModal}>Регистрация</button>
      </div>

      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <Form_Autorization onClose={() => setLoginModalOpen(false)} />
      </Modal>

      <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)}>
        <Form_registration onClose={() => setRegisterModalOpen(false)} />
      </Modal>
    </header>
  );
};

export default Header;