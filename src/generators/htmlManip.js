import axios from 'axios';
import FormData from 'form-data'; // Certifique-se de instalar o pacote `form-data`

export async function populateOrderDetails(orderId) {
    try {
        const fetchOsById = async (orderId) => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('Token não encontrado.');
                }

                const [ordersResponse, clientsResponse, employeesResponse, servicesResponse] = await Promise.all([
                    axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/oss/${orderId}`),
                    axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/clientes/${token}`),
                    axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/funcionarios/${token}`),
                    axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/servicos/${token}`)
                ]);

                const orders = ordersResponse.data;
                const clients = clientsResponse.data;
                const employees = employeesResponse.data;
                const services = servicesResponse.data;

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

                const selectedOrder = orders.find(order => order._id === orderId);

                if (!selectedOrder) {
                    throw new Error(`Ordem de serviço com ID ${orderId} não encontrada.`);
                }

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

        const fetchUserData = async (token) => {
            try {
                const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/user/${token}`);
                return {
                    nome_da_empresa: response.data.nome_empresa,
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

        const token = sessionStorage.getItem('token');
        const order = await fetchOsById(orderId);
        const userData = await fetchUserData(token);

        const {
            nome_os,
            cliente_os = {},
            funcionario_os = {},
            servico_os = {},
            equipamento = '',
            marca = '',
            numero_serie = '',
            pecas_os = [],
            defeito = '',
            diagnostico = '',
            observacoes = '',
            data_encerramento = '',
            tecnico_responsavel = '',
            acessorio = '',
            createdAt = '',
        } = order;

        const nomeCliente = cliente_os.nome_cliente || '';
        const telefoneCliente = cliente_os.contato_cliente || '';
        const cpfCnpjCliente = cliente_os.cpf_cliente || cliente_os.cnpj_cliente || '';
        const enderecoCliente = cliente_os.endereco_cliente || '';

        const nomeFuncionario = funcionario_os.nome_func || '';
        const contatoFunc = funcionario_os.contato_func || '';
        const setorFunc = funcionario_os.setor || '';

        const nomeServico = servico_os.nome_servico || '';
        const valorServico = servico_os.valor_servico || '';

        const listaPecasOs = pecas_os.join(', ') || '';
        const dataCriacao = createdAt || '';

        document.querySelector('#logo').src = userData.picturePathLogo || 'logo-empresa.png';
        document.querySelector('#empresa-nome').textContent = userData.nome_da_empresa;
        document.querySelector('#cnpjcpf').textContent = userData.cnpjcpf;
        document.querySelector('#telefone').textContent = userData.phone;
        document.querySelector('#endereco').textContent = userData.endereco;

        document.querySelector('#os-nome').textContent = nome_os;
        document.querySelector('#data-criacao').textContent = `Data: ${dataCriacao}`;

        document.querySelector('#cliente-ou-funcionario-title').textContent = nomeCliente ? 'Cliente' : 'Funcionário';
        document.querySelector('#nome-cliente-ou-funcionario').textContent = nomeCliente || nomeFuncionario;
        document.querySelector('#telefone-cliente-ou-funcionario').textContent = telefoneCliente || contatoFunc;
        document.querySelector('#cpf-cnpj-cliente-ou-funcionario').textContent = cpfCnpjCliente;
        document.querySelector('#endereco-cliente').textContent = enderecoCliente || '';

        document.querySelector('#equipamento-nome').textContent = equipamento;
        document.querySelector('#equipamento-marca').textContent = marca;
        document.querySelector('#numero-serie').textContent = numero_serie;

        document.querySelector('#servico-nome').textContent = nomeServico;
        document.querySelector('#servico-valor').textContent = `R$ ${valorServico}`;

        document.querySelector('#pecas-lista').innerHTML = pecas_os.map(peca => `<li>${peca}</li>`).join('');

        document.querySelector('#defeitos-relatados').textContent = defeito;
        document.querySelector('#diagnostico').textContent = diagnostico;
        document.querySelector('#observacoes').textContent = observacoes;

        document.querySelector('#data-encerramento').textContent = data_encerramento;
        document.querySelector('#tecnico-responsavel').textContent = tecnico_responsavel;
        document.querySelector('#acessorio').textContent = acessorio;

    } catch (error) {
        console.error('Erro ao popular os detalhes da ordem', error.message);
    }
}


export async function sendHtmlForPdfConverter(type) {
    try {
        let fileUrl;
        if (type === 'empresa') {
            fileUrl = '/generators/pdf-empresa.html';
        } else if (type === 'beneficiario') {
            fileUrl = '/generators/pdf-beneficiario.html';
        } else {
            throw new Error('Tipo inválido. Use "empresa" ou "beneficiario".');
        }

        const htmlResponse = await fetch(fileUrl);
        const html = await htmlResponse.text();

        const formData = new FormData();
        let blob = new Blob([html], { type: 'text/html' });
        formData.append('file', blob, 'document.html');

        const response = await axios.post(
            'https://v2.convertapi.com/convert/html/to/pdf?Secret=secret_78JxYzkyWXZTQIRW',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'arraybuffer'
            }
        );

        // Cria um link de download e simula um clique para iniciar o download do PDF
        blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Erro ao converter HTML para PDF:', error);
    }
}

