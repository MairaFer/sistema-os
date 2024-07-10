import React from 'react';
import styled from 'styled-components';
import GlobalStyle from './GlobalStyle';
import Sidebar from './Componentes/SideBar/Sidebar';
import Home from './pages/Home/Home';
import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';

const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
`;
import LoginPage from './Componentes/LoginPage/LoginPageComponent'; // Certifique-se de que o caminho esteja correto

function App() {
  return (
    <>
      <LoginPage />
      <Footer />
    </>
  );
}

export default App;
