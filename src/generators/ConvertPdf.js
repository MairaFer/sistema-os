import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Função para converter HTML em PDF
const convertHtmlToPdf = async (htmlFilePath, outputPdfPath) => {
    try {
        // Ler o arquivo HTML
        const html = fs.readFileSync(htmlFilePath, 'utf8');

        // Iniciar o Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Carregar o conteúdo HTML
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Configuração do PDF
        const options = {
            path: outputPdfPath, // Caminho onde o PDF será salvo
            format: 'A4', // Tamanho do papel
            printBackground: true, // Imprimir fundo
        };

        // Gerar o PDF
        await page.pdf(options);

        // Fechar o navegador
        await browser.close();

        console.log(`PDF criado com sucesso: ${outputPdfPath}`);
    } catch (error) {
        console.error('Erro ao converter HTML para PDF:', error);
    }
};

// Caminhos dos arquivos
const htmlFilePath = path.join(process.cwd(), 'input.html'); // Substitua pelo caminho do seu arquivo HTML
const outputPdfPath = path.join(process.cwd(), 'output.pdf'); // Caminho onde o PDF será salvo

// Executar a conversão
convertHtmlToPdf(htmlFilePath, outputPdfPath);
