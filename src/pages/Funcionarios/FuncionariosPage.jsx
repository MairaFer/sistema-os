import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HeaderContainer, MainContainer, ContentContainer, ButtonContainer 
} from './FuncionarioStyled'; 
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

const FuncionarioPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`);
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Erro ao buscar funcionários', error);
        enqueueSnackbar('Erro ao buscar funcionários!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [enqueueSnackbar]);

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
  };

  const handleViewEmployee = () => {
    if (selectedEmployee) {
      setOpenViewModal(true);
    } else {
      console.warn('Nenhum funcionário selecionado');
    }
    handleMenuClose(); // Fecha o menu
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const returnTempString = () => {
    if (!selectedEmployee) {
      return ['Nenhum funcionário selecionado.'];
    }
    return `
      Nome: ${selectedEmployee.nome_func}
      Setor: ${selectedEmployee.setor}
      Contato: ${selectedEmployee.contato_func}
    `.trim().split('\n');
  };

  const handleConfirmDelete = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${selectedEmployee._id}/${token}`);
      setEmployees(employees.filter(employee => employee._id !== selectedEmployee._id));
      setFilteredEmployees(filteredEmployees.filter(employee => employee._id !== selectedEmployee._id));
      enqueueSnackbar('Funcionário excluído com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao excluir funcionário', error);
      enqueueSnackbar('Erro ao excluir funcionário!', { variant: 'error' });
    } finally {
      handleCloseDialog();
    }
  };

  const handleAddEmployeeClick = () => {
    navigate('/criar-funcionario');
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MainContainer>
        <HeaderContainer>
          <div style={{ marginBottom: '1rem' }} />
          <TextField
            placeholder="Buscar funcionário..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: '1rem', width: '400px' }}
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
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p>Não há nenhum funcionário cadastrado.</p>
            </div>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '12px', width: '60%' }}>
              <Table sx={{ border: 'none' }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Funcionário</strong></TableCell>
                    <TableCell ><strong>Setor</strong></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>{employee.nome_func}</TableCell>
                      <TableCell sx={{ borderRadius: '2rem 0 0 2rem', color: '#fff', backgroundColor: '#FF5A15', width:'20rem' }}>
                        {employee.setor}
                      </TableCell>
                      <TableCell sx={{width:''}}>
                        <IconButton onClick={(event) => handleMenuClick(event, employee)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <ButtonContainer>
            <Fab color="primary" aria-label="add" onClick={handleAddEmployeeClick}>
              <AddIcon />
            </Fab>
          </ButtonContainer>
        </ContentContainer>
      </MainContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemMui onClick={handleViewEmployee}>Visualizar</MenuItemMui>
        <MenuItemMui onClick={handleDeleteEmployee}>Excluir</MenuItemMui>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <p>Você tem certeza que deseja excluir este funcionário?</p>
          {returnTempString().map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog}>Cancelar</MuiButton>
          <MuiButton color="error" onClick={handleConfirmDelete}>Excluir</MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
      >
        <DialogTitle>Detalhes do Funcionário</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <>
              <p><strong>Nome:</strong> {selectedEmployee.nome_func}</p>
              <p><strong>Setor:</strong> {selectedEmployee.setor}</p>
              <p><strong>Contato:</strong> {selectedEmployee.contato_func}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseViewModal}>Fechar</MuiButton>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default FuncionarioPage;
