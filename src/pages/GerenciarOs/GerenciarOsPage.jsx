import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HeaderContainer, MainContainer, ContentContainer,
  ButtonContainer
} from './GerenciarOSStyled';
import {
  Select, MenuItem, FormControl, InputLabel, Fab, Menu,
  MenuItem as MenuItemMui, createTheme, ThemeProvider,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, Button as MuiButton, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'Lexend, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0e0e0',
          color: '#000',
          '&:hover': {
            backgroundColor: '#d5d5d5',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          borderBottom: '1px solid #ddd',
          fontSize: '1.25rem',
          fontWeight: '500',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td, &:last-child th': {
            border: 0,
          },
        },
      },
    },
  },
});

const OrdemDeServicoPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [osList, setOsList] = useState([]);
  const [filteredOsList, setFilteredOsList] = useState([]);
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOs, setSelectedOs] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOsList = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado.');
        }

        // Fazer requisições paralelas para obter os dados
        const [ordersResponse, clientsResponse, employeesResponse] = await Promise.all([
          axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss/${token}`),
          axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`),
          axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`)
        ]);

        const orders = ordersResponse.data;
        const clients = clientsResponse.data;
        const employees = employeesResponse.data;

        // Criar mapeamentos para clientes e funcionários
        const clientMap = clients.reduce((map, client) => {
          map[client._id] = client.nome_cliente;
          return map;
        }, {});

        const employeeMap = employees.reduce((map, employee) => {
          map[employee._id] = employee.nome_func;
          return map;
        }, {});

        // Mapear ordens de serviço com nomes de clientes e funcionários
        const ordersWithNames = orders.map(order => {
          const clientName = clientMap[order.cliente_os] || 'Cliente não encontrado';
          const employeeName = employeeMap[order.funcionario_os] || 'Funcionário não encontrado';

          return {
            ...order,
            cliente_os: clientName,
            funcionario_os: employeeName
          };
        });

        setOsList(ordersWithNames);
        setFilteredOsList(ordersWithNames);
      } catch (error) {
        console.error('Erro ao buscar ordens de serviço', error.message);
        enqueueSnackbar('Erro ao buscar ordens de serviço!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOsList();
  }, [enqueueSnackbar]);

  useEffect(() => {
    let filtered = osList;

    if (searchTerm) {
      filtered = filtered.filter(os =>
        (os.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          os.nome_funcionario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          os.chave_os?.includes(searchTerm))
      );
    }

    switch (filter) {
      case 'data_asc':
        filtered = filtered.sort((a, b) => new Date(a.data_os) - new Date(b.data_os));
        break;
      case 'data_desc':
        filtered = filtered.sort((a, b) => new Date(b.data_os) - new Date(a.data_os));
        break;
      case 'status_em_aberto':
        filtered = filtered.filter(os => os.status_os === 'Em Aberto');
        break;
      case 'status_aguardando_autorizacao':
        filtered = filtered.filter(os => os.status_os === 'Aguardando Autorização');
        break;
      case 'status_finalizada':
        filtered = filtered.filter(os => os.status_os === 'Finalizada');
        break;
      default:
        break;
    }

    setFilteredOsList(filtered);
  }, [searchTerm, filter, osList]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleMenuClick = (event, os) => {
    setAnchorEl(event.currentTarget);
    setSelectedOs(os);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditOs = () => {
    if (selectedOs) {
      navigate(`/editar-os/${selectedOs._id}`);
    } else {
      console.warn('Nenhuma ordem de serviço selecionada');
    }
    handleMenuClose();
  };

  const handleDownloadPdf = () => {
    if (selectedOs) {
      // Aqui você pode adicionar a lógica para gerar e baixar o PDF
      console.log('Baixar PDF da OS:', selectedOs.chave_os);
    } else {
      console.warn('Nenhuma ordem de serviço selecionada');
    }
    handleMenuClose();
  };

  const handleDeleteOs = () => {
    if (selectedOs) {
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/os/${token}/${selectedOs._id}/deletar`);
      setOsList(osList.filter(os => os._id !== selectedOs._id));
      setFilteredOsList(filteredOsList.filter(os => os._id !== selectedOs._id));
      enqueueSnackbar('Ordem de serviço excluída com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao excluir ordem de serviço', error);
      enqueueSnackbar('Erro ao excluir ordem de serviço!', { variant: 'error' });
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MainContainer>
        <HeaderContainer>
          <div style={{ marginBottom: '1rem' }} />
          <TextField
            placeholder="Buscar por nome ou chave da OS..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: '1rem', width: '400px' }}
          />
          <FormControl style={{ marginLeft: '1rem' }} variant="filled">
            <InputLabel id="filter-label">Filtrar por Data ou Status</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: '250px' }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="data_asc">Data OS Crescente</MenuItem>
              <MenuItem value="data_desc">Data OS Decrescente</MenuItem>
              <MenuItem value="status_em_aberto">Status: Em Aberto</MenuItem>
              <MenuItem value="status_aguardando_autorizacao">Status: Aguardando Autorização</MenuItem>
              <MenuItem value="status_finalizada">Status: Finalizada</MenuItem>
            </Select>
          </FormControl>
          <Fab color="primary" aria-label="add" onClick={() => navigate('/criar-os')}>
            <AddIcon />
          </Fab>
        </HeaderContainer>
        <ContentContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Chave OS</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Funcionário</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Não há nenhuma ordem de serviço cadastrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOsList.map(os => (
                      <TableRow key={os._id}>
                        <TableCell>{os.chave_os}</TableCell>
                        <TableCell>{os.cliente_os}</TableCell>
                        <TableCell>{os.funcionario_os}</TableCell>
                        <TableCell>{os.status_os}</TableCell>
                        <TableCell>{new Date(os.data_os).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuClick(event, os)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </ContentContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditOs}>Editar</MenuItem>
          <MenuItem onClick={handleDownloadPdf}>Baixar PDF</MenuItem>
          <MenuItem onClick={handleDeleteOs}>Excluir</MenuItem>
        </Menu>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            Tem certeza de que deseja excluir esta ordem de serviço?
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseDialog}>Cancelar</MuiButton>
            <MuiButton color="error" onClick={handleConfirmDelete}>Excluir</MuiButton>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </ThemeProvider>
  );
};

export default OrdemDeServicoPage;

