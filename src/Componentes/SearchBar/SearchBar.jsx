import React from 'react';
import { Input, TextInput, SearchIcon } from './SearchBarStyled';

const SearchBar = ({ onChange }) => {
  return (
    <Input>
      <TextInput type="text" placeholder="Pesquisar..." onChange={onChange} />
      <SearchIcon />
    </Input>
  );
};

export default SearchBar;
