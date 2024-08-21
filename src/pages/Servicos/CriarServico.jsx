import React, { useState } from "react";
import styles from './CriarServico.module.css';
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

const validationSchema = yup.object().shape({
    nome_servico: yup.string().required("Nome do serviço é obrigatório."),
    valor_servico: yup
        .number()
        .typeError("Valor deve ser um número.")
        .required("Valor do serviço é obrigatório.")
        .positive("Valor deve ser positivo."),
});

export const CreateServicoPage = () => {
    const [newServico, setNewServico] = useState({
        nome_servico: '',
        valor_servico: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleNewServicoChange = (event) => {
        const { name, value } = event.target;

        setNewServico(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = async () => {
        try {
            await validationSchema.validate(newServico, { abortEarly: false });
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

        const servicoData = {
            ...newServico,
        };

        try {
            const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-servico/${token}`, servicoData);

            const servicoId = response.data;

            if (servicoId) {
                setOpenSnackbar(true); // Abre o Snackbar em caso de sucesso
                navigate("/servicos");
            } else {
                console.error('ID do serviço criado não encontrado.');
            }
        } catch (error) {
            setSubmitError('Erro ao enviar dados. Tente novamente.');
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleNavigateHome = () => {
        navigate("/servicos");
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Criando Serviço</div>
                        <button className={styles.backButton} onClick={handleNavigateHome}>
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>
                        <section className={styles.servicoFormContainer}>
                            <Typography sx={{ fontSize: '1.5rem', color: '#ffff' }} variant="h6" gutterBottom>
                                Criar novo serviço:
                            </Typography>
                            <div className={styles.newServicoWrapperAndButton}>
                                <div className={styles.newServicoWrapper}>
                                    <TextField
                                        name="nome_servico"
                                        label="Nome do serviço*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newServico.nome_servico}
                                        onChange={handleNewServicoChange}
                                        error={!!errors.nome_servico}
                                        helperText={errors.nome_servico}
                                    />
                                    <TextField
                                        name="valor_servico"
                                        label="Valor*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newServico.valor_servico}
                                        onChange={handleNewServicoChange}
                                        error={!!errors.valor_servico}
                                        helperText={errors.valor_servico}
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
                    Serviço criado com sucesso!
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default CreateServicoPage;
