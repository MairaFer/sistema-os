import React from 'react';
import { Input } from './SearchBarStyled';

const SearchBar = ({ onChange }) => {
  return <Input type="text" placeholder="Pesquisar..." onChange={onChange} />;
};

export default SearchBar;
