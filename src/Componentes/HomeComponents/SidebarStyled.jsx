import styled from 'styled-components';

export const SidebarContainer = styled.div`
  height: 100vh;
  width: ${props => (props.isExpanded ? '250px' : '70px')};
  position: fixed;
  background-color: #213356;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  font-family: 'Lexend', sans-serif;
  transition: width 0.7s;
  z-index: 1001;
  overflow: hidden;
`;

export const SidebarLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 14px;
`;

export const SidebarMenu = styled.ul`
  list-style-type: none;
  padding: 1rem 0.18rem 0 0;
  margin: auto 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SidebarMenuItem = styled.li`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => (props.isExpanded ? '5px' : '7px')};
  width: 100%;
  box-sizing: border-box;
  &.active {
    background-color: #34495e;
    border-radius: 4px;
    padding: 10px 20px;
  }
  &:hover {
    background-color: #34495e;
    border-radius: 4px;
    padding: 10px 20px;
    transition: background-color 0.7s;
  }
`;

export const SidebarLink = styled.a`
  color: ${props => (props.red ? '#e74c3c' : 'white')};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 400;
  &:hover {
    text-decoration: none;
  }
`;

export const Icon = styled.span`
  margin-right: ${props => (props.isExpanded ? '20px' : '0')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  color: ${props => (props.red ? '#e74c3c' : 'white')};
`;

export const SidebarFooter = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SidebarFooterItem = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    background-color: #34495e;
    border-radius: 4px;
    padding: 10px 20px;
    transition: background-color 0.7s;
  }
`;

export const Divider = styled.div`
  height: 0.5px;
  background-color: #ecf0f1;
  margin: 10px 0;
`;
