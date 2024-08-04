import React from 'react';
import { ListContainer } from './ItemListStyled';
import ListItem from '../ListItem/ListItem';

const ItemList = ({ items }) => {
  return (
    <ListContainer>
      {items.map((item, index) => (
        <ListItem key={index} item={item} />
      ))}
    </ListContainer>
  );
};

export default ItemList;
