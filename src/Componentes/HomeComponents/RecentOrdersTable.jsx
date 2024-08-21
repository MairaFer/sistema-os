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
            <TableHeadCell>Cliente/Funcionário</TableHeadCell>
            <TableHeadCell>Data</TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.nome_os}</TableCell>
              <TableCell>{order.key_search}</TableCell>
              <TableCell>{order.status_os}</TableCell>
              <TableCell>{order.cliente_os || order.funcionario_os}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
            </TableRow>          
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default RecentOrdersTable;
