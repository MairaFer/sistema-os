import React, { useState } from "react";
import styles from './AddFuncionarioOS.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

const validationSchema = yup.object().shape({
    nome_func: yup.string().required("Nome é obrigatório."),
    contato_func: yup
        .string()
        .min(8, "Contato deve ter pelo menos 8 caracteres.")
        .required("Contato é obrigatório."),
    setor: yup.string().required("Setor é obrigatório."),
});

export const AddFuncionarioOs = () => {
    const [newFuncionario, setNewFuncionario] = useState({
        nome_func: '',
        contato_func: '',
        setor: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();

    const handleNewFuncionarioChange = (event) => {
        const { name, value } = event.target;

        setNewFuncionario(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = async () => {
        try {
            await validationSchema.validate(newFuncionario, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach(error => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
            return false;
        }
    };

    const handleSubmit = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado.');
            return;
        }

        const isValid = await validateForm();
        if (!isValid) return;

        const funcionarioData = {
            ...newFuncionario,
        };

        try {
            const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-funcionario/${token}`, funcionarioData);

            const funcionarioId = response.data;
            console.log(funcionarioId)

            if (funcionarioId) {
                sessionStorage.removeItem('selectedClientId');
                sessionStorage.setItem('selectedFuncionarioId', funcionarioId);
                navigate("/criar-os/finalizar");
            } else {
                console.error('ID do funcionário criado não encontrado.');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setSubmitError('Erro ao enviar dados. Tente novamente.');
            } else {
                setSubmitError('Erro ao enviar dados. Tente novamente.');
            }
        }
    };

    const handleNavigateHome = () => {
        navigate("/criaros/funcionario");
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Criando Funcionário</div>
                        <p className={styles.p}>2. Adicione um Funcionário</p>
                        <button className={styles.backButton} onClick={handleNavigateHome}>
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>
                        <section className={styles.funcionarioFormContainer}>
                            <Typography sx={{ fontSize: '1.5rem', color: '#ffff'}} variant="h6" gutterBottom>
                                Criar novo funcionário:
                            </Typography>
                            <div className={styles.newFuncionarioWrapperAndButton}>
                                <div className={styles.newFuncionarioWrapper}>
                                    <TextField
                                        name="nome_func"
                                        label="Nome*"
                                        variant="filled"
                                        fullWidth
                                        value={newFuncionario.nome_func}
                                        onChange={handleNewFuncionarioChange}
                                        error={!!errors.nome_func}
                                        helperText={errors.nome_func}
                                    />
                                    <TextField
                                        name="contato_func"
                                        label="Contato*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newFuncionario.contato_func}
                                        onChange={handleNewFuncionarioChange}
                                        error={!!errors.contato_func}
                                        helperText={errors.contato_func}
                                    />
                                    <TextField
                                        name="setor"
                                        label="Setor*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newFuncionario.setor}
                                        onChange={handleNewFuncionarioChange}
                                        error={!!errors.setor}
                                        helperText={errors.setor}
                                    />
                                </div>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{ display: 'flex', width: '8rem', height:'8rem', borderRadius:'1rem', alignItems: 'center', backgroundColor: '#0047FF', color: '#FFF' }}
                                >
                                    <ArrowForwardIcon style={{ fontSize: 90, padding: 10 }} />
                                </Button>
                            </div>
                            {submitError && <Typography color="error">{submitError}</Typography>}
                        </section>
                    </div>
                    <div className={styles.designPage} />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default AddFuncionarioOs;
