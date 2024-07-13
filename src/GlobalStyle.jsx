import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #d4d9e1;
  }

  * {
    box-sizing: border-box;
  }

/* Estilo para navegadores WebKit (Chrome, Safari, etc.) */
::-webkit-scrollbar {
  width: 10px; /* largura da barra de rolagem */
}

::-webkit-scrollbar-track {
  background-color: transparent; /* torna o fundo da área da barra de rolagem transparente */
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* cor semi-transparente do botão da barra de rolagem */
  border-radius: 5px; /* borda arredondada do botão da barra de rolagem */
}

/* Estilo para outros navegadores */
/* Este estilo pode não funcionar em todos os navegadores */
scrollbar-width: thin; /* largura da barra de rolagem */
scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* cor semi-transparente do botão e fundo transparente da barra de rolagem */

`;

export default GlobalStyle;
