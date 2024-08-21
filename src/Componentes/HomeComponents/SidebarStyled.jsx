import styled from 'styled-components';
// SidebarContainer
export const SidebarContainer = styled.div`
  height: 100vh;
  width: ${props => (props.isExpanded ? '250px' : '80px')};
  position: fixed;
  top: 0;
  left: 0;
  background-color: #213356;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Mantém a separação entre o menu e o rodapé */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  font-family: 'Lexend', sans-serif;
  transition: width 0.3s;
  z-index: 1001;
  overflow: hidden;
`;

// Menu da Sidebar
export const SidebarMenu = styled.ul`
  list-style-type: none;
  padding: 1rem 0.18rem 0 0;
  margin: auto 0; /* Centraliza verticalmente */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza horizontalmente */
`;

// Item do Menu da Sidebar
export const SidebarMenuItem = styled.li`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* Garantir que o item ocupe a largura total disponível */
  box-sizing: border-box;
  &.active {
    background-color: #34495e; /* Cor para a tela ativa */
    border-radius: 4px; /* Adiciona bordas arredondadas */
    padding: 10px 20px; /* Padding uniforme */
  }
  &:hover {
    background-color: #34495e;
    border-radius: 4px; /* Adiciona bordas arredondadas */
    padding: 10px 20px; /* Padding uniforme */
    transition: background-color 0.3s;
  }
`;

// Link da Sidebar
export const SidebarLink = styled.a`
  color: ${props => (props.red ? '#e74c3c' : 'white')};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1.1rem; /* Aumenta o tamanho da fonte */
  font-weight: 400; /* Adiciona negrito ao texto */
  &:hover {
    text-decoration: none;
  }
`;

// Ícone da Sidebar
export const Icon = styled.span`
  margin-right: ${props => (props.isExpanded ? '20px' : '0')}; /* Aumenta o espaçamento para 20px */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; /* Aumenta o tamanho dos ícones */
  color: ${props => (props.red ? '#e74c3c' : 'white')};
`;

// Rodapé da Sidebar
export const SidebarFooter = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza itens no rodapé */
`;

// Item do Rodapé da Sidebar
export const SidebarFooterItem = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    background-color: #34495e;
    border-radius: 4px; /* Adiciona bordas arredondadas */
    padding: 10px 20px; /* Padding uniforme */
    transition: background-color 0.3s;
  }
`;

// Divisor do Rodapé da Sidebar
export const Divider = styled.div`
  height: 0.5px;
  background-color: #ecf0f1;
  margin: 10px 0;
`;
