import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signData } from '../api/ncalayer-service';
import defaultImage from './img/вк ава.jpg';
import './style/CreateResume.css';

const CreateResume: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contacts, setPhone] = useState<string>('');
  const [bio, setComment] = useState<string>('');
  const [cms, setSignature] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigate = useNavigate();

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleNavigateBack = () => navigate('/admin');

  const handleSignData = async () => {
    if (!firstName || !lastName || !email || !contacts || !bio) {
      setErrorMessage('Пожалуйста, заполните все поля.');
      setTimeout(clearMessages, 10000);
      return;
    }

    const dataToSign = `FullName: ${firstName} ${lastName}, Email: ${email}, Phone: ${contacts}, Comment: ${bio}`;

    try {
      const signedData = await signData(dataToSign, 'resume_creation');
      if (signedData) {
        setSignature(signedData);
        setSuccessMessage('Данные успешно подписаны!');
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

  const handleAddResume = async () => {
    if (!cms) {
      setErrorMessage('Сначала получите подпись.');
      setTimeout(clearMessages, 10000);
      return;
    }

    const newUserResume = {
      firstName,
      lastName,
      email,
      contacts,
      bio,
      cms,
      profilePicture: defaultImage,
    };

    const formData = new FormData();
    Object.entries(newUserResume).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Извлекаем объект user из Local Storage и получаем token
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    try {
      const response = await axios.post('http://localhost:4000/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Резюме добавлено:', response.data.message);

      // Очистка полей формы после успешной отправки
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setComment('');
      setSignature(null);
      setSuccessMessage('Резюме успешно добавлено!');
      setTimeout(clearMessages, 10000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setErrorMessage('Вы не можете создавать резюме.');
      } else {
        console.error('Ошибка при добавлении резюме:', error);
        setErrorMessage('Ошибка при добавлении резюме. Пожалуйста, попробуйте еще раз.');
      }
      setTimeout(clearMessages, 10000);
    }
  };

  return (
    <div className="create-resume-container">
      <h2>Создание нового резюме</h2>
      <input
        type="text"
        className="input-field"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Имя"
      />
      <input
        type="text"
        className="input-field"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Фамилия"
      />
      <input
        type="email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Электронная почта"
      />
      <input
        type="tel"
        className="input-field"
        value={contacts}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Телефон"
      />
      <textarea
        className="input-field"
        value={bio}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Комментарий"
      />

      <button onClick={handleSignData} className="profile-button">
        Подписать данные
      </button>
      <button onClick={handleAddResume} className="profile-button">
        Добавить резюме
      </button>
      <button onClick={handleNavigateBack} className="profile-button">
        Вернуться к списку
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default CreateResume;
