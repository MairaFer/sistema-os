
import React from 'react';
import { TableWrapper, Table, TableHead, TableHeadRow, TableHeadCell, TableBody, TableRow, TableCell } from './RecentOrdersTableStyled';

const RecentOrdersTable = ({ orders }) => {
  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Nome</TableHeadCell>
            <TableHeadCell>Chave</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Cliente</TableHeadCell>
            <TableHeadCell>Data</TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
            <TableCell>{order.name}</TableCell>
            <TableCell>{order.key}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.client}</TableCell>
            <TableCell>{order.date}</TableCell>
          </TableRow>          
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default RecentOrdersTable;
