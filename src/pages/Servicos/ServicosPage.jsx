import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HeaderContainer, MainContainer, ContentContainer, Title, 
  TitleContainer, ButtonContainer 
} from './ServicosStyled';
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

const ServicosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${token}`);
        console.log('Dados dos serviços:', response.data);
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error('Erro ao buscar serviços', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(service =>
      service.nome_servico?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "" || service.valor_servico?.includes(filter))
    );
    setFilteredServices(filtered);
  }, [searchTerm, filter, services]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
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

  const handleDeleteService = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${selectedService._id}/${token}`);
      setServices(services.filter(service => service._id !== selectedService._id));
      setFilteredServices(filteredServices.filter(service => service._id !== selectedService._id));
      handleMenuClose();
    } catch (error) {
      console.error('Erro ao excluir serviço', error);
    }
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
            style={{ marginBottom: '1rem' }}
          />
          <FormControl style={{ marginLeft: '1rem' }} variant="filled">
            <InputLabel id="filter-label">Filtrar por Valor</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: '200px' }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="100">Até R$100</MenuItem>
              <MenuItem value="200">Até R$200</MenuItem>
            </Select>
          </FormControl>
        </HeaderContainer>
        <ContentContainer>
          <TitleContainer>
            <Title>Serviço</Title>
            <Title>Valor</Title>
          </TitleContainer>
          
          <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', width: '80%'}}>
            <Table sx={{ border: 'none'}}>
              <TableBody >
                {filteredServices.map((service) => (
                  <TableRow  key={service._id}>
                    <TableCell sx={{bgcolor: 'white'}} >{service.nome_servico}</TableCell>
                    <TableCell sx={{ backgroundColor: '#FF5A15', color: '#fff', borderRadius: '20px 0 0 20px', width: '30%' }}>
                      <th style={{paddingLeft: '25%', width: '300px', fontSize: '1rem'}}>
                        {service.valor_servico}
                      </th>
                    </TableCell>
                    <TableCell sx={{width: '5%', backgroundColor: '#0047FF'}} >
                      <IconButton sx={{width: '100%'}} onClick={(event) => handleMenuClick(event, service)}>
                        <MoreVertIcon sx={{color: 'white'}} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ButtonContainer>
            <Fab color="primary" aria-label="add" onClick={() => alert('Adicionar novo serviço')}>
              <AddIcon />
            </Fab>
          </ButtonContainer>
        </ContentContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItemMui onClick={handleViewService}>Ver Serviço</MenuItemMui>
          <MenuItemMui onClick={handleDeleteService}>Excluir Serviço</MenuItemMui>
        </Menu>
      </MainContainer>
    </ThemeProvider>
  );
};

export default ServicosPage;
