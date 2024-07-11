import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Sidebar from './Componentes/SideBar/Sidebar';
import Home from './pages/Home/Home';
import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';
import LoginPage from './Componentes/LoginPage/LoginPageComponent'; // Certifique-se de que o caminho esteja correto

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
        <Route path="/home" element={
          <>
           <Header />
            <Sidebar />
            <Content>
              <Home />
            </Content>
          </>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
