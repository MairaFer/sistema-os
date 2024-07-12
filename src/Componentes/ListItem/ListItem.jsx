import React from 'react';
import { ListItemContainer, ItemInfo } from './ListItemStyled';

const ListItem = ({ item }) => {
  return (
    <ListItemContainer>
      <ItemInfo>{item.name}</ItemInfo>
      <ItemInfo>{item.identifier}</ItemInfo>
    </ListItemContainer>
  );
};

export default ListItem;
