import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './style/Profile.css';
import defaultProfileImage from './img/вк ава.jpg';
import { signData } from '../api/ncalayer-service';

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture?: string;
  contacts: string;
  pin: string;
  createdAt: string;
}

const UserProfileComponent: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contacts, setContacts] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(defaultProfileImage);
  const [signature, setSignature] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;

      if (!token) {
        console.error('Необходимо войти в систему');
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const fetchedProfile: UserProfile = response.data;
        setUserProfile(fetchedProfile);
        setFirstName(fetchedProfile.firstName);
        setLastName(fetchedProfile.lastName);
        setContacts(fetchedProfile.contacts);
        setBio(fetchedProfile.bio);
        setImagePreview(
          fetchedProfile.profilePicture && fetchedProfile.profilePicture !== "null" && fetchedProfile.profilePicture !== ""
            ? `data:image/png;base64,${fetchedProfile.profilePicture}`
            : defaultProfileImage
        );
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const clearErrorMessage = () => setErrorMessage('');
  const clearSuccessMessage = () => setSuccessMessage('');

  const handleSignData = async () => {
    if (!firstName || !lastName || !contacts || !bio) {
      setErrorMessage('Пожалуйста, заполните все поля.');
      setTimeout(clearErrorMessage, 5000);
      return;
    }

    const dataToSign = `email: ${userProfile?.email}, firstName: ${firstName}, lastName: ${lastName}, bio: ${bio}, contacts: ${contacts}`;
    try {
      const signedData = await signData(dataToSign, 'profile_update');
      if (signedData) {
        setSignature(signedData);
        setSuccessMessage('Данные успешно подписаны!');
        setTimeout(clearSuccessMessage, 5000);
      } else {
        setErrorMessage('Не удалось получить подпись.');
        setTimeout(clearErrorMessage, 5000);
      }
    } catch (error) {
      console.error('Ошибка при подписи данных:', error);
      setErrorMessage('Ошибка при подписи данных. Пожалуйста, попробуйте еще раз.');
      setTimeout(clearErrorMessage, 5000);
    }
  };

  const handleEdit = async () => {
    if (!firstName || !lastName || !contacts || !bio) {
      setErrorMessage('Пожалуйста, заполните все поля.');
      setTimeout(clearErrorMessage, 5000);
      return;
    }

    if (!signature) {
      setErrorMessage('Пожалуйста, подпишите данные перед сохранением.');
      setTimeout(clearErrorMessage, 5000);
      return;
    }

    const updatedData = {
      email: userProfile?.email,
      firstName,
      lastName,
      contacts,
      bio,
      profilePicture: profileImage,
      cms: signature,
    };

    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    try {
      const response = await axios.put('http://localhost:4000/profile', updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Профиль обновлен:', response.data.message);
      setUserProfile({ ...userProfile, firstName, lastName, contacts, bio } as UserProfile);
      setSuccessMessage('Профиль успешно обновлен!');
      setTimeout(clearSuccessMessage, 5000);
      setEditing(false);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      setErrorMessage('Ошибка при обновлении профиля. Пожалуйста, попробуйте еще раз.');
      setTimeout(clearErrorMessage, 5000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Проверка формата изображения
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        setErrorMessage('Недопустимый формат изображения. Пожалуйста, выберите файл формата JPG, JPEG или PNG.');
        setTimeout(clearErrorMessage, 5000);
        return;
      }

      // Проверка размера изображения (например, не более 5 MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeInBytes) {
        setErrorMessage('Размер изображения превышает 5 MB. Пожалуйста, выберите более легкий файл.');
        setTimeout(clearErrorMessage, 5000);
        return;
      }

      // Если файл прошел проверку, конвертируем в base64 и обновляем состояние
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String.split(',')[1]);  // Сохраняем только base64 строку
        setImagePreview(base64String);  // Устанавливаем превью изображения
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setImagePreview(defaultProfileImage);
  };

  const handleNavigateBack = () => navigate('/admin');

  const handleCancelEdit = () => {
    setEditing(false);
    setFirstName(userProfile?.firstName || '');
    setLastName(userProfile?.lastName || '');
    setContacts(userProfile?.contacts || '');
    setBio(userProfile?.bio || '');
    setProfileImage(null);
    setImagePreview(userProfile?.profilePicture && userProfile.profilePicture !== "null"
      ? `data:image/png;base64,${userProfile.profilePicture}`
      : defaultProfileImage);
  };

  return (
    <>
      <NavBar />
      <div className="profile-container">
        <h1 className="profile-header">Профиль пользователя</h1>
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
              <label>О себе</label>
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
            <button onClick={handleSignData} className="profile-button">Подписать данные</button>
            <button onClick={handleEdit} className="profile-button">Сохранить</button>
            <button onClick={handleCancelEdit} className="profile-button">Отменить редактирование</button>
          </div>
        ) : (
          <div className="profile-grid">
            <div className="profile-image-column">
              <img
                src={imagePreview || defaultProfileImage}  // если imagePreview null, будет использовано defaultProfileImage
                alt="Profile"
                className="profile-image"
              />
              <button onClick={() => setEditing(true)} className="profile-button">Редактировать</button>
              {profileImage && <button onClick={handleDeleteImage} className="profile-button">Удалить изображение</button>}
            </div>
            <div className="profile-info-column">
              <p className="profile-info"><strong>Имя:</strong> {firstName}</p>
              <p className="profile-info"><strong>Фамилия:</strong> {lastName}</p>
              <p className="profile-info"><strong>О себе:</strong> {bio}</p>
            </div>
            <div className="profile-contact-column">
              <p className="profile-info"><strong>Контакты:</strong> {contacts}</p>
              <p className="profile-info"><strong>Email:</strong> {userProfile?.email}</p>
              <p className="profile-info"><strong>PIN:</strong> {userProfile?.pin}</p>
              <p className="profile-info"><strong>Дата регистрации:</strong> {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleString() : 'Не указана'}</p>
            </div>
          </div>
        )}
        <button onClick={handleNavigateBack} className="profile-button">Посмотреть резюме</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </>
  );
};

export default UserProfileComponent;
