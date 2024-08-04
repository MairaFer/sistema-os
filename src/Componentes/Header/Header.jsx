import React from 'react';
import logo from "../../imagens/LOGO.svg";
import avatar from "../../imagens/avatar.jpg";
import {
  HeaderContainer,
  Logo,
  SearchContainer,
  SearchBar,
  SearchIcon,
  UserInfo,
  UserName,
  UserAvatar,
  IconsContainer,
  IconButton
} from './HeaderStyled';
import { FaSearch, FaBell, FaEnvelope } from 'react-icons/fa';

function Header() {
  return (
    <HeaderContainer>
      <Logo src={logo} alt="Logo da Empresa" />
      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchBar type="text" placeholder="Pesquisar..." />
      </SearchContainer>
      <IconsContainer>
        <IconButton>
          <FaEnvelope />
        </IconButton>
        <IconButton>
          <FaBell />
        </IconButton>
      </IconsContainer>
      <UserInfo>
        <UserName>Nome do Usuário</UserName>
        <UserAvatar src= {avatar} alt="Avatar do Usuário" />
      </UserInfo>
    </HeaderContainer>
  );
}

export default Header;
