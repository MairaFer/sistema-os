import React, { useState } from "react";
import styles from './CriarClientes.module.css';
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
    nome_cliente: yup.string().required("Nome do cliente é obrigatório."),
    contato_cliente: yup
        .string()
        .matches(/^\d{11}$|^\d{10}$/, "Contato deve ter exatamente 11 dígitos.")
        .required("Contato é obrigatório."),
    endereco_cliente: yup.string().max(250, "Endereço pode ter no máximo 250 caracteres."),
    cpfCnpj: yup
        .string()
        .required("CPF ou CNPJ é obrigatório.")
        .matches(/^\d{11}$|^\d{14}$/, "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.")
        .test('is-valid-cpf-or-cnpj', 'CPF ou CNPJ inválido.', value => {
            if (!value) return false;
            const isValidCpf = /^\d{11}$/.test(value);
            const isValidCnpj = /^\d{14}$/.test(value);
            return isValidCpf || isValidCnpj;
        }),
    email_cliente: yup
        .string()
        .email("Email inválido.")
        .required("Email é obrigatório."),
});

export const CreateClientPage = () => {
    const [newClient, setNewClient] = useState({
        nome_cliente: '',
        contato_cliente: '',
        endereco_cliente: '',
        cpfCnpj: '',
        email_cliente: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleNewClientChange = (event) => {
        const { name, value } = event.target;

        setNewClient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = async () => {
        try {
            await validationSchema.validate(newClient, { abortEarly: false });
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

        const clientData = {
            ...newClient,
            cpfCnpj: newClient.cpfCnpj,
        };

        try {
            const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-cliente/${token}`, clientData);

            const clientId = response.data;

            if (clientId) {
                setOpenSnackbar(true); // Abre o Snackbar em caso de sucesso
                navigate("/clientes");
            } else {
                console.error('ID do cliente criado não encontrado.');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                if (error.response.data.message.includes('CPF já existente')) {
                    setSubmitError('CPF ou CNPJ já cadastrado.');
                } else {
                    setSubmitError('Erro ao enviar dados. Verifique se o CPF/CNPJ já foi cadastrado.');
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
        navigate("/clientes");
    };


    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Adicionar Cliente +</div>
                        <button className={styles.backButton} onClick={handleNavigateHome}>
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>
                        <section className={styles.clientFormContainer}>
                            <Typography sx={{ fontSize: '1.5rem', color: '#ffff', marginLeft: '1rem' }} variant="h6" gutterBottom>
                                Insira os dados do cliente:
                            </Typography>
                            <div className={styles.newClientWrapperAndButton}>
                                <div className={styles.newClientWrapper}>
                                    <TextField
                                        name="nome_cliente"
                                        label="Nome do cliente*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newClient.nome_cliente}
                                        onChange={handleNewClientChange}
                                        error={!!errors.nome_cliente}
                                        helperText={errors.nome_cliente}
                                    />
                                    <TextField
                                        name="contato_cliente"
                                        label="Contato*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newClient.contato_cliente}
                                        onChange={handleNewClientChange}
                                        error={!!errors.contato_cliente}
                                        helperText={errors.contato_cliente}
                                    />
                                    <TextField
                                        name="endereco_cliente"
                                        label="Endereço"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newClient.endereco_cliente}
                                        onChange={handleNewClientChange}
                                    />
                                    <TextField
                                        name="cpfCnpj"
                                        label="CPF ou CNPJ*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newClient.cpfCnpj}
                                        onChange={handleNewClientChange}
                                        error={!!errors.cpfCnpj}
                                        helperText={errors.cpfCnpj}
                                    />
                                    <TextField
                                        name="email_cliente"
                                        label="Email*"
                                        variant="filled"
                                        margin="dense"
                                        fullWidth
                                        value={newClient.email_cliente}
                                        onChange={handleNewClientChange}
                                        error={!!errors.email_cliente}
                                        helperText={errors.email_cliente}
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
                    Cliente criado com sucesso!
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default CreateClientPage;
