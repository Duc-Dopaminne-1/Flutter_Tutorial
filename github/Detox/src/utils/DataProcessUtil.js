/* eslint-disable no-undefined */
import {isEmpty, isString, toLower} from 'lodash';

import {
  CONSTANTS,
  EMPTY_STRING,
  MAP_RANK,
  MAX_RATING_VALUE,
  MIN_RATING_VALUE,
  UNIT_OF_MEASURE,
  UUID_TOTAL_CHARACTERS,
} from '../assets/constants';
import {COLORS} from '../assets/theme/colors';
import PropertyType from '../screens/ManagePost/PropertyType';
import {
  getProjectStatusById,
  getPropertyTypeById,
  getUnitOfMeasureById,
  getUnitOfMeasureByKey,
} from './GetMasterData';
import {mapToUiImageSelectionSources} from './ImageUtil';
import UrlUtils from './UrlUtils';
import {getUserFullName} from './UserAgentUtil';

function isObject(obj) {
  // eslint-disable-next-line eqeqeq
  return obj !== undefined && obj !== null && obj.constructor == Object;
}

export const urlsToSources = urls => {
  return isEmpty(urls)
    ? []
    : urls.map(item => ({
        uri: item.url,
      }));
};

export const urisToSources = urls => {
  return isEmpty(urls)
    ? []
    : urls.map(item => ({
        url: item.uri || item.url,
      }));
};

/**
 * Parse string address from json object
 * @param {*} addressData Address json object
 * @param {*} hiddenHomeNumber default false. (true/false) hidden/show home number
 * @param {*} basic default false. (true/false) End of address with dot "." / Address original
 * @returns string address
 */
export const extractAddressData = (addressData, hiddenHomeNumber = false, basic = false) => {
  const address = [];
  if (addressData) {
    const {homeAddress, streetName, wardName, districtName, cityName} = addressData;
    const isNotEmpty = data => !isEmpty(data);

    let streetData = '';
    isNotEmpty(homeAddress) && (streetData = hiddenHomeNumber ? '' : homeAddress);
    isNotEmpty(streetName) && (streetData = `${streetData} ${streetName}`.trim());
    isNotEmpty(streetData) && address.push(streetData);
    isNotEmpty(wardName) && address.push(wardName);
    isNotEmpty(districtName) && address.push(districtName);
    isNotEmpty(cityName) && address.push(cityName);
  }
  if (isEmpty(address)) {
    return '';
  }
  const addressString = address.reduce((prev, current) => `${prev}, ${current}`);
  const ext = basic ? '' : '.';
  return `${addressString}${ext}`;
};

export const searchProjectDtoMapper = (project, masterData) => {
  const {projectStatusId} = project;
  const projectStatus = getProjectStatusById(masterData, projectStatusId);
  const unitOfMeasureProject = getUnitOfMeasureByKey(masterData, UNIT_OF_MEASURE.BILLION);
  return {
    ...project,
    unitOfMeasureProject,
    projectStatusDescription: projectStatus?.projectStatusDescription ?? '',
    projectStatusName: projectStatus?.projectStatusName ?? '',
  };
};

export const searchProjectDtoMapperArr = (projects, masterData) => {
  return isEmpty(projects)
    ? []
    : projects.map(project => searchProjectDtoMapper(project, masterData));
};

export const searchPropertyDtoMapper = (property, masterData) => {
  const unitOfMeasure = getUnitOfMeasureById(masterData, property.unitOfMeasureId);
  const propertyType = getPropertyTypeById(masterData, property.propertyTypeId);
  return {
    ...property,
    images: mapToUiImageSelectionSources({images: property.images}),
    unitOfMeasure,
    propertyTypeName: propertyType.propertyTypeName ?? PropertyType.apartment,
  };
};

export const searchPropertyDtoMapperArr = (properties, masterData) => {
  return isEmpty(properties)
    ? []
    : properties.map(property => searchPropertyDtoMapper(property, masterData));
};

/**
 * This function use to map list data to list items render in dropdown component
 * @param {*} arr list raw data
 * @param {*} idValue id field name
 * @param {*} nameValue field name use to extract text show in dropdown item
 * @param {*} selectedId is the id of item that mark as checked
 * @returns array items use for dropwdown component
 */
export const dropdownMapper = (arr, idValue, nameValue, selectedId) => {
  return arr.map(it => ({
    ...it,
    id: it[idValue],
    name: it[nameValue],
    checked: selectedId ? selectedId === it[idValue] : false,
  }));
};

/**
 * This function is wrapper of @see dropdownMapper
 * it will set first item is checked === true if don't find any selected item before
 * @returns an object `{dropdownData,selectedId}`
 * @property `dropdownData` is array items use for  dropdown component
 * @property `selectedId` is the id of the selected item
 */
export const getValidDropdownData = (
  arr,
  idValue,
  nameValue,
  selectedId,
  canEmptyDefault = false,
) => {
  const mappedData = dropdownMapper(arr, idValue, nameValue, selectedId);
  const dropdownData = mappedData;
  let id = selectedId;
  if (!isEmpty(dropdownData)) {
    const found = dropdownData.find(it => it.checked);
    if (!found && !canEmptyDefault) {
      dropdownData[0].checked = true;
      id = dropdownData[0].id;
    }
  }
  return {dropdownData, selectedId: id};
};

export const safeExtractNumber = value => {
  return value ?? 0;
};

export const mapSellAgentInfoToData = agentInfo => {
  if (!agentInfo) {
    return {name: '', itemId: ''};
  }
  const rankName = agentInfo?.agentRankName ?? MAP_RANK.DEFAULT_NAME;
  const rankColor = COLORS[MAP_RANK[rankName].color];
  const name = getUserFullName(agentInfo);
  const rank = {
    agentRankingName: agentInfo.agentRankingDescription ?? '',
    hexColorCode: rankColor,
  };
  return {
    ...agentInfo,
    profilePhoto: agentInfo.profilePhoto,
    rating: agentInfo.rating,
    name,
    rank,
    itemId: agentInfo.agentId,
  };
};

export const mapSellConsultantInfoToData = agentInfo => {
  if (!agentInfo) {
    return {name: '', itemId: ''};
  }
  const name = agentInfo.fullName;
  const group = agentInfo.staffGroupDescription;
  return {
    ...agentInfo,
    profilePhoto: agentInfo.profilePhoto,
    rating: agentInfo.rating,
    name,
    group,
    itemId: agentInfo.staffId,
  };
};

export const mapStaffGroups = staffGroup => {
  if (!staffGroup) {
    return {id: '', name: ''};
  }
  return {
    ...staffGroup,
    id: staffGroup.staffGroupId,
    name: staffGroup.staffGroupDescription,
    checked: false,
  };
};

// id: item.agentGroupId,
// name: item.agentGroupDescription,
// checked: item.agentGroupId === agentGroup.id ? true : false,

export const processRatingNumber = rateNumber => {
  const haft = 0.5;
  const leftValue = Math.floor(rateNumber);
  const rightValue = leftValue + haft;
  let roundedValue = 0;
  if (leftValue < rateNumber && rateNumber <= rightValue) {
    roundedValue = rightValue;
  } else if (rightValue < rateNumber) {
    roundedValue = rightValue + haft;
  } else {
    roundedValue = leftValue;
  }
  if (roundedValue < MIN_RATING_VALUE) {
    roundedValue = MIN_RATING_VALUE;
  }
  if (roundedValue > MAX_RATING_VALUE) {
    roundedValue = MAX_RATING_VALUE;
  }
  return roundedValue;
};

export const extractFileName = urlWithUiid => {
  const fullFileName = UrlUtils.getFileNameFromUrl(urlWithUiid);
  if (!isEmpty(fullFileName)) {
    const lastDot = fullFileName.lastIndexOf('.');
    const extension = fullFileName.substring(lastDot);
    const name = fullFileName.substring(0, lastDot - UUID_TOTAL_CHARACTERS - 1); // 1 for "-"
    return `${name}${extension}`;
  }
  return EMPTY_STRING;
};

export const isValueNull = value => {
  if (!value) {
    return true;
  }
  if (
    isString(value) &&
    (toLower(value) === CONSTANTS.NULL_STRING || toLower(value) === CONSTANTS.UNDEFINED_STRING)
  ) {
    return true;
  }
  return false;
};

export const getAgentRankColor = agentRankName => {
  const agentRank = agentRankName ?? MAP_RANK.DEFAULT_NAME;
  const rankColor = COLORS[MAP_RANK[agentRank].color];
  return rankColor;
};

export const shallowCompareObj = (a, b, compareMissingProps) => {
  for (const prop in a) {
    let missingProps = true;
    // eslint-disable-next-line no-labels
    loopB: for (const prop2 in b) {
      if (prop === prop2) {
        missingProps = false;
        if (isObject(a[prop]) && isObject(b[prop2])) {
          if (!shallowCompareObj(a[prop], b[prop2], compareMissingProps)) {
            return false;
          }
        } else if (!Array.isArray(a[prop]) && !Array.isArray(b[prop2]) && a[prop] !== b[prop2]) {
          return false;
        } else {
          // eslint-disable-next-line no-labels
          break loopB;
        }
      }
    }
    if (missingProps && compareMissingProps) {
      return false;
    }
  }

  return true;
};
