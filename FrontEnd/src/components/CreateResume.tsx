import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signData } from '../api/ncalayer-service';
import NavBar from '../components/NavBar'; // Import NavBar component
import './style/CreateResume.css';

const CreateResume: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [bio, setComment] = useState<string>('');
  const [contacts, setPhone] = useState<string>('');
  const [cms, setSignature] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const profilePicture = "null";

  const navigate = useNavigate();

  const clearErrorMessage = () => setErrorMessage('');
  const clearSuccessMessage = () => setSuccessMessage('');

  const handleNavigateBack = () => navigate('/admin');

  const handleSignData = async () => {
    if (!email || !firstName || !lastName || !bio || !contacts) {
      setErrorMessage('Пожалуйста, заполните все поля.');
      setTimeout(clearErrorMessage, 10000);
      return;
    }

    const dataToSign = `email: ${email}, firstName: ${firstName}, lastName: ${lastName}, bio: ${bio}, profilePicture: ${profilePicture}, contacts: ${contacts}`;

    try {
      const signedData = await signData(dataToSign, 'resume_creation');
      if (signedData) {
        setSignature(signedData);
        setSuccessMessage('Данные успешно подписаны!');
        setTimeout(clearSuccessMessage, 10000);
      } else {
        setErrorMessage('Не удалось получить подпись.');
        setTimeout(clearErrorMessage, 10000);
      }
    } catch (error) {
      console.error('Ошибка при подписи данных:', error);
      setErrorMessage('Ошибка при подписи данных. Пожалуйста, попробуйте еще раз.');
      setTimeout(clearErrorMessage, 10000);
    }
  };

  const handleAddResume = async () => {
    if (!cms) {
      setErrorMessage('Сначала получите подпись.');
      setTimeout(clearErrorMessage, 10000);
      return;
    }

    const resumeData = {
      email,
      firstName,
      lastName,
      bio,
      profilePicture,
      contacts,
      cms,
    };

    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    try {
      const response = await axios.post('http://localhost:4000/profile/', resumeData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Резюме добавлено:', response.data.message);

      setEmail('');
      setFirstName('');
      setLastName('');
      setComment('');
      setPhone('');
      setSignature(null);
      setSuccessMessage('Резюме успешно добавлено!');
      setTimeout(clearSuccessMessage, 10000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setErrorMessage('Вы не можете создавать резюме.');
      } else {
        console.error('Ошибка при добавлении резюме:', error);
        setErrorMessage('Ошибка при добавлении резюме. Пожалуйста, попробуйте еще раз.');
      }
      setTimeout(clearErrorMessage, 10000);
    }
  };

  return (
    <>
      <NavBar /> {/* NavBar component at the top */}
      <div className="create-resume-container">
        <h2>Создание нового резюме</h2>
        <input
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Электронная почта"
        />
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
        <textarea
          className="input-field"
          value={bio}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий"
        />
        <input
          type="tel"
          className="input-field"
          value={contacts}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Телефон"
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
    </>
  );
};

export default CreateResume;
