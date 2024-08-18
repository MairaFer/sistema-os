import React from 'react';
import '../../Componentes/LoadingPage/Loading.css'; // Certifique-se de criar um arquivo CSS para os estilos

const Loading = () => {
  return (
    <div className="loading-overlay">
      <img className="loading-logo" src="./public/Ativo 2.svg" alt="CyberOS Logo" />
    </div>
  );
};

export default Loading;
