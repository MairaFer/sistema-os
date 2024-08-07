import React from "react";
import styles from './CriarOsCliente.module.css';
import { useNavigate } from 'react-router-dom';

export const SelectTypeOS = () => {
    const navigate = useNavigate();

    const handleNavigateHome = () => {
        navigate("/criaros/tipo-da-os");
    };

    return (
      <div className={styles.selecaoTipoOs}>
      <div className={styles.div}>
          <div className={styles.overlapGroup}>
              <div className={styles.barraPage} />
              <div className={styles.textWrapper}>Criando OS</div>
              <p className={styles.p}>2. Adicione um Cliente a OS</p>
              <button className={styles.backButton} onClick={handleNavigateHome} >
                  <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
              </button>
              <section className={styles.clientFormContainer}>
                  <label className="texto" htmlFor="selectClient">Selecionar Cliente Existente</label>
                  <div className={styles.selectClientWrapper}>
                      <select id="selectClient" className={styles.selectClient}>
                          <option>Cliente</option>
                          {/* Consumo da Api */}
                      </select>
                  </div>
                  <label className="texto">Ou Criar novo cliente</label>
                  <div className={styles.newClientWrapperAndButton}>
                      <div className={styles.newClientWrapper}>
                          <input type="text" placeholder="Nome do cliente*" className={styles.inputField} />
                          <input type="text" placeholder="Contato" className={styles.inputField} />
                          <input type="text" placeholder="Endereço" className={styles.inputField} />
                          <input type="text" placeholder="CPF/CNPJ*" className={styles.inputField} />
                      </div>
                      <button className={styles.submitButton}>
                          <img className={styles.submitIcon} src="/public/confirm.png" alt="avançar" />
                      </button>
                  </div>
              </section>
          </div>
          <div className={styles.designPage} />
      </div>
  </div>
  
    );
};

export default SelectTypeOS;
