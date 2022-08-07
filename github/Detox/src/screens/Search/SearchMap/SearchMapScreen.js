import React, {useContext, useEffect, useState} from 'react';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {POST_TYPE} from '../../../assets/constants';
import SearchDataUtils from '../../../utils/SearchDataUtils';
import {useMount} from '../../commonHooks';
import {useSearchFilterAgent} from '../SearchFilterAgentScreen';
import SearchMapAgentsScreen from './SearchMapAgentsScreen';
import SearchMapProjectsScreen from './SearchMapProjectsScreen';
import SearchMapPropertyPostScreen from './SearchMapPropertyPostScreen';
import {SearchMapScreenParams} from './SearchMapScreenParams';

type Props = {
  route: {
    params: SearchMapScreenParams,
  },
};

const SearchMapScreen = ({route}: Props) => {
  const type = route.params?.type ?? POST_TYPE.B2C;
  const [tabType, setTabType] = useState(type);
  const [filterCriteria, setFilterCriteria] = useState(route.params.searchCriteria);
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const searchFilterAgentHook = useSearchFilterAgent(masterData);

  useEffect(() => {
    const searchCriteria = route.params?.searchCriteria;
    if (searchCriteria) {
      setFilterCriteria(searchCriteria);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.searchCriteria]);

  useMount(() => {
    if (tabType === POST_TYPE.AGENT) {
      searchFilterAgentHook.getAllAgentGroups();
    }
  });

  const onChangeKeyword = text => {
    setFilterCriteria({...filterCriteria, keyword: text});
  };

  const onGetNewFilter = newCriteria => {
    setFilterCriteria({...filterCriteria, ...newCriteria});
  };

  const onPressTabType = newType => {
    setTabType(newType);
    setFilterCriteria(SearchDataUtils.initialCriteriaState({}, masterData));
  };

  const mapProps = {
    searchCriteria: filterCriteria,
    onGetNewFilter: onGetNewFilter,
    onChangeKeyword: onChangeKeyword,
    onPressTabType: onPressTabType,
    selectedTab: tabType,
    items: route.params.items,
  };

  if (tabType === POST_TYPE.AGENT) {
    return <SearchMapAgentsScreen {...mapProps} searchFilterAgentHook={searchFilterAgentHook} />;
  }

  return tabType === POST_TYPE.B2C ? (
    <SearchMapProjectsScreen {...mapProps} />
  ) : (
    <SearchMapPropertyPostScreen {...mapProps} />
  );
};

export default SearchMapScreen;
