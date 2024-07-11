import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPageStyled.css'; 
import '../Footer/Footer';
import Loading from '../../pages/Loading/Loading'; // Importe o componente de loading

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook para redirecionar

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
      // Redireciona o usuário para a página inicial após login bem-sucedido
      navigate('/home');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Falha no login. Por favor, verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='login-form'>
      {loading && <Loading />} {/* Mostra a tela de loading enquanto os dados estão sendo carregados */}
      <div className="login-container">
        <img className='logo-login' src="./public/LOGO.svg" alt="CyberOS Logo" />
        <div className="login-form">
          <h1 className="titulo">Já tem cadastro?</h1>
          <h2 className="subtitulo">Faça seu login__</h2>
          <button className="google-login">
            <img src="./public/google.png" alt="Google Logo" /> Login com Google
          </button>
          <div className="or-separator">- ou -</div>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="login-links">
            <a href="/forgot-password">esqueceu sua senha?</a>
            <a href="/register">Novo no cyberos? Cadastre-se aqui</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
