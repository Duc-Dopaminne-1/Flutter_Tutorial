import React from 'react';

import {useSearchProjectsCoordinatesLazyQuery} from '../../../api/graphql/generated/graphql';
import {CONSTANTS} from '../../../assets/constants';
import SearchDataUtils from '../../../utils/SearchDataUtils';
import {SEARCH_TYPE} from './MapComponents/MapHelpers';
import PopupMapItem from './MapComponents/PopupMapItem';
import SearchMapBaseScreen from './SearchMapBaseScreen';

const mappingSearchCriteria = searchCriteria => {
  const searchFilter = SearchDataUtils.mappingSearchProjects(
    searchCriteria,
    null,
    searchCriteria?.projectOrderBy,
    null,
    CONSTANTS.DEFAULT_SEARCH_MAP_PAGE_SIZE,
  );
  return searchFilter;
};

const SearchMapProjectsScreen = ({searchCriteria, ...otherMapProps}) => {
  const renderPopupItem = data => {
    return <PopupMapItem currentData={data} />;
  };

  return (
    <SearchMapBaseScreen
      searchType={SEARCH_TYPE.PROJECTS}
      graphqlApiLazy={useSearchProjectsCoordinatesLazyQuery}
      dataField={'searchProjects'}
      searchCriteria={searchCriteria}
      mappingSearchCriteria={mappingSearchCriteria}
      nameInfoDto={'projectInfoDtos'}
      renderPopupItem={renderPopupItem}
      {...otherMapProps}
    />
  );
};

export default SearchMapProjectsScreen;
