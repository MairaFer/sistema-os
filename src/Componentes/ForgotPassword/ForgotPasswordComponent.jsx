import React, { useState } from 'react';
import axios from 'axios';
import styles from './ForgotPassword.module.css'; // Importando o CSS Module
import ConfirmationModal from '../ConfirmBox/ConfirmBoxComponent.jsx';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate para navegação
import Footer from '../Footer/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Hook useNavigate para navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('https://cyberos-sistemadeordemdeservico-api.onrender.com/request-password-reset', {
        email_user: email,
      });
      setIsModalOpen(true); // Abre o pop-up
      console.log('Email sent:', response.data);
    } catch (err) {
      console.error('Error sending email:', err.response);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Falha ao enviar e-mail. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/'); // Navega para a página inicial após fechar o modal
  };

  const confirmAction = () => {
    closeModal();
  };

  return (
    <section>
        <div className={styles.forgotPasswordContainer}>
      <form className={styles.forgotPasswordForm} onSubmit={handleSubmit}>
        <img className={styles.logo} src="./public/LOGO.svg" alt="CyberOS Logo" />
        <h1>Esqueceu sua senha?</h1>
        <h2>Digite seu email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        message="Um e-mail com instruções para redefinir sua senha foi enviado."
      />
    </div>
     <Footer />
    </section>
  );
};

export default ForgotPassword;
