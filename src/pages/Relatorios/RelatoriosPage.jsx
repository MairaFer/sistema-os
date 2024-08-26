import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatusCard from '../../Componentes/HomeComponents/StatusCard';
import { FaCheck, FaExclamationCircle, FaHourglassHalf, FaClipboardList } from 'react-icons/fa';
import Skeleton from '@mui/material/Skeleton';
import styles from './Relatorios.module.css';
import { Snackbar, Alert } from '@mui/material';

const Relatorio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Usuário');
  const [osStatus, setOsStatus] = useState({
    active: 0,
    late: 0,
    pendingAuthorization: 0,
    finished: 0,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [noRecentOrders, setNoRecentOrders] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      sessionStorage.setItem('token', token);
      navigate('/relatorio');
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

        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss/${token}`);

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
                <StatusCard icon={<FaHourglassHalf />} count={osStatus.pendingAuthorization} label="OS's Em Espera" bgColor="#ff9933" color="#fff" />
                <StatusCard icon={<FaClipboardList />} count={osStatus.finished} label="OS's Finalizadas" bgColor="#3399ff" color="#fff" />
              </>
            )}
          </div>
        </div>
      </main>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Ordem de Serviço criada com sucesso!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Relatorio;
