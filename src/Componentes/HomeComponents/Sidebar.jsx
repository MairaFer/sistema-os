import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarContainer,
  SidebarMenu,
  SidebarMenuItem,
  SidebarLink,
  Icon,
  SidebarFooter,
  SidebarFooterItem,
  Divider,
  ToggleButton,
  ToggleIcon
} from '../../Componentes/HomeComponents/SidebarStyled';
import { FaHome, FaUser, FaUsers, FaTools, FaCog, FaSignOutAlt, FaBars, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../context/authContext'; // Importar o AuthContext
import StyleSidebar from './Sidebar.module.css'

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation(); // Usar useLocation para obter a URL atual
  const { logout } = useAuth(); // Obter o método de logout do AuthContext

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    logout(); // Chamar o método de logout
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <SidebarContainer isExpanded={isExpanded}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ToggleButton onClick={toggleSidebar}> <FaBars /></ToggleButton>
      </div>
      <div>
        <SidebarMenu>
          <SidebarMenuItem className={isActive('/home')} isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/home" title="Tela Inicial">
              <Icon isExpanded={isExpanded}><img className={StyleSidebar.img} src="/Ativo 2.svg" alt="Logo Cyberos" /></Icon>
              {isExpanded && 'Tela Inicial'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem className={isActive('/clientes')} isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/clientes" title="Clientes">
              <Icon isExpanded={isExpanded}><FaUser /></Icon>
              {isExpanded && 'Clientes'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem className={isActive('/funcionarios')} isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/funcionarios" title="Funcionários">
              <Icon isExpanded={isExpanded}><FaUsers /></Icon>
              {isExpanded && 'Funcionários'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem className={isActive('/servicos')} isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/servicos" title="Serviços">
              <Icon isExpanded={isExpanded}><FaTools /></Icon>
              {isExpanded && 'Serviços'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem className={isActive('/relatorios')} isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/relatorios" title="Relatórios">
              <Icon isExpanded={isExpanded}><FaChartLine /></Icon>
              {isExpanded && 'Relatórios'}
            </SidebarLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
      <SidebarFooter>
        <Divider />
        <SidebarFooterItem isExpanded={isExpanded}>
          <SidebarLink as={Link} to="/settings" title="Configurações">
            <Icon isExpanded={isExpanded}><FaCog /></Icon>
            {isExpanded && 'Configurações'}
          </SidebarLink>
        </SidebarFooterItem>
        <SidebarFooterItem isExpanded={isExpanded}>
          <SidebarLink href='' title="Sair" red onClick={handleLogout}>
            <Icon isExpanded={isExpanded} red><FaSignOutAlt /></Icon>
            {isExpanded && 'Sair'}
          </SidebarLink>
        </SidebarFooterItem>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;
