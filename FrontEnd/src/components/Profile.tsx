import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './style/Profile.css';
import StarRating from './StarRating';
import defaultProfileImage from './img/вк ава.jpg';

interface Resume {
  id: number;
  fullName: string;
  comment: string;
  rating: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
}

const Profile: React.FC = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/resumes/${id}`)
      .then(response => {
        const fetchedResume: Resume = response.data;
        setResume(fetchedResume);
        setFirstName(fetchedResume.firstName);
        setLastName(fetchedResume.lastName);
        setEmail(fetchedResume.email);
        setPhone(fetchedResume.phone);
        setComment(fetchedResume.comment);
        setRating(fetchedResume.rating);
        setImagePreview(fetchedResume.image || defaultProfileImage);
      })
      .catch(error => console.error('Ошибка загрузки резюме:', error));
  }, [id]);

  const handleEdit = async () => {
    if (resume) {
      const updatedResume: Partial<Resume> = { 
        firstName, 
        lastName,
        email,
        phone,
        comment, 
        rating,
      };
      
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('comment', comment);
      formData.append('rating', rating?.toString() || '');

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      try {
        const response = await axios.put(`http://localhost:5000/api/resumes/${resume.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data.message);
        setResume({ ...resume, ...updatedResume });
      } catch (error) {
        console.error('Ошибка обновления резюме:', error);
      }
    }
    setEditing(false);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setImagePreview(defaultProfileImage);
  };

  const handleNavigateBack = () => navigate('/admin');

  return (
    <div className="profile-container">
      <h1 className="profile-header">Профиль Резюме</h1>
      {editing ? (
        <div>
          <input type="text" className="input-field" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Имя" />
          <input type="text" className="input-field" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Фамилия" />
          <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" />
          <input type="text" className="input-field" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ваш комментарий" />
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
          <input type="file" onChange={handleImageChange} />
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
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
          </div>
          <div className="profile-contact-column">
            <p className="profile-info"><strong>Телефон:</strong> {phone}</p>
            <p className="profile-info"><strong>Email:</strong> {email}</p>
          </div>
        </div>
      )}
      <button onClick={handleNavigateBack} className="profile-button">Вернуться к списку</button>
    </div>
  );
};

export default Profile;
