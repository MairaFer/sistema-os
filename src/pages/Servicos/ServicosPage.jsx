import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HeaderContainer, MainContainer, ContentContainer, ButtonContainer, HeaderTableCellStyled 
} from './ServicosStyled'; 
import {
  TableContainerStyled,
  TableStyled,
  TableHeadStyled,
  TableCellStyled,
  TableRowStyled,
  ValorCellStyled,
} from './ServicosStyled'; 
import {
  Select, MenuItem, FormControl, InputLabel, Fab, Menu,
  MenuItem as MenuItemMui, createTheme, ThemeProvider, TableBody, IconButton, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, Button as MuiButton, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
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
          borderSpacing: '8px',
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
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
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
        enqueueSnackbar('Erro ao buscar serviços!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [enqueueSnackbar]);

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

  const handleMenuClick = (event, serviceId) => {
    setAnchorEl(event.currentTarget);
    setSelectedServiceId(serviceId);  // Store the selected service ID
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedServiceId(null);  // Clear selected service ID on close
  };

  const handleViewService = () => {
    if (selectedServiceId) {
      const service = services.find(service => service._id === selectedServiceId);
      if (service) {
        alert(`Visualizar serviço: ${service.nome_servico}`);
      }
    }
    handleMenuClose();
  };

  const handleDeleteService = () => {
    if (selectedServiceId) {
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    const token = sessionStorage.getItem('token');
    if (selectedServiceId) {
      try {
        await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/deletar/${token}/${selectedServiceId}`);
        setServices(services.filter(service => service._id !== selectedServiceId));
        setFilteredServices(filteredServices.filter(service => service._id !== selectedServiceId));
        enqueueSnackbar('Serviço excluído com sucesso!', { variant: 'success' });
      } catch (error) {
        console.error('Erro ao excluir serviço', error);
        enqueueSnackbar('Erro ao excluir serviço!', { variant: 'error' });
      } finally {
        handleCloseDialog();
        setSelectedServiceId(null);  // Clear selected service ID after deletion
      }
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
            <TableContainerStyled>
              <TableStyled>
                <TableHeadStyled>
                  <TableRowStyled>
                    <HeaderTableCellStyled><strong>Serviço</strong></HeaderTableCellStyled>
                    <HeaderTableCellStyled><strong>Valor</strong></HeaderTableCellStyled>
                    <HeaderTableCellStyled></HeaderTableCellStyled>
                  </TableRowStyled>
                </TableHeadStyled>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRowStyled key={service._id}>
                      <TableCellStyled>{service.nome_servico}</TableCellStyled>
                      <ValorCellStyled>
                        {formatCurrency(service.valor_servico)}
                      </ValorCellStyled>
                      <TableCellStyled>
                        <IconButton onClick={(event) => handleMenuClick(event, service._id)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedServiceId === service._id}
                          onClose={handleMenuClose}
                        >
                          <MenuItemMui onClick={handleViewService}>Visualizar</MenuItemMui>
                          <MenuItemMui onClick={handleDeleteService}>Excluir</MenuItemMui>
                        </Menu>
                      </TableCellStyled>
                    </TableRowStyled>
                  ))}
                </TableBody>
              </TableStyled>
            </TableContainerStyled>
          )}
        </ContentContainer>
        <ButtonContainer>
          <Fab color="primary" aria-label="add" onClick={handleAddServiceClick}>
            <AddIcon />
          </Fab>
        </ButtonContainer>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <p>Tem certeza de que deseja excluir este serviço?</p>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseDialog}>Cancelar</MuiButton>
            <MuiButton onClick={handleConfirmDelete} color="error">Excluir</MuiButton>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </ThemeProvider>
  );  
};

export default ServicosPage;
