import React from 'react';
import { Button } from './ActionButtonSyled';

const ActionButton = ({ icon, label }) => (
  <Button>
    {icon}
    {label}
  </Button>
);

export default ActionButton;
