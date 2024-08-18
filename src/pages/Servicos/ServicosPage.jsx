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
  const [sortOrder, setSortOrder] = useState('');
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
            style={{ marginBottom: '1rem', width:'400px' }}
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
          <TitleContainer>
            <Title>Serviço</Title>
            <Title>Valor</Title>
          </TitleContainer>
          
          <TableContainer component={Paper} sx={{ borderRadius: '12px', width: '80%'}}>
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
