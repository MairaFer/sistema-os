import React, { useState } from "react";
import styles from './CriarOsCliente.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import {
    Button,
    ThemeProvider,
    createTheme,
    Grid,
    Box
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

// Defina o tema
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        text: {
            primary: '#000',
            secondary: '#111',
        },
    },
    typography: {
        fontFamily: '"Lexend", sans-serif',
        h1: { fontSize: '2rem', color: '#333', fontWeight: '500' },
        body1: { fontSize: '1.05rem', color: '#555', fontWeight: '500' },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.25rem',
                    transition: 'all 0.3s ease-in-out',
                    '&.Mui-focused': {
                        backgroundColor: '#e0f7fa',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0047FF',
                    color: '#FFF',
                    '&:hover': {
                        backgroundColor: '#0037CC',
                    },
                },
            },
        },
    },
});

export const SelectTypeOS = () => {
    const { control } = useForm();
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState("");
    const navigate = useNavigate();
    const [navigateAllowed, setNavigateAllowed] = useState(false); // Estado para controle de navegação

    const handleSearch = async () => {
        if (search) {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado.');
                return;
            }

            let response;

            try {
                if (search.length === 11) {
                    response = await axios.post(
                        `https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/buscar-cpf/${token}`,
                        { cpf: search }
                    );
                } else if (search.length === 14) {
                    response = await axios.post(
                        `https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/buscar-cnpj/${token}`,
                        { cnpj: search }
                    );
                } else {
                    setDialogContent("CPF ou CNPJ inválido. Verifique o número e tente novamente.");
                    setDialogOpen(true);
                    return;
                }

                if (response.data.length > 0) {
                    setClients(response.data);
                    if (search.length === 11) {
                        setDialogContent(`Cliente Selecionado: Nome - ${response.data[0].nome_cliente} / CPF - ${response.data[0].cpf_cliente}`);
                    } else {
                        setDialogContent(`Cliente Selecionado: Nome - ${response.data[0].nome_cliente} / CNPJ - ${response.data[0].cnpj_cliente}`);
                    }
                    setNavigateAllowed(true); // Permitir navegação
                } else {
                    setClients([]);
                    setDialogContent("Cliente não encontrado.");
                }
                setDialogOpen(true);
            } catch (error) {
                console.error('Erro ao buscar cliente:', error);
                setDialogContent("Erro ao buscar cliente. Tente novamente.");
                setDialogOpen(true);
            }
        }
    };

    const handleClientSelect = (event, selectedClient) => {
        setSelectedClient(selectedClient || null);
        setSearch(selectedClient ? selectedClient.cpfCnpj : "");
    };

    const handleAddClient = () => {
        navigate("/criaros/adicionar-cliente");
    };

    const handleNavigateHome = () => {
        navigate("/criaros/tipo-da-os");
    };

    const handleDialogClose = (navigateToNextPage) => {
        setDialogOpen(false);
        if (navigateToNextPage && navigateAllowed && clients.length > 0) {
            sessionStorage.removeItem('selectedFuncionarioId');
            sessionStorage.setItem('selectedClientId', clients[0]._id);
            navigate("/criar-os/finalizar");
        } else {
            setNavigateAllowed(false); // Resetar a permissão de navegação
            setSelectedClient(null); // Limpar a seleção se não avançar
        }
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Criando OS</div>
                        <p className={styles.p}>2. Adicione um Cliente a OS</p>
                        <button className={styles.backButton} onClick={handleNavigateHome}>
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>

                        <section className={styles.clientFormContainer}>
                            <label className="texto" htmlFor="selectClient">Selecionar cliente existente:</label>
                            <div className={styles.searchWrapper}>
                                <Controller
                                    name="cpfCnpj"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Digite CPF ou CNPJ"
                                            margin="normal"
                                            variant="filled"
                                            className={`${styles.searchInput} ${search ? styles.inputFilled : ''}`}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            fullWidth
                                            sx={{ width: '100%' }} // Ajuste a largura do TextField
                                        />
                                    )}
                                />

                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    sx={{ marginLeft: 2, marginTop: 1, height: 50 }}
                                >
                                    Buscar
                                </Button>
                            </div>

                            <div className={styles.addButtonWrapper}>
                                <Typography sx={{ fontSize: '1.4rem', color: '#ffff', marginTop: '0.8rem' }} variant="body1"> Ou Adicionar Novo Cliente:</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddClient}
                                    sx={{ marginTop: 1, width: 280, height: 55 }}
                                >
                                    Adicionar Cliente
                                </Button>
                            </div>
                        </section>
                    </div>
                    <div className={styles.designPage} />
                </div>

                <Dialog sx={{ border: 'solid', borderColor: '#EF5E22' }} open={dialogOpen} onClose={() => handleDialogClose(false)}>
                    <DialogTitle sx={{ color: '#000' }}>Cliente Encontrado!</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ color: '#000' }}>{dialogContent}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleDialogClose(false)} sx={{ backgroundColor:'#dc3545'}}>
                            CANCELAR
                        </Button>
                        <Button onClick={() => handleDialogClose(true)} color="primary">
                            AVANÇAR {'>'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
};

export default SelectTypeOS;
