import React from 'react';
import { FaHome, FaUser, FaUsers, FaTools } from 'react-icons/fa';
import StatusCard from './StatusCard';
import { OverviewContainer, OverviewTitle, CardContainer, CardTitle, CardCount, CardIconContainer } from './StatusOverviewStyled';

const StatusOverview = () => {
  const data = [
    { title: 'Ativas', count: 0, color: '#4CAF50', icon: <FaHome /> },
    { title: 'Atrasadas', count: 0, color: '#FF5722', icon: <FaUser /> },
    { title: 'Em Espera', count: 0, color: '#fff063', icon: <FaUsers /> },
    { title: 'Finalizadas', count: 0, color: '#2196F3', icon: <FaTools /> }
  ];

  return (
    <OverviewContainer>
      <OverviewTitle>Ordens de Serviço</OverviewTitle>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        {data.map((item, index) => (
          <CardContainer key={index}>
            <CardIconContainer>{item.icon}</CardIconContainer>
            <CardTitle>{item.title}</CardTitle>
            <CardCount>{item.count}</CardCount>
          </CardContainer>
        ))}
      </div>
    </OverviewContainer>
  );
}

export default StatusOverview;
