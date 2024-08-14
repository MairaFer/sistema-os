import React, { useState } from 'react';
import ItemList from '../../Componentes/ItemList/ItemList';
import AddButton from '../../Componentes/AddButton/AddButton';
import SearchBar from '../../Componentes/SearchBar/SearchBar';
import { HeaderContainer, MainContainer, ContentContainer, Title, TitleContainer, ButtonContainer } from './ClienteStyled';

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
    <MainContainer>
      <HeaderContainer>
        <div style={{ marginBottom: '1rem' }} /> {/* Espaço acima da SearchBar */}
        <SearchBar onChange={handleSearch} />
      </HeaderContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>Cliente</Title>
          <Title>CPF/CNPJ</Title>
        </TitleContainer>
        <ItemList items={filteredClients} />
        <ButtonContainer>
          <AddButton onClick={() => alert('Adicionar novo cliente')} />
        </ButtonContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Cliente;
