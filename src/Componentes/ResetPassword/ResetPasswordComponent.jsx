import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../ConfirmBox/ConfirmBoxComponent.jsx';
import styles from './ResetPassword.module.css'; // Importando o CSS Module

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await axios.post(`https://cyberos-sistemadeordemdeservico-api.onrender.com/reset-password/${token}`, {
        new_password: password,
      });
      setIsModalOpen(true);
    } catch (err) {
      setError('Falha ao redefinir senha. Por favor, tente novamente.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/'); // Navega para a página inicial após fechar o modal
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <form className={styles.resetPasswordForm} onSubmit={handleSubmit}>
        <img className={styles.logo} src="../../public/LOGO.svg" alt="CyberOS Logo" />
        <h1>Redefinir Senha</h1>
        <input
          type="password"
          placeholder="Nova Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Redefinir Senha
        </button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message="Senha redefinida com sucesso!"
        onConfirm={closeModal} // Navegar após confirmar
      />
    </div>
  );
};

export default ResetPassword;
