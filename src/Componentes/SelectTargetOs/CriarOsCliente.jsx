import React, { useState } from "react";
import styles from './CriarOsCliente.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

export const SelectTypeOS = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (search) {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado.');
                return;
            }

            let response;

            try {
                if (search.length === 11) {
                    // CPF: 11 dígitos
                    response = await axios.post(
                        `https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/buscar-cpf/${token}`,
                        { cpf: search }
                    );
                } else if (search.length === 14) {
                    // CNPJ: 14 dígitos
                    response = await axios.post(
                        `https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/buscar-cnpj/${token}`,
                        { cnpj: search }
                    );
                } else {
                    setDialogContent("CPF ou CNPJ inválido. Verifique o número e tente novamente.");
                    setDialogOpen(true);
                    return;
                }

                if (response.data.length > 0) {
                    setClients(response.data);
                    if (search.length === 11) {
                        setDialogContent(`Cliente Selecionado: Nome - ${response.data[0].nome_cliente} / CPF - ${response.data[0].cpf_cliente}`);
                    } else {
                        setDialogContent(`Cliente Selecionado: Nome - ${response.data[0].nome_cliente} / CNPJ - ${response.data[0].cnpj_cliente}`);
                    }
                } else {
                    setClients([]);
                    setDialogContent("Cliente não encontrado.");
                }
                setDialogOpen(true);
            } catch (error) {
                console.error('Erro ao buscar cliente:', error);
                setDialogContent("Erro ao buscar cliente. Tente novamente.");
                setDialogOpen(true);
            }
        }
    };

    const handleClientSelect = (event, selectedClient) => {
        setSelectedClient(selectedClient || null);
        setSearch(selectedClient ? selectedClient.cpfCnpj : "");
    };

    const handleAddClient = () => {
        navigate("/criaros/adicionar-cliente");
    };

    const handleNavigateHome = () => {
        navigate("/criaros/tipo-da-os");
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        if (clients.length > 0) {
            sessionStorage.setItem('selectedClientId', clients[0]._id);
            navigate("/criar-os/finalizar");
        }
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
                        <label className="texto" htmlFor="selectClient">Pesquisar Cliente por CPF/CNPJ</label>
                        <div className={styles.searchWrapper}>
                            <TextField
                                id="searchClient"
                                placeholder="Digite CPF ou CNPJ"
                                className={styles.searchInput}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ width: 300 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                sx={{ marginLeft: 1 }}
                            >
                                Buscar
                            </Button>
                        </div>
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            {selectedClient ? `${selectedClient.nome_cliente} - ${selectedClient.cpfCnpj}` : "Nenhum cliente selecionado"}
                        </Typography>
                        <div className={styles.addButtonWrapper}>
                            <Typography variant="body1">Adicionar Novo Cliente</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddClient}
                                sx={{ marginTop: 1 }}
                            >
                                Adicionar
                            </Button>
                        </div>
                    </section>
                </div>
                <div className={styles.designPage} />
            </div>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Aviso</DialogTitle>
                <DialogContent>
                    <Typography>{dialogContent}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SelectTypeOS;
