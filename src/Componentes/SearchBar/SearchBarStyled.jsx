import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';

export const Input = styled.div`
  position: relative;
  width: 400px;  /* Ajuste o tamanho conforme necessário */
  display: flex;
  align-items: center;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 0.8rem;  /* Espaço para o ícone de pesquisa */
  border: 1px solid #ccc;
  border-radius: 19px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 10px;
  color: #888;
  font-size: 1.2rem;
  pointer-events: none;  /* O ícone não interfere com o clique no input */
`;
