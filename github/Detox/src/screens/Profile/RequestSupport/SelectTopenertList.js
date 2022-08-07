import isEmpty from 'lodash/isEmpty';
import React from 'react';

import {SIZES} from '../../../assets/constants/sizes';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import JsonDataUtils from '../../../utils/JsonDataUtils';
import TopenerItem from './Components/TopenerItem';

export const initFilterTopener = {
  keyword: null,
  workingAreasJson: {
    cityId: null,
    districtId: [],
  },
};

const mapAddressToRequestString = filterState => {
  const {cityId, districtId} = filterState?.workingAreasJson;
  const request = JsonDataUtils.deleteEmptyDataFiled({
    workingAreasJson: cityId
      ? JSON.stringify([
          {
            CityId: cityId,
            DistrictIds: !isEmpty(districtId) ? districtId?.map(item => item.id) : [],
          },
        ])
      : null,
    keyword: isEmpty(filterState.keyword) ? null : filterState.keyword,
  });
  return request;
};

const SelectTopenerList = ({
  dataKey,
  onPressItem,
  currentTopenerId = null,
  consultantSelected,
  supportServiceId,
  propertyPostId,
  filterState,
  query,
}) => {
  const request =
    dataKey === 'getTopenersRecentlySupportTicket'
      ? {
          currentTopenerId: currentTopenerId,
        }
      : {
          topenerServiceTypeJson: supportServiceId ? JSON.stringify([supportServiceId]) : null,
          currentTopenerId: JSON.stringify(currentTopenerId),
          propertyPostId: propertyPostId,
          ...mapAddressToRequestString(filterState),
        };
  const queryParams = {
    page: 1,
    pageSize: 8,
    request: request,
  };

  const renderItem = (item, onPress) => {
    const isSelected = item.topenerId === consultantSelected.topenerId ? true : false;
    return <TopenerItem item={item} onPress={onPress} isSelected={isSelected} />;
  };

  const onPress = item => {
    onPressItem(item);
  };

  return (
    <LazyList
      separatorHeight={SIZES.MARGIN_8}
      renderItem={({item}) => renderItem(item, onPress)}
      extractArray={response => response?.[dataKey]?.edges || []}
      useQuery={query}
      queryOptions={{variables: {...queryParams}}}
      pagingType={PAGING_TYPE.OFFSET_VARIABLES}
    />
  );
};

export default SelectTopenerList;
