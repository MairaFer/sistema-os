import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import {
  Container,
  FormContainer,
  Form,
  Input,
  Button,
  Section,
  LogoContainer,
  LogoImage,
  InfoContainer,
} from './SettingsPageStyled';
import Styled from './SettingsPage.module.css';

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
    username: '',
    nome_da_empresa: '',
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
          username: response.data.nome_user,
          nome_da_empresa: response.data.nome_empresa,
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

    setIsModified(true);

    if (name === 'cnpjcpf' && !validateCNPJ(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, cnpjcpf: 'CNPJ deve ter exatamente 14 dígitos.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado.');
      }

      if (formData.cnpjcpf.length !== 14) {
        setErrors((prevErrors) => ({ ...prevErrors, cnpjcpf: 'CNPJ deve ter exatamente 14 dígitos.' }));
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

      setIsModified(false);
      window.location.reload(); // Reload the page to reflect changes
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
        const response = await axios.post(
          `https://cyberos-sistemadeordemdeservico-api.onrender.com/account/addlogo/${token}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Logo alterada com sucesso');
        setFormData((prevData) => ({
          ...prevData,
          picturePathLogo: response.data.picturePathLogo,
        }));
        setIsModified(false);
        window.location.reload(); 
      } catch (error) {
        console.error('Erro ao alterar a logo:', error);
      }
    }
  };

  return (
    <Container>
      <>
        <FormContainer>
          <Section style={{ paddingBottom: '1rem' }}>
            <h2 className={Styled.h2}>Informações da Conta</h2>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="username">Nome de Usuário:</label>
                {loading ? (
                  <Skeleton variant="text" width={300} height={40} />
                ) : (
                  <p id="username" style={{ fontSize: '1.2rem', fontWeight: '500', color: '#EF5E22' }}>
                    {formData.username}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email">Email:</label>
                {loading ? (
                  <Skeleton variant="text" width={300} height={40} />
                ) : (
                  <p id="email" style={{ fontSize: '1.25rem', fontWeight: '500', color: '#EF5E22' }}>
                    {formData.email}
                  </p>
                )}
              </div>
            </div>
          </Section>

          <Section style={{ paddingBottom: '1rem' }}>
            <h2 className={Styled.h2}>Informações de Documento</h2>
            <InfoContainer>
              <div>
                <Form>
                  <div>
                    <label htmlFor="nome_da_empresa">Nome da Empresa</label>
                    {loading ? (
                      <Skeleton variant="text" width={800} height={40} />
                    ) : (
                      <Input
                        type="text"
                        id="nome_da_empresa"
                        name="nome_da_empresa"
                        value={formData.nome_da_empresa}
                        onChange={handleChange}
                      />
                    )}
                    {errors.nome_da_empresa && <p className="error">{errors.nome_da_empresa}</p>}

                    <label htmlFor="phone">Telefone</label>
                    {loading ? (
                      <Skeleton variant="text" width={300} height={40} />
                    ) : (
                      <Input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    )}
                    {errors.phone && <p className="error">{errors.phone}</p>}

                    <label htmlFor="cnpjcpf">CNPJ/CPF</label>
                    {loading ? (
                      <Skeleton variant="text" width={300} height={40} />
                    ) : (
                      <Input
                        type="text"
                        id="cnpjcpf"
                        name="cnpjcpf"
                        value={formData.cnpjcpf}
                        onChange={handleChange}
                      />
                    )}
                    {errors.cnpjcpf && <p className="error">{errors.cnpjcpf}</p>}

                    <label htmlFor="endereco">Endereço</label>
                    {loading ? (
                      <Skeleton variant="text" width={300} height={40} />
                    ) : (
                      <Input
                        type="text"
                        id="endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                      />
                    )}
                    {errors.endereco && <p className="error">{errors.endereco}</p>}
                  </div>
                </Form>
              </div>
              <LogoContainer>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload"
                  onChange={handleLogoChange}
                  disabled={loading} // Desabilitar enquanto carrega
                />
                {loading ? (
                  <Skeleton variant="rectangular" width={150} height={150} />
                ) : (
                  <label htmlFor="logo-upload">
                    <LogoImage
                      src={formData.picturePathLogo || '/logo-placeholder.png'}
                      alt="Logo da Empresa"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }} // Ajuste de tamanho
                    />
                  </label>
                )}
                <p style={{ color: '#fff' }}>Alterar Logo</p>
              </LogoContainer>
            </InfoContainer>

            {loading ? (
              <Skeleton variant="rectangular" width={616} height={40} />
            ) : (
              <Button
                type="submit"
                disabled={!isModified}
                style={!isModified ? { opacity: 0.5, backgroundColor: '#0047FF', width: '616px' } : { backgroundColor: '#0047FF' }}
                onClick={handleSubmit} // Ensure the button triggers handleSubmit
              >
                Salvar Alterações
              </Button>
            )}
          </Section>

          <Section>
            <h2 className={Styled.h2}>Configurações</h2>
            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
              {loading ? (
                <>
                  <Skeleton variant="rectangular" width={300} height={40} />
                  <Skeleton variant="rectangular" width={300} height={40} />
                </>
              ) : (
                <>
                  <Button type="button" style={{ width: '300px', backgroundColor: '#0047FF' }}>Alterar Senha</Button>
                  <Button type="button" style={{ width: '300px', backgroundColor: '#dc3545' }}>Excluir Conta</Button>
                </>
              )}
            </div>
          </Section>
        </FormContainer>
      </>
    </Container>
  );
};

export default SettingsPage;

