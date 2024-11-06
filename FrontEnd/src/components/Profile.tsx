import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar'; 
import './style/Profile.css';
import defaultProfileImage from './img/вк ава.jpg';
import { signData } from '../api/ncalayer-service'; // Импортируем функцию подписания данных

interface Resume {
  _id: string;
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture?: string;
  contacts: string;
}

const Profile: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [contacts, setContacts] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null); // Стейт для подписи данных
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResume = async () => {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;

      if (!email) {
        console.error('Email is required in the URL');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/profile?email=${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const fetchedResume: Resume = response.data;
        setResume(fetchedResume);
        setFirstName(fetchedResume.firstName);
        setLastName(fetchedResume.lastName);
        setContacts(fetchedResume.contacts);
        setBio(fetchedResume.bio);
        setImagePreview(
          fetchedResume.profilePicture ? `data:image/png;base64,${fetchedResume.profilePicture}` : defaultProfileImage
        );
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };

    fetchResume();
  }, [email]);

  const clearErrorMessage = () => setErrorMessage('');
  const clearSuccessMessage = () => setSuccessMessage('');

  const handleSignData = async () => {
    if (!firstName || !lastName || !contacts || !bio) {
      setErrorMessage('Пожалуйста, заполните все поля.');
      setTimeout(clearErrorMessage, 10000);
      return;
    }

    const dataToSign = `email: ${email}, firstName: ${firstName}, lastName: ${lastName}, bio: ${bio}, profilePicture: ${profileImage}, contacts: ${contacts}`;

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

  const handleEdit = async () => {
    if (!firstName || !lastName || !contacts || !bio) {
      setErrorMessage('Пожалуйста, заполните все поля.');
      setTimeout(clearErrorMessage, 10000);
      return;
    }

    if (!signature) {
      setErrorMessage('Пожалуйста, подпишите данные перед сохранением.');
      setTimeout(clearErrorMessage, 10000);
      return;
    }

    // Подготовка данных для обновления профиля
    const updatedData = {
      email, // Убедитесь, что email передается в запросе
      firstName,
      lastName,
      contacts,
      bio,
      profilePicture: profileImage,
      cms: signature, // Передаем подпись в запрос
    };

    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    try {
      const response = await axios.put('http://localhost:4000/profile/', updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Профиль обновлен:', response.data.message);
      setResume({ ...resume, firstName, lastName, contacts, bio } as Resume);
      setSuccessMessage('Профиль успешно обновлен!');
      setTimeout(clearSuccessMessage, 10000);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      setErrorMessage('Ошибка при обновлении профиля. Пожалуйста, попробуйте еще раз.');
      setTimeout(clearErrorMessage, 10000);
    }
    setEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String.split(',')[1]);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setImagePreview(defaultProfileImage);
  };

  const handleNavigateBack = () => navigate('/admin');

  return (
    <>
      <NavBar /> 
      <div className="profile-container">
        <h1 className="profile-header">Профиль Резюме</h1>
        {editing ? (
          <div className="edit-form">
            <div className="input-group">
              <label>Имя</label>
              <input
                type="text"
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Имя"
              />
            </div>
            <div className="input-group">
              <label>Фамилия</label>
              <input
                type="text"
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Фамилия"
              />
            </div>
            <div className="input-group">
              <label>Контакты</label>
              <input
                type="text"
                className="input-field"
                value={contacts}
                onChange={(e) => setContacts(e.target.value)}
                placeholder="Контакты"
              />
            </div>
            <div className="input-group">
              <label>Биография</label>
              <textarea
                className="input-field"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Биография"
              />
            </div>
            <div className="input-group">
              <label>Изображение</label>
              <input type="file" onChange={handleImageChange} className="input-field" />
            </div>
            <button onClick={handleSignData} className="profile-button">
              Подписать данные
            </button>
            <button onClick={handleEdit} className="profile-button">Сохранить</button>
          </div>
        ) : (
          <div className="profile-grid">
            <div className="profile-image-column">
              <img src={imagePreview || defaultProfileImage} alt="Profile" className="profile-image" />
              <button onClick={() => setEditing(true)} className="profile-button">Редактировать</button>
              {profileImage && <button onClick={handleDeleteImage} className="profile-button">Удалить изображение</button>}
            </div>
            <div className="profile-info-column">
              <p className="profile-info"><strong>Имя:</strong> {firstName}</p>
              <p className="profile-info"><strong>Фамилия:</strong> {lastName}</p>
              <p className="profile-info"><strong>Биография:</strong> {bio}</p>
            </div>
            <div className="profile-contact-column">
              <p className="profile-info"><strong>Контакты:</strong> {contacts}</p>
              <p className="profile-info"><strong>Email:</strong> {email}</p>
            </div>
          </div>
        )}
        <button onClick={handleNavigateBack} className="profile-button">Вернуться к списку</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </>
  );
};

export default Profile;
