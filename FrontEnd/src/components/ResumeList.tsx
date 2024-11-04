
import React, { useState, useEffect } from 'react';

interface ResumeData {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
}

const ResumeList: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);

  useEffect(() => {
    // Загрузка списка резюме от сервера
    const fetchResumes = async () => {
      const response = await fetch('/api/resumes');
      const data = await response.json();
      setResumes(data);
    };
    fetchResumes();
  }, []);

  return (
    <div>
      <h2>Список резюме</h2>
      <ul>
        {resumes.map(resume => (
          <li key={resume.id}>{resume.firstName} {resume.lastName} - {resume.position}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeList;
