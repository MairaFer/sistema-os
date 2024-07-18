import React from 'react';
import { Card, CardIcon, CardInfo, CardCount } from './StatusCardStyled';

const StatusCard = ({ icon, count, label, bgColor, color }) => {
  return (
    <Card style={{ backgroundColor: bgColor, color: color }}>
      <CardIcon>{icon}</CardIcon>
      <CardInfo>
        <CardCount>{count}</CardCount>
        <div>{label}</div>
      </CardInfo>
    </Card>
  );
};

export default StatusCard;
