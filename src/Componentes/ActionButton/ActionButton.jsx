import React from 'react';
import { Button } from './ActionButtonSyled';

const ActionButton = ({ icon, label, onClick }) => {
  return (
    <Button onClick={onClick}>
      {icon} {label}
    </Button>
  );
};

export default ActionButton;
