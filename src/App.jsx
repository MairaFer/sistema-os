import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Sidebar from './Componentes/SideBar/Sidebar';
import HomePage from './pages/Home/Home';
import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';
import LoginPage from './Componentes/LoginPage/LoginPageComponent';
import Cliente from './pages/Clientes/ClientesPage';
import Funcionarios from './pages/Funcionarios/FuncionariosPage';
import Servicos from './pages/Servicos/ServicosPage';
import Register from './pages/Register/RegisterPage.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPasswordPage.jsx'
import ResetPassword from './Componentes/ResetPassword/ResetPasswordComponent.jsx';

const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/redefinir-senha" element={<ForgotPassword />} />
        <Route path="/account/mudar-senha/:token" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/clientes" element={
          <>
            <Sidebar />
            <Header/>
            <Content>
              <Cliente />
            </Content>
          </>
        } />
        <Route path="/funcionarios" element={
          <>
            <Sidebar />
            <Header />
            <Content>
              <Funcionarios />
            </Content>
          </>
        } />
        <Route path="/servicos" element={
          <>
            <Sidebar />
            <Header />
            <Content>
              <Servicos />
            </Content>
          </>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
