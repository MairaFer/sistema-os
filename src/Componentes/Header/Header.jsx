import React from 'react';
import logo from "../../imagens/LOGO.svg";
import avatar from "../../imagens/avatar.jpg";
import {
  HeaderContainer,
  Logo,
} from './HeaderStyled';


function Header() {
  return (
    <HeaderContainer>
      <Logo src={logo} alt="Logo CyberOS" />
    </HeaderContainer>
  );
}

export default Header;
