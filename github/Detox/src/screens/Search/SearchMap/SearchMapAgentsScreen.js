import {useNavigation} from '@react-navigation/native';
import React from 'react';

import {useSearchAgentsCoordinatesLazyQuery} from '../../../api/graphql/generated/graphql';
import SearchDataUtils from '../../../utils/SearchDataUtils';
import ScreenIds from '../../ScreenIds';
import {SEARCH_TYPE, searchMapStyles} from './MapComponents/MapHelpers';
import PopupAgentItem from './MapComponents/PopupAgentItem';
import SearchMapBaseScreen from './SearchMapBaseScreen';

const mappingSearchCriteria = searchCriteria => {
  return SearchDataUtils.mappingSearchAgent(searchCriteria);
};

const SearchMapAgentsScreen = ({searchCriteria, ...otherMapProps}) => {
  const navigation = useNavigation();

  const onPressAgentPopup = item => {
    navigation.navigate(ScreenIds.AgentManagement, {
      agentId: item.agentId ?? '',
    });
  };

  const renderAgentPopup = item => {
    return (
      <PopupAgentItem
        style={searchMapStyles.popupItem}
        agentId={item.agentId}
        onPress={() => onPressAgentPopup(item)}
      />
    );
  };

  return (
    <SearchMapBaseScreen
      searchType={SEARCH_TYPE.AGENTS}
      graphqlApiLazy={useSearchAgentsCoordinatesLazyQuery}
      dataField={'searchAgents'}
      searchCriteria={searchCriteria}
      mappingSearchCriteria={mappingSearchCriteria}
      nameInfoDto={'agentInfoDtos'}
      renderPopupItem={item => renderAgentPopup(item)}
      {...otherMapProps}
    />
  );
};

export default SearchMapAgentsScreen;
