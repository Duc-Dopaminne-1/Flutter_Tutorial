import React from 'react';

import ScreenIds from '../../ScreenIds';
import MemberItem from './MemberItem';

const renderMemberItem = (item, navigation, needShowSeparator) => {
  const onPressItem = itemInfo => {
    navigation.navigate(ScreenIds.AgentManagement, {agentId: itemInfo.agentId});
  };
  return (
    <MemberItem item={item.item} onPress={onPressItem} needShowSeparator={needShowSeparator} />
  );
};

export {renderMemberItem};
