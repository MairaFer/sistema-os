import { useCallback } from 'react';
import styles from './CRIAODEOS.module.css';


const CRIAODEOS = () => {
  	
  	const onConfirmBoxContainerClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
    		<div className={styles.criaoDeOs2}>
      			<div className={styles.barraPage}>
        				<div className={styles.barraPageChild} />
      			</div>
      			<div className={styles.designPage}>
        				<div className={styles.designPageChild} />
      			</div>
      			<div className={styles.confirmBox} onClick={onConfirmBoxContainerClick}>
        				<div className={styles.confirmBoxChild} />
        				<img className={styles.sortRightIcon} alt="Botão de Confirmar" src="Sort Right.png" />
      			</div>
      			<div className={styles.criandoOs}>Criando OS</div>
      			<div className={styles.adicioneUmCliente}>Adicione um Cliente</div>
      			<div className={styles.dropdown}>
        				<div className={styles.box} />
        				<div className={styles.nomedocliente}>
          					<div className={styles.nomedoclienteChild} />
          					<div className={styles.cliente}>Cliente</div>
        				</div>
        				<img className={styles.expandArrowIcon} alt="" src="Expand Arrow.png" />
      			</div>
      			<div className={styles.selecionarClienteExistente}>Selecionar Cliente Existente</div>
      			<div className={styles.containerNovoCliente}>
        				<div className={styles.box1} />
        				<div className={styles.contatoinserir}>
          					<div className={styles.nomedoclienteChild} />
          					<div className={styles.cliente}>contato</div>
        				</div>
        				<div className={styles.nomedoclienteinserir}>
          					<div className={styles.nomedoclienteChild} />
          					<div className={styles.cliente}>nome do cliente*</div>
        				</div>
        				<div className={styles.endereoinserir}>
          					<div className={styles.nomedoclienteChild} />
          					<div className={styles.endereo}>endereço</div>
        				</div>
        				<div className={styles.cpfinserir}>
          					<div className={styles.nomedoclienteChild} />
          					<div className={styles.cpfOuCnpj}>cpf ou cnpj*</div>
        				</div>
      			</div>
      			<div className={styles.ouCriarNovo}>Ou Criar novo cliente</div>
      			<div className={styles.backButton} onClick={onConfirmBoxContainerClick}>
        				<div className={styles.backButtonChild} />
        				<img className={styles.goBackIcon} alt="" src="Go Back.png" />
      			</div>
    		</div>);
};

export default CRIAODEOS;
