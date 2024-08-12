import React, { useState, useEffect } from "react";
import styles from './CriarOsCliente.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const SelectTypeOS = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [newClient, setNewClient] = useState({
        nome_cliente: '',
        contato_cliente: '',
        endereco_cliente: '',
        cpf_cliente: '',
        email_cliente: ''
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado.');
                return;
            }

            try {
                const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`);
                setClients(response.data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        fetchClients();
    }, []);

    const handleSearch = (event, value) => {
        setSearch(value);
    };

    const handleClientSelect = (event, selectedClient) => {
        setSelectedClient(selectedClient || null);
        setSearch(selectedClient ? selectedClient.nome_cliente : "");
    };

    const handleNewClientChange = (event) => {
        const { name, value } = event.target;

        if (name === 'contato_cliente') {
            const formattedValue = formatContact(value);
            setNewClient(prevState => ({
                ...prevState,
                [name]: formattedValue
            }));
        } else {
            setNewClient(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const formatContact = (value) => {
        const cleaned = value.replace(/\D+/g, '');
        return cleaned.length > 11 ? cleaned.slice(0, 11) : cleaned;
    };

    const validateForm = () => {
        const newErrors = {};
        const { nome_cliente, contato_cliente, endereco_cliente, cpf_cliente, email_cliente } = newClient;

        if (!nome_cliente) newErrors.nome_cliente = "Nome do cliente é obrigatório.";

        const cleanedContact = contato_cliente.replace(/\D+/g, '');
        if (cleanedContact.length !== 11) {
            newErrors.contato_cliente = "Contato deve ter exatamente 11 dígitos.";
        }

        const cpfPattern = /^\d{11}$/;
        if (!cpf_cliente.match(cpfPattern)) {
            newErrors.cpf_cliente = "CPF deve ter 11 dígitos.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email_cliente.match(emailPattern)) {
            newErrors.email_cliente = "Email inválido.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado.');
            return;
        }
    
        if (selectedClient) {
            // Armazenar o ID do cliente no sessionStorage
            sessionStorage.setItem('selectedClientId', selectedClient.id);
            console.log('Cliente criado:', selectedClient);
            // Navegar para a página de finalização
            navigate("/criar-os/finalizar");
            return;
        }
    
        if (!validateForm()) return;
    
        try {
            // Remover caracteres não numéricos do contato
            const cleanContact = newClient.contato_cliente.replace(/\D+/g, '');
    
            // Enviar dados para criar um novo cliente
            const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-cliente/${token}`, {
                ...newClient,
                contato_cliente: cleanContact
            });
    
            // Recuperar o cliente criado e armazenar seu ID no sessionStorage
            const createdClient = response.data;
            sessionStorage.setItem('selectedClientId', createdClient.id);
    
            // Navegar para a página de finalização
            navigate("/criar-os/finalizar");
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
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
                        <label className="texto" htmlFor="selectClient">Selecionar Cliente Existente</label>
                        <Autocomplete
                            id="selectClient"
                            options={clients}
                            getOptionLabel={(option) => `${option.nome_cliente} - ${option.email_cliente}`}
                            value={selectedClient}
                            onChange={handleClientSelect}
                            inputValue={search}
                            onInputChange={handleSearch}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Pesquisar cliente"
                                    className={styles.searchInput}
                                />
                            )}
                            sx={{ width: 300 }}
                        />
                        <label className="texto">Ou Criar novo cliente</label>
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
                                    placeholder="Contato"
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
                                    name="cpf_cliente"
                                    placeholder="CPF*"
                                    value={newClient.cpf_cliente}
                                    onChange={handleNewClientChange}
                                    className={styles.inputField}
                                />
                                {errors.cpf_cliente && <p className={styles.error}>{errors.cpf_cliente}</p>}
                                
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
                                <img className={styles.submitIcon} src="/public/confirm.png" alt="avançar" />
                            </button>
                        </div>
                    </section>
                </div>
                <div className={styles.designPage} />
            </div>
        </div>
    );
};

export default SelectTypeOS;
