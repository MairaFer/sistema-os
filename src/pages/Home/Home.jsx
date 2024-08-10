import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatusCard from '../../Componentes/HomeComponents/StatusCard';
import RecentOrdersTable from '../../Componentes/HomeComponents/RecentOrdersTable';
import { FaCheck, FaExclamationCircle, FaHourglassHalf, FaClipboardList, FaPlus, FaClipboard } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import styles from './Home.module.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noRecentOrders, setNoRecentOrders] = useState(false);

  const createOsHandle = () => {
    console.log("Navegando para /criaros/tipo-da-os");
    navigate("/criaros/tipo-da-os");
  };

  const manageOsHandle = () => {
    console.log("Navegando para /gerenciaros");
    navigate("/gerenciaros");
  };

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
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <p>home &gt; Pagina Inicial</p>
        <div className={styles.greetingContainer}>
          <h1 className={styles.greeting}>Olá, Usuário</h1>
          <div className={styles.statusContainer}>
            <StatusCard icon={<FaCheck />} count="10" label="OS's Ativas" bgColor="#00cc66" color="#fff" />
            <StatusCard icon={<FaExclamationCircle />} count="2" label="OS's Em Atraso" bgColor="#ff3333" color="#fff" />
            <StatusCard icon={<FaHourglassHalf />} count="32" label="OS's Em Espera" bgColor="#ff9933" color="#fff" />
            <StatusCard icon={<FaClipboardList />} count="129" label="OS's Finalizadas" bgColor="#3399ff" color="#fff" />
          </div>
        </div>
        <div className={styles.actionContainer}>
          <button className={styles.actionButton} onClick={createOsHandle}>
            <FaPlus /> Criar OS
          </button>
          <button className={styles.actionButton} onClick={manageOsHandle}>
            <FaClipboard /> Gerenciar OS's
          </button>
        </div>
        <div className={styles.recentOrdersContainer}>
          <h2>OS's Recentes</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : noRecentOrders ? (
            <p className={styles.erroOS}>Não existe nenhuma OS recente.</p>
          ) : recentOrders.length > 0 ? (
            <RecentOrdersTable orders={recentOrders} />
          ) : (
            <p className={styles.erroOS}>{error}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
