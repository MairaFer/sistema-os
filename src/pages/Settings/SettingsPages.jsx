import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import { Container, FormContainer, Title, Form, Input, Button, Section, LogoContainer, LogoImage } from './SettingsPageStyled';

const validateCNPJ = (value) => {
  return /^\d{14}$/.test(value);
};

const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return value;
};

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    username: '', // Novo campo para o nome de usuário
    nome_da_empresa: '', // Campo corrigido para o nome da empresa
    email: '',
    cnpjcpf: '',
    phone: '',
    endereco: '',
    picturePathLogo: '', 
  });
  
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado.');
        }
        
        const response = await axios.get(`https://cyberos-sistemadeordemdeservico-api.onrender.com/user/${token}`);
        const data = {
          username: response.data.nome_user, // Novo campo para o nome de usuário
          nome_da_empresa: response.data.nome_empresa, // Campo corrigido
          email: response.data.email_user,
          cnpjcpf: response.data.cnpj_user,
          phone: response.data.contato_userEmpresa,
          endereco: response.data.endereco_userEmpresa || '',
          picturePathLogo: response.data.picturePathLogo,
        };
        setFormData(data);
        setInitialData(data);
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setIsModified(true); // Marca como modificado

    // Validação simples
    if (name === 'cnpjcpf' && !validateCNPJ(value)) {
      setErrors(prevErrors => ({ ...prevErrors, cnpjcpf: 'CNPJ deve ter exatamente 14 dígitos.' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado.');
      }

      // Valida o CNPJ/CPF antes de enviar
      if (formData.cnpjcpf.length !== 14) {
        setErrors(prevErrors => ({ ...prevErrors, cnpjcpf: 'CNPJ deve ter exatamente 14 dígitos.' }));
        return;
      }

      if (formData.nome_da_empresa !== initialData.nome_da_empresa) {
        await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/account/addnome-empresa/${token}`, { nomeEmpresa: formData.nome_da_empresa });
      }
      if (formData.cnpjcpf !== initialData.cnpjcpf) {
        await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/account/addcnpj/${token}`, { cnpj: formData.cnpjcpf });
      }
      if (formData.phone !== initialData.phone) {
        await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/account/addcontato/${token}`, { contato: formData.phone });
      }
      if (formData.endereco !== initialData.endereco) {
        await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/account/addendereco/${token}`, { endereco: formData.endereco });
      }
      
      setIsModified(false); // Após salvar, marca como não modificado
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const handleLogoChange = async (e) => {
    const logoFile = e.target.files[0];
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      console.error('Token não encontrado.');
      return;
    }

    if (logoFile) {
      const formData = new FormData();
      formData.append('logo', logoFile);

      try {
        await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/account/addlogo/${token}`, formData);
        console.log('Logo alterada com sucesso');
        setIsModified(true);
      } catch (error) {
        console.error('Erro ao alterar a logo:', error);
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      ) : (
        <>
          <FormContainer>
            <Title>Configurações da Conta</Title>
            <Form onSubmit={handleSubmit}>
              <Section>
                <label htmlFor="username">Nome de Usuário</label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled
                />
                {errors.username && <p className="error">{errors.username}</p>}
              </Section>
              <Section>
                <label htmlFor="nome_da_empresa">Nome da Empresa</label>
                <Input
                  type="text"
                  id="nome_da_empresa"
                  name="nome_da_empresa"
                  value={formData.nome_da_empresa}
                  onChange={handleChange}
                />
                {errors.nome_da_empresa && <p className="error">{errors.nome_da_empresa}</p>}
              </Section>
              <Section>
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled // Desabilitar o campo de email
                />
              </Section>
              <Section>
                <label htmlFor="phone">Telefone</label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </Section>
              <Section>
                <label htmlFor="cnpjcpf">CNPJ/CPF</label>
                <Input
                  type="text"
                  id="cnpjcpf"
                  name="cnpjcpf"
                  value={formData.cnpjcpf}
                  onChange={handleChange}
                />
                {errors.cnpjcpf && <p className="error">{errors.cnpjcpf}</p>}
              </Section>
              <Section>
                <label htmlFor="endereco">Endereço</label>
                <Input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                />
                {errors.endereco && <p className="error">{errors.endereco}</p>}
              </Section>
              <Button type="submit" disabled={!isModified} style={!isModified ? { opacity: 0.5 } : {}}>
                Salvar Alterações
              </Button>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button">Alterar Senha</Button>
                <Button type="button" style={{ backgroundColor: '#dc3545' }}>Excluir Conta</Button>
              </div>
            </Form>
          </FormContainer>
          <LogoContainer>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="logo-upload"
              onChange={handleLogoChange}
            />
            <label htmlFor="logo-upload">
              <LogoImage src={formData.picturePathLogo || '/logo-placeholder.png'} alt="Logo da Empresa" />
            </label>
            <p>Alterar foto da logo</p>
          </LogoContainer>
        </>
      )}
    </Container>
  );
};

export default SettingsPage;
