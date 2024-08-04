import React, { useState } from 'react';
import ItemList from '../../Componentes/ItemList/ItemList';
import AddButton from '../../Componentes/AddButton/AddButton';
import SearchBar from '../../Componentes/SearchBar/SearchBar';

const Cliente = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([
    { name: 'Cliente 1', identifier: '123.456.789-00' },
    { name: 'Cliente 2', identifier: '987.654.321-00' },
  ]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Clientes</h1>
      <SearchBar onChange={handleSearch} />
      <ItemList items={filteredClients} />
      <AddButton onClick={() => alert('Adicionar novo cliente')} />
    </div>
  );
};

export default Cliente;
