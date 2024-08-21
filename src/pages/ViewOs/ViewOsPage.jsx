import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from './ViewOs.module.css';
import html2pdf from 'html2pdf.js';

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

export const ViewOsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customPdf, setCustomPdf] = useState(null);

    const handleDownload = async (type) => {
        try {
            let url = '';
            if (type === "empresa") {
                url = `https://cyberos-sistemadeordemdeservico-api.onrender.com/ordem-servico/${id}/download/empresa`;
            } else if (type === "beneficiario") {
                url = `https://cyberos-sistemadeordemdeservico-api.onrender.com/ordem-servico/${id}/download/beneficiario`;
            }

            const response = await axios.get(url, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `OS_${id}_${type}.pdf`;
            link.click();
        } catch (error) {
            console.error('Erro ao baixar o PDF:', error);
        }
    };

    const generateCustomPdf = async () => {
        try {
            const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/ordem-servico/${id}`);
            const orderDetails = response.data;

            // Modificar o HTML com os dados da API
            const htmlTemplate = document.querySelector('#os-template').innerHTML;
            const modifiedHtml = modifyHtmlContent(htmlTemplate, orderDetails);

            // Gerar o PDF usando html2pdf
            const element = document.createElement('div');
            element.innerHTML = modifiedHtml;
            document.body.appendChild(element);

            const opt = {
                margin:       0,
                filename:     `OS_${id}_custom.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().from(element).set(opt).save();
            document.body.removeChild(element);
        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
        }
    };

    const handleNavigateHome = () => {
        navigate("/gerenciaros");
    };

    useEffect(() => {
        generateCustomPdf();

        return () => {
            setCustomPdf(null);
        };
    }, [id]);

    return (
        <ThemeProvider theme={lightTheme}>
            <div className={styles.selecaoTipoOs}>
                <div className={styles.div}>
                    <div className={styles.overlapGroup}>
                        <div className={styles.barraPage} />
                        <div className={styles.textWrapper}>Visualizar OS</div>
                        <button className={styles.backButton} onClick={handleNavigateHome}>
                            <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                        </button>
                        <section className={styles.pdfPreviewSection}>
                            <Typography sx={{ fontSize: '1.5rem', color: '#ffff', marginLeft: '1rem' }} variant="h6" gutterBottom>
                                Selecione a via para download:
                            </Typography>
                            <div className={styles.pdfPreviewContainer}>
                                <div className={styles.downloadButtonsContainer}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDownload("empresa")}
                                        className={styles.downloadButton}
                                        startIcon={<DownloadIcon />}
                                    >
                                        Baixar Via da Empresa
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDownload("beneficiario")}
                                        className={styles.downloadButton}
                                        startIcon={<DownloadIcon />}
                                    >
                                        Baixar Via do Beneficiário
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className={styles.designPage} />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default ViewOsPage;

const modifyHtmlContent = (htmlTemplate, orderDetails) => {
    return htmlTemplate
        .replace('{{orderId}}', orderDetails.id)
        .replace('{{clientName}}', orderDetails.clientName)
        .replace('{{clientAddress}}', orderDetails.clientAddress)
        .replace('{{clientPhone}}', orderDetails.clientPhone)
        .replace('{{clientCnpj}}', orderDetails.clientCnpj)
        .replace('{{equipmentModel}}', orderDetails.equipmentModel)
        .replace('{{diagnosis}}', orderDetails.diagnosis.join('</li><li>'))
        .replace('{{solutions}}', orderDetails.solutions.join('</li><li>'))
        .replace('{{logoEmpresa}}', orderDetails.logoEmpresa)
        .replace('{{logoClientePlaceholder}}', orderDetails.logoClientePlaceholder);
};
