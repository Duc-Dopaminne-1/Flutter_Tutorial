import PropTypes from 'prop-types';
import React from 'react';

import {useGetShortAgentByIdLazyQuery} from '../../../../api/graphql/generated/graphql';
import AgentItem from '../../../../components/AgentItem';
import {mapAgentItemsUi} from '../../../../components/AgentItem/types';
import PopupSearchItem from './PopupSearchItem';

const renderAgentItem = ({data, onPress}) => {
  if (!data) {
    return null;
  }
  const item = mapAgentItemsUi(data);
  return <AgentItem agentInfo={item.agentInfo} onPress={() => onPress(item)} />;
};

const PopupAgentItem = ({style, agentId, onPress}) => {
  return (
    <PopupSearchItem
      style={style}
      queryGraphql={useGetShortAgentByIdLazyQuery}
      variables={{agentId}}
      fieldData="agentByIdForPublic"
      renderItem={data => renderAgentItem({data, onPress})}
    />
  );
};

PopupAgentItem.propTypes = {
  agentId: PropTypes.string,
  onPressTitleImage: PropTypes.func,
};

PopupAgentItem.defaultProps = {
  agentId: '',
  onPressTitleImage: () => {},
};

export default PopupAgentItem;
