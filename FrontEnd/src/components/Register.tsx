import React, { useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { signData } from '../api/ncalayer-service';
import './style/Register.css';

interface ErrorResponse {
  message: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // Renamed from companyName
  const [password, setPassword] = useState<string>('');
  const [cms, setCms] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null); // Renamed from companyNameRef
  const passwordRef = useRef<HTMLInputElement>(null);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleRegister = async () => {
    if (!cms) {
      setErrorMessage('Сначала получите подпись.');
      setTimeout(clearMessages, 10000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/auth/signup', {
        email,
        phoneNumber, // Changed to phoneNumber
        password,
        cms,
      });
      setSuccessMessage('Регистрация успешна!');
      setTimeout(() => navigate('/login'), 2000);
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

    const dataToSign = `Email: ${email}, Phone Number: ${phoneNumber}`;

    try {
      const signedData = await signData(dataToSign, 'registration');
      if (signedData) {
        setCms(signedData);
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
      <h1>Create an account</h1>
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
        placeholder="Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="register-input"
        ref={phoneNumberRef}
        autoComplete="tel"
      />
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
          ref={passwordRef}
        />
        
      </div>
      <div className="input-hint">
        <span>• Use 8 or more characters</span>
        <span>• Use upper and lower case letters (e.g. Aa)</span>
        <span>• Use a number (e.g. 1234)</span>
        <span>• Use a symbol (e.g. !@#$)</span>
      </div>
      <button onClick={handleSign} className="register-button">
        Получить подпись
      </button>
      <button onClick={handleRegister} className="register-button">
        Зарегистрироваться
      </button>
      <button onClick={() => navigate('/login')} className="register-button">
        Уже зарегистрированы?
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <p style={{ fontSize: '12px', marginTop: '20px' }}>
        By creating an account, you agree to the <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default Register;
