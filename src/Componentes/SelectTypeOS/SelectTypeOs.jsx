import React from "react";
import styles from "./SelectTypeOs.module.css";
import { useNavigate } from 'react-router-dom';

export const SelectTypeOS = () => {
    const navigate = useNavigate();

    const handleNavigateHome = () => {
        navigate("/home");
    };

    const handleNavigateFuncionario = () => {
        navigate("/criaros/funcionario");
    };

    const handleNavigateCliente = () => {
        navigate("/criaros/cliente");
    };

    return (
        <div className={styles.selecaoTipoOs}>
            <div className={styles.div}>
                <div className={styles.overlapGroup}>
                    <div className={styles.barraPage} />
                    <div className={styles.textWrapper}>Criando OS</div>
                    <p className={styles.p}>1. Escolha o tipo de OS</p>
                    <button className={styles.backButton} onClick={handleNavigateHome} >
                        <img className={styles.goBack} src="/public/volte.png" alt="botão de voltar" />
                    </button>
                    <section className={styles.buttonContainer}>
                        <button className={styles.botaoFunc} onClick={handleNavigateFuncionario}>
                            <img className={styles.img} src="/public/funcionarios.png" alt="botão de funcionario" />
                        </button>
                        <button className={styles.botaoClient} onClick={handleNavigateCliente}>
                            <img className={styles.img} src="/public/cliente.png" alt="botão de cliente" />
                        </button>
                        <div className={styles.textWrapper2}>Cliente</div>
                        <div className={styles.textWrapper3}>Funcionário</div>
                    </section>
                </div>
                <div className={styles.designPage} />
            </div>
        </div>
    );
};

export default SelectTypeOS;
