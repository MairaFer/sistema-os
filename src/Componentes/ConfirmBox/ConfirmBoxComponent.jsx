import React from 'react';
import styles from './ConfirmBox.module.css'; // Usando CSS Modules

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.icon}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2zM10 17L5 12L6.4 10.6L10 14.2L17.6 6.6L19 8L10 17Z" />
            </svg>
          </div>
          <p className={styles.message}>{message}</p>
          <button onClick={onConfirm} className={styles.button}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;