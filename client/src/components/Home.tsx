import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  const { user, handleLogout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-container">
      <h1>Welcome, {user.email}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
