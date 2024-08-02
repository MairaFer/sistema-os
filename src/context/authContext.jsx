import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || ''
  });
  const navigate = useNavigate();

  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setAuth({ token, userId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setAuth({ token: '', userId: '' });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
