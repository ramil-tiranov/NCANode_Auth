// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Admin from './components/Admin';
import CreateResume from './components/CreateResume';
import AboutUs from './components/AboutUs';
import UserProfile from './components/UserProfile';
import CompaniesPage from './components/CompanyList';
import CompanyDetails from './components/CompanyDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/resume/:email" element={<Profile />} />
        <Route path="/create-resume" element={<CreateResume />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
