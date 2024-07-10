import React from 'react';
import { CardIconContainer, CardTitle, CardCount } from './StatusOverviewStyled';

const StatusCard = ({ title, count, color, icon }) => {
  return (
    <CardContainer style={{ borderColor: color }}>
      <CardIconContainer>{icon}</CardIconContainer>
      <CardTitle>{title}</CardTitle>
      <CardCount>{count}</CardCount>
    </CardContainer>
  );
}

export default StatusCard;
