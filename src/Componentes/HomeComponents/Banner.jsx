import React from 'react';
import { BannerContainer, BannerContent, ButtonContainer, Button } from './BannerStyled';
import { FaPlus, FaCog } from 'react-icons/fa';

const Banner = () => {
  return (
    <BannerContainer>
      <BannerContent>
        <ButtonContainer>
          <Button>
            <FaPlus size={20}/>
            Criar um Serviço
          </Button>
          <Button>
            <FaCog size={20}/>
            Gerenciar Serviços
          </Button>
        </ButtonContainer>
      </BannerContent>
    </BannerContainer>
  );
}

export default Banner;
