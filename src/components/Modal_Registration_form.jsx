import React, { useState } from 'react';
import Registration_form from './Registration_form';
import './Modal_Registration_form.css'; // Подключаем стили

const Modal_Registration_form = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Кнопка открытия модального окна */}
      <button onClick={handleOpenModal}>Регистрация</button>
      
      {/* Модальное окно */}
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              ×
            </span>
            <h2>Регистрация</h2>
            <Registration_form /> {/* Ваш компонент формы */}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal_Registration_form;
