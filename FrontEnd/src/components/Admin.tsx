import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import StarRating from './StarRating';
import './style/Admin.css';

interface Resume {
  id: number;
  fullName: string;
  firstName: string; // Имя
  lastName: string; // Фамилия
  email: string; // Email
  comment: string;
  rating: number;
}

const Admin: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filter, setFilter] = useState<'rated' | 'notRated'>('rated');
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile/list');
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

  const handleResumeClick = (id: number) => {
    setSelectedResumeId(id);
    navigate(`/resume/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <h1>Страница администратора</h1>

      <Link to="/create-resume" className="admin-link">
        Создать резюме для пользователя
      </Link>

      <div className="filter-section">
        <button onClick={() => setFilter('rated')}>Оцененные</button>
        <button onClick={() => setFilter('notRated')}>Не оцененные</button>
      </div>

      <div className="resume-section">
        <h2>Резюме</h2>
        <ul className="resume-list">
          {filteredResumes().map(resume => (
            <li
              key={resume.id}
              onClick={() => handleResumeClick(resume.id)}
              className="resume-item"
            >
              {resume.firstName} {resume.lastName} ({resume.email}) - Оценка: {resume.rating !== null ? resume.rating : 'Нет оценки'}
            </li>
          ))}
        </ul>
      </div>

      {selectedResumeId && (
        <>
          <StarRating
            rating={resumes.find(resume => resume.id === selectedResumeId)?.rating || null}
            onRatingChange={(newRating) => {
              setResumes(prevResumes =>
                prevResumes.map(resume =>
                  resume.id === selectedResumeId ? { ...resume, rating: newRating } : resume
                )
              );
            }}
          />
        </>
      )}

      <button onClick={handleLogout} className="logout-button">Выйти</button>
    </div>
  );
};

export default Admin;
