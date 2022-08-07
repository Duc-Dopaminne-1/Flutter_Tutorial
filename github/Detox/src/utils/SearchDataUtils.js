import _, {isEmpty} from 'lodash';

import {
  SearchAgentInput,
  SearchProjectOrderBy,
  SearchPropertyPostOrderBy,
} from '../api/graphql/generated/graphql';
import {
  ALL_SELECT,
  APPROVAL_STATUS,
  CONSTANTS,
  FILTER_STATUS_ALL_SELECT,
  getBathRoomList,
  getDirectionKey,
  getDirectionList,
  getProjectOrderList,
  getPropertyOrderList,
  getPropertyPostStatusList,
  getRoomsList,
  SEARCH_PROPERTY_STATUS,
  SEARCH_RENT_PROPERTY_STATUS,
  SEARCH_TYPE_INDEX,
} from '../assets/constants';
import {getStringifyJsonArray} from '../screens/Search/SearchFilterAgentScreen';
import {getPropertyPostApprovalStatusByKey} from './GetMasterData';
import JsonDataUtils from './JsonDataUtils';
import {parseDirection} from './MapDataUtils';
import {getMappingCities} from './MappingMasterData';

const MIN_PRICE = 0;
const MIN_SQUARE = 0;

const mappingPropertyTypes = propertyTypes => {
  if (propertyTypes?.length === 4) {
    return [];
  }
  return propertyTypes.map(item => ({
    Id: item.id,
  }));
};

const checkAreaHasCityAll = areas => {
  if (Array.isArray(areas) && areas.length > 0 && areas[0].city?.id === ALL_SELECT.id) {
    return true;
  }
  return false;
};

const mappingPlace = places => {
  if (checkAreaHasCityAll(places)) {
    return [];
  }
  if (!places || !places?.length) return [];
  return places.map(item => ({
    CityId: item?.city?.id ?? '',
    DistrictIds: item?.districts?.map(district => district.id) || [],
  }));
};

const mappingDirection = directionId => {
  if (directionId) {
    if (directionId === -1) {
      return [];
    } else {
      return [{Direction: getDirectionKey(directionId)}];
    }
  } else {
    return [];
  }
};

const splitDirectionStrings = directions => {
  if (isEmpty(directions)) {
    return [];
  }
  const parsedDirection = parseDirection(directions, true);
  const arrayOfDirections = parsedDirection.split(',');
  const mappingDirections = arrayOfDirections.map(item => ({Direction: getDirectionKey(item)}));
  return mappingDirections;
};

const mappingRangePrice = ([from, to]) => {
  if (!from && !to) {
    return null;
  }
  return {
    rangePriceJson: JSON.stringify({
      PriceFrom: from && from > MIN_PRICE ? from : MIN_PRICE,
      PriceTo: to && to > 0 ? to : CONSTANTS.MAX_PRICE_VALUE,
    }),
  };
};

const mappingRangeSquares = ([from, to]) => {
  if (!from && !to) {
    return null;
  }
  return {
    rangeSquareJson: JSON.stringify({
      SquareFrom: from && from > MIN_SQUARE ? from : MIN_SQUARE,
      SquareTo: to && to > 0 ? to : CONSTANTS.MAX_ACREAGE_VALUE,
    }),
  };
};

const getApprovalIds = (masterData, isSoldStatus = false, isAll = false) => {
  const approval = getPropertyPostApprovalStatusByKey(masterData, APPROVAL_STATUS.APPROVAL);
  const sold = getPropertyPostApprovalStatusByKey(masterData, APPROVAL_STATUS.SOLD);
  let approvalIds = [{Id: approval?.propertyPostApprovalStatusId}];

  if (isAll) {
    approvalIds = [
      {Id: sold?.propertyPostApprovalStatusId},
      {Id: approval?.propertyPostApprovalStatusId},
    ];
  } else if (isSoldStatus) {
    approvalIds = [{Id: sold?.propertyPostApprovalStatusId}];
  } else {
    approvalIds = [{Id: approval?.propertyPostApprovalStatusId}];
  }
  return approvalIds;
};

const getApprovalIdsHomeScreen = masterData => {
  const approval = getPropertyPostApprovalStatusByKey(masterData, APPROVAL_STATUS.APPROVAL);
  return [{Id: approval?.propertyPostApprovalStatusId}];
};

const mappingSearchCriteria = (
  state,
  page,
  orderBy,
  pageSize = CONSTANTS.DEFAULT_SEARCH_PAGE_SIZE,
) => {
  const searchData = {
    keyword: state.keyword ?? null,
    propertyTypeJson: JsonDataUtils.stringifyJSONArray(
      mappingPropertyTypes(state.propertyTypeJson),
    ),
    placeJson: JsonDataUtils.stringifyJSONArray(mappingPlace(state.placeJson)),
    directionJson: JsonDataUtils.stringifyJSONArray(splitDirectionStrings(state.directionJson)),
    balconyDirectionJson: JsonDataUtils.stringifyJSONArray(
      splitDirectionStrings(state.balconyDirectionJson),
    ),
    ...mappingRangePrice(state.rangePriceJson),
    ...mappingRangeSquares(state.rangeSquareJson),
    numberOfBedRoom: state.numberOfBedRoom,
    numberOfBathRoom: state.numberOfBathRoom,
    pageSize: pageSize,
    page: page,
    orderBy: orderBy,
    propertyPostApprovalStatusJson: state.propertyPostApprovalStatusJson
      ? JsonDataUtils.stringifyJSONArray(state.propertyPostApprovalStatusJson)
      : null,
  };
  const input = _.pickBy(searchData); // remove any falsy value (false, 0, null, '', ...)

  if (
    state?.propertyPostStatus === SEARCH_RENT_PROPERTY_STATUS[1].id || // is searching posts for rent
    state?.propertyPostStatus === SEARCH_RENT_PROPERTY_STATUS[2].id // is searching rented posts
  ) {
    input.isRented = state?.propertyPostStatus === SEARCH_RENT_PROPERTY_STATUS[2].id;
  }
  return input;
};

const mappingSearchProjects = (
  state,
  page,
  orderBy,
  featureProject,
  pageSize = CONSTANTS.DEFAULT_SEARCH_PAGE_SIZE,
) => {
  return {
    keyword: state.keyword ?? '',
    propertyTypeJson: JsonDataUtils.stringifyJSONArray(
      mappingPropertyTypes(state.propertyTypeJson),
    ),
    placeJson: JsonDataUtils.stringifyJSONArray(mappingPlace(state.placeJson)),
    ...mappingRangePrice(state.rangePriceJson),
    pageSize: pageSize,
    page: page,
    orderBy: orderBy,
    featureProject: featureProject ? featureProject : null,
    projectStatus: state?.projectStatus ?? '',
  };
};

const mappingSearchAgent = (state, start_page, pageSize = CONSTANTS.DEFAULT_PAGE_SIZE) => {
  //Note: place of state will always have 1 cityId and 1 districtId for current spec
  //Change this when spec changes
  const getListPlace = () => {
    const getDistrictIds = () => {
      const districtSelected = state.place?.districtId;
      if (districtSelected && districtSelected.length > 0) {
        const districIds = districtSelected.map(item => item.id);
        return districIds;
      }
      return [];
    };
    const cityId = state.place?.cityId;
    if (cityId) {
      return [{CityId: cityId, DistrictIds: getDistrictIds()}];
    }
    return [];
  };
  let placeJson = JsonDataUtils.stringifyJSONArray(getListPlace());

  let geoLocationJson = null;
  if (state.geolocation && state.geolocation.latitude && state.geolocation.longitude) {
    const geoLocation = {
      centerLongitude: state.geolocation.longitude,
      centerLatitude: state.geolocation.latitude,
      distanceInMeters: CONSTANTS.SEARCH_AGENT_NEAR_ME_DISTANCE,
    };
    geoLocationJson = JsonDataUtils.stringifyJSONObject(geoLocation);
  }

  //If search near me => ignore place;
  if (geoLocationJson) {
    placeJson = null;
  }

  let agentGroupIds = state.agentGroupIds;
  if (
    Array.isArray(agentGroupIds) &&
    agentGroupIds.length === 1 &&
    agentGroupIds[0] === ALL_SELECT.id
  ) {
    agentGroupIds = [];
  }

  const input: SearchAgentInput = {
    // agentRankingJson: getStringifyJsonArray(state.agentRankings.map(item => item.id)),
    propertyTypeJson: getStringifyJsonArray(state.propertyTypes.map(item => item.id)),
    topenerServiceTypeJson: JSON.stringify(
      state.topenerServiceTypes.map(item => ({requestTypeId: item.id})),
    ),
    // agentGroupJson: getStringifyJsonArray(agentGroupIds),
    placeJson,
    geoLocationJson,
    orderBy: CONSTANTS.DEFAUTL_SEARCH_AGENT_ORDER,
    pageSize,
    page: start_page,
    keyword: state.keyword,
    fuzziness: false,
  };
  return input;
};

const resetDropdown = (it, index) => ({...it, checked: index === 0});

const itemsData = (params, masterData) => {
  const searchRentalPost = params?.tabIndex === SEARCH_TYPE_INDEX.RENTAL;
  const directions = [ALL_SELECT, ...getDirectionList()];
  const balconyDirections = [ALL_SELECT, ...getDirectionList()];
  const statuses = [
    FILTER_STATUS_ALL_SELECT,
    ...masterData?.projectStatus?.edges?.map(item => ({
      id: item.projectStatusId,
      name: item.projectStatusDescription,
      checked: false,
    })),
  ];

  const rawDirections = directions.map(resetDropdown);
  const rawNumberOfRooms = getRoomsList().map(resetDropdown);
  const rawNumberOfBathRooms = getBathRoomList().map(resetDropdown);
  const rawPropertyOrderBys = getPropertyOrderList().map(resetDropdown);
  const rawProjectOrderBys = getProjectOrderList().map(resetDropdown);
  const rawPropertyPostStaus = getPropertyPostStatusList(searchRentalPost).map(resetDropdown);

  return {
    propertyTypes: masterData?.propertyTypes?.edges?.map(item => ({
      id: item.propertyTypeId,
      name: item.propertyTypeName,
      description: item.propertyTypeDescription,
    })),
    propertyPostStatus: rawPropertyPostStaus,
    cities: getMappingCities(masterData?.cities?.edges),
    directions: rawDirections,
    numberOfRooms: rawNumberOfRooms,
    numberOfBathRooms: rawNumberOfBathRooms,
    propertyOrderBys: rawPropertyOrderBys,
    projectOrderBys: rawProjectOrderBys,
    balconyDirections: balconyDirections,
    statuses,
  };
};

const removeAccents = str => {
  const AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ];
  for (let i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    const char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str.toLowerCase();
};

const mappingSearchSuggest = ({keyword, pageSize = 3, order = 'LATEST'}) => {
  return {
    keyword: keyword,
    pageSize: pageSize,
    page: 1,
    orderBy: order,
  };
};

const resetFilter = (params, masterData) => {
  const searchRentalPost = params?.tabIndex === SEARCH_TYPE_INDEX.RENTAL;
  return {
    itemsData: itemsData(params, masterData),
    propertyTypeJson: params?.propertyTypeJson
      ? params?.propertyTypeJson
      : masterData.propertyTypes.edges.map(item => ({
          id: item.propertyTypeId,
        })),
    propertyPostStatus: searchRentalPost
      ? SEARCH_RENT_PROPERTY_STATUS[1].id
      : SEARCH_PROPERTY_STATUS[1].id,
    rangePriceJson: [null, null],
    projectPriceJson: [null, null],
    rangeSquareJson: [null, null],
    numberOfBedRoom: 0,
    numberOfBathRoom: 0,
    directionJson: '',
    placeJson: params?.placeJson ? params?.placeJson : [],
    balconyDirectionJson: '',
    projectStatus: '',
  };
};

const initialCriteriaState = (params, masterData) => {
  return {
    keyword: params?.keyword ?? '',
    ...resetFilter(params, masterData),
    propertyPostOrderBy: SearchPropertyPostOrderBy.Latest,
    projectOrderBy: params?.projectOrderBy ? params?.projectOrderBy : SearchProjectOrderBy.Latest,
  };
};

const initialCriteriaStateAgent = (params, state, itemsDataAgent) => {
  return {
    keyword: params?.keyword ?? '',
    ...state,
    itemsData: itemsDataAgent,
  };
};

const SearchDataUtils = {
  mappingSearchCriteria,
  mappingSearchProjects,
  initialCriteriaState,
  initialCriteriaStateAgent,
  getApprovalIds,
  removeAccents,
  getApprovalIdsHomeScreen,
  resetFilter,
  checkAreaHasCityAll,
  mappingSearchAgent,
  mappingSearchSuggest,
  mappingDirection,
  splitDirectionStrings,
};

export default SearchDataUtils;
