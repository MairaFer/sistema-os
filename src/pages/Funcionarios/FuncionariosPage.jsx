import React, { useState } from 'react';
import ItemList from '../../Componentes/ItemList/ItemList';
import AddButton from '../../Componentes/AddButton/AddButton';
import SearchBar from '../../Componentes/SearchBar/SearchBar';

const Funcionarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([
    { name: 'Funcionario 1', identifier: '123.456.789-00' },
    { name: 'Funcionario 2', identifier: '987.654.321-00' },
  ]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Funcionários</h1>
      <SearchBar onChange={handleSearch} />
      <ItemList items={filteredEmployees} />
      <AddButton onClick={() => alert('Adicionar novo funcionário')} />
    </div>
  );
};

export default Funcionarios;
