import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import StarRating from './StarRating';
import './style/Admin.css';

interface Resume {
  _id: string;
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
  contacts: string;
  feedbacks: Array<string>;
  rating: number | null;
  position: string;
  department: string;
}

const Admin: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filter, setFilter] = useState<'rated' | 'notRated'>('rated');
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

  const filteredResumes = () => {
    return filter === 'rated'
      ? resumes.filter(resume => resume.rating !== null)
      : resumes.filter(resume => resume.rating === null);
  };

  const handleResumeClick = (email: string) => {
    navigate(`/resume/${email}`);
  };

  return (
    <div className="admin-container">
      <h1>Страница администратора</h1>
      <Link to="/create-resume" className="admin-link">Создать резюме для пользователя</Link>

      <div className="filter-section">
        <button onClick={() => setFilter('rated')}>Оцененные</button>
        <button onClick={() => setFilter('notRated')}>Не оцененные</button>
      </div>

      <div className="resume-section">
        <h2>Резюме</h2>
        <ul className="resume-list">
          {filteredResumes().map(resume => (
            <li key={resume._id} className="resume-item" onClick={() => handleResumeClick(resume.email)}>
              <img
                src={resume.profilePicture}
                alt={`${resume.lastName}`}
                className="profile-picture"
              />
              <div className="resume-details">
                <h3>{resume.firstName} {resume.lastName}</h3>
                <p className="position">{resume.position}</p>
                <p className="department">{resume.department}</p>
                <StarRating rating={resume.__v || 0} onRatingChange={() => {}} />
              </div>
              <div className="contact-info">
                <p><i className="icon phone-icon"></i> +{resume.contacts}</p>
                <p><i className="icon email-icon"></i> {resume.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => navigate('/login')} className="logout-button">Выйти</button>
    </div>
  );
};

export default Admin;
