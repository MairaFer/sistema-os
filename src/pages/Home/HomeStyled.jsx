import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const MainContent = styled.main`
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
`;

export const GreetingContainer = styled.div`
  background-color: #213356;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Greeting = styled.h1`
  color: #ff6600;
  margin: 1rem 0;
  text-align: left;
`;

export const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin: 1rem 0;
  width: 100%;
`;

export const RecentOrdersContainer = styled.div`
  margin: 1rem 0;
  width: 100%;
`;
