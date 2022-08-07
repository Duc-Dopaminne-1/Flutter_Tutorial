import React, {useContext} from 'react';

import {
  useSearchPropertyPostsCoordinatesLazyQuery,
  useSearchPropertyPostsForRentLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {CONSTANTS, ITEM_MAP_TYPE, POST_TYPE} from '../../../assets/constants';
import SearchDataUtils from '../../../utils/SearchDataUtils';
import {SEARCH_TYPE} from './MapComponents/MapHelpers';
import PopupMapItem from './MapComponents/PopupMapItem';
import SearchMapBaseScreen from './SearchMapBaseScreen';

const mappingSearchCriteria = (searchCriteria, masterData) => {
  const additionalCriteria = {
    propertyPostApprovalStatusJson: SearchDataUtils.getApprovalIds(masterData, false),
  };
  const searchFilter = SearchDataUtils.mappingSearchCriteria(
    {...searchCriteria, ...additionalCriteria},
    null,
    searchCriteria.propertyPostOrderBy,
    CONSTANTS.DEFAULT_SEARCH_MAP_PAGE_SIZE,
  );
  return searchFilter;
};

const SearchMapPropertyPostScreen = ({searchCriteria, ...otherMapProps}) => {
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const isOnRentalTab = otherMapProps.selectedTab === POST_TYPE.RENTAL;

  const graphqlQueryOptions = {
    func: isOnRentalTab
      ? useSearchPropertyPostsForRentLazyQuery
      : useSearchPropertyPostsCoordinatesLazyQuery,
    dataField: isOnRentalTab ? 'searchPropertyPostsForRent' : 'searchPropertyPosts',
    nameInfoDto: isOnRentalTab ? 'propertyPostForRentInfoDtos' : 'propertyPostInfoDtos',
  };

  const renderPopupItem = data => {
    return <PopupMapItem currentData={data} type={ITEM_MAP_TYPE.propertyPost} />;
  };

  return (
    <SearchMapBaseScreen
      searchType={SEARCH_TYPE.PROPERTY_POSTS}
      graphqlApiLazy={graphqlQueryOptions.func}
      dataField={graphqlQueryOptions.dataField}
      searchCriteria={searchCriteria}
      mappingSearchCriteria={criteria => mappingSearchCriteria(criteria, masterData)}
      nameInfoDto={graphqlQueryOptions.nameInfoDto}
      renderPopupItem={renderPopupItem}
      isOnRentalTab={isOnRentalTab}
      {...otherMapProps}
    />
  );
};

export default SearchMapPropertyPostScreen;
