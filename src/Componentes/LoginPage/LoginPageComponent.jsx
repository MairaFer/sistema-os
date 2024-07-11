import React from 'react';
import './LoginPageStyled.css'; 
import '../Footer/Footer'
const Login = () => {
  return (
    <section className='login-form'>
      <div className="login-container">
        <img className='logo-login' src="./public/LOGO.svg" alt="CyberOS Logo" />
        <div className="login-form">
          <h1 className="titulo">Já tem cadastro?</h1>
          <h2 className="subtitulo">Faça seu login__</h2>
          <button className="google-login">
            <img src="./public/google.png" alt="Google Logo" /> Login com Google
          </button>
          <div className="or-separator">- ou -</div>
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Senha" />
            <button type="submit">Entrar</button>
          </form>
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
