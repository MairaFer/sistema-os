import React from 'react';
import { Button } from './AddButtonStyled';
import { FaPlus } from 'react-icons/fa';

const AddButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <FaPlus /> Adicionar
    </Button>
  );
};

export default AddButton;
