import styled from 'styled-components';

export const TableWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  border-radius: 7px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #c4c8d2;
`;

export const TableHead = styled.thead`
    background-color: #2F4165;
`;

export const TableHeadRow = styled.tr`
  color: #c4c8d2;
`;

export const TableHeadCell = styled.th`
  padding: 12px;
  text-align: left;
`;

export const TableBody = styled.tbody`
  color: #2F4165;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #c4c8d2;
  }
`;

export const TableCell = styled.td`
  padding: 12px;
`;
