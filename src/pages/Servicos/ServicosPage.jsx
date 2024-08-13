import React, { useState } from 'react';
import ItemList from '../../Componentes/ItemList/ItemList';
import AddButton from '../../Componentes/AddButton/AddButton';
import SearchBar from '../../Componentes/SearchBar/SearchBar';
import { HeaderContainer, MainContainer, ContentContainer, Title, TitleContainer, ButtonContainer } from './ServicosStyled';

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
    <MainContainer>
      <HeaderContainer>
        <div style={{ marginBottom: '1rem' }} /> {/* Espaço acima da SearchBar */}
        <SearchBar onChange={handleSearch} />
      </HeaderContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>Serviço</Title>
          <Title>Preço</Title>
        </TitleContainer>
        <ItemList items={filteredServices} />
        <ButtonContainer>
          <AddButton onClick={() => alert('Adicionar novo serviço')} />
        </ButtonContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Servicos;
