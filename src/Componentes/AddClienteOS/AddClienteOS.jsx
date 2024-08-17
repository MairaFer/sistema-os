import React, { useState } from "react";
import styles from './AddClienteOS.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Importa o ícone de seta

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

export const SelectTypeOS = () => {
    const [newClient, setNewClient] = useState({
        nome_cliente: '',
        contato_cliente: '',
        endereco_cliente: '',
        cpfCnpj: '',
        email_cliente: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
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

            // Supondo que a resposta da API contenha o ID do cliente
            const clientId = response.data;

            if (clientId) {
                sessionStorage.setItem('selectedClientId', clientId);
                console.log(clientId)
                navigate("/criar-os/finalizar");
            } else {
                console.error('ID do cliente criado não encontrado.');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                // Verifica se a resposta contém uma mensagem de CPF já existente
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

    const handleNavigateHome = () => {
        navigate("/criaros/tipo-da-os");
    };

    return (
        <div className={styles.selecaoTipoOs}>
            <div className={styles.div}>
                <div className={styles.overlapGroup}>
                    <div className={styles.barraPage} />
                    <div className={styles.textWrapper}>Criando OS</div>
                    <p className={styles.p}>2. Adicione um Cliente a OS</p>
                    <button className={styles.backButton} onClick={handleNavigateHome}>
                        <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                    </button>
                    <section className={styles.clientFormContainer}>
                        <label className={styles.paragraph}>Criar novo cliente:</label>
                        <div className={styles.newClientWrapperAndButton}>
                            <div className={styles.newClientWrapper}>
                                <input
                                    type="text"
                                    name="nome_cliente"
                                    placeholder="Nome do cliente*"
                                    value={newClient.nome_cliente}
                                    onChange={handleNewClientChange}
                                    className={styles.inputField}
                                />
                                {errors.nome_cliente && <p className={styles.error}>{errors.nome_cliente}</p>}

                                <input
                                    type="text"
                                    name="contato_cliente"
                                    placeholder="Contato*"
                                    value={newClient.contato_cliente}
                                    onChange={handleNewClientChange}
                                    className={styles.inputField}
                                />
                                {errors.contato_cliente && <p className={styles.error}>{errors.contato_cliente}</p>}

                                <input
                                    type="text"
                                    name="endereco_cliente"
                                    placeholder="Endereço"
                                    value={newClient.endereco_cliente}
                                    onChange={handleNewClientChange}
                                    className={styles.inputField}
                                />

                                <input
                                    type="text"
                                    name="cpfCnpj"
                                    placeholder="CPF ou CNPJ*"
                                    value={newClient.cpfCnpj}
                                    onChange={handleNewClientChange}
                                    className={styles.inputField}
                                />
                                {errors.cpfCnpj && <p className={styles.error}>{errors.cpfCnpj}</p>}

                                <input
                                    type="email"
                                    name="email_cliente"
                                    placeholder="Email*"
                                    value={newClient.email_cliente}
                                    onChange={handleNewClientChange}
                                    className={styles.inputField}
                                />
                                {errors.email_cliente && <p className={styles.error}>{errors.email_cliente}</p>}
                            </div>
                            <button className={styles.submitButton} onClick={handleSubmit}>
                                <ArrowForwardIcon style={{ fontSize: 90, padding: 10, color: '#fff'}}  /> 
                            </button>
                        </div>
                        {submitError && <p className={styles.error}>{submitError}</p>}
                    </section>
                </div>
                <div className={styles.designPage} />
            </div>
        </div>
    );
};

export default SelectTypeOS;
