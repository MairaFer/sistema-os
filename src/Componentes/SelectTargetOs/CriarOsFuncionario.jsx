import React, { useState, useEffect } from "react";
import styles from './CriarOsFuncionario.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import {
    Button,
    ThemeProvider,
    createTheme
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

export const CriarOsFuncionario = () => {
    const { control } = useForm();
    const [funcionarios, setFuncionarios] = useState([]);
    const [filteredFuncionarios, setFilteredFuncionarios] = useState([]);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("nome"); // Tipo de busca: 'nome' ou 'setor'
    const navigate = useNavigate();
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);

    // Função para buscar todos os funcionários
    const fetchAllFuncionarios = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado.');
            return;
        }

        try {
            const response = await axios.get(
                `https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`
            );
            setFuncionarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    useEffect(() => {
        fetchAllFuncionarios();
    }, []);

    useEffect(() => {
        if (search) {
            let filtered = [];

            if (searchType === "nome") {
                filtered = funcionarios.filter(f => f.nome_func.toLowerCase().includes(search.toLowerCase()));
            } else if (searchType === "setor") {
                filtered = funcionarios.filter(f => f.setor.toLowerCase().includes(search.toLowerCase()));
            }

            setFilteredFuncionarios(filtered);
        } else {
            setFilteredFuncionarios([]);
        }
    }, [search, searchType, funcionarios]);

    const handleAddFuncionario = () => {
        navigate("/criaros/adicionar-funcionario");
    };

    const handleNavigateHome = () => {
        navigate("/criaros/tipo-da-os");
    };

    const handleAvancar = () => {
        if (selectedFuncionario) {
            sessionStorage.removeItem('selectedClientId');
            sessionStorage.setItem('selectedFuncionarioId', selectedFuncionario._id);
            navigate("/criar-os/finalizar-func");
        }
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Criando OS</div>
                        <p className={styles.p}>2. Adicione um Funcionário à OS</p>
                        <button className={styles.backButton} onClick={handleNavigateHome}>
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>
                    </div>

                    <section className={styles.funcionarioFormContainer}>
                        <label className="texto" htmlFor="searchTipo">Selecionar funcionário existente:</label>
                        <div className={styles.searchTipoWrapper}>
                            <TextField
                                select
                                label="Buscar por"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                variant="filled"
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                SelectProps={{ native: true }}
                            >
                                <option value="nome">Nome</option>
                                <option value="setor">Setor</option>
                            </TextField>

                            <Controller
                                name="searchInput"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={`Digite o ${searchType === "nome" ? "nome" : "setor"}`}
                                        variant="filled"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        fullWidth
                                    />
                                )}
                            />

                            <Autocomplete
                                options={filteredFuncionarios}
                                getOptionLabel={(option) => `${option.nome_func} - ${option.setor}`}
                                value={selectedFuncionario}
                                onChange={(event, newValue) => setSelectedFuncionario(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Funcionários"
                                        variant="filled"
                                    />
                                )}
                                fullWidth
                                sx={{ marginTop: 2 }}
                                disabled={!filteredFuncionarios.length && !search}
                            />


                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAvancar}
                                sx={{ marginTop: 2, width: 280, height: 55 }}
                                disabled={!selectedFuncionario}
                            >
                                Avançar
                            </Button>

                            <Typography sx={{ fontSize: '1.4rem', color: '#ffff', marginTop: '0.8rem' }} variant="body1">Ou Adicionar Novo Funcionário:</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddFuncionario}
                                sx={{ marginTop: 2, width: 280, height: 55 }}
                            >
                                Adicionar Funcionário
                            </Button>
                        </div>
                    </section>
                </div>
                <div className={styles.designPage} />
            </div>
        </ThemeProvider>
    );
};

export default CriarOsFuncionario;
