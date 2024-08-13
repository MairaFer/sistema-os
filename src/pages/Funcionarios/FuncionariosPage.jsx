import React, { useState } from 'react';
import ItemList from '../../Componentes/ItemList/ItemList';
import AddButton from '../../Componentes/AddButton/AddButton';
import SearchBar from '../../Componentes/SearchBar/SearchBar';
import { HeaderContainer, MainContainer, ContentContainer, Title, TitleContainer, ButtonContainer } from './FuncionarioStyled';

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
    <MainContainer>
      <HeaderContainer>
        <div style={{ marginBottom: '1rem' }} /> {/* Espaço acima da SearchBar */}
        <SearchBar onChange={handleSearch} />
      </HeaderContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>Funcionário</Title>
          <Title>CPF/CNPJ</Title>
        </TitleContainer>
        <ItemList items={filteredEmployees} />
        <ButtonContainer>
          <AddButton onClick={() => alert('Adicionar novo funcionário')} />
        </ButtonContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Funcionarios;
