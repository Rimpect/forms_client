import React from 'react';
import { useTheme } from 'react-switch-theme';

const Change_theme = () => {
  const { theme, toggleTheme } = useTheme(); // Используем useTheme

  return (
    <button onClick={toggleTheme}> {/* Передаем функцию toggleTheme */}
      {theme === 'light' ? '🌙 Темная тема' : '🌞 Светлая тема'}
    </button>
  );
};

export default Change_theme;