import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatusCard from '../../Componentes/HomeComponents/StatusCard';
import RecentOrdersTable from '../../Componentes/HomeComponents/RecentOrdersTable';
import { FaCheck, FaExclamationCircle, FaHourglassHalf, FaClipboardList, FaPlus, FaClipboard } from 'react-icons/fa';
import styles from './Home.module.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noRecentOrders, setNoRecentOrders] = useState(false);
  const [userName, setUserName] = useState('Usuário');
  const [osStatus, setOsStatus] = useState({
    active: 0,
    late: 0,
    pendingAuthorization: 0,
    finished: 0,
  });

  const createOsHandle = () => {
    navigate("/criaros/tipo-da-os");
  };

  const manageOsHandle = () => {
    navigate("/gerenciaros");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      sessionStorage.setItem('token', token);
      navigate('/home');
    } else {
      const storedToken = sessionStorage.getItem('token');
      if (!storedToken) {
        console.error('Token não encontrado.');
        navigate('/');
      }
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado.');
        }
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/user/${token}`);
        setUserName(response.data.nome_user);
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        setUserName('Usuário');
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchOsStatus = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado.');
        }

        console.log('Fetching OS status with token:', token);

        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss/${token}`);

        console.log('OS status response:', response.data);

        // Ajuste a estrutura dos dados conforme o retorno da API
        const active = response.data.filter(os => os.status_os === 'Em Aberto').length;
        const late = response.data.filter(os => os.status_os === 'Em Atraso').length;
        const pendingAuthorization = response.data.filter(os => os.status_os === 'Aguardando Autorização').length;
        const finished = response.data.filter(os => os.status_os === 'Finalizada').length;

        setOsStatus({
          active,
          late,
          pendingAuthorization,
          finished,
        });
      } catch (error) {
        console.error('Erro ao buscar status das ordens de serviço:', error);
        setError('Erro ao buscar status das ordens de serviço.');
      }
    };

    fetchOsStatus();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado.');
        }
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss/${token}`);
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
        <p>home &gt; Página Inicial</p>
        <div className={styles.greetingContainer}>
          <h1 className={styles.greeting}>Olá, {userName}</h1>
          <div className={styles.statusContainer}>
            <StatusCard icon={<FaCheck />} count={osStatus.active} label="OS's Ativas" bgColor="#00cc66" color="#fff" />
            <StatusCard icon={<FaExclamationCircle />} count={osStatus.late} label="OS's Em Atraso" bgColor="#ff3333" color="#fff" />
            <StatusCard icon={<FaHourglassHalf />} count={osStatus.pendingAuthorization} label="OS's Em Espera" bgColor="#ff9933" color="#fff" />
            <StatusCard icon={<FaClipboardList />} count={osStatus.finished} label="OS's Finalizadas" bgColor="#3399ff" color="#fff" />
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
