import React from 'react';
import Sidebar from '../../Componentes/SideBar/Sidebar';
import Footer from '../../Componentes/Footer/Footer';
import Banner from '../../Componentes/Banner/Banner';
import StatusOverview from '../../Componentes/StatusOverview/StatusOverview';
import RecentOrdersTable from '../../Componentes/RecentOrdersTable/RecentOrdersTable';
const Home = () => {
  const recentOrders = [
    { name: 'Ordem 1', key: '001', status: 'Em Andamento', client: 'Empresa A', date: '2024-06-28' },
    { name: 'Ordem 2', key: '002', status: 'Concluída', client: 'Empresa B', date: '2024-06-27' },
    { name: 'Ordem 3', key: '003', status: 'Aguardando', client: 'Empresa C', date: '2024-06-26' },
  ];
  return (
    <div>
      <p></p>
      <p> </p>
      p
      <h2></h2>
      {">"} Pagina Inicial
      <p></p>
      <Sidebar />
      <Banner />
      <StatusOverview />
      <RecentOrdersTable orders={recentOrders} /> {/* Renderizando a tabela de ordens recentes */}
      <div>

        <section>
      
        </section>
        <section>
          
        </section>

      </div>
    </div>
  );
}

export default Home;
