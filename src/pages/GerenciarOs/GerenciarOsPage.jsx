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
  DialogContent, DialogTitle, Button as MuiButton, CircularProgress, Backdrop
} from '@mui/material';
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
          backgroundColor: '#E3EAF8',
          borderRadius: '30px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#f25c21',
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
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);

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
          const clientName = clientMap[order.cliente_os];
          const employeeName = employeeMap[order.funcionario_os];

          return {
            ...order,
            cliente_v: clientName,
            funcionario_V: employeeName
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
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'data_desc':
        filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
    console.log(selectedOs._id);
    try {
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/os/deletar/${token}/${selectedOs._id}`);
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

  const fetchPdfDataAndGenerate = async (order) => {
    setIsBackdropOpen(true)

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado.');
      }

      // Fazer requisições paralelas para obter os dados necessários
      const [
        clientsResponse,
        employeesResponse,
        userResponse,
        servicesResponse
      ] = await Promise.all([
        axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`),
        axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`),
        axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/user/${token}`),
        axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${token}`)
      ]);

      const clients = clientsResponse.data;
      const employees = employeesResponse.data;
      const user = userResponse.data;
      const services = servicesResponse.data;

      // Criar mapeamentos para clientes, funcionários e serviços
      const clientMap = clients.reduce((map, client) => {
        map[client._id] = client;
        return map;
      }, {});

      const employeeMap = employees.reduce((map, employee) => {
        map[employee._id] = employee;
        return map;
      }, {});

      const serviceMap = services.reduce((map, service) => {
        map[service._id] = service;
        return map;
      }, {});

      // Mapear dados de cliente, funcionário e serviço para a ordem
      const client = clientMap[order.cliente_os] || {};
      const employee = employeeMap[order.funcionario_os] || {};
      const service = serviceMap[order.servico_os] || {};

      console.log('Cliente:', client);
      console.log('Funcionário:', employee);
      console.log('Serviço:', service);

      // Construir os dados necessários para o PDF
      const orderData = {
        logoUrl: user.picturePathLogo || '',
        nome_empresa: user.nome_empresa || '',
        cnpj_user: user.cnpj_user || '',
        contato_userEmpresa: user.contato_userEmpresa || '',
        endereco_userEmpresa: user.endereco_userEmpresa || '',
        nome_os: order.nome_os || '',
        key_search: order.key_search || '',
        createdAt: order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : '',
        corf: client._id ? 'Cliente' : 'Funcionário',
        nome_corF: client.nome_cliente || employee.nome_func || '',
        contato_corF: client.contato_cliente || employee.contato_func || '',
        cpfCnpj: client.cpf_cliente || client.cnpj_cliente || '',
        endOrSetor: client._id ? 'Endereço' : 'Setor',
        endOrSetor_info: client.endereco_cliente || employee.setor || '',
        equipamento: order.equipamento || '',
        marca: order.marca || '',
        numero_serie: order.numero_serie || '',
        nome_servico: service.nome_servico || '',
        valor_servico: service.valor_servico || '',
        pecas: order.pecas || [],
        pagamento: order.pagamento || '',
        defeito: order.defeito || '',
        diagnostico: order.diagnostico || '',
        data_encerramento: order.data_encerramento ? new Date(order.data_encerramento).toLocaleDateString('pt-BR') : '',
        tecnico: order.tecnico || ''
      };

      console.log('Dados da Ordem:', orderData);

      // Enviar o PDF gerado para a API
      try {

        const response = await axios.post(
          `https://cyberos-sistemadeordemdeservico-api.onrender.com/generate-pdf/${token}`,
          orderData,
          {
            responseType: 'blob' // Configura o Axios para tratar a resposta como um blob
          }
        );

        // Cria um URL para o blob e inicia o download
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${order.key_search}.pdf`); // Define o nome do arquivo para download
        document.body.appendChild(link);
        link.click();
        link.remove();

        console.log('PDF gerado com sucesso:', response.data);
        enqueueSnackbar('PDF gerado com sucesso!', { variant: 'success' });
      } catch (pdfError) {
        enqueueSnackbar('Erro ao gerar pdf', { variant: 'error' });
        console.error('Erro ao gerar PDF:', pdfError.message);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
    } finally {
      setIsBackdropOpen(false); // Fecha o Backdrop quando o processo é concluído
    }
  };

  const handleDownload = async () => {
    try {
      console.log(selectedOs);
      if (selectedOs && selectedOs._id) {
        await fetchPdfDataAndGenerate(selectedOs);
        console.log("PDF criado com sucesso.");
      } else {
        console.warn('Nenhuma ordem de serviço selecionada');
      }
    } catch (error) {
      console.error('Erro ao gerar ou baixar o PDF:', error);
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
        </HeaderContainer>
        <ContentContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '12px', width: '80%', backgroundColor: '#E3EAF8' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Chave OS</TableCell>
                    <TableCell>Cliente/Funcionario</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell></TableCell>
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
                        <TableCell>{os.nome_os}</TableCell>
                        <TableCell>{os.key_search}</TableCell>
                        <TableCell>{os.cliente_v || os.funcionario_v}</TableCell>
                        <TableCell>{os.status_os}</TableCell>
                        <TableCell>{new Date(os.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton sx={{ width: '' }} onClick={(event) => handleMenuClick(event, os)}>
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
          <MenuItem onClick={() => handleDownload("empresa")}>Emitir OS Empresa</MenuItem>
          <MenuItem onClick={() => handleDownload("beneficiario")}>Emitir OS Beneficiário</MenuItem>
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
};

export default OrdemDeServicoPage; 