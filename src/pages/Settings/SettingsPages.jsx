import React, { useState } from 'react';
import { Container, Title, Form, Input, Button, Section } from './SettingsPageStyled';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    username: 'Seu Nome',
    email: 'seuemail@example.com',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar os dados do formulário
    console.log('Dados enviados:', formData);
  };

  return (
    <Container>
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
            value={formData.telefone}
            onChange={handleChange}
          />
        </Section>
        <Section>
          <label htmlFor="password">Nova Senha</label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Section>
        <Button type="submit">Salvar Alterações</Button>
      </Form>
    </Container>
  );
};

export default SettingsPage;
