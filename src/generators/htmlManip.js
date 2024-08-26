import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Função para gerar e baixar o PDF
export function generateAndDownloadPDF() {
    fetch("/public/pdf-empresa.html")
        .then(response => response.text())
        .then(htmlContent => {
            const container = document.createElement('div');
            container.style.position = 'absolute'; // Define a posição para evitar sobreposição
            container.style.top = '-9999px'; // Move o container para fora da tela
            container.style.padding = '2px'; // Adiciona padding para a imagem
            container.innerHTML = htmlContent;
            document.body.appendChild(container);

            html2canvas(container, {
                scale: 2, // Melhora a resolução
                useCORS: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');

                // Configurações do PDF
                const pdf = new jsPDF({
                    unit: 'mm',
                    format: 'a4'
                });

                // Dimensões da página A4 em mm
                const pdfWidth = pdf.internal.pageSize.width;
                const pdfHeight = pdf.internal.pageSize.height;

                // Dimensões do canvas em pixels
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;

                // Calcular as proporções para ajustar a imagem à página A4 com padding
                const padding = 2; // Padding de 2px
                const imgWidth = pdfWidth - 2 * padding; // Subtrai o padding da largura
                const imgHeight = (canvasHeight * imgWidth) / canvasWidth;

                // Ajustar a altura da imagem se ela exceder a altura da página
                const adjustedImgHeight = imgHeight > (pdfHeight - 2 * padding) ? (pdfHeight - 2 * padding) : imgHeight;

                // Adicionar a imagem ao PDF
                pdf.addImage(imgData, 'PNG', padding, padding, imgWidth, adjustedImgHeight);

                // Verificar se a imagem ainda excede a altura da página
                if (adjustedImgHeight > (pdfHeight - 2 * padding)) {
                    // Dividir a imagem em várias páginas se necessário
                    let remainingHeight = adjustedImgHeight - (pdfHeight - 2 * padding);
                    let yOffset = padding;
                    while (remainingHeight > (pdfHeight - 2 * padding)) {
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', padding, yOffset, imgWidth, pdfHeight - 2 * padding);
                        remainingHeight -= (pdfHeight - 2 * padding);
                        yOffset -= (pdfHeight - 2 * padding);
                    }
                    // Adicionar a última parte da imagem se houver
                    if (remainingHeight > 0) {
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', padding, yOffset, imgWidth, remainingHeight);
                    }
                }

                // Salvar o PDF
                pdf.save('documento.pdf');

                // Remover o container temporário
                document.body.removeChild(container);
            }).catch(error => {
                console.error('Erro ao renderizar o HTML para o canvas:', error.message);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar o conteúdo do HTML:', error.message);
        });
}
