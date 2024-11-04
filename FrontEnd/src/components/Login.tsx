import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/Login.css';

// Интерфейс для пользователя
interface User {
  email: string;
  phone: string;
  password: string;
}

const Login: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [identifier, setIdentifier] = useState<string>(''); // Изменяем на identifier для email или телефона
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/auth/users'); // Обновите URL, если необходимо
        setUsers(response.data);
      } catch (error) {
        console.error('Ошибка получения пользователей:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        identifier, // Используем идентификатор (email или телефон)
        password,
      });

      const user = response.data; // Предполагаем, что ответ содержит данные пользователя

      if (user) {
        alert('Вход выполнен успешно!');
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/admin'); 
      } else {
        setErrorMessage('Неправильный email или пароль.');
      }
    } catch (error) {
      setErrorMessage('Неправильный email или пароль.'); // Обработайте ошибку, если вход не удался
      console.error('Ошибка при входе:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>Вход</h1>
      <input 
        type="text" 
        placeholder="Email или Номер телефона" // Измените подсказку
        value={identifier} 
        onChange={(e) => setIdentifier(e.target.value)} 
        className="login-input"
      />
      <input 
        type="password" 
        placeholder="Пароль" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">Войти</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button onClick={() => navigate('/register')} className="login-button">
        Еще не зарегистрирован?
      </button>
    </div>
  );
};

export default Login;
