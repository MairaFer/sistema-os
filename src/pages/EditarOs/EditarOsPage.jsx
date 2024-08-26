import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Grid, TextField, Button, Box, IconButton, Snackbar, Alert, InputAdornment, FormLabel, MenuItem, Select } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios'; // Adicione a importação do axios se ainda não estiver lá
import styles from './EditarOs.module.css'; // Atualize o caminho para o seu CSS

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

const EditOrder = () => {
    const { id } = useParams(); // Captura o ID da URL
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            pecas: [{ nome_peca: '', quantidade: '', valor_peca: '' }],
            diagnostico: '',
            observacoes: '',
            status: '', // Adicione o status aqui
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pecas',
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/ordem-servico/${id}`);
                const data = response.data;
                // Preenche o formulário com os dados recebidos
                reset({
                    diagnostico: data.diagnostico,
                    pecas: data.pecas_os,
                    observacoes: data.observacoes,
                    status: data.status || '', // Adicione o status aqui
                });
            } catch (error) {
                console.error('Erro ao carregar dados da ordem de serviço:', error);
            }
        };

        fetchOrderData();
    }, [id, reset]);

    const calcularValorTotal = (quantidade, valor_peca) => {
        return quantidade * valor_peca;
    };

    const onSubmit = async (data) => {
        console.log('Formulário enviado com os dados:', data);

        // Preparar o payload para atualizar a ordem de serviço
        const payload = {
            diagnostico: data.diagnostico,
            pecas_os: data.pecas.map(peca => ({
                ...peca,
                valor_total: calcularValorTotal(peca.quantidade, peca.valor_peca),
            })),
            observacoes: data.observacoes || '',
            status: data.status || '', // Adicione o status aqui
        };
        console.log('Payload para atualização da ordem de serviço:', payload);

        try {
            console.log('Enviando requisição para atualizar a ordem de serviço...');
            await axios.put(`https://cyberos-sistemadeordemdeservico-api.onrender.com/ordem-servico/${id}`, payload);
            console.log('Ordem de serviço atualizada com sucesso');

            setOpenSnackbar(true);
            navigate('/home', { state: { success: true } });
        } catch (error) {
            console.error('Erro ao atualizar ordem de serviço', error);
        }
    };

    const handleCancel = () => {
        navigate('/gerenciaros'); // Navega para a página inicial ou para a página desejada
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.container}>
                <div className={styles.selecaoTipoOs}>
                    <div className={styles.div}>
                        <div className={styles.overlapGroup}>
                            <div className={styles.barraPage} />
                            <div className={styles.textWrapper}>Dados da OS</div>
                            <p className={styles.p}>Preencha os dados para atualização da OS</p>
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
                                    sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                                    onClick={() => append({ nome_peca: '', quantidade: '', valor_peca: '' })}
                                >
                                    Adicionar Peça
                                </Button>
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
                                            error={Boolean(errors.observacoes)}
                                            helperText={errors.observacoes?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            variant="filled"
                                            fullWidth
                                            label="Status"
                                            error={Boolean(errors.status)}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Selecione o Status</MenuItem>
                                            <MenuItem value="pendente">Pendente</MenuItem>
                                            <MenuItem value="concluido">Concluído</MenuItem>
                                            <MenuItem value="cancelado">Cancelado</MenuItem>
                                        </Select>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                            >
                                Atualizar OS
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </form>

                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={() => setOpenSnackbar(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={() => setOpenSnackbar(false)}
                            severity="success"
                            sx={{ width: '100%' }}
                        >
                            Ordem de serviço atualizada com sucesso!
                        </Alert>
                    </Snackbar>
                </section>
            </div>
        </ThemeProvider>
    );
};

export default EditOrder;
