import React, { useState } from 'react';
import { Container, FormContainer, Title, Form, Input, Button, Section, LogoContainer, LogoImage } from './SettingsPageStyled';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    username: 'Seu Nome',
    email: 'seuemail@example.com',
    cnpjcpf: '12345678901',
    phone: '1234567890',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
  };

  const handleLogoChange = (e) => {
    console.log('Logo alterada');
  };

  return (
    <Container>
      <FormContainer>
        <Title>Configurações da Conta</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <label htmlFor="username">Nome da empresa</label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Section>
          <Section>
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
          </Section>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button type="button">Alterar Senha</Button>
            <Button type="button" style={{ backgroundColor: '#dc3545' }}>Excluir Conta</Button>
          </div>
        </Form>
      </FormContainer>
      <LogoContainer>
        <LogoImage src="/logoex.png" alt="Logo da Empresa" onClick={handleLogoChange} />
        <p>Alterar foto da logo</p>
      </LogoContainer>
    </Container>
  );
};

export default SettingsPage;
