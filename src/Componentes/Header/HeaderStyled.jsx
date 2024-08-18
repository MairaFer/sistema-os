import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background-color: #213356;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
width: calc(100% - ${props => (props.isExpanded ? '250px' : '80px')}); /* Ajustar a largura da header */
  top: 0;
  left: ${props => (props.isExpanded ? '250px' : '80px')}; /* Ajustar a posição da header */
  z-index: 1000;
  transition: width 0.3s, left 0.3s;
`;

export const Logo = styled.img`
  width: 120px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #202D3A;
  border-radius: 10px;
  padding: 0px;
`;

export const SearchIcon = styled.div`
  padding: 8px;
  color: #a0a0a0;
`;

export const SearchBar = styled.input`
  width: 150px;
  padding: 10px;
  border: none;
  background-color: transparent;
  color: white;
  font-size: 14px;
  border-radius: 5px; 
  ::placeholder {
    color: #a0a0a0;
    font-size: 0.9em;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const UserName = styled.div`
  margin-right: 15px;
  font-weight: 400;
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

export const IconButton = styled.div`
  margin: 0 10px;
  font-size: 18px;
  color: white;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  
  &:hover {
    color: #3498db;
  }
`;
