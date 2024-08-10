import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaExclamationCircle, FaHourglassHalf, FaClipboardList, FaFilter } from 'react-icons/fa';
import StatusCard from '../../Componentes/HomeComponents/StatusCard';
import styles from './Relatorios.module.css';

const RelatoriosPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
 
  }, []);

  const handleFilterReports = () => {
    console.log('Filtrar Relatórios');
    //ação de filtro aqui
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
      <p>relatorios &gt;  Relatórios</p>
      <div className={styles.greetingContainer}>
      <h1 className={styles.greeting}>Painel de Relatórios</h1>
          <div className={styles.statusContainer}>
            <StatusCard icon={<FaCheck />} count="10" label="OS's Ativas" bgColor="#00cc66" color="#fff" />
            <StatusCard icon={<FaExclamationCircle />} count="2" label="OS's Em Atraso" bgColor="#ff3333" color="#fff" />
            <StatusCard icon={<FaHourglassHalf />} count="32" label="OS's Em Espera" bgColor="#ff9933" color="#fff" />
            <StatusCard icon={<FaClipboardList />} count="129" label="OS's Finalizadas" bgColor="#3399ff" color="#fff" />
          </div>
        </div>
        <div className={styles.actionContainer}>
          <button className={styles.actionButton} onClick={handleFilterReports}>
            <FaFilter /> Filtrar
          </button>
        </div>
        {loading && <p>Carregando...</p>}
        {error && <p className={styles.error}>{error}</p>}
      </main>
    </div>
  );
};

export default RelatoriosPage;
