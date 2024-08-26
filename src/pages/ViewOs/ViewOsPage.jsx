import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from './ViewOs.module.css';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from 'axios';
import { generateOrderPDF } from '../../generators/htmlManip.js'; // Importando a função

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
            // Gerar o PDF usando a função importada
            await generateOrderPDF(id, type);

            // Após gerar o PDF, você pode definir o caminho do arquivo temporário para o download
            const pdfUrl = `../../temp/${id}/${type}`;

            // Atualizar o estado para mostrar o preview
            const response = await axios.get(pdfUrl, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            setCustomPdf({
                uri: URL.createObjectURL(blob),
                name: `OS_${id}_${type}.pdf`
            });
        } catch (error) {
            console.error('Erro ao gerar ou baixar o PDF:', error);
        }
    };

    const handleNavigateHome = () => {
        navigate("/gerenciaros");
    };

    useEffect(() => {
        // Limpar o PDF ao desmontar o componente
        return () => {
            if (customPdf) {
                URL.revokeObjectURL(customPdf.uri);
            }
        };
    }, [customPdf]);

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
                                        onClick={() => handleDownload("Empresa")}
                                        className={styles.downloadButton}
                                        startIcon={<DownloadIcon />}
                                    >
                                        Baixar Minha Via
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDownload("")}
                                        className={styles.downloadButton}
                                        startIcon={<DownloadIcon />}
                                    >
                                        Baixar Via do Beneficiário
                                    </Button>
                                </div>
                            </div>
                            {customPdf && (
                                <DocViewer
                                    documents={[{ uri: customPdf.uri, fileType: 'application/pdf', fileName: customPdf.name }]}
                                    pluginRenderers={DocViewerRenderers}
                                    style={{ height: '500px', width: '100%', marginTop: '20px' }}
                                />
                            )}
                        </section>
                    </div>
                    <div className={styles.designPage} />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default ViewOsPage;
