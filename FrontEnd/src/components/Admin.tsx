import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './style/Admin.css';
import defaultProfileImage from './img/noimage.jpg';
// import defaultProfileImage from './img/вк ава.jpg';

interface Resume {
  _id: string;
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture?: string;
  contacts: string;
  feedbacks: Array<{ rating: number }>; // Каждое сообщение о фидбеке содержит rating
  position: string;
  department: string;
}

const Admin: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const navigate = useNavigate();

  const getToken = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:4000/profile/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setResumes(response.data);
      } catch (error) {
        console.error('Ошибка получения резюме:', error);
      }
    };
    fetchResumes();
  }, []);

  const handleResumeClick = (email: string) => {
    navigate(`/resume/${email}`);
  };

  // Функция для вычисления среднего рейтинга
  const calculateAverageRating = (feedbacks: Array<{ rating: number }>) => {
    if (feedbacks.length === 0) return 'Не оценен'; // Если нет отзывов, показываем "Не оценен"
    
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length; // Средний рейтинг

    return `⭐️`.repeat(Math.round(averageRating)); // Показываем звездочки в зависимости от среднего рейтинга
  };

  return (
    <div className="admin-container">
      <NavBar />

      <main className="main-content">
        <h2>Созданные резюме</h2>
        <ul className="resume-list">
          {resumes.map((resume) => {
            const ratingText = calculateAverageRating(resume.feedbacks); // Получаем рейтинг

            return (
              <li key={resume._id} className="resume-item" onClick={() => handleResumeClick(resume.email)}>
                <div className="profile-main-info">
                  {/* Проверка, если profilePicture отсутствует или равно "null", отображаем defaultProfileImage */}
                  <img
  src={
    resume.profilePicture && resume.profilePicture !== "null" && resume.profilePicture !== ""
      ? `data:image/png;base64,${resume.profilePicture}`
      : defaultProfileImage
  }
  alt={`${resume.firstName} ${resume.lastName}`}
  className="profile-picture"
/>



                  <div>
                    <h3>{resume.firstName} {resume.lastName}</h3>
                    <p>{resume.position}</p>
                    <p>{resume.department}</p>
                    <div className="rating">{ratingText}</div> {/* Отображение рейтинга */}
                  </div>
                </div>
                <div className="profile-contact-info">
                  <p>📞 {resume.contacts}</p>
                  <p>✉️ {resume.email}</p>
                  <p>📍 571 Nazarbaev st.</p>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export default Admin;
