import styled from 'styled-components';

export const BannerContainer = styled.section`

`;

export const BannerContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #f4f4f4;
  width: 100%;
  max-width: 250px;
  border: none;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
  cursor: pointer;

  svg {
    vertical-align: middle;
  }
`;
