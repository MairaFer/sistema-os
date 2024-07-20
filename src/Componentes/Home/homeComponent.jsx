import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './home.module.css';
import '../Footer/Footer';
import Loading from '../../pages/Loading/Loading';

const Home = () => {
  return (
    <div className={styles.telaInicial}>
      <div className={styles.overlapWrapper}>
        <div className={styles.overlap}>
          <div className={styles.barraPage}>
            <div className={styles.rectangle}></div>
            <div className={styles.div}></div>
          </div>
          <assets className={styles.nav} src="../../assets/nav.png" alt="Navigation" />
          <div className={styles.botoCriarOs}>
            <div className={styles.overlapGroup}>
              <div className={styles.textWrapper}>Criar OS</div>
              <assets className={styles.createOrder} src="../../assets/criar-ordem.png" alt="Create Order" />
            </div>
          </div>
          <div className={styles.botoGerenciarOs}>
            <div className={styles.overlap2}>
              <div className={styles.button}></div>
              <div className={styles.textWrapper2}>Gerenciar OS’s</div>
              <assets className={styles.editProperty} src="../../assets/editar.png" alt="Edit Property" />
            </div>
          </div>
          <div className={styles.dashboard}>
            <div className={styles.osAtivasIconFrame}>
              <div className={styles.overlapGroup2}>
                <div className={styles.rectangle2}></div>
                <div className={styles.rectangle3}></div>
                <div className={styles.textWrapper3}>OS’S Ativas</div>
                <assets className={styles.process} src="../../public/google.png" alt="Process" />
                <div className={styles.textWrapper4}>10</div>
              </div>
            </div>
            <div className={styles.osAtrasoFrame}>
              <div className={styles.overlap3}>
                <div className={styles.expiredWrapper}>
                  <assets className={styles.expired} src="../../assets/atraso.png" alt="Expired" />
                </div>
                <div className={styles.overlapGroup3}>
                  <div className={styles.textWrapper5}>OS’s Em Atraso</div>
                  <div className={styles.textWrapper6}>2</div>
                </div>
              </div>
            </div>
            <div className={styles.osEsperaFrame}>
              <div className={styles.overlap4}>
                <div className={styles.sandTimerWrapper}>
                  <assets className={styles.sandTimer} src="../../assets/em-espera.png" alt="Sand Timer" />
                </div>
                <div className={styles.overlap5}>
                  <div className={styles.textWrapper7}>OS’S Em Espera</div>
                  <div className={styles.textWrapper6}>32</div>
                </div>
              </div>
            </div>
            <div className={styles.osFinalizadaFrame}>
              <div className={styles.overlap6}>
                <div className={styles.orderCompletedWrapper}>
                  <assets className={styles.orderCompleted} src="../../assets/finalizada.png" alt="Order Completed" />
                </div>
                <div className={styles.overlap7}>
                  <div className={styles.textWrapper8}>OS’S Finalizadas</div>
                  <div className={styles.textWrapper9}>129</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.textWrapper10}>Olá, Usuário</div>
          <div className={styles.textWrapper11}>OS’S Recentes</div>
          <div className={styles.rectangle4}></div>
          <div className={styles.os}>
            <div className={styles.overlap8}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper12}>REPARO DE MÁQUINA</div>
              </div>
              <div className={styles.textWrapper13}>OS-163</div>
              <div className={styles.textWrapper14}>Em Aberto</div>
              <div className={styles.textWrapper15}>Osmar Panificadora</div>
              <div className={styles.textWrapper16}>01/06/2024</div>
            </div>
          </div>
          <div className={styles.textWrapper17}>Nome</div>
          <div className={styles.textWrapper18}>Status</div>
          <div className={styles.textWrapper19}>Data</div>
          <div className={styles.textWrapper20}>Cliente</div>
          <div className={styles.textWrapper21}>OSkey</div>
        </div>
      </div>
    </div>
  );
};

export default Home;

