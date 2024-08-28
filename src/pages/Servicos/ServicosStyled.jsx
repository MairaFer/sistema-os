import styled from 'styled-components';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

export const TableContainerStyled = styled(TableContainer)`
  border-radius: 7px;
  width: 80%; /* Ajuste a largura conforme necessário */
  max-width: 1000px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
`;
export const HeaderTableCellStyled = styled(TableCell)`
  padding: 8px 20px;
  font-size: 1.4rem; /* Aumenta o tamanho da fonte */
  font-weight: 00;  /* Aumenta a espessura da fonte */
  color: #2F4165;    /* Muda a cor para #2F4165 */
`;
export const TableStyled = styled(Table)`
  border: none;
  background-color: #E3EAF8;
`;

export const TableHeadStyled = styled(TableHead)`
  background-color: ;
`;

export const TableCellStyled = styled(TableCell)`
  color: #c4c8d2;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 16px;
`;

export const TableRowStyled = styled(TableRow)`
  &:nth-of-type(odd) {
  }
  &:nth-of-type(even) {
  }
`;

export const ValorCellStyled = styled(TableCell)`
  background-color: #0056b3;
  color: #fff;
  font-weight: bold;
  border-radius: 0.6rem 0.6rem 0.6rem 0.6rem;
`;
export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const HeaderContainer = styled.div`
  background-color: #213356;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center; 
`;

export const ContentContainer = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #485474;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem; 
  align-items: center; 
  position: relative; 
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem; 
`;

export const Title = styled.div`
  font-size: 1.2em;
  color: #ffffff;
  font-weight: bold;
  width: 50%;
  text-align: center; /* Centraliza o texto */
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;
