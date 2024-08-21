// Função para modificar o conteúdo e os atributos do HTML
const modifyHtmlContent = (orderDetails) => {
    // 1. Alterar o texto do título da ordem de serviço
    const orderTitleElements = document.querySelectorAll('.order-title');
    orderTitleElements.forEach(element => {
        element.textContent = `Ordem de Serviço ${orderDetails.id}`; // Novo título
    });

    // 2. Alterar o texto do nome do cliente
    const clientNameElement = document.querySelector('.section-content strong:nth-of-type(1)');
    if (clientNameElement) {
        clientNameElement.nextElementSibling.textContent = orderDetails.clientName || 'Nome do Cliente';
    }

    // 3. Alterar o endereço do cliente
    const clientAddressElement = document.querySelector('.section-content strong:nth-of-type(2)');
    if (clientAddressElement) {
        clientAddressElement.nextElementSibling.textContent = orderDetails.clientAddress || 'Endereço do Cliente';
    }

    // 4. Alterar o telefone do cliente
    const clientPhoneElement = document.querySelector('.section-content strong:nth-of-type(3)');
    if (clientPhoneElement) {
        clientPhoneElement.nextElementSibling.textContent = orderDetails.clientPhone || 'Telefone do Cliente';
    }

    // 5. Alterar o CNPJ do cliente
    const clientCnpjElement = document.querySelector('.section-content strong:nth-of-type(4)');
    if (clientCnpjElement) {
        clientCnpjElement.nextElementSibling.textContent = orderDetails.clientCnpj || 'CNPJ do Cliente';
    }

    // 6. Alterar o modelo do equipamento
    const equipmentModelElement = document.querySelector('.section-content strong:nth-of-type(2)');
    if (equipmentModelElement) {
        equipmentModelElement.nextElementSibling.textContent = orderDetails.equipmentModel || 'Modelo do Equipamento';
    }

    // 7. Alterar o diagnóstico atual
    const diagnosisList = document.querySelector('.item-list');
    if (diagnosisList) {
        diagnosisList.innerHTML = orderDetails.diagnosis.map(item => `<li>${item}</li>`).join('');
    }

    // 8. Alterar a solução aplicada
    const solutionList = document.querySelectorAll('.item-list')[1];
    if (solutionList) {
        solutionList.innerHTML = orderDetails.solutions.map(item => `<li>${item}</li>`).join('');
    }

    // 9. Alterar o logo da empresa
    const logoEmpresaImg = document.querySelector('.header-table img');
    if (logoEmpresaImg) {
        logoEmpresaImg.src = orderDetails.logoEmpresa || 'logo-empresa.png'; // Novo caminho da imagem
    }

    // 10. Alterar o texto de placeholder do logo do cliente
    const logoClientePlaceholder = document.querySelector('.logo-placeholder');
    if (logoClientePlaceholder) {
        logoClientePlaceholder.textContent = orderDetails.logoClientePlaceholder || 'Marca do Cliente';
    }
};

// Exemplo de uso da função
document.addEventListener('DOMContentLoaded', () => {
    const orderDetails = {
        id: '0002',
        clientName: 'Novo Nome do Cliente',
        clientAddress: 'Novo Endereço, 1234, Bairro Novo, Cidade Nova',
        clientPhone: '(41) 9999-9999',
        clientCnpj: '12.345.678/0001-99',
        equipmentModel: 'Modelo Novo',
        diagnosis: [
            'Novo problema identificado',
            'Nova falha detectada'
        ],
        solutions: [
            'Nova solução aplicada',
            'Ajustes realizados'
        ],
        logoEmpresa: 'novo-logo-empresa.png',
        logoClientePlaceholder: 'Nova Marca do Cliente'
    };

    modifyHtmlContent(orderDetails);
});
