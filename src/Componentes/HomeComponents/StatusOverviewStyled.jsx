import styled from 'styled-components';

export const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f4;
  margin-top: 20px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

export const OverviewTitle = styled.h2`
  font-size: 1.2em;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
`;

export const CardContainer = styled.div`
  background: white;
  border: 2px solid; /* Certifique-se de que a propriedade borderColor está definida */
  border-radius: 10px;
  padding: 20px;
  width: 150px;
  text-align: center;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2em;
`;

export const CardCount = styled.p`
  margin: 0;
  font-size: 2em;
  font-weight: bold;
`;

export const CardIconContainer = styled.div`
  font-size: 2em;
  margin-bottom: 10px;
`;
