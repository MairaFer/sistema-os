import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Função para buscar uma ordem de serviço específica
const fetchOsById = async (orderId) => {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            throw new Error('Token não encontrado.');
        }

        // Fazer requisições paralelas para obter os dados
        const [ordersResponse, clientsResponse, employeesResponse, servicesResponse] = await Promise.all([
            axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss/${token}`),
            axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`),
            axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`),
            axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${token}`)
        ]);

        const orders = ordersResponse.data;
        const clients = clientsResponse.data;
        const employees = employeesResponse.data;
        const services = servicesResponse.data;

        // Criar mapeamentos para clientes, funcionários e serviços
        const clientMap = clients.reduce((map, client) => {
            map[client._id] = client;
            return map;
        }, {});

        const employeeMap = employees.reduce((map, employee) => {
            map[employee._id] = employee;
            return map;
        }, {});

        const serviceMap = services.reduce((map, service) => {
            map[service._id] = service;
            return map;
        }, {});

        // Filtrar a ordem de serviço pelo ID fornecido
        const selectedOrder = orders.find(order => order._id === orderId);

        if (!selectedOrder) {
            throw new Error(`Ordem de serviço com ID ${orderId} não encontrada.`);
        }

        // Adicionar detalhes da ordem
        const orderWithDetails = {
            ...selectedOrder,
            cliente_os: clientMap[selectedOrder.cliente_os] || null,
            funcionario_os: employeeMap[selectedOrder.funcionario_os] || null,
            servico_os: serviceMap[selectedOrder.servico_os] || null
        };

        return orderWithDetails;
    } catch (error) {
        console.error('Erro ao buscar ordem de serviço', error.message);
        throw error;
    }
};

// Função para gerar o HTML para uma ordem de serviço
async function generateHTML(order, via) {
    const {
        nome_os,
        cliente_os,
        funcionario_os,
        servico_os,
        equipamento,
        marca,
        numero_serie,
        pagamento,
        tecnico,
        pecas_os,
        defeito,
        diagnostico,
        observacoes,
        data_encerramento,
        tecnico_responsavel,
        acessorio,
        createdAt,
    } = order;

    const token = sessionStorage.getItem('token');

    // Função para buscar dados do usuário
    const fetchUserData = async (token) => {
        try {
            const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/user/${token}`);
            return {
                username: response.data.nome_user,
                nome_da_empresa: response.data.nome_empresa,
                email: response.data.email_user,
                cnpjcpf: response.data.cnpj_user,
                phone: response.data.contato_userEmpresa,
                endereco: response.data.endereco_userEmpresa || '',
                picturePathLogo: response.data.picturePathLogo,
            };
        } catch (error) {
            console.error('Erro ao buscar os dados do usuário:', error);
            throw error;
        }
    };

    const data = await fetchUserData(token);

    const cliente = cliente_os || {};
    const funcionario = funcionario_os || {};
    const servico = servico_os || {};

    const nomeCliente = cliente.nome_cliente || '';
    const telefoneCliente = cliente.contato_cliente || '';
    const cpfCnpjCliente = cliente.cpf_cliente || cliente.cnpj_cliente;
    const enderecoCliente = cliente.endereco_cliente || '';

    const nomeFuncionario = funcionario.nome_func || '';
    const contatoFunc = funcionario.contato_func || '';
    const setorFunc = funcionario.setor || '';

    const nomeServico = servico.nome_servico || '';
    const valorServico = servico.valor_servico || '';

    const listaPecasOs = pecas_os ? pecas_os.join(', ') : '';

    return via === 'Empresa' ? `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordem de Serviço ${nome_os} ${order.key_search}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.2;
            margin: 0;
            padding: 10mm;
            box-sizing: border-box;
        }
        h1, h2, h3, h4, h5, h6, p {
            margin: 0;
        }
        .table-container {
            width: 100%;
            page-break-inside: avoid;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .header-table {
            margin-bottom: 15px;
        }
        .header-table td {
            text-align: center;
            vertical-align: top;
            padding: 5px;
        }
        .header-table img {
            max-width: 60px;
            height: auto;
        }
        .header-table .company-details {
            font-size: 10pt;
            font-weight: bold;
        }
        .section-title {
            background-color: #434343;
            color: #ffffff;
            font-weight: bold;
            padding: 5px;
            font-size: 10pt;
        }
        .section-content {
            padding: 5px;
            background-color: #ffffff;
            font-size: 9pt;
        }
        .section-content strong {
            display: block;
            margin-bottom: 4pt;
        }
        .item-list {
            margin-left: 24pt;
            list-style-type: disc;
        }
        .item-list li {
            margin-bottom: 3pt;
        }
        .signature-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
        .signature-section div {
            width: 45%;
        }
        .signature-section .signature {
            border-top: 1px solid #000;
            width: 100%;
            padding: 5px;
            display: inline-block;
        }
        @page {
            size: A4;
            margin: 10mm;
        }
        @media print {
            body {
                font-size: 9pt;
            }
            .header-table img {
                max-width: 50px;
            }
            .company-details {
                font-size: 9pt;
            }
            .section-title {
                font-size: 9pt;
                padding: 4px;
            }
            .section-content {
                font-size: 8pt;
                padding: 4px;
            }
            .signature-section div {
                width: 45%;
                margin-bottom: 0;
            }
        }
    </style>
</head>

<body>

    <div class="table-container">
        <table class="header-table">
            <tr>
                <td>
                    <img src="${data.picturePathLogo || 'logo-empresa.png'}" alt="Logo da Empresa">
                </td>
                <td class="company-details">
                    <p>${data.nome_da_empresa}</p>
                    <p>${data.cnpjcpf}</p>
                    <p>${data.phone}</p>
                    <p>${data.endereco}</p>
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Ordem de Serviço - ${nome_os} ${order.key_search}</td>
                <td class="section-title">Data: ${createdAt || ''}</td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">${nomeCliente ? 'Cliente' : 'Funcionário'}</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>${nomeCliente ? 'Nome' : 'Nome'}</strong>
                    ${nomeCliente || nomeFuncionario}
                </td>
                <td class="section-content">
                    <strong>${nomeCliente ? 'Telefone' : 'Contato'}</strong>
                    ${telefoneCliente || contatoFunc}
                </td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>${nomeCliente ? 'CPF/CNPJ' : 'Setor'}</strong>
                    ${cpfCnpjCliente || setorFunc}
                </td>
                <td class="section-content">
                    <strong>${nomeCliente ? 'Endereço' : ''}</strong>
                    ${enderecoCliente || ''}
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Equipamento</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>Nome</strong>
                    ${equipamento || ''}
                </td>
                <td class="section-content">
                    <strong>Marca</strong>
                    ${marca || ''}
                </td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>Número de Série</strong>
                    ${numero_serie || ''}
                </td>
                <td class="section-content"></td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Serviço</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>Nome</strong>
                    ${nomeServico}
                </td>
                <td class="section-content">
                    <strong>Valor</strong>
                    R$ ${valorServico}
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Peças</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    <ul class="item-list">
                        ${listaPecasOs}
                    </ul>
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Defeitos Relatados</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    ${defeito || 'Nenhum defeito informado'}
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Diagnóstico</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    ${diagnostico || 'Nenhum diagnóstico informado'}
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Observações</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    ${observacoes || 'Nenhuma observação informada'}
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Data de Encerramento</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content">
                    ${data_encerramento || 'Não informada'}
                </td>
                <td class="section-content"></td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Técnico Responsável</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    ${tecnico_responsavel || 'Não informado'}
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Acessórios</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    ${acessorio || 'Nenhum acessório informado'}
                </td>
            </tr>
        </table>

        <div class="signature-section">
            <div>
                <div class="signature">Assinatura Cliente</div>
                <p>Nome Cliente</p>
            </div>
            <div>
                <div class="signature">Assinatura Técnico</div>
                <p>${tecnico || 'Nome Técnico'}</p>
            </div>
        </div>

    </div>

</body>

</html>
` : `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordem de Serviço ${order.key_search}</title>
    <style>
         body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.2;
            margin: 0;
            padding: 10mm;
            box-sizing: border-box;
        }
        h1, h2, h3, h4, h5, h6, p {
            margin: 0;
        }
        .table-container {
            width: 100%;
            page-break-inside: avoid;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .header-table {
            margin-bottom: 15px;
        }
        .header-table td {
            text-align: center;
            vertical-align: top;
            padding: 5px;
        }
        .header-table img {
            max-width: 60px;
            height: auto;
        }
        .header-table .company-details {
            font-size: 10pt;
            font-weight: bold;
        }
        .section-title {
            background-color: #434343;
            color: #ffffff;
            font-weight: bold;
            padding: 5px;
            font-size: 10pt;
        }
        .section-content {
            padding: 5px;
            background-color: #ffffff;
            font-size: 9pt;
        }
        .section-content strong {
            display: block;
            margin-bottom: 4pt;
        }
        .item-list {
            margin-left: 24pt;
            list-style-type: disc;
        }
        .item-list li {
            margin-bottom: 3pt;
        }
        .signature-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
        .signature-section div {
            width: 45%;
        }
        .signature-section .signature {
            border-top: 1px solid #000;
            width: 100%;
            padding: 5px;
            display: inline-block;
        }
        @page {
            size: A4;
            margin: 10mm;
        }
        @media print {
            body {
                font-size: 9pt;
            }
            .header-table img {
                max-width: 50px;
            }
            .company-details {
                font-size: 9pt;
            }
            .section-title {
                font-size: 9pt;
                padding: 4px;
            }
            .section-content {
                font-size: 8pt;
                padding: 4px;
            }
            .signature-section div {
                width: 45%;
                margin-bottom: 0;
            }
        }
    </style>
</head>

<body>

    <div class="table-container">
        <table class="header-table">
            <tr>
                <td>
                    <img src="logo-empresa.png" alt="Logo da Empresa">
                </td>
                <td class="company-details">
                    <p>${data.nome_da_empresa}</p>
                    <p>${data.cnpj_user}</p>
                    <p>${data.contato_userEmpresa}</p>
                    <p>${data.endereco_userEmpresa}</p>
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Ordem de Serviço - ${order.nome_os} ${order.key_search}</td>
                <td class="section-title">Data: ${order.createdAt || ''}</td>
            </tr>
        </table>

        <table>
        <tr>
            <td class="section-title">
                ${nomeCliente ? 'Cliente' : 'Funcionário'}
            </td>
            <td class="section-title"></td>
        </tr>
        <tr>
            <td class="section-content">
                <strong>${nomeCliente ? 'Nome' : 'Nome'}</strong>
                ${nomeCliente || nomeFuncionario}
            </td>
            <td class="section-content">
                <strong>${nomeCliente ? 'Telefone' : 'Contato'}</strong>
                ${telefoneCliente || contatoFunc}
            </td>
        </tr>
        <tr>
            <td class="section-content">
                <strong>${nomeCliente ? 'CPF/CNPJ' : 'Setor'}</strong>
                ${cpfCnpjCliente || SetorFunc}
            </td>
            <td class="section-content">
                <strong>${nomeCliente ? 'Endereço' : ''}</strong>
                ${enderecoCliente || ''}
            </td>
        </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Equipamento</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>Nome</strong>
                    ${order.equipamento || ''}
                </td>
                <td class="section-content">
                    <strong>Marca</strong>
                    ${order.marca || ''}
                </td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>Número de Série</strong>
                    ${order.numeroSerie || ''}
                </td>
                <td class="section-content"></td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Serviço</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>Nome</strong>
                    ${nomeServico}
                </td>
                <td class="section-content">
                    <strong>Valor</strong>
                    R$ ${valorServico}
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Peças</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    <ul class="item-list">
                        ${listapecas_os}
                    </ul>
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Defeitos Relatados</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    <ul class="item-list">
                        ${order.defeito}
                    </ul>
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Diagnóstico</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content" colspan="2">
                    <ul class="item-list">
                        ${order.diagnostico}
                    </ul>
                </td>
            </tr>
        </table>

        <table>
            <tr>
                <td class="section-title">Informações Extra</td>
                <td class="section-title"></td>
            </tr>
            <tr>
                <td class="section-content">
                    <strong>Data</strong>
                    ${data_encerramento || ''}
                </td>
                <td class="section-content">
                    <strong>Técnico</strong>
                    ${order.tecnico || ''}
                </td>
                 <td class="section-content">
                    <strong>Técnico</strong>
                    ${order.pagamento || ''}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
    `;
}

// Função para enviar o HTML para a API e receber o PDF
async function sendHtmlForPdfConversion(html, token) {
    try {
        const response = await axios.post(
            `https://cyberos-sistemadeordemdeservico-api.onrender.com/os/pickPdf/${token}`,
            { html },
            { responseType: 'arraybuffer' } // Para receber o PDF como buffer
        );

        return response.data; // Retorna o buffer do PDF
    } catch (error) {
        console.error('Erro ao converter HTML em PDF:', error);
        return null;
    }
}

export async function generateOrderPDF(orderId, templateType) {
    const token = sessionStorage.getItem('token');
    if (!token) {
        throw new Error('Token não encontrado.');
    }
    try {
        const order = await fetchOsById(orderId);
        const html = await generateHTML(order, templateType);
        const pdfBuffer = await sendHtmlForPdfConversion(html, token);

        if (pdfBuffer) {
            const filePath = path.join(__dirname, 'temp', `${order.key_search}-${templateType}.pdf`);
            fs.writeFileSync(filePath, pdfBuffer);
            console.log(`PDF salvo em: ${filePath}`);
        }
    } catch (error) {
        console.error('Erro ao gerar PDF para ordem de serviço:', error);
    }
}