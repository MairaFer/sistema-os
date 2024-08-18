import styled from 'styled-components';

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
  justify-content: space-between;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  transition: width 0.3s;
  z-index: 1001;
  overflow: hidden;
`;

// Botão de Toggle
export const ToggleButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
  cursor: pointer;
`;

// Ícone do Botão de Toggle
export const ToggleIcon = styled.span`
  font-size: 24px;
`;

// Menu da Sidebar
export const SidebarMenu = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
`;

// Item do Menu da Sidebar
export const SidebarMenuItem = styled.li`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isExpanded ? 'flex-start' : 'center')};
  &.active {
    background-color: #34495e; /* Cor para a tela ativa */
  }
  &:hover {
    background-color: #34495e;
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
  font-size: 16px;
  &:hover {
    text-decoration: underline;
  }
`;

// Ícone da Sidebar
export const Icon = styled.span`
  margin-right: ${props => (props.isExpanded ? '20px' : '0')}; /* Aumenta o espaçamento para 20px */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${props => (props.red ? '#e74c3c' : 'white')};
`;

// Rodapé da Sidebar
export const SidebarFooter = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

// Item do Rodapé da Sidebar
export const SidebarFooterItem = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isExpanded ? 'flex-start' : 'center')};
  &:hover {
    background-color: #34495e;
    transition: background-color 0.3s;
  }
`;

// Divisor do Rodapé da Sidebar
export const Divider = styled.div`
  height: 0.5px;
  background-color: #ecf0f1;
  margin: 10px 0;
`;
