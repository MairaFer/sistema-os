import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const PrivateRoute = () => {
  const { auth } = useAuth();

  return auth.token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
