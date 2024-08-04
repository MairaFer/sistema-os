import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: #0056b3;
  }
`;
