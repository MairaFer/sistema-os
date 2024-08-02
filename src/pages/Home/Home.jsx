import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Greeting, StatusContainer, ActionContainer, RecentOrdersContainer } from './HomeStyled';
import StatusCard from '../../Componentes/StatusOverview/StatusCard';
import ActionButton from '../../Componentes/ActionButton/ActionButton';
import RecentOrdersTable from '../../Componentes/RecentOrdersTable/RecentOrdersTable';
import { FaCheck, FaExclamationCircle, FaHourglassHalf, FaClipboardList, FaPlus, FaClipboard } from 'react-icons/fa';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recentOrders = [
    { name: 'REPARO DE MÁQUINA', osKey: 'OS-163', status: 'Em Aberto', client: 'Osmar Panificadora', date: '01/06/2024' }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('jwtToken', token); // Armazena o token no localStorage
      navigate('/home'); // Redireciona para a página inicial
    } else {
      // Verifica se o token já está presente no localStorage
      const storedToken = localStorage.getItem('jwtToken');
      if (!storedToken) {
        console.error('Token não encontrado.');
        navigate('/login'); // Redireciona para a página de login se o token não estiver presente
      }
    }
  }, [location.search, navigate]);

  return (
    <Container>
      <main>
        <p>home</p>
        &gt; Pagina Inicial
        <Greeting>Olá, Usuário</Greeting>
        <StatusContainer>
          <StatusCard icon={<FaCheck />} count="10" label="OS's Ativas" bgColor="#00cc66" color="#fff" />
          <StatusCard icon={<FaExclamationCircle />} count="2" label="OS's Em Atraso" bgColor="#ff3333" color="#fff" />
          <StatusCard icon={<FaHourglassHalf />} count="32" label="OS's Em Espera" bgColor="#ff9933" color="#fff" />
          <StatusCard icon={<FaClipboardList />} count="129" label="OS's Finalizadas" bgColor="#3399ff" color="#fff" />
        </StatusContainer>
        <ActionContainer>
          <ActionButton icon={<FaPlus />} label="Criar OS" />
          <ActionButton icon={<FaClipboard />} label="Gerenciar OS's" />
        </ActionContainer>
        <RecentOrdersContainer>
          <h2>OS's Recentes</h2>
          <RecentOrdersTable orders={recentOrders} />
        </RecentOrdersContainer>
      </main>
    </Container>
  );
};

export default Home;
