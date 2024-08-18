import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HeaderContainer, MainContainer, ContentContainer, Title, 
  TitleContainer, ButtonContainer 
} from './FuncionarioStyled'; 
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

const FuncionarioPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`);
        console.log('Dados dos funcionários:', response.data);
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Erro ao buscar funcionários', error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.nome_func?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "" || employee.setor?.toLowerCase().includes(filter.toLowerCase()))
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, filter, employees]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleViewEmployee = () => {
    alert(`Visualizar funcionário: ${selectedEmployee.nome_func}`);
    handleMenuClose();
  };

  const handleDeleteEmployee = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${selectedEmployee._id}/${token}`);
      setEmployees(employees.filter(employee => employee._id !== selectedEmployee._id));
      setFilteredEmployees(filteredEmployees.filter(employee => employee._id !== selectedEmployee._id));
      handleMenuClose();
    } catch (error) {
      console.error('Erro ao excluir funcionário', error);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MainContainer>
        <HeaderContainer>
          <div style={{ marginBottom: '1rem' }} />
          <TextField 
            variant="outlined" 
            placeholder="Buscar funcionário..." 
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: '1rem', width:'400px' }}
          />
          <FormControl style={{ marginLeft: '1rem' }} variant="filled">
            <InputLabel id="filter-label">Filtrar por Setor</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: '250px' }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="RH">RH</MenuItem>
              <MenuItem value="TI">TI</MenuItem>
              <MenuItem value="Financeiro">Financeiro</MenuItem>
              {/* Adicione outros setores conforme necessário */}
            </Select>
          </FormControl>
        </HeaderContainer>
        <ContentContainer>
          <TitleContainer>
            <Title>Funcionário</Title>
            <Title>Setor</Title>
          </TitleContainer>
          
          <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', width: '80%'}}>
            <Table sx={{ border: 'none'}}>
              <TableBody >
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell sx={{bgcolor: 'white'}}>{employee.nome_func}</TableCell>
                    <TableCell sx={{ backgroundColor: '#FF5A15', color: '#fff', borderRadius: '20px 0 0 20px', width: '30%' }}>
                      <th style={{paddingLeft: '25%', width: '300px', fontSize: '1rem'}}>
                        {employee.setor}
                      </th>
                    </TableCell>
                    <TableCell sx={{width: '5%', backgroundColor: '#0047FF'}}>
                      <IconButton sx={{width: '100%'}} onClick={(event) => handleMenuClick(event, employee)}>
                        <MoreVertIcon sx={{color: 'white'}} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ButtonContainer>
            <Fab color="primary" aria-label="add" onClick={() => alert('Adicionar novo funcionário')}>
              <AddIcon />
            </Fab>
          </ButtonContainer>
        </ContentContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItemMui onClick={handleViewEmployee}>Ver Funcionário</MenuItemMui>
          <MenuItemMui onClick={handleDeleteEmployee}>Excluir Funcionário</MenuItemMui>
        </Menu>
      </MainContainer>
    </ThemeProvider>
  );
};

export default FuncionarioPage;