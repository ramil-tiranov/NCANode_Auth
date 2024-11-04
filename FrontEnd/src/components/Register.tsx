import React, { useState, useRef } from 'react';
import axios, { AxiosError } from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { signData } from '../api/ncalayer-service'; // Импорт функции для подписи
import './style/Register.css';

interface ErrorResponse {
  message: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [cms, setcms] = useState<string | null>(null); // Используем правильный регистр
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>(''); // Добавляем состояние для успешного сообщения
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleRegister = async () => {
    if (!cms) {
      setErrorMessage('Сначала получите подпись.');
      setTimeout(clearMessages, 10000); // Удалить сообщение через 10 секунд
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/auth/signup', {
        email,
        phoneNumber,
        password,
        cms, 
      });
      setSuccessMessage('Регистрация успешна!');
      setTimeout(() => navigate('/login'), 2000); // Переход на страницу логина после сообщения
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; 
      if (axiosError.response) {
        setErrorMessage(axiosError.response.data.message || 'Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
      } else {
        setErrorMessage('Ошибка сети. Пожалуйста, попробуйте еще раз.');
      }
      setTimeout(clearMessages, 10000);
    }
  };

  const handleSign = async () => {
    if (!email || !phoneNumber || !password) {
      setErrorMessage('Пожалуйста, заполните все поля.');

      if (!email) emailRef.current?.focus();
      else if (!phoneNumber) phoneNumberRef.current?.focus();
      else if (!password) passwordRef.current?.focus();
      
      setTimeout(clearMessages, 10000);
      return;
    }

    const dataToSign = `Email: ${email}, Phone: ${phoneNumber}`;

    try {
      const signedData = await signData(dataToSign, 'registration'); // Передаем тип действия
      if (signedData) {
        setcms(signedData); // Сохраняем смс после успешной подписи
        setSuccessMessage('Подпись успешно получена в формате CMS!');
      } else {
        setErrorMessage('Не удалось получить подпись.');
      }
      setTimeout(clearMessages, 10000);
    } catch (error) {
      console.error('Ошибка при подписи данных:', error);
      setErrorMessage('Ошибка при подписи данных. Пожалуйста, попробуйте еще раз.');
      setTimeout(clearMessages, 10000);
    }
  };

  return (
    <div className="register-container">
      <h1>Регистрация</h1>
      <p className="register-NCALayer">Перед регистрацией запустите NCALayer</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
        ref={emailRef}
        autoComplete="email"
      />
      <input
        type="tel"
        placeholder="Номер телефона"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="register-input"
        ref={phoneNumberRef}
        autoComplete="tel"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
        ref={passwordRef}
      />
      <button onClick={handleSign} className="register-button">
        Подписать данные
      </button>
      <button onClick={handleRegister} className="register-button">
        Зарегистрироваться
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button onClick={() => navigate('/login')} className="register-button">
        Уже зарегистрированы?
      </button>
    </div>
  );
};

export default Register;
