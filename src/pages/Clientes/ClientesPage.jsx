import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HeaderContainer, MainContainer, ContentContainer,
  ButtonContainer, HeaderTableCellStyled 
} from './ClienteStyled';
import {
  TableContainerStyled,
  TableStyled,
  TableHeadStyled,
  TableCellStyled,
  TableRowStyled,
  CnpjCellStyled,
  CpfCellStyled
} from './ClienteStyled';
import {
  Select, MenuItem, FormControl, InputLabel, Fab, Menu,
  MenuItem as MenuItemMui, createTheme, ThemeProvider, TableBody, IconButton, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, Button as MuiButton, CircularProgress
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
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
          backgroundColor: '#E3EAF8',
          borderRadius: '50px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#2074d4',
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
          borderSpacing: ' 8px',
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

const ClientesPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`);
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes', error);
        enqueueSnackbar('Erro ao buscar clientes!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const filtered = clients.filter(client =>
      (client.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.cpf_cliente?.includes(searchTerm) || client.cnpj_cliente?.includes(searchTerm))) &&
      (filter === "" ||
        (filter === "CPF" && client.cpf_cliente) ||
        (filter === "CNPJ" && client.cnpj_cliente))
    );
    setFilteredClients(filtered);
  }, [searchTerm, filter, clients]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleMenuClick = (event, client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewClient = () => {
    if (selectedClient) {
      setOpenViewModal(true);
    } else {
      console.warn('Nenhum cliente selecionado');
    }
    handleMenuClose(); // Fecha o menu
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const returnTempString = () => {
    if (!selectedClient) {
      return ['Nenhum cliente selecionado.'];
    }
    return `
      Nome: ${selectedClient.nome_cliente}
      CPF/CNPJ: ${selectedClient.cpf_cliente || selectedClient.cnpj_cliente}
      Endereço: ${selectedClient.endereco_cliente}
      Email: ${selectedClient.email_cliente}
      Telefone: ${selectedClient.contato_cliente}
    `.trim().split('\n');
  };
  
  const handleConfirmDelete = async () => {
    const token = sessionStorage.getItem('token');
    console.log(selectedClient._id);
    try {
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/deletar/${token}/${selectedClient._id}`);
      setClients(clients.filter(client => client._id !== selectedClient._id));
      setFilteredClients(filteredClients.filter(client => client._id !== selectedClient._id));
      enqueueSnackbar('Cliente excluído com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao excluir cliente', error);
      enqueueSnackbar('Erro ao excluir cliente!', { variant: 'error' });
    } finally {
      handleCloseDialog();
    }
  };

  const handleAddClientClick = () => {
    navigate('/criar-cliente');
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MainContainer>
        <HeaderContainer>
          <div style={{ marginBottom: '1rem' }} />
          <TextField
  placeholder="Buscar cliente..."
  value={searchTerm}
  onChange={handleSearch}
  style={{ marginBottom: '1rem', width: '400px' }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>

          <FormControl style={{ marginLeft: '1rem' }} variant="filled">
            <InputLabel id="filter-label">Filtrar por CPF/CNPJ</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: '250px' }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="CPF">CPF</MenuItem>
              <MenuItem value="CNPJ">CNPJ</MenuItem>
            </Select>
          </FormControl>
        </HeaderContainer>
        <ContentContainer>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </div>
          ) : filteredClients.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p>Não há nenhum cliente cadastrado.</p>
            </div>
          ) : (
            <TableContainerStyled>
               <TableStyled>
               <TableHeadStyled>
  <TableRowStyled>
    <HeaderTableCellStyled>Cliente</HeaderTableCellStyled>
    <HeaderTableCellStyled>CPF/CNPJ</HeaderTableCellStyled>
    <TableCellStyled></TableCellStyled> {/* Esta célula não precisa de estilo especial */}
  </TableRowStyled>
</TableHeadStyled>
    <TableBody>
      {filteredClients.map((client) => (
        <TableRowStyled key={client._id}>
          <TableCellStyled>{client.nome_cliente}</TableCellStyled>
          {client.cnpj_cliente ? (
            <CnpjCellStyled>{client.cnpj_cliente}</CnpjCellStyled>
          ) : (
            <CpfCellStyled>{client.cpf_cliente}</CpfCellStyled>
          )}
          <TableCellStyled>
            <IconButton onClick={(event) => handleMenuClick(event, client)}>
              <MoreVertIcon style={{ color: '#c4c8d2' }} />
            </IconButton>
          </TableCellStyled>
        </TableRowStyled>
      ))}
    </TableBody>
  </TableStyled>
</TableContainerStyled>
          )}

          <ButtonContainer>
            <Fab color="primary" aria-label="add" onClick={handleAddClientClick}>
              <AddIcon />
            </Fab>
          </ButtonContainer>
        </ContentContainer>

        {/* Menu de opções */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              zIndex: 2300, // Garante que o menu está acima de outros elementos
              backgroundColor: '#ffffff', // Cor de fundo do menu
      color: '#fff', // Cor do texto do menu
            },
          }}
        >
          <MenuItemMui onClick={handleViewClient}>Visualizar</MenuItemMui>
          <MenuItemMui style={{color: '#FF0000'}} onClick={handleDeleteClient}>Excluir</MenuItemMui>
        </Menu>

        {/* Modal de Visualização */}
        <Dialog open={openViewModal} onClose={handleCloseViewModal}>
          <DialogTitle style={{color:'#000', fontWeight: '600'}}>Detalhes do Cliente:</DialogTitle>
          <DialogContent sx={{color:'#000', fontSize:'1.5rem', fontWeight: '500', padding: "3rem 3rem 0", gap: '0'}}>
            {returnTempString().map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseViewModal}>Fechar</MuiButton>
          </DialogActions>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle style={{color:'#000', fontWeight: '600'}}>Confirmar Exclusão</DialogTitle>
          <DialogContent style={{color:'#000', fontWeight: '500'}}>
            <p>Tem certeza que deseja excluir o cliente {selectedClient?.nome_cliente}?</p>
          </DialogContent>
          <DialogActions>
            <MuiButton style={{backgroundColor: '#0047FF', color:'#fff', fontWeight: '600'}} onClick={handleCloseDialog}>Cancelar</MuiButton>
            <MuiButton style={{backgroundColor: '#FF0000', color:'#fff', fontWeight: '600'}} onClick={handleConfirmDelete} color="error">Excluir</MuiButton>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </ThemeProvider>
  );
};

export default ClientesPage;

