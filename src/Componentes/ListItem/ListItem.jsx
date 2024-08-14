import React from 'react';
import { ListItemContainer, ItemInfo, ThreeDotsButton, ListItemWrapper, IdentifierBox } from './ListItemStyled';
import { FiMoreVertical } from 'react-icons/fi';

const ListItem = ({ item }) => {
  return (
    <ListItemWrapper>
      <ListItemContainer>
        <ItemInfo>{item.name}</ItemInfo>
        <IdentifierBox>{item.identifier}</IdentifierBox> {/* Destaca o identifier */}
      </ListItemContainer>
      <ThreeDotsButton>
        <FiMoreVertical />
      </ThreeDotsButton>
    </ListItemWrapper>
  );
};

export default ListItem;
