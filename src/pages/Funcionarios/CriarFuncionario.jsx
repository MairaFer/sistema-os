import React, { useState } from "react";
import styles from './CriarFuncionario.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

// Atualize o schema de validação para refletir os novos campos
const validationSchema = yup.object().shape({
    nome_funcionario: yup.string().required("Nome do funcionário é obrigatório."),
    contato_funcionario: yup
        .string()
        .matches(/^\d{11}$|^\d{10}$/, "Contato deve ter exatamente 11 dígitos.")
        .required("Contato é obrigatório."),
    setor: yup.string().required("Setor é obrigatório."),
});

export const CreateFuncionarioPage = () => {
    const [newFuncionario, setNewFuncionario] = useState({
        nome_funcionario: '',
        contato_funcionario: '',
        setor: '',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
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

            if (funcionarioId) {
                setOpenSnackbar(true); // Abre o Snackbar em caso de sucesso
                navigate("/funcionarios");
            } else {
                console.error('ID do funcionário criado não encontrado.');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                if (error.response.data.message.includes('CPF já existente')) {
                    setSubmitError('CPF já cadastrado.');
                } else {
                    setSubmitError('Erro ao enviar dados. Verifique se o CPF já foi cadastrado.');
                }
            } else {
                setSubmitError('Erro ao enviar dados. Tente novamente.');
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleNavigateHome = () => {
        navigate("/funcionarios");
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Adicionando Funcionário +</div>
                        <button className={styles.backButton} onClick={handleNavigateHome}>
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>
                        <section className={styles.funcionarioFormContainer}>
                            <Typography sx={{ fontSize: '1.5rem', color: '#ffff',  }} variant="h6" gutterBottom>
                                Criar novo funcionário:
                            </Typography>
                            <div className={styles.newFuncionarioWrapperAndButton}>
                                <div className={styles.newFuncionarioWrapper}>
                                    <TextField
                                        name="nome_funcionario"
                                        label="Nome do funcionário*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newFuncionario.nome_funcionario}
                                        onChange={handleNewFuncionarioChange}
                                        error={!!errors.nome_funcionario}
                                        helperText={errors.nome_funcionario}
                                    />
                                    <TextField
                                        name="contato_funcionario"
                                        label="Contato*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newFuncionario.contato_funcionario}
                                        onChange={handleNewFuncionarioChange}
                                        error={!!errors.contato_funcionario}
                                        helperText={errors.contato_funcionario}
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
                                    sx={{ display: 'flex', width: '8rem', height: '8rem', borderRadius: '1rem', alignItems: 'center', backgroundColor: '#0047FF', color: '#FFF' }}
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
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Funcionário criado com sucesso!
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default CreateFuncionarioPage;
