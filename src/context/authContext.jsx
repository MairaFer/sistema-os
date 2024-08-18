import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: sessionStorage.getItem('token') || '',
    userId: sessionStorage.getItem('userId') || ''
  });
  const navigate = useNavigate();

  const login = (token, userId) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
    setAuth({ token, userId });
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
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
