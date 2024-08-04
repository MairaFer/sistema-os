import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterPageStyled.module.css'; // Importando o CSS Module
import Loading from '../../pages/Loading/Loading'; // Importe o componente de loading

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook para redirecionar

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação da senha
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://cyberos-sistemadeordemdeservico-api.onrender.com/register', {
        nome_user: name,
        email_user: email,
        password
      });
      console.log('Registration successful:', response.data);
      // Redireciona o usuário para a página de login após registro bem-sucedido
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err.response);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Mostra a mensagem de erro vinda da API
      } else {
        setError('Falha no registro. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.registerForm}>
      {loading && <Loading />} {/* Mostra a tela de loading enquanto os dados estão sendo carregados */}
      <div className={styles.registerContainer}>
        <img className={styles.logoRegister} src="./public/LOGO.svg" alt="CyberOS Logo" />
        <div className={styles.registerForm}>
          <h1 className={styles.titulo}>Comece agora!</h1>
          <h2 className={styles.subtitulo}>Faça seu cadastro_</h2>
          <form onSubmit={handleRegister}>
            <input
              className={styles.registerInput}
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className={styles.registerInput}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.registerInput}
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className={styles.registerInput}
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className={styles.registerButton} type="submit" disabled={loading}>
              {loading ? 'Criando Conta...' : 'Criar Conta'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default Register;
