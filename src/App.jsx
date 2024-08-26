import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Sidebar from './Componentes/HomeComponents/Sidebar.jsx';
import Home from './pages/Home/Home';
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
import CompleteOsPage from './pages/CriarOs/CompleteOsPage.jsx';
import AddClienteOs from './pages/AddClienteOS/AddClienteOSPage.jsx'
import AddFuncionarioOs from './pages/AddFuncionarioOS/AddFuncionarioOSPage.jsx'
import CriarFuncionario from './pages/Funcionarios/CriarFuncionario.jsx'
import CriarCliente from './pages/Clientes/CriarCliente.jsx'
import CriarServico from './pages/Servicos/CriarServico.jsx'
import GerenciarOsPage from './pages/GerenciarOs/GerenciarOsPage.jsx'
import EditarOsPage from './pages/EditarOs/EditarOsPage.jsx'
import ViewOsPage from './pages/ViewOs/ViewOsPage.jsx';

const Content = styled.div`
  margin-left: 3.75rem;
  padding-bottom: 1.25rem;
  padding-left: 1.25rem;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  height: 100vh;
  header: none;
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
                <Sidebar />
                <Content>
                  <Home />
                </Content>
              </>
            } />
            <Route path="/gerenciaros" element={
              <>
                <Sidebar />
                <Content>
                  <GerenciarOsPage />
                </Content>
              </>
            } />
            <Route path="/editar-os/:id" element={
              <>
                <Sidebar />
                <Content>
                  <EditarOsPage />
                </Content>
              </>
            } />
            <Route path="/view-os/:id" element={
              <>
                <Sidebar />
                <Content>
                  <ViewOsPage />
                </Content>
              </>
            } />
            <Route path="/criar-servico" element={
              <>
                <Sidebar />
                <Content>
                  <CriarServico />
                </Content>
              </>
            } />
            <Route path="/criar-cliente" element={
              <>
                <Sidebar />
                <Content>
                  <CriarCliente />
                </Content>
              </>
            } />
            <Route path="/criar-funcionario" element={
              <>
                <Sidebar />
                <Content>
                  <CriarFuncionario />
                </Content>
              </>
            } />
            <Route path="/criaros/tipo-da-os" element={
              <>
                <Sidebar />
                <Content>
                  <SelectTypeOsPage />
                </Content>
              </>
            } />
            <Route path="/criaros/adicionar-cliente" element={
              <>
                <Sidebar />
                <Content>
                  <AddClienteOs />
                </Content>
              </>
            } />
            <Route path="/criaros/adicionar-funcionario" element={
              <>
                <Sidebar />
                <Content>
                  <AddFuncionarioOs />
                </Content>
              </>
            } />
            <Route path="/criar-os/finalizar" element={
              <>
                <Sidebar />
                <Content>
                  <CompleteOsPage />

                </Content>
              </>
            } />
            <Route path="/criaros/funcionario" element={
              <>
                <Sidebar />
                <Content>
                  <CriarOsFuncionarioPage />
                </Content>
              </>
            } />
            <Route path="/criaros/cliente" element={
              <>
                <Sidebar />
                <Content>
                  <CriarOsClientePage />
                </Content>
              </>
            } />
            <Route path="/clientes" element={
              <>
                <Sidebar />
                <Content>
                  <Cliente />
                </Content>
              </>
            } />
            <Route path="/funcionarios" element={
              <>
                <Sidebar />
                <Content>
                  <Funcionarios />
                </Content>
              </>
            } />
            <Route path="/servicos" element={
              <>
                <Sidebar />
                <Content>
                  <Servicos />
                </Content>
              </>
            } />
            <Route path="/relatorios" element={
              <>
                <Sidebar />
                <Content>
                  <Relatorios />
                </Content>
              </>
            } />
            <Route path="/settings" element={
              <>
                <Sidebar />
                <Content>
                  <SettingsPage />
                </Content>
              </>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
