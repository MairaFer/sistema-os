import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Componentes/RegisterPage/RegisterPageStyled.css'; 
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

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://cyberos-sistemadeordemdeservico-api.onrender.com/register', {
        name,
        email,
        password
      });
      console.log('Registration successful:', response.data);
      // Redireciona o usuário para a página de login após registro bem-sucedido
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Falha no registro. Por favor, tente novamente.');
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
          <h1 className="titulo">Comece agora!</h1>
          <h2 className="subtitulo">Faça seu cadastro__</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
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
