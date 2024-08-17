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

// Defina o schema de validação
const schema = yup.object().shape({
    nome_os: yup.string().required('Registre o Nome da OS.'),
    equipamento: yup.string().required('Equipamento é obrigatório'),
    marca: yup.string(),
    numero_serie: yup.string(),
    pagamento: yup.string().required('Defina a forma de pagamento.'),
    tecnico: yup.string().required('Defina o técnico responsável.'),
    nome_servico: yup.string().required('Defina o serviço.'),
    valor_servico: yup.number().positive('Valor do Serviço deve ser positivo').required('Defina o valor do serviço'),
    pecas: yup.array().of(
        yup.object().shape({
            nome_peca: yup.string().required('Nome da Peça é obrigatório'),
            quantidade: yup.number().positive('Quantidade deve ser positiva').required('Quantidade é obrigatória'),
            valor_peca: yup.number().positive('Valor Unitário deve ser positivo').required('Valor Unitário é obrigatório'),
        })
    ),
    observacoes: yup.string(),
    data_encerramento: yup.date().required('Data de encerramento é obrigatória'),
    diagnostico: yup.string(),
    defeitos_relatados: yup.string(),
    acessorio: yup.boolean()
});

const CreateOrder = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            pecas: [{ nome_peca: '', quantidade: '', valor_peca: '' }],
            valor_servico: '',
            acessorio: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pecas',
    });

    const [servicos, setServicos] = useState([]);
    const [selectedServico, setSelectedServico] = useState(null);
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

    const criarServico = async (nomeServico, valorServico) => {
        const token = sessionStorage.getItem('token');
        if (!selectedServico) {
            try {
                const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-servico/${token}`, {
                    nome_servico: nomeServico,
                    valor_servico: valorServico,
                });
                return response.data;
            } catch (error) {
                console.error('Erro ao criar serviço', error);
                return null;
            }
        }
    };

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

        const idDeCliente = sessionStorage.getItem('selectedClientId');
        const idDeFuncionario = sessionStorage.getItem('selectedFuncionarioId');

        let servicoId = selectedServico?._id;

        // Se não houver serviço selecionado e o nome do serviço estiver presente, crie um novo serviço
        if (!servicoId && data.nome_servico) {
            const novoServico = await criarServico(data.nome_servico, data.valor_servico);
            if (novoServico && novoServico._id) {
                servicoId = novoServico._id;
                // Atualiza o estado com o novo serviço, se necessário
                setServicos(prev => [...prev, novoServico]);
                setSelectedServico(novoServico);
            } else {
                setServicoOsError('Não foi possível criar o serviço.');
            }
        } else if (!servicoId) {
            setServicoOsError('O Serviço é obrigatório');
        } else {
            setServicoOsError('');
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
            servico_os: servicoId || null,
            pecas_os: data.pecas.map(peca => ({
                ...peca,
                valor_total: calcularValorTotal(peca.quantidade, peca.valor_peca),
            })),
            observacoes: data.observacoes || '',
            pagamento: data.pagamento,
            data_encerramento: data.data_encerramento,
        };

        console.log('Payload para criação da ordem de serviço:', payload);

        try {
            // Enviar a requisição para criar a ordem de serviço
            await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-os/${token}`, payload);
            console.log('Ordem de serviço criada com sucesso');
            setOpenSnackbar(true); // Mostrar o Snackbar
            navigate('/home', { state: { success: true } }); // Redirecionar para a página inicial após a criação
        } catch (error) {
            console.error('Erro ao criar ordem de serviço', error);
        }
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
                            <button className={styles.backButton} onClick={() => navigate("/criaros/tipo-da-os")}>
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
                                <FormControl fullWidth margin="normal" variant="filled">
                                    <InputLabel id="pagamento-label">Forma de Pagamento*</InputLabel>
                                    <Controller
                                        name="pagamento"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="pagamento-label"
                                                error={Boolean(errors.pagamento)}
                                            >
                                                <MenuItem value="cartao_de_credito">Cartão de Crédito</MenuItem>
                                                <MenuItem value="cartão_de_debito">Cartão de Débito</MenuItem>
                                                <MenuItem value="boleto">Boleto</MenuItem>
                                                <MenuItem value="pix">Pix</MenuItem>
                                                <MenuItem value="transferencia_bancaria">TED</MenuItem>
                                                <MenuItem value="dinheiro">Dinheiro</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    {errors.pagamento && <p className={styles.errorMessage}>{errors.pagamento.message}</p>}
                                </FormControl>
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
                                                    setValue('nome_servico', value.nome_servico); // Atualiza o nome do serviço
                                                    setValue('valor_servico', value.valor_servico); // Atualiza o valor do serviço
                                                } else {
                                                    setSelectedServico(null);
                                                    setValue('nome_servico', ''); // Limpa o campo
                                                    setValue('valor_servico', ''); // Limpa o campo
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box className={styles.serviceBox}>
                                    <Controller
                                        name="nome_servico"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Serviço*"
                                                margin="normal"
                                                variant="filled"
                                                fullWidth
                                                error={Boolean(errors.nome_servico)}
                                                helperText={errors.nome_servico?.message}
                                                onChange={(e) => {
                                                    setValue('nome_servico', e.target.value);
                                                    if (e.target.value) {
                                                        // Limpa a seleção do Autocomplete se o campo for preenchido manualmente
                                                        setSelectedServico(null);
                                                    }
                                                }}
                                                className={field.value ? styles.textFieldAnimation : ''}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="valor_servico"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Valor do Serviço*"
                                                margin="normal"
                                                variant="filled"
                                                fullWidth
                                                type="number"
                                                error={Boolean(errors.valor_servico)}
                                                helperText={errors.valor_servico?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">R$</InputAdornment>
                                                    )
                                                }}
                                                onChange={(e) => {
                                                    setValue('valor_servico', e.target.value);
                                                    if (e.target.value) {
                                                        // Limpa a seleção do Autocomplete se o campo for preenchido manualmente
                                                        setSelectedServico(null);
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
                                <Controller
                                    name="data_encerramento"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Prazo da OS*"
                                            margin="normal"
                                            variant="filled"
                                            fullWidth
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            error={Boolean(errors.data_encerramento)}
                                            helperText={errors.data_encerramento?.message}
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
                                                <FormControlLabel sx={{ fontSize: '2rem', margin: '0', color: '#fff' }} value={true} control={<Radio />} label="Sim" />
                                                <FormControlLabel sx={{ fontSize: '2rem', margin: '0', color: '#fff' }} value={false} control={<Radio />} label="Não" />
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
