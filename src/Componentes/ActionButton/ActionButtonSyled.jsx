import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: #0066ff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.5rem;
  margin: 0.5rem;

  &:hover {
    background-color: #0056cc;
  }
`;
