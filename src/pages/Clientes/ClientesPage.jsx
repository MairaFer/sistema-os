import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HeaderContainer, MainContainer, ContentContainer, Title, 
  TitleContainer, ButtonContainer 
} from './ClienteStyled';
import { 
  Select, MenuItem, FormControl, InputLabel, Fab, Menu, 
  MenuItem as MenuItemMui, createTheme, ThemeProvider, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, TextField 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
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
  },
});

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`);
        console.log('Dados dos clientes:', response.data);
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes', error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "" || (client.cpf_cliente?.includes(filter) || client.cnpj_cliente?.includes(filter)))
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
    setSelectedClient(null);
  };

  const handleViewClient = () => {
    alert(`Visualizar cliente: ${selectedClient.nome_cliente}`);
    handleMenuClose();
  };

  const handleDeleteClient = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${selectedClient._id}/${token}`);
      setClients(clients.filter(client => client._id !== selectedClient._id));
      setFilteredClients(filteredClients.filter(client => client._id !== selectedClient._id));
      handleMenuClose();
    } catch (error) {
      console.error('Erro ao excluir cliente', error);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MainContainer>
        <HeaderContainer>
          <div style={{ marginBottom: '1rem' }} />
          <TextField 
            variant="outlined" 
            placeholder="Buscar cliente..." 
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: '1rem' }}
          />
          <FormControl style={{ marginLeft: '1rem' }} variant="filled">
            <InputLabel id="filter-label">Filtrar por CPF/CNPJ</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: '200px' }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="CPF">CPF</MenuItem>
              <MenuItem value="CNPJ">CNPJ</MenuItem>
            </Select>
          </FormControl>
        </HeaderContainer>
        <ContentContainer>
          <TitleContainer>
            <Title>Cliente</Title>
            <Title>CPF/CNPJ</Title>
          </TitleContainer>
          
          <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', width: '80%'}}>
            <Table sx={{ border: 'none'}}>
              <TableBody >
                {filteredClients.map((client) => (
                  <TableRow  key={client._id}>
                    <TableCell sx={{bgcolor: 'white'}} >{client.nome_cliente}</TableCell>
                    <TableCell sx={{ backgroundColor: '#FF5A15', color: '#fff', borderRadius: '20px 0 0 20px', width: '30%' }}>
                      <th style={{paddingLeft: '25%', width: '300px', fontSize: '1rem'}}>
                        {client.cpf_cliente || client.cnpj_cliente}
                      </th>
                    </TableCell>
                    <TableCell sx={{width: '5%', backgroundColor: '#0047FF'}} >
                      <IconButton sx={{width: '100%'}} onClick={(event) => handleMenuClick(event, client)}>
                        <MoreVertIcon sx={{color: 'white'}} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ButtonContainer>
            <Fab color="primary" aria-label="add" onClick={() => alert('Adicionar novo cliente')}>
              <AddIcon />
            </Fab>
          </ButtonContainer>
        </ContentContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItemMui onClick={handleViewClient}>Ver Cliente</MenuItemMui>
          <MenuItemMui onClick={handleDeleteClient}>Excluir Cliente</MenuItemMui>
        </Menu>
      </MainContainer>
    </ThemeProvider>
  );
};

export default ClientesPage;
