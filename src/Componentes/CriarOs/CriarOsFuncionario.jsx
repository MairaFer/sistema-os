import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TextField, Button, IconButton, Snackbar, Alert, ThemeProvider, createTheme, Radio, RadioGroup, FormControlLabel, FormLabel, Select, MenuItem, InputLabel, FormControl, Grid, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Autocomplete from '@mui/material/Autocomplete';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import styles from './CriarOs.module.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InputAdornment from '@mui/material/InputAdornment';


let idDeCliente = sessionStorage.getItem('selectedClientId');
let idDeFuncionario = sessionStorage.getItem('selectedFuncionarioId');

console.log('ID de Cliente:', idDeCliente);
console.log('ID de Funcionario:', idDeFuncionario);


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
        h1: { fontSize: '2rem', color: '#333', fontWeight: '600' },
        body1: { fontSize: '1.05rem', color: '#555', fontWeight: '500' },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.25rem',
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
        MuiSelect: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.25rem',
                },
            },
        },
    },
});

let schema;
// Defina o schema de validação
schema = yup.object().shape({
    nome_os: yup.string().required('Registre o Nome da OS.'),
    equipamento: yup.string().required('Equipamento é obrigatório'),
    marca: yup.string().nullable(),
    numero_serie: yup.string().nullable(),
    pagamento: yup.string().nullable(),
    tecnico: yup.string().required('Defina o técnico responsável.'),
    nome_servico: yup.string().required('Defina o serviço.'),
    valor_servico: yup.number().nullable().default(0),
    pecas: yup.array().of(
        yup.object().shape({
            nome_peca: yup.string().nullable(),
            quantidade: yup.number().positive('Quantidade deve ser positiva').nullable(),
            valor_peca: yup.number().positive('Valor Unitário deve ser positivo').nullable(),
        })
    ),
    observacoes: yup.string().nullable(),
    data_encerramento: yup.date().nullable(),
    diagnostico: yup.string().nullable(),
    defeitos_relatados: yup.string().nullable(),
    acessorio: yup.boolean().nullable()
});


const CreateOrder = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            pecas: [{ nome_peca: '', quantidade: '', valor_peca: '' }],
            valor_servico: '',
            data_encerramento: null,
            acessorio: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pecas',
    });

    const [servicos, setServicos] = useState([]);
    const [selectedServico, setSelectedServico] = useState(null);
    const [isServicoSelected, setIsServicoSelected] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [servicoOsError, setServicoOsError] = useState('');

    useEffect(() => {
        const fetchServicos = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado.');
                return;
            }

            try {
                const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${token}`);
                setServicos(response.data);
            } catch (error) {
                console.error('Erro ao buscar serviços', error);
            }
        };

        fetchServicos();
    }, []);

    const calcularValorTotal = (quantidade, valor_peca) => {
        return quantidade * valor_peca;
    };

    const onSubmit = async (data) => {
        console.log('Formulário enviado com os dados:', data);

        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado.');
            return;
        }

        let servicoId = selectedServico?._id;

        if (!data.valor_servico) {
            data.valor_servico = 0;
        }

        // Se o serviço não foi selecionado e o nome e valor do serviço foram fornecidos
        if (!isServicoSelected && data.nome_servico) {
            console.log('Nenhum serviço selecionado, criando novo serviço com nome e valor inseridos manualmente:', data.nome_servico);

            try {
                console.log('Criando novo serviço:', data.nome_servico, data.valor_servico);
                const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-servico/${token}`, {
                    nome_servico: data.nome_servico,
                    valor_servico: data.valor_servico,
                });

                const novoServico = response.data;

                console.log('Novo serviço criado:', novoServico);

                if (novoServico) {
                    setServicos(prev => [...prev, novoServico]);
                    setSelectedServico(novoServico);
                    servicoId = novoServico;
                } else {
                    console.error('Erro ao criar novo serviço ou serviço inválido');
                    setServicoOsError('Erro ao criar novo serviço.');
                    return;
                }
            } catch (error) {
                console.error('Erro ao criar serviço', error);
                setServicoOsError('Erro ao criar serviço.');
                return;
            }
        }

        // Preparar o payload para criar a ordem de serviço
        const payload = {
            cliente_os: idDeCliente || null,
            funcionario_os: idDeFuncionario || null,
            nome_os: data.nome_os,
            tecnico: data.tecnico,
            equipamento: data.equipamento,
            marca: data.marca,
            numero_serie: data.numero_serie,
            servico_os: servicoId,
            pecas_os: data.pecas.map(peca => ({
                ...peca,
                valor_total: calcularValorTotal(peca.quantidade, peca.valor_peca),
            })),
            observacoes: data.observacoes || '',
            pagamento: 'Não Informado',
            data_encerramento: null,
        };
        console.log('Payload para criação da ordem de serviço:', payload);

        try {
            console.log('Enviando requisição para criar ordem de serviço...');
            await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-os/${token}`, payload);
            console.log('Ordem de serviço criada com sucesso');

            idDeCliente = null;
            idDeFuncionario = null;

            sessionStorage.removeItem('selectedFuncionarioId');
            sessionStorage.removeItem('selectedClienteId');

            setOpenSnackbar(true);
            navigate('/home', { state: { success: true } });
        } catch (error) {
            console.error('Erro ao criar ordem de serviço', error);
        }
    };

    const handleNavigateHome = () => {
        idDeCliente = null;
        idDeFuncionario = null;
        sessionStorage.removeItem('selectedFuncionarioId');
        sessionStorage.removeItem('selectedClienteId');
        navigate("/criaros/tipo-da-os");
    };

    return (
        <ThemeProvider theme={lightTheme}>

            <div className={styles.container}>
                <div className={styles.selecaoTipoOs}>
                    <div className={styles.div}>
                        <div className={styles.overlapGroup}>
                            <div className={styles.barraPage} />
                            <div className={styles.textWrapper}>Dados da OS</div>
                            <p className={styles.p}>3. Preencha os dados para criação da OS</p>
                            <button className={styles.backButton} onClick={handleNavigateHome}>
                                <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                            </button>
                        </div>
                    </div>
                </div>

                <section className={styles.content}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormLabel component="legend" className={styles.formLabel} sx={{ fontSize: '2rem', margin: '0', color: '#fff' }}>Dados da Ordem de Serviço:</FormLabel>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="nome_os"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nome da Ordem de Serviço*"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                            error={Boolean(errors.nome_os)}
                                            helperText={errors.nome_os?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="equipamento"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Equipamento*"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                            error={Boolean(errors.equipamento)}
                                            helperText={errors.equipamento?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="marca"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Marca"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="numero_serie"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Número de Série"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="tecnico"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Técnico Responsável*"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                            error={Boolean(errors.tecnico)}
                                            helperText={errors.tecnico?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="servico"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            options={servicos}
                                            getOptionLabel={(option) => option.nome_servico || ''}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Selecionar um serviço"
                                                    margin="normal"
                                                    variant="filled"
                                                    fullWidth
                                                    error={Boolean(errors.servico)}
                                                    helperText={errors.servico?.message}
                                                />
                                            )}
                                            onChange={(e, value) => {
                                                if (value) {
                                                    setSelectedServico(value);
                                                    setIsServicoSelected(true);
                                                    setValue('nome_servico', value.nome_servico); // Nome correto do campo
                                                    setValue('valor_servico', value.valor_servico); // Nome correto do campo
                                                } else {
                                                    setSelectedServico(null);
                                                    setIsServicoSelected(false);
                                                    setValue('nome_servico', ''); // Nome correto do campo
                                                    setValue('valor_servico', ''); // Nome correto do campo
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box className={styles.serviceBox}>
                                    <Controller
                                        name="nome_servico" // Nome correto do campo
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Serviço*"
                                                margin="normal"
                                                variant="filled"
                                                fullWidth
                                                error={Boolean(errors.nome_servico)} // Nome correto do campo
                                                helperText={errors.nome_servico?.message}
                                                onChange={(e) => {
                                                    setValue('nome_servico', e.target.value); // Nome correto do campo
                                                    if (e.target.value) {
                                                        setSelectedServico(null);
                                                        setIsServicoSelected(false);
                                                    }
                                                }}
                                                className={field.value ? styles.textFieldAnimation : ''}
                                            />
                                        )}
                                    />
                                </Box>
                                {servicoOsError && <p className={styles.errorMessage}>{servicoOsError}</p>}
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel component="legend" className={styles.formLabel} sx={{ fontSize: '1.8rem', margin: '0', color: '#fff' }}>Peças Utilizadas:</FormLabel>
                                {fields.map((field, index) => (
                                    <Box key={field.id} className={styles.pieceBox}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} md={3}>
                                                <Controller
                                                    name={`pecas.${index}.nome_peca`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Peça"
                                                            margin="normal"
                                                            variant="filled"
                                                            fullWidth
                                                            error={Boolean(errors.pecas?.[index]?.nome_peca)}
                                                            helperText={errors.pecas?.[index]?.nome_peca?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={1}>
                                                <Controller
                                                    name={`pecas.${index}.quantidade`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Qtd."
                                                            margin="normal"
                                                            variant="filled"
                                                            fullWidth
                                                            type="number"
                                                            error={Boolean(errors.pecas?.[index]?.quantidade)}
                                                            helperText={errors.pecas?.[index]?.quantidade?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={1.5}>
                                                <Controller
                                                    name={`pecas.${index}.valor_peca`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Valor"
                                                            margin="normal"
                                                            variant="filled"
                                                            fullWidth
                                                            type="number"
                                                            error={Boolean(errors.pecas?.[index]?.valor_peca)}
                                                            helperText={errors.pecas?.[index]?.valor_peca?.message}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">R$</InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={1}>
                                                <IconButton
                                                    sx={{ paddingTop: '2rem', paddingRight: '6rem' }}
                                                    alt="remover peça"
                                                    aria-label="remover peça"
                                                    color="error"
                                                    onClick={() => remove(index)}
                                                >
                                                    <RemoveCircleIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleIcon />}
                                    onClick={() => append({ nome_peca: '', quantidade: '', valor_peca: '' })}
                                    className={styles.addPieceButton}
                                >
                                    Adicionar Peça
                                </Button>
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="diagnostico"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Diagnóstico"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            error={Boolean(errors.diagnostico)}
                                            helperText={errors.diagnostico?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="defeitos_relatados"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Defeitos Relatados"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            error={Boolean(errors.defeitos_relatados)}
                                            helperText={errors.defeitos_relatados?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ fontSize: '1.3rem', margin: '0', color: '#fff' }}>Possui Acessórios? (Carregadores, Cabos...)</FormLabel>
                                    <Controller
                                        name="acessorio"
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup  {...field}>
                                                <FormControlLabel sx={{ fontSize: '2rem', margin: '0', color: '#fff', '& .MuiTypography-root': { color: '#fff', }, }} value={true} control={<Radio sx={{ color: 'white' }} />} label="Sim" />
                                                <FormControlLabel sx={{ fontSize: '2rem', margin: '0', color: '#fff', '& .MuiTypography-root': { color: '#fff', }, }} value={false} control={<Radio sx={{ color: 'white' }} />} label="Não" />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.acessorio && <p className={styles.errorMessage}>{errors.acessorio.message}</p>}
                                </FormControl>
                            </Grid>


                            <Grid item xs={12}>
                                <Controller
                                    name="observacoes"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Observações"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                            multiline
                                            rows={4}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} className={styles.submitButtonContainer}>
                                <Button variant="contained" color="primary" type="submit" className={styles.submitButton}>
                                    Criar Ordem de Serviço
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </section>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                        Ordem de Serviço criada com sucesso!
                    </Alert>
                </Snackbar>
            </div>
        </ThemeProvider>
    );
};

export default CreateOrder;
