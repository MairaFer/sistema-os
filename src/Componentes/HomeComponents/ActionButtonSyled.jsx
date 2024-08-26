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
  transition: background-color 0.s ease;
  min-width: 150px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 0.5rem;
  }
`;
