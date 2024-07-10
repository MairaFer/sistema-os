import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterSection,
  FooterLink,
  FooterTitle
} from './FooterStyled';

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Sobre Nós</FooterTitle>
          <p>Informações sobre a empresa e sua missão.</p>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Contato</FooterTitle>
          <FooterLink href="#contact">Fale Conosco</FooterLink>
          <FooterLink href="#support">Suporte</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Siga-nos</FooterTitle>
          <FooterLink href="#facebook">Facebook</FooterLink>
          <FooterLink href="#twitter">Twitter</FooterLink>
          <FooterLink href="#instagram">Instagram</FooterLink>
        </FooterSection>
      </FooterContent>
      <p>&copy; 2024 Nome da Empresa. Todos os direitos reservados.</p>
    </FooterContainer>
  );
}

export default Footer;
