import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatusCard from '../../Componentes/HomeComponents/StatusCard';
import RecentOrdersTable from '../../Componentes/HomeComponents/RecentOrdersTable';
import { FaCheck, FaExclamationCircle, FaHourglassHalf, FaClipboardList, FaPlus, FaClipboard } from 'react-icons/fa';
import Skeleton from '@mui/material/Skeleton';
import styles from './Home.module.css';
import { Snackbar, Alert } from '@mui/material';

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

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (location.state?.success) {
      setOpenSnackbar(true);
    }
  }, [location.state]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
        // Divide o nome no primeiro espaço e pega a primeira parte
        const primeiroNome = response.data.nome_user.split(' ')[0];
        setUserName(primeiroNome);
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

        // Buscar ordens de serviço
        const ordersResponse = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss/${token}`);
        const orders = ordersResponse.data;

        // Buscar clientes
        const clientsResponse = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`);
        const clients = clientsResponse.data;

        // Buscar funcionários
        const employeesResponse = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`);
        const employees = employeesResponse.data;

        // Criar mapeamentos para clientes e funcionários
        const clientMap = clients.reduce((map, client) => {
          map[client._id] = client.nome_cliente;
          return map;
        }, {});

        const employeeMap = employees.reduce((map, employee) => {
          map[employee._id] = employee.nome_func;
          return map;
        }, {});

        // Ordenar ordens de serviço pela data de criação
        const sortedOrders = orders.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Ordena em ordem decrescente
        });

        // Selecionar as 9 ordens mais recentes
        const recentOrders = sortedOrders.slice(0, 9);

        // Mapear ordens de serviço com nomes de clientes e funcionários
        const ordersWithNames = recentOrders.map(order => {
          const clientName = clientMap[order.cliente_os];

          const employeeName = employeeMap[order.funcionario_os];

          return {
            ...order,
            cliente_os: clientName,
            funcionario_os: employeeName
          };
        });

        if (ordersWithNames.length === 0) {
          setNoRecentOrders(true);
        }
        setRecentOrders(ordersWithNames);
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
        <div className={styles.greetingContainer}>
          {loading ? (
            <Skeleton variant="text" width={200} height={50} />
          ) : (
            <h1 className={styles.greeting}>Olá, {userName}</h1>
          )}
          <div className={styles.statusContainer}>
            {loading ? (
              Array(4).fill().map((_, index) => (
                <Skeleton key={index} variant="rectangular" width={200} height={100} style={{ marginRight: '10px' }} />
              ))
            ) : (
              <>
                <StatusCard icon={<FaCheck />} count={osStatus.active} label="OS's Ativas" bgColor="#00cc66" color="#fff" />
                <StatusCard icon={<FaExclamationCircle />} count={osStatus.late} label="OS's Em Atraso" bgColor="#ff3333" color="#fff" />
                <StatusCard icon={<FaHourglassHalf />} count={osStatus.pendingAuthorization} label="OS's Em Espera" bgColor="#E9D251" color="#fff" />
                <StatusCard icon={<FaClipboardList />} count={osStatus.finished} label="OS's Finalizadas" bgColor="#3399ff" color="#fff" />
              </>
            )}
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
          <h2 style={{fontFamily: "Lexend", fontWeight: 400}}>OS's Recentes</h2>
          {loading ? (
            Array(5).fill().map((_, index) => (
              <Skeleton key={index} variant="rectangular" width="100%" height={50} style={{ marginBottom: '10px' }} />
            ))
          ) : noRecentOrders ? (
            <p className={styles.erroOS}>Não existe nenhuma OS recente.</p>
          ) : recentOrders.length > 0 ? (
            <RecentOrdersTable orders={recentOrders} />
          ) : (
            <p className={styles.erroOS}>{error}</p>
          )}
        </div>
      </main>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Ordem de Serviço criada com sucesso!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
