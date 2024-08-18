import React, { useState, useEffect } from "react";
import styles from './CriarOsFuncionario.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const SelectTypeOS = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        nome_funcionario: '',
        contato_funcionario: '',
        setor_funcionario: ''
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado.');
                return;
            }

            try {
                const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`);
                setEmployees(response.data);
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleSearch = (event, value) => {
        setSearch(value);
    };

    const handleEmployeeSelect = (event, selectedEmployee) => {
        setSelectedEmployee(selectedEmployee || null);
        setSearch(selectedEmployee ? selectedEmployee.nome_funcionario : "");
    };

    const handleNewEmployeeChange = (event) => {
        const { name, value } = event.target;

        if (name === 'contato_funcionario') {
            const formattedValue = formatContact(value);
            setNewEmployee(prevState => ({
                ...prevState,
                [name]: formattedValue
            }));
        } else {
            setNewEmployee(prevState => ({
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
        const { nome_funcionario, contato_funcionario, setor_funcionario } = newEmployee;

        if (!nome_funcionario) newErrors.nome_funcionario = "Nome do funcionário é obrigatório.";
        if (!setor_funcionario) newErrors.setor_funcionario = "Setor é obrigatório.";

        const cleanedContact = contato_funcionario.replace(/\D+/g, '');
        if (cleanedContact.length !== 11) {
            newErrors.contato_funcionario = "Contato deve ter exatamente 11 dígitos.";
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

        if (selectedEmployee) {
            sessionStorage.setItem('selectedEmployeeId', selectedEmployee.id);
            navigate("/criar-os/finalizar");
            return;
        }

        if (!validateForm()) return;

        try {
            const cleanContact = newEmployee.contato_funcionario.replace(/\D+/g, '');

            const response = await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/criar-funcionario/${token}`, {
                ...newEmployee,
                contato_funcionario: cleanContact
            });
            const createdEmployee = response.data;
            sessionStorage.setItem('selectedEmployeeId', createdEmployee.id);

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
                    <p className={styles.p}>2. Adicione um Funcionário à OS</p>
                    <button className={styles.backButton} onClick={handleNavigateHome}>
                        <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                    </button>
                    <section className={styles.funcionarioFormContainer}>
                        <label className="texto" htmlFor="selectFuncionario">Selecionar Funcionário Existente</label>
                        <Autocomplete
                            id="selectFuncionario"
                            options={employees}
                            getOptionLabel={(option) => `${option.nome_funcionario} - ${option.setor_funcionario}`}
                            value={selectedEmployee}
                            onChange={handleEmployeeSelect}
                            inputValue={search}
                            onInputChange={handleSearch}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Pesquisar funcionário"
                                    className={styles.searchInput}
                                />
                            )}
                            sx={{ width: 300 }}
                        />
                        <label className="texto">Ou Criar novo funcionário</label>
                        <div className={styles.newFuncionarioWrapperAndButton}>
                            <div className={styles.newFuncionarioWrapper}>
                                <input
                                    type="text"
                                    name="nome_funcionario"
                                    placeholder="Nome do funcionário*"
                                    value={newEmployee.nome_funcionario}
                                    onChange={handleNewEmployeeChange}
                                    className={styles.inputField}
                                />
                                {errors.nome_funcionario && <p className={styles.error}>{errors.nome_funcionario}</p>}
                                
                                <input
                                    type="text"
                                    name="contato_funcionario"
                                    placeholder="Contato"
                                    value={newEmployee.contato_funcionario}
                                    onChange={handleNewEmployeeChange}
                                    className={styles.inputField}
                                />
                                {errors.contato_funcionario && <p className={styles.error}>{errors.contato_funcionario}</p>}
                                
                                <input
                                    type="text"
                                    name="setor_funcionario"
                                    placeholder="Setor*"
                                    value={newEmployee.setor_funcionario}
                                    onChange={handleNewEmployeeChange}
                                    className={styles.inputField}
                                />
                                {errors.setor_funcionario && <p className={styles.error}>{errors.setor_funcionario}</p>}
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
