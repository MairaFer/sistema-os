import React, { useState } from 'react';
import ItemList from '../../Componentes/ItemList/ItemList';
import AddButton from '../../Componentes/AddButton/AddButton';
import SearchBar from '../../Componentes/SearchBar/SearchBar';

const Servicos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([
    { name: 'Serviço 1', identifier: 'R$100,00' },
    { name: 'Serviço 2', identifier: 'R$200,00' },
  ]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Serviços</h1>
      <SearchBar onChange={handleSearch} />
      <ItemList items={filteredServices} />
      <AddButton onClick={() => alert('Adicionar novo serviço')} />
    </div>
  );
};

export default Servicos;
