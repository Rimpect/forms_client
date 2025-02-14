import React from 'react';

const Form_registration = () => {
  return (
    <form action="#" method="post">
      <label htmlFor="username">Имя пользователя:</label><br />
      <input type="text" id="username" name="username" /><br />

      <label htmlFor="lastname">Фамилия пользователя:</label><br />
      <input type="text" id="lastname" name="lastname" /><br />

      <label htmlFor="login">Логин пользователя:</label><br />
      <input type="text" id="login" name="login" /><br />
      
      <label htmlFor="email">Email:</label><br />
      <input type="email" id="email" name="email" /><br />
      
      <label htmlFor="password">Пароль:</label><br />
      <input type="password" id="password" name="password" /><br />

      <label htmlFor="password_check">Пароль:</label><br />
      <input type="password" id="password_check" name="password_check" /><br />

      <label htmlFor="checkbox_check">Я принимаю условия использования</label><br />
      <input type="checkbox" id="checkbox_check" name="checkbox_check" /><br />

      <label htmlFor="age">Возраст</label><br />
      <input type="list" id="age" name="age" /><br />
      
      <label htmlFor="gender">Пол</label><br />
      <input type="radiobutton" id="gender" name="gender" /><br />

      <input type="submit" value="Зарегистрироваться" />
    </form>
  );
};

export default Form_registration;