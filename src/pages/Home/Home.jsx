import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, MainContent, GreetingContainer, Greeting, StatusContainer, ActionContainer, RecentOrdersContainer } from './HomeStyled';
import StatusCard from '../../Componentes/StatusOverview/StatusCard';
import ActionButton from '../../Componentes/ActionButton/ActionButton';
import RecentOrdersTable from '../../Componentes/RecentOrdersTable/RecentOrdersTable';
import { FaCheck, FaExclamationCircle, FaHourglassHalf, FaClipboardList, FaPlus, FaClipboard } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import homeStyle from './Home.module.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noRecentOrders, setNoRecentOrders] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      sessionStorage.setItem('token', token); // Armazena o token no sessionStorage
      navigate('/home'); // Redireciona para a página inicial
    } else {
      // Verifica se o token já está presente no sessionStorage
      const storedToken = sessionStorage.getItem('token');
      if (!storedToken) {
        console.error('Token não encontrado.');
        navigate('/'); // Redireciona para a página de login se o token não estiver presente
      }
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado.');
        }
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss`, {
          params: { token }
        });
        const orders = response.data.slice(0, 5);
        if (orders.length === 0) {
          setNoRecentOrders(true);
        }
        setRecentOrders(orders);
      } catch (error) {
        setError('Erro ao buscar ordens de serviço recentes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <Container>
      <MainContent>
        <p>home &gt; Pagina Inicial</p>
        <GreetingContainer>
          <Greeting>Olá, Usuário</Greeting>
          <StatusContainer>
            <StatusCard icon={<FaCheck />} count="10" label="OS's Ativas" bgColor="#00cc66" color="#fff" />
            <StatusCard icon={<FaExclamationCircle />} count="2" label="OS's Em Atraso" bgColor="#ff3333" color="#fff" />
            <StatusCard icon={<FaHourglassHalf />} count="32" label="OS's Em Espera" bgColor="#ff9933" color="#fff" />
            <StatusCard icon={<FaClipboardList />} count="129" label="OS's Finalizadas" bgColor="#3399ff" color="#fff" />
          </StatusContainer>
        </GreetingContainer>
        <ActionContainer>
          <ActionButton icon={<FaPlus />} label="Criar OS" />
          <ActionButton icon={<FaClipboard />} label="Gerenciar OS's" />
        </ActionContainer>
        <RecentOrdersContainer>
          <h2>OS's Recentes</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : noRecentOrders ? (
            <p className={homeStyle.erroOS}>Não existe nenhuma OS recente.</p>
          ) : recentOrders.length > 0 ? (
            <RecentOrdersTable orders={recentOrders} />
          ) : (
            <p className={homeStyle.erroOS}>{error}</p>
          )}
        </RecentOrdersContainer>
      </MainContent>
    </Container>
  );
};

export default Home;
