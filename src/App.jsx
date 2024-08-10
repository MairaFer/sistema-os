import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Sidebar from './Componentes/HomeComponents/Sidebar.jsx';
import Home from './pages/Home/Home';
import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';
import LoginPage from './Componentes/LoginPage/LoginPageComponent';
import Cliente from './pages/Clientes/ClientesPage';
import Funcionarios from './pages/Funcionarios/FuncionariosPage';
import CriarOsFuncionarioPage from './pages/CriarOs/SelectFuncionarioPage.jsx'
import CriarOsClientePage from './pages/CriarOs/SelectClientePage.jsx'
import Servicos from './pages/Servicos/ServicosPage';
import Register from './pages/Register/RegisterPage.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPasswordPage.jsx';
import ResetPassword from './Componentes/ResetPassword/ResetPasswordComponent.jsx';
import SelectTypeOsPage from './pages/SelectTypeOS/SelectTypeOsPage.jsx';
import Relatorios from './pages/Relatorios/RelatoriosPage.jsx';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './Componentes/PrivateRoute/PrivateRoute';
import SettingsPage from './pages/Settings/SettingsPages.jsx';
const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
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
                <Footer />
              </>
            } />
            <Route path="/criaros/tipo-da-os" element={
              <>
                <Sidebar />
                <Content>
                  <SelectTypeOsPage />
                </Content>
                <Footer />
              </>
            } />
            <Route path="/criaros/funcionario" element={
              <>
                <Sidebar />
                <Content>
                  <CriarOsFuncionarioPage />
                </Content>
                <Footer />
              </>
            } />
            <Route path="/criaros/cliente" element={
              <>
                <Sidebar />
                <Content>
                  <CriarOsClientePage />
                </Content>
                <Footer />
              </>
            } />
            <Route path="/clientes" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Cliente />
                </Content>
                <Footer />
              </>
            } />
            <Route path="/funcionarios" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Funcionarios />
                </Content>
                <Footer />
              </>
            } />
            <Route path="/servicos" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Servicos />
                </Content>
                <Footer />
              </>
            } />
            <Route path="/relatorios" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <Relatorios />
                </Content>
                <Footer />
              </>
            } />
             <Route path="/settings" element={
              <>
                <Header />
                <Sidebar />
                <Content>
                  <SettingsPage />
                </Content>
                <Footer />
              </>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
