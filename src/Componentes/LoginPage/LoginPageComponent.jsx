import React from 'react';
import './LoginPageStyled.css'; // Certifique-se de criar um arquivo CSS para os estilos

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="./public/LOGO.svg" alt="CyberOS Logo" />
      </div>
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
  );
};

export default Login;
