import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import './style/CompanyDetails.css';
import defaultCompanyLogo from './img/companyimage.jpg'; // Импорт дефолтного логотипа

interface Company {
  _id: string;
  companyId: string;
  companyName: string;
  email: string;
  bio: string;
  logo: string;
  contacts: string;
  contactNumber: string;
  feedbacks: any[];
}

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : null;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!token) {
        setErrorMessage('Токен не найден, пожалуйста, войдите в систему');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/company/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setCompany(response.data);
      } catch (error) {
        setErrorMessage('Не удалось загрузить информацию о компании');
        console.error('Ошибка при получении данных о компании:', error);
      }
    };

    fetchCompanyDetails();
  }, [id, token]);

  if (errorMessage) return <p className="error-message">{errorMessage}</p>;
  if (!company) return <p>Загрузка...</p>;

  return (
    <>
      <NavBar />
      <div className="company-details-container">
        <div className="company-header">
          <h1 className="company-name">{company.companyName}</h1>
          <p className="company-feedbacks">{company.feedbacks.length} отзыва(ов)</p>
        </div>
        <div className="company-main-info">
          <div className="company-logo-container">
            <img
              src={company.logo ? company.logo : defaultCompanyLogo} // Если логотип отсутствует, используем дефолтный
              alt={company.companyName}
              className="company-logo"
            />
          </div>
          <div className="company-info">
            <p><strong>Email:</strong> {company.email}</p>
            <p><strong>Биография:</strong> {company.bio}</p>
            <p><strong>Контакты:</strong> {company.contacts}</p>
            {company.contactNumber && <p><strong>Контактный номер:</strong> {company.contactNumber}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
