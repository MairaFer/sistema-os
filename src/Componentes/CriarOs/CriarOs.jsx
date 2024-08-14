import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TextField, Button, IconButton, MenuItem, Select, InputLabel, FormControl, Autocomplete, InputAdornment, Snackbar, Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import styles from './CriarOs.module.css';

// Define o esquema de validação sem referências cíclicas
const schema = yup.object().shape({
  nome_os: yup.string().required('Nome da Ordem de Serviço é obrigatório'),
  equipamento: yup.string().required('Equipamento é obrigatório'),
  marca: yup.string(),
  numero_serie: yup.string(),
  pagamento: yup.string().required('Forma de Pagamento é obrigatória'),
  tecnico: yup.string().required('Técnico é obrigatório'),
  nome_servico: yup.string().required('Nome do Serviço é obrigatório'),
  valor_servico: yup.number().positive('Valor do Serviço deve ser positivo').required('Valor do Serviço é obrigatório'),
  pecas: yup.array().of(
    yup.object().shape({
      nome_peca: yup.string().required('Nome da Peça é obrigatório'),
      quantidade: yup.number().positive('Quantidade deve ser positiva').required('Quantidade é obrigatória'),
      valor_peca: yup.number().positive('Valor Unitário deve ser positivo').required('Valor Unitário é obrigatório'),
    })
  ).required('Pelo menos uma peça é obrigatória'),
  observacoes: yup.string(),
  data_encerramento: yup.date().required('Data de encerramento é obrigatória'),
});


const CreateOrder = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            pecas: [{ nome_peca: '', quantidade: '', valor_peca: '' }],
            valor_servico: ''
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pecas',
    });

    const [servicos, setServicos] = useState([]);
    const [selectedServico, setSelectedServico] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
        try {
            const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-servico/${token}`, {
                nome_servico: nomeServico,
                valor_servico: valorServico,
            });
            return response.data; // Retorna o serviço criado
        } catch (error) {
            console.error('Erro ao criar serviço', error);
            return null;
        }
    };

    const calcularValorTotal = (quantidade, valor_peca) => {
        return quantidade * valor_peca;
    };

    const onSubmit = async (data) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado.');
            return;
        }

        const idDeCliente = sessionStorage.getItem('selectedClientId');
        const idDeFuncionario = sessionStorage.getItem('selectedFuncionarioId');

        let servicoId = selectedServico?._id;

        if (!servicoId && data.nome_servico) {
            const novoServico = await criarServico(data.nome_servico, data.valor_servico);
            if (novoServico && novoServico._id) {
                servicoId = novoServico._id;
            }
        }

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

        console.log(payload);

        try {
            await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-os/${token}`, payload);
            console.log('Ordem de serviço criada com sucesso');
            setOpenSnackbar(true); // Mostra o Snackbar
            navigate('/home'); // Redirecionar para a página inicial após a criação
        } catch (error) {
            console.error('Erro ao criar ordem de serviço', error);
        }
    };

    return (
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
                    <Controller
                        name="nome_os"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nome da Ordem de Serviço*"
                                margin="normal"
                                className={styles.textField}
                                error={Boolean(errors.nome_os)}
                                helperText={errors.nome_os?.message}
                            />
                        )}
                    />

                    <Controller
                        name="equipamento"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Equipamento*"
                                margin="normal"
                                className={styles.textField}
                                error={Boolean(errors.equipamento)}
                                helperText={errors.equipamento?.message}
                            />
                        )}
                    />

                    <Controller
                        name="marca"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Marca"
                                margin="normal"
                                className={styles.textField}
                            />
                        )}
                    />

                    <Controller
                        name="numero_serie"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Número de Série"
                                margin="normal"
                                className={styles.textField}
                            />
                        )}
                    />

                    <FormControl fullWidth margin="normal" className={styles.formControl}>
                        <InputLabel id="pagamento-label">Forma de Pagamento*</InputLabel>
                        <Controller
                            name="pagamento"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="pagamento-label"
                                    label="Forma de Pagamento*"
                                    error={Boolean(errors.pagamento)}
                                >
                                    <MenuItem value="cartao_credito">Cartão de Crédito</MenuItem>
                                    <MenuItem value="debito">Débito</MenuItem>
                                    <MenuItem value="pix">Pix</MenuItem>
                                    <MenuItem value="boleto">Boleto</MenuItem>
                                    <MenuItem value="dinheiro">Dinheiro</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>

                    <Controller
                        name="tecnico"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Técnico*"
                                margin="normal"
                                className={styles.textField}
                                error={Boolean(errors.tecnico)}
                                helperText={errors.tecnico?.message}
                            />
                        )}
                    />

                    <Autocomplete
                        options={servicos}
                        getOptionLabel={(option) => option.nome_servico || ''}
                        onChange={(event, newValue) => {
                            setSelectedServico(newValue);
                            setValue('nome_servico', newValue?.nome_servico || '');
                            setValue('valor_servico', newValue?.valor_servico || '');
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Nome do Serviço*"
                                margin="normal"
                                className={styles.textField}
                                error={Boolean(errors.nome_servico)}
                                helperText={errors.nome_servico?.message}
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
                                type="number"
                                margin="normal"
                                className={styles.textField}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                }}
                                error={Boolean(errors.valor_servico)}
                                helperText={errors.valor_servico?.message}
                            />
                        )}
                    />

                    <h3>Peças</h3>

                    {fields.map((item, index) => (
                        <div key={item.id} className={styles.pecasContainer}>
                            <Controller
                                name={`pecas.${index}.nome_peca`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nome da Peça*"
                                        margin="normal"
                                        className={styles.textField}
                                        error={Boolean(errors.pecas?.[index]?.nome_peca)}
                                        helperText={errors.pecas?.[index]?.nome_peca?.message}
                                    />
                                )}
                            />
                            <Controller
                                name={`pecas.${index}.quantidade`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Quantidade*"
                                        type="number"
                                        margin="normal"
                                        className={styles.textField}
                                        error={Boolean(errors.pecas?.[index]?.quantidade)}
                                        helperText={errors.pecas?.[index]?.quantidade?.message}
                                    />
                                )}
                            />
                            <Controller
                                name={`pecas.${index}.valor_peca`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Valor Unitário*"
                                        type="number"
                                        margin="normal"
                                        className={styles.textField}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        }}
                                        error={Boolean(errors.pecas?.[index]?.valor_peca)}
                                        helperText={errors.pecas?.[index]?.valor_peca?.message}
                                    />
                                )}
                            />
                            <IconButton onClick={() => remove(index)} className={styles.removeButton}>
                                <RemoveCircleIcon />
                            </IconButton>
                        </div>
                    ))}
                    <Button variant="contained" onClick={() => append({ nome_peca: '', quantidade: '', valor_peca: '' })} className={styles.addButton}>
                        <AddCircleIcon /> Adicionar Peça
                    </Button>

                    <Controller
                        name="observacoes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Observações"
                                margin="normal"
                                multiline
                                rows={4}
                                className={styles.textField}
                            />
                        )}
                    />

                    <Controller
                        name="data_encerramento"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Data de Encerramento*"
                                type="date"
                                margin="normal"
                                className={styles.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={Boolean(errors.data_encerramento)}
                                helperText={errors.data_encerramento?.message}
                            />
                        )}
                    />

                    <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
                        Criar Ordem de Serviço
                    </Button>
                </form>
            </section>

            {/* Snackbar para mensagens de sucesso */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    Ordem de Serviço criada com sucesso!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CreateOrder;
