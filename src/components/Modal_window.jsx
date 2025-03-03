import React from 'react';
import './Modal_window.css'; 
const Modal_window = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Если isOpen === false, ничего не рендерим
  
    return (
      <div>
        <button onClick={onClose}>Закрыть</button>
        {children}
      </div>
    );
  };
  
  export default Modal_window;