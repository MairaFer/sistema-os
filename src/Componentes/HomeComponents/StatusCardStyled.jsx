import styled from 'styled-components';

export const Card = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
`;

export const CardIcon = styled.div`
  font-size: 3rem;
  margin-right: 1.5rem;
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CardCount = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
`;
