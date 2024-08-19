import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HeaderContainer, MainContainer, ContentContainer, TitleContainer,
  ButtonContainer
} from './ServicosStyled';
import {
  Select, MenuItem, FormControl, InputLabel, Fab, Menu,
  MenuItem as MenuItemMui, createTheme, ThemeProvider,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, Button as MuiButton, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

const ServicosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${token}`);
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error('Erro ao buscar serviços', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const sorted = [...services].sort((a, b) => {
      const valorA = parseFloat(a.valor_servico);
      const valorB = parseFloat(b.valor_servico);

      if (sortOrder === 'asc') {
        return valorA - valorB;
      } else if (sortOrder === 'desc') {
        return valorB - valorA;
      }
      return 0;
    });

    const filtered = sorted.filter(service =>
      service.nome_servico?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredServices(filtered);
  }, [searchTerm, sortOrder, services]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleMenuClick = (event, service) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleViewService = () => {
    alert(`Visualizar serviço: ${selectedService.nome_servico}`);
    handleMenuClose();
  };

  const handleDeleteService = () => {
    if (selectedService) {
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
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${selectedService._id}/${token}`);
      setServices(services.filter(service => service._id !== selectedService._id));
      setFilteredServices(filteredServices.filter(service => service._id !== selectedService._id));
    } catch (error) {
      console.error('Erro ao excluir serviço', error);
    } finally {
      handleCloseDialog();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  

  const handleAddServiceClick = () => {
    navigate('/criar-servico');
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MainContainer>
        <HeaderContainer>
          <div style={{ marginBottom: '1rem' }} />
          <TextField 
            variant="outlined" 
            placeholder="Buscar serviço..." 
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: '1rem', width: '400px' }}
          />
          <FormControl style={{ marginLeft: '1rem' }} variant="filled">
            <InputLabel id="sort-order-label">Ordenar por Valor</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              onChange={handleSortOrderChange}
              style={{ width: '250px' }}
            >
              <MenuItem value="asc">Crescente</MenuItem>
              <MenuItem value="desc">Decrescente</MenuItem>
            </Select>
          </FormControl>
        </HeaderContainer>
        <ContentContainer>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </div>
          ) : filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p>Não há nenhum serviço cadastrado.</p>
            </div>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '12px', width: '55%' }}>
              <Table sx={{ border: 'none' }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Serviço</strong></TableCell>
                    <TableCell><strong>Valor</strong></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>{service.nome_servico}</TableCell>
                      <TableCell sx={{ backgroundColor: '#FF5A15', color: '#fff', borderRadius: '2rem 0 0 2rem', width:'15rem' }}>
                        {formatCurrency(service.valor_servico)}
                      </TableCell>
                      <TableCell sx={{width:''}}>
                        <IconButton onClick={(event) => handleMenuClick(event, service)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItemMui onClick={handleViewService}>Visualizar</MenuItemMui>
                          <MenuItemMui onClick={handleDeleteService}>Excluir</MenuItemMui>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </ContentContainer>
        <ButtonContainer>
          <Fab color="primary" onClick={handleAddServiceClick} style={{ marginTop: '2rem' }}>
            <AddIcon />
          </Fab>
        </ButtonContainer>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>Deseja realmente excluir este serviço?</DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseDialog} color="primary">Cancelar</MuiButton>
            <MuiButton onClick={handleConfirmDelete} color="secondary">Excluir</MuiButton>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </ThemeProvider>
  );
};

export default ServicosPage;
