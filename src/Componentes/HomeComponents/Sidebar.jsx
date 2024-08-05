import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from './SidebarStyled';
import { FaHome, FaUser, FaUsers, FaTools, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SidebarContainer isExpanded={isExpanded}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ToggleButton onClick={toggleSidebar}>
          <ToggleIcon><FaBars /></ToggleIcon>
        </ToggleButton>
      
      </div>
      <div>
        <SidebarMenu>
          <SidebarMenuItem isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/home" title="Tela Inicial">
              <Icon isExpanded={isExpanded}><FaHome /></Icon>
              {isExpanded && 'Tela Inicial'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/clientes" title="Clientes">
              <Icon isExpanded={isExpanded}><FaUser /></Icon>
              {isExpanded && 'Clientes'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/funcionarios" title="Funcionários">
              <Icon isExpanded={isExpanded}><FaUsers /></Icon>
              {isExpanded && 'Funcionários'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem isExpanded={isExpanded}>
            <SidebarLink as={Link} to="/servicos" title="Serviços">
              <Icon isExpanded={isExpanded}><FaTools /></Icon>
              {isExpanded && 'Serviços'}
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
          <SidebarLink href="#logout" title="Sair" red>
            <Icon isExpanded={isExpanded} red><FaSignOutAlt /></Icon>
            {isExpanded && 'Sair'}
          </SidebarLink>
        </SidebarFooterItem>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;
