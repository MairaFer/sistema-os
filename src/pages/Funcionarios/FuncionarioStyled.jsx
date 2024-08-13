import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin-top: 2rem; 
`;

export const HeaderContainer = styled.div`
  background-color: #213356;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center; 
`;

export const ContentContainer = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #485474;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem; 
  align-items: center; 
  position: relative; 
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem; 
`;

export const Title = styled.div`
  font-size: 1.2em;
  color: #ffffff;
  font-weight: bold;
  width: 50%;
  text-align: center; /* Centraliza o texto */
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;
