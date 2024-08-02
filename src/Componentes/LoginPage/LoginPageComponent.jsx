import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPageStyled.module.css';
import Loading from '../../pages/Loading/Loading';
import { useAuth } from '../../context/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://cyberos-sistemadeordemdeservico-api.onrender.com/login', {
        email_user: email,
        password
      });
      console.log('Login successful:', response.data);
      const { token, user } = response.data;
      login(token, user); // Armazena o token e o userId
      navigate('/home');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Falha no login. Por favor, verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://cyberos-sistemadeordemdeservico-api.onrender.com/google';
  };

  return (
    <section className={styles.loginForm}>
      {loading && <Loading />}
      <div className={styles.loginContainer}>
        <img className={styles.logoLogin} src="/LOGO.svg" alt="CyberOS Logo" />
        <div className={styles.loginForm}>
          <h1 className={styles.titulo}>Já tem cadastro?</h1>
          <h2 className={styles.subtitulo}>Faça seu login abaixo_</h2>
          <button className={styles.googleLogin} onClick={handleGoogleLogin}>
            <img src="/google.png" alt="Google Logo" />
            Continuar com Google
          </button>
          <p className={styles.orSeparator}>ou</p>
          <form onSubmit={handleLogin}>
            <input
              className={styles.loginInput}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.loginInput}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className={styles.loginButton} type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className={styles.loginLinks}>
            <a href="/redefinir-senha">Esqueci minha senha</a>
            <a href="/register">Novo no cyberos? Cadastre-se aqui</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
