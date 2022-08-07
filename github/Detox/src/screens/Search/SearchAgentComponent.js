import {useNavigation} from '@react-navigation/native';
import React from 'react';

import {useSearchAgentsLazyQuery} from '../../api/graphql/generated/graphql';
import AgentItem, {ItemHeight} from '../../components/AgentItem';
import {mapAgentItemsUi} from '../../components/AgentItem/types';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import SearchDataUtils from '../../utils/SearchDataUtils';
import ScreenIds from '../ScreenIds';

const START_PAGE = 1;

const SearchAgentComponent = ({state, setState}) => {
  const navigation = useNavigation();
  const querySetting = {
    queryParams: {
      input: SearchDataUtils.mappingSearchAgent(state.searchCriteria, START_PAGE),
    },
    useQuery: useSearchAgentsLazyQuery,
    responseDataKey: 'searchAgents',
    responseDataArrayKey: 'agentInfoDtos',
  };
  const mapToUiModel = item => {
    return mapAgentItemsUi(item) ?? {};
  };

  const onDataChange = ({totalCount, items}) => {
    setState({
      ...state,
      c2cPostsCount: totalCount ?? 0,
      items: items.map(value => value.agentInfo),
    });
  };

  const onPressAgentDetail = id => {
    navigation.navigate(ScreenIds.AgentManagement, {
      agentId: id ?? '',
    });
  };

  return (
    <LazyList
      renderItem={({item}) => {
        return <AgentItem onPress={onPressAgentDetail} agentInfo={item.agentInfo} />;
      }}
      useQuery={querySetting.useQuery}
      queryOptions={{
        variables: {
          ...querySetting.queryParams,
        },
      }}
      mapToUiModel={mapToUiModel}
      itemHeight={ItemHeight}
      uniqueKey={'agentId'}
      extractArray={response => response?.searchAgents?.agentInfoDtos ?? []}
      extractTotalCount={response => response?.searchAgents?.totalCount ?? 0}
      onDataChange={onDataChange}
      pagingType={PAGING_TYPE.OFFSET}
    />
  );
};

export default SearchAgentComponent;
