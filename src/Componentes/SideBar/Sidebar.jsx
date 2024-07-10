import logo from "../../imagens/LOGO.svg";
import React, { useState } from 'react';
import {
  SidebarContainer,
  SidebarMenu,
  SidebarMenuItem,
  SidebarLink,
  LogoContainer,
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
      <ToggleButton onClick={toggleSidebar}>
        <ToggleIcon><FaBars /></ToggleIcon>
      </ToggleButton>
      <div>
        {isExpanded && (
          <LogoContainer>
            <img src={logo} alt="Logo da Empresa" />
          </LogoContainer>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarLink href="#home" title="Tela Inicial">
              <Icon><FaHome /></Icon>
              {isExpanded && 'Tela Inicial'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLink href="#customers" title="Clientes">
              <Icon><FaUser /></Icon>
              {isExpanded && 'Clientes'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLink href="#employees" title="Funcionários">
              <Icon><FaUsers /></Icon>
              {isExpanded && 'Funcionários'}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLink href="#services" title="Serviços">
              <Icon><FaTools /></Icon>
              {isExpanded && 'Serviços'}
            </SidebarLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
      <SidebarFooter>
        <Divider />
        <SidebarFooterItem>
          <SidebarLink href="#settings" title="Configurações">
            <Icon><FaCog /></Icon>
            {isExpanded && 'Configurações'}
          </SidebarLink>
        </SidebarFooterItem>
        <SidebarFooterItem>
          <SidebarLink href="#logout" title="Sair" red>
            <Icon red><FaSignOutAlt /></Icon>
            {isExpanded && 'Sair'}
          </SidebarLink>
        </SidebarFooterItem>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;


