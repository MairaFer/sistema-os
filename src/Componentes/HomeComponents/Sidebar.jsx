import React, { useState } from 'react';
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
  SidebarLogoContainer, // Novo componente para a logo
} from '../../Componentes/HomeComponents/SidebarStyled';
import { FaUser, FaUsers, FaTools, FaCog, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import StyleSidebar from './Sidebar.module.css';

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => (location.pathname === path && path !== '/home' ? 'active' : '');

  return (
    <SidebarContainer
      isExpanded={isExpanded}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarLogoContainer isExpanded={isExpanded}>
        <SidebarLink as={Link} to="/home" title="Tela Inicial">
          <Icon isExpanded={isExpanded}>
            <img className={StyleSidebar.img} src="/Ativo 2.svg" alt="Logo Cyberos" />
          </Icon>
          {isExpanded && 'Tela Inicial'}
        </SidebarLink>
      </SidebarLogoContainer>

      <SidebarMenu>
        <SidebarMenuItem className={isActive('/clientes')} isExpanded={isExpanded}>
          <SidebarLink as={Link} to="/clientes" title="Clientes">
            <Icon isExpanded={isExpanded}>
              <FaUser />
            </Icon>
            {isExpanded && 'Clientes'}
          </SidebarLink>
        </SidebarMenuItem>
        <SidebarMenuItem className={isActive('/funcionarios')} isExpanded={isExpanded}>
          <SidebarLink as={Link} to="/funcionarios" title="Funcionários">
            <Icon isExpanded={isExpanded}>
              <FaUsers />
            </Icon>
            {isExpanded && 'Funcionários'}
          </SidebarLink>
        </SidebarMenuItem>
        <SidebarMenuItem className={isActive('/servicos')} isExpanded={isExpanded}>
          <SidebarLink as={Link} to="/servicos" title="Serviços">
            <Icon isExpanded={isExpanded}>
              <FaTools />
            </Icon>
            {isExpanded && 'Serviços'}
          </SidebarLink>
        </SidebarMenuItem>
        <SidebarMenuItem className={isActive('/relatorios')} isExpanded={isExpanded}>
          <SidebarLink as={Link} to="/relatorios" title="Relatórios">
            <Icon isExpanded={isExpanded}>
              <FaChartLine />
            </Icon>
            {isExpanded && 'Relatórios'}
          </SidebarLink>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarFooter>
        <Divider />
        <SidebarFooterItem isExpanded={isExpanded}>
          <SidebarLink as={Link} to="/settings" title="Configurações">
            <Icon isExpanded={isExpanded}>
              <FaCog />
            </Icon>
            {isExpanded && 'Configurações'}
          </SidebarLink>
        </SidebarFooterItem>
        <SidebarFooterItem isExpanded={isExpanded}>
          <SidebarLink as={Link} to="#" title="Sair" red onClick={handleLogout}>
            <Icon isExpanded={isExpanded} red>
              <FaSignOutAlt />
            </Icon>
            {isExpanded && 'Sair'}
          </SidebarLink>
        </SidebarFooterItem>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;
