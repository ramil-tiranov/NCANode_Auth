import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './style/Admin.css';
import defaultProfileImage from './img/noimage.jpg';

interface Resume {
  _id: string;
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture?: string;
  contacts: string;
  feedbacks: Array<{ rating: number }>;
  position: string;
  department: string;
}

const Admin: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Add search state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const getToken = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  };


  const fetchResumes = async (page: number) => {
    try {
      setLoading(true);
      setError(null); // Reset error before making the request

      const token = getToken();
      const response = await axios.get('http://localhost:4000/profile/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: { page, limit: itemsPerPage },
      });

      if (response && response.data && Array.isArray(response.data.profiles)) {
        const data = response.data.profiles;
        setResumes(data);

        const totalCount = response.data.totalCount;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setResumes([]);
        setError('Unexpected data format received.');
      }
    } catch (error) {
      setError('Ошибка получения резюме');
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch resumes with search query
  const fetchResumesWithSearch = async (page: number, query: string) => {
    try {
      setLoading(true);
      setError(null); // Reset error before making the request
  
      const token = getToken();
      const response = await axios.get('http://localhost:4000/profile/search', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: { page, limit: itemsPerPage, query },
      });
  
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data; // Directly assign the response.data
        setResumes(data);
  
        const totalCount = response.data.length; // Modify this as needed for pagination
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setResumes([]);
        setError('Unexpected data format received.');
      }
    } catch (error) {
      setError('Ошибка получения резюме');
      console.error('Error fetching resumes with search:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (searchQuery) {
      fetchResumesWithSearch(currentPage, searchQuery); // Fetch resumes with search query
    } else {
      fetchResumes(currentPage); // Fetch all resumes if no search query
    }
  }, [currentPage, searchQuery]); // Trigger fetch when page or searchQuery changes

  const handleResumeClick = (email: string) => {
    navigate(`/resume/${email}`);
  };

  const calculateAverageRating = (feedbacks: Array<{ rating: number }>) => {
    if (feedbacks.length === 0) return 'Не оценен';
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;
    return `⭐️`.repeat(Math.round(averageRating));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination helper to create page number range with ellipses
  const getPageNumbers = () => {
    const pageNumbers = [];
    const range = 2; // Pages before and after the current page

    // First page
    pageNumbers.push(1);

    // Ellipsis before
    if (currentPage - range > 2) pageNumbers.push('...');

    // Pages around current page
    for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
      pageNumbers.push(i);
    }

    // Ellipsis after
    if (currentPage + range < totalPages - 1) pageNumbers.push('...');

    // Last page
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query); // Update search query
  };

  return (
    <div className="admin-container">
      <NavBar />

      <main className="main-content">
        <h2>Созданные резюме</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />

        {loading && <p>Загрузка...</p>} {/* Show loading indicator */}

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}

        {resumes.length === 0 ? (
          <p>Резюме не найдены</p> // No resumes found message
        ) : (
          <ul className="resume-list">
            {resumes.map((resume) => {
              const ratingText = calculateAverageRating(resume.feedbacks);

              return (
                <li key={resume._id} className="resume-item" onClick={() => handleResumeClick(resume.email)}>
                  <div className="profile-main-info">
                    <img
                      src={resume.profilePicture && resume.profilePicture !== "null" && resume.profilePicture !== ""
                        ? resume.profilePicture
                        : defaultProfileImage
                      }
                      alt={`${resume.firstName} ${resume.lastName}`}
                      className="profile-picture"
                    />
                    <div>
                      <h3>{resume.firstName} {resume.lastName}</h3>
                      <p>{resume.position}</p>
                      <p>{resume.department}</p>
                      <div className="rating">{ratingText}</div>
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
        )}

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            &#8592; Предыдущая
          </button>

          {/* Page number buttons with ellipses */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => {
                if (typeof page === 'number') {
                  handlePageClick(page);
                }
              }}
              className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
              disabled={page === '...'}
            > 
              {page}
            </button>
          ))}

          <button
            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Следующая &#8594;
          </button>
        </div>
      </main>
    </div>
  );
};

export default Admin;
