import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style/CompanyList.css';
import NavBar from '../components/NavBar';
import defaultCompanyLogo from './img/companyimage.jpg'; // Импортируем дефолтный логотип

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

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : null;

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!token) {
        setErrorMessage('Токен не найден, пожалуйста, войдите в систему');
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/company', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setCompanies(response.data);
      } catch (error) {
        setErrorMessage('Не удалось загрузить список компаний');
        console.error('Ошибка при получении данных о компаниях:', error);
      }
    };

    fetchCompanies();
  }, [token]);

  return (
    <>
      <NavBar />
      <div className="company-list-container">
        <h1 className="company-list-header">Список компаний</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="company-list">
          {companies.length === 0 ? (
            <p>Нет доступных компаний</p>
          ) : (
            companies.map((company) => (
              <div key={company._id} className="company-card">
                <Link to={`/company/${company._id}`} className="company-link">
                  <div className="company-card-header">
                    <h2 className="company-name">{company.companyName}</h2>
                    <p className="company-feedbacks">{company.feedbacks.length} отзыва(ов)</p>
                  </div>
                  <div className="company-card-body">
                    <div className="company-logo-container">
                      <img
                        src={company.logo ? company.logo : defaultCompanyLogo} // Если логотип компании нет, ставим дефолтный
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
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyList;
