import React from 'react';

const Autorization_form = () => {
  return (
    <form action="#" method="post">
     
      <label htmlFor="login">Логин пользователя:</label><br />
      <input type="text" id="login" name="login" /><br />
            
      <label htmlFor="password">Пароль:</label><br />
      <input type="password" id="password" name="password" /><br />

      <input type="submit" value="Войти" />
    </form>
  );
};

export default Autorization_form;