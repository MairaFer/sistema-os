import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: #252630;
  color: white;
  padding: 40px 20px;
  text-align: center;
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

export const FooterSection = styled.div`
  margin: 20px 0;

  p {
    font-size: 0.9em;
    line-height: 1.6;
  }
`;

export const FooterTitle = styled.h4`
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: bold;
`;

export const FooterLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  margin-bottom: 10px;
  display: block;

  &:hover {
    text-decoration: underline;
    color: #007BFF;
  }
`;
