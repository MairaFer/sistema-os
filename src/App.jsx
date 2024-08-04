import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Sidebar from './Componentes/SideBar/Sidebar';
import Home from './pages/Home/Home';
import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';
import LoginPage from './Componentes/LoginPage/LoginPageComponent';
import Cliente from './pages/Clientes/ClientesPage';
import Funcionarios from './pages/Funcionarios/FuncionariosPage';
import Servicos from './pages/Servicos/ServicosPage';
import Register from './pages/Register/RegisterPage.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPasswordPage.jsx';
import ResetPassword from './Componentes/ResetPassword/ResetPasswordComponent.jsx';
import SelectTypeOsPage from './pages/SelectTypeOS/SelectTypeOsPage.jsx';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './Componentes/PrivateRoute/PrivateRoute';

const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/redefinir-senha" element={<ForgotPassword />} />
          <Route path="/account/mudar-senha/:token" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Home />
                </Content>
              </>
            } />
            <Route path="/criaros/tipo-da-os" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <SelectTypeOsPage />
                </Content>
              </>
            } />
            <Route path="/clientes" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Cliente />
                </Content>
              </>
            } />
            <Route path="/funcionarios" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Funcionarios />
                </Content>
              </>
            } />
            <Route path="/servicos" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Servicos />
                </Content>
              </>
            } />
          </Route>
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
