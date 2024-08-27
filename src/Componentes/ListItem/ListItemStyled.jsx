import styled from 'styled-components';

export const ListItemWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const ListItemContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 7px;
  background-color: #f9f9f9;
`;

export const ItemInfo = styled.div`
  font-size: 1.1em;
  color: #333;
  padding-left: 20px; 
`;

export const IdentifierBox = styled.div`
  font-size: 1.1em;
  color: #fff;
  background-color: #EF5E22; 
  padding: 10px 100px;
  border-radius: 7px;
`;

export const ThreeDotsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
  color: #fff;
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%); /* Centraliza verticalmente */

  &:hover {
    color: #666;
  }
`;
