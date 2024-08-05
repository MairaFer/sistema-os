import styled from 'styled-components';

export const TableWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
`;

export const TableHead = styled.thead`
  background-color: #f0f0f0;
`;

export const TableHeadRow = styled.tr`
  color: #333;
`;

export const TableHeadCell = styled.th`
  padding: 12px;
  text-align: left;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const TableCell = styled.td`
  padding: 12px;
`;
