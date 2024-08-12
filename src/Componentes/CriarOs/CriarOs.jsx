import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TextField, Button, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './CriarOs.module.css';

// Definindo o esquema de validação com Yup
const schema = yup.object().shape({
    nome_os: yup.string().required('Nome da Ordem de Serviço é obrigatório'),
    equipamento: yup.string().required('Equipamento é obrigatório'),
    marca: yup.string().required('Marca é obrigatória'),
    numero_serie: yup.string().required('Número de Série é obrigatório'),
    pagamento: yup.string().required('Forma de Pagamento é obrigatória'),
    tecnico: yup.string().required('Técnico é obrigatório'),
    nome_servico: yup.string().required('Nome do Serviço é obrigatório'),
    valor_servico: yup.number().positive('Valor do Serviço deve ser positivo').required('Valor do Serviço é obrigatório'),
    pecas: yup.array().of(
        yup.object().shape({
            nome: yup.string().required('Nome da Peça é obrigatório'),
            quantidade: yup.number().positive('Quantidade deve ser positiva').required('Quantidade é obrigatória'),
            valor_unitario: yup.number().positive('Valor Unitário deve ser positivo').required('Valor Unitário é obrigatório'),
        })
    ).required('Peças são obrigatórias').min(1, 'Pelo menos uma peça é obrigatória'),
    observacoes: yup.string(),
});

const CreateOrder = () => {
    const { control, handleSubmit, register, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            pecas: [{ nome: '', quantidade: '', valor_unitario: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pecas',
    });

    const calcularValorTotal = (quantidade, valor_unitario) => {
        return quantidade * valor_unitario;
    };

    const onSubmit = (data) => {
        console.log(data);
        // Lógica para enviar os dados para a API
    };

    const handleNavigateHome = () => {
        // Lógica para navegação
    };

    return (
        <div className={styles.container}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Dados da OS</div>
                        <p className={styles.p}>3. Preencha os dados para criação da OS</p>
                        <button className={styles.backButton} onClick={handleNavigateHome} >
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>
                    </div>
                </div>
            </div>

            <section className={styles.formSection}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <TextField
                        fullWidth
                        label="Nome da Ordem de Serviço*"
                        {...register('nome_os')}
                        margin="normal"
                        className={styles.textField}
                    />
                    
                    <TextField
                        fullWidth
                        label="Equipamento*"
                        {...register('equipamento')}
                        margin="normal"
                        className={styles.textField}
                    />
                    
                    <TextField
                        fullWidth
                        label="Marca*"
                        {...register('marca')}
                        margin="normal"
                        className={styles.textField}
                    />

                    <TextField
                        fullWidth
                        label="Número de Série*"
                        {...register('numero_serie')}
                        margin="normal"
                        className={styles.textField}
                    />

                    <FormControl fullWidth margin="normal" className={styles.selectField}>
                        <InputLabel>Forma de Pagamento*</InputLabel>
                        <Controller
                            name="pagamento"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Forma de Pagamento*"
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

                    <TextField
                        fullWidth
                        label="Técnico*"
                        {...register('tecnico')}
                        margin="normal"
                        className={styles.textField}
                    />

                    <TextField
                        fullWidth
                        label="Nome do Serviço*"
                        {...register('nome_servico')}
                        margin="normal"
                        className={styles.textField}
                    />

                    <TextField
                        fullWidth
                        label="Valor do Serviço*"
                        type="number"
                        {...register('valor_servico')}
                        margin="normal"
                        className={styles.textField}
                    />

                    {fields.map((item, index) => (
                        <div key={item.id} className={styles.pecaContainer}>
                            <Controller
                                name={`pecas.${index}.nome`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Nome da Peça*"
                                        {...field}
                                        margin="normal"
                                        className={styles.textField}
                                    />
                                )}
                            />

                            <Controller
                                name={`pecas.${index}.quantidade`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Quantidade*"
                                        type="number"
                                        {...field}
                                        margin="normal"
                                        className={styles.textField}
                                    />
                                )}
                            />

                            <Controller
                                name={`pecas.${index}.valor_unitario`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Valor Unitário*"
                                        type="number"
                                        {...field}
                                        margin="normal"
                                        className={styles.textField}
                                    />
                                )}
                            />

                            <TextField
                                fullWidth
                                label="Valor Total"
                                type="number"
                                value={calcularValorTotal(getValues(`pecas.${index}.quantidade`), getValues(`pecas.${index}.valor_unitario`))}
                                margin="normal"
                                className={styles.textField}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <IconButton
                                onClick={() => remove(index)}
                                color="error"
                                aria-label="remover peça"
                            >
                                <RemoveCircleIcon />
                            </IconButton>
                        </div>
                    ))}

                    <IconButton
                        onClick={() => append({ nome: '', quantidade: '', valor_unitario: '' })}
                        color="primary"
                        aria-label="adicionar peça"
                    >
                        <AddCircleIcon />
                    </IconButton>

                    <TextField
                        fullWidth
                        label="Observações"
                        {...register('observacoes')}
                        margin="normal"
                        multiline
                        rows={4}
                        className={styles.textField}
                    />

                    <Button type="submit" variant="contained" color="primary">
                        Enviar
                    </Button>
                </form>
            </section>
        </div>
    );
};

export default CreateOrder;
