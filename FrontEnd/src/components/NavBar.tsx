import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style/NavBar.css';

const NavBar: React.FC = () => {
  const location = useLocation(); // Получаем текущий путь

  return (
    <header className="header">
      <div className='header-links'>
      <Link to="/profile" className={`nav-link profile-link ${location.pathname === '/profile' ? 'active' : ''}`}>
        <span>Profile</span>
      </Link>
      </div>
      
      <input type="text" placeholder="Type here..." className="search-bar" />
      <div className="header-links">
        <Link to="/admin" className={`nav-link resume-link ${location.pathname === '/admin' ? 'active' : ''}`}>
          <span>View resume</span>
        </Link>
        <Link to="/create-resume" className={`nav-link create-link ${location.pathname === '/create-resume' ? 'active' : ''}`}>
          <span>Create resume</span>
        </Link>
        <Link to="/about" className={`nav-link about-link ${location.pathname === '/about' ? 'active' : ''}`}>
          <span>About us</span>
        </Link>
        <Link to="/" className={`nav-link exit-link ${location.pathname === '/' ? 'active' : ''}`}>
          <span>Exit</span>
        </Link>
      </div>
    </header>
  );
};

export default NavBar;
