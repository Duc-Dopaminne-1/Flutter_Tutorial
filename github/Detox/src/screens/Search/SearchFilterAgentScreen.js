import React, {useEffect, useState} from 'react';

import {useGetTopenerServiceTypes} from '../../hooks/useGetTopenerServiceTypes';
import JsonDataUtils from '../../utils/JsonDataUtils';
import {useGetAgentGroups} from '../Profile/useGetAgentGroups';
import FilterAgentContainer from './components/FilterAgentContainer';

const getItemsData = masterData => {
  const listPropertyTypes = masterData?.propertyTypes?.edges ?? [];
  const propertyTypes = listPropertyTypes.map(item => ({
    id: item.propertyTypeId,
    name: item.propertyTypeName,
    description: item.propertyTypeDescription,
  }));

  const listAgentRankings = masterData?.agentRankings?.edges ?? [];
  const agentRankings = listAgentRankings.map(item => ({
    id: item.agentRankingId,
    name: item.agentRankingName,
    description: item.agentRankingDescription,
  }));

  return {
    propertyTypes,
    agentRankings,
  };
};

const getAgentGroups = groupList => {
  if (!groupList && !Array.isArray(groupList)) {
    return [];
  }
  return groupList.map(item => ({
    id: item.agentGroupId,
    name: item.agentGroupDescription,
    checked: false,
  }));
};

const getNewArrayOfTypesOrRankings = (item, value, list) => {
  let newList = list;
  if (value) {
    newList.push(item);
  } else {
    newList = newList.filter(oldItem => oldItem.id !== item.id);
  }
  return newList;
};

export const getStringifyJsonArray = listData => {
  if (!listData || listData.length === 0) {
    return null;
  }
  const listIds = listData.map(item => ({
    Id: item,
  }));
  return JsonDataUtils.stringifyJSONArray(listIds);
};

const resetAgentGroups = agentGroups => {
  return agentGroups.map(item => ({
    id: item.id,
    name: item.name,
    checked: false,
  }));
};

export const initialState = () => {
  return {
    place: {},
    propertyTypes: [],
    agentRankings: {},
    agentGroupIds: [],
    topenerServiceTypes: [],
    findNearest: false,
    geolocation: null,
    isResetCity: true,
  };
};

export const useSearchFilterAgent = masterData => {
  const {} = useGetTopenerServiceTypes(data => {
    setItemsData({...itemsData, topenerServiceTypes: data});
  });
  const [itemsData, setItemsData] = useState(getItemsData(masterData));
  const [state, setState] = useState(initialState());

  const onSuccessGetAgentGroups = agentGroupsData => {
    const groupList = agentGroupsData?.edges ?? [];
    const agentGroups = getAgentGroups(groupList);
    setItemsData({...itemsData, agentGroups});
  };
  const {getAllAgentGroups} = useGetAgentGroups({onSuccess: onSuccessGetAgentGroups});

  useEffect(() => {
    if (state.isResetCity) {
      setState({...state, isResetCity: false});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isResetCity]);

  const onSelectPropertyType = (item, value) => {
    const newPropertyTypes = getNewArrayOfTypesOrRankings(item, value, state.propertyTypes);
    setState({...state, propertyTypes: newPropertyTypes});
  };

  const onSelectTopenerServiceType = (item, value) => {
    const topenerServiceTypes = getNewArrayOfTypesOrRankings(
      item,
      value,
      state.topenerServiceTypes,
    );
    setState({...state, topenerServiceTypes});
  };

  const onSelectAgentRanking = (item, value) => {
    const newAgentRankings = getNewArrayOfTypesOrRankings(item, value, state.agentRankings);
    setState({...state, agentRankings: newAgentRankings});
  };

  const onChangeCity = item => {
    if (item.id !== state.place?.cityId) {
      setState({...state, place: {cityId: item.id}});
    }
  };

  const onChangeDistrict = item => {
    setState({...state, place: {...state.place, districtId: item}});
  };

  const onCheckFindNearMe = (location, value) => {
    if (value && location && location.latitude && location.longitude) {
      setState({
        ...state,
        findNearest: true,
        geolocation: {latitude: location.latitude, longitude: location.longitude},
      });
    } else {
      setState({...state, findNearest: false, geolocation: null});
    }
  };

  const onSelectAgentGroup = items => {
    setState({...state, agentGroupIds: items.map(item => item.id)});
  };

  const onRemoveItemAgentGroup = ids => {
    setState({...state, agentGroupIds: ids});
  };

  const onResetFilter = () => {
    setState(initialState());
    setItemsData({...itemsData, agentGroups: resetAgentGroups(itemsData.agentGroups)});
  };

  return {
    state,
    setState,
    itemsData,
    onChangeCity,
    onChangeDistrict,
    onSelectPropertyType,
    onSelectTopenerServiceType,
    onSelectAgentRanking,
    onSelectAgentGroup,
    onRemoveItemAgentGroup,
    onCheckFindNearMe,
    onResetFilter,
    getAllAgentGroups,
  };
};

const SearchFilterAgentScreen = ({onPressDismiss, onPressConfirm, searchFilterAgentHook}) => {
  const {
    state,
    itemsData,
    onChangeCity,
    onChangeDistrict,
    onSelectPropertyType,
    onSelectAgentRanking,
    onSelectAgentGroup,
    onSelectTopenerServiceType,
    onRemoveItemAgentGroup,
    onCheckFindNearMe,
    onResetFilter,
  } = searchFilterAgentHook;

  const onPressButtonSearch = () => {
    onPressConfirm(state);
  };

  return (
    <FilterAgentContainer
      state={state}
      itemsData={itemsData}
      onChangeCity={onChangeCity}
      onChangeDistrict={onChangeDistrict}
      onSelectPropertyType={onSelectPropertyType}
      onSelectAgentRanking={onSelectAgentRanking}
      onSelectAgentGroup={onSelectAgentGroup}
      onSelectTopenerServiceType={onSelectTopenerServiceType}
      onRemoveItemAgentGroup={onRemoveItemAgentGroup}
      onCheckFindNearMe={onCheckFindNearMe}
      onPressButtonSearch={onPressButtonSearch}
      onPressButtonCancelFilter={onResetFilter}
      onPressDismiss={onPressDismiss}
    />
  );
};

export default SearchFilterAgentScreen;
