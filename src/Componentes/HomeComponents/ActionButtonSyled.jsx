import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 150px;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 0.5rem;
  }
`;
