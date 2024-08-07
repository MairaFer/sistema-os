import React from "react";
import styles from './CriarOsFuncionario.module.css';
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
              <p className={styles.p}>2. Adicione um Funcionário à OS</p>
              <button className={styles.backButton} onClick={handleNavigateHome} >
                  <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
              </button>
              <section className={styles.funcionarioFormContainer}>
                  <label className="texto" htmlFor="selectFuncionario">Selecionar Funcionário Existente</label>
                  <div className={styles.selectFuncionarioWrapper}>
                      <select id="selectFuncionario" className={styles.selectFuncionario}>
                          <option>Funcionário</option>
                          {/* Consumo da Api */}
                      </select>
                  </div>
                  <label className="texto">Ou Criar novo funcionário</label>
                  <div className={styles.newFuncionarioWrapperAndButton}>
                      <div className={styles.newFuncionarioWrapper}>
                          <input type="text" placeholder="Nome do funcionário*" className={styles.inputField} />
                          <input type="text" placeholder="Contato" className={styles.inputField} />
                          <input type="text" placeholder="Setor*" className={styles.inputField} />
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
