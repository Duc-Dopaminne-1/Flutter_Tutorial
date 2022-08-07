import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import {APPROVAL_STATUS, CONSTANTS} from '../../../assets/constants';
import ArrayUtils from '../../../utils/ArrayUtils';
import {dateToTimestamp, getDateBefore} from '../../../utils/TimerCommon';
import {PostType} from '../useNewPost';
import {PROPERTY_STATUS_OPTIONS, RENTED_STATUS} from './FilterModel';

// range giới hạn 1 năm.
const LIMIT_RANGE_DATE = 365;
// mặc định range 03 tháng.
const DEFAULT_RANGE_DATE = 30;

/**
 * get list property types from masterData
 * @param {*} data masterData
 * @returns list property types mapping selected
 */
export const getPropertyTypes = data => {
  if (data?.propertyTypes?.edges) {
    return data.propertyTypes.edges.map(item => ({
      id: item.propertyTypeId,
      name: item.propertyTypeDescription,
      checked: false,
    }));
  }
  return [];
};

/**
 * map guaranteed packages from origin to UI
 * @param {*} packages original data response
 * @returns custom list mapping for UI
 */
export const mapGuaranteedPackages = (packages: Array) => {
  if (ArrayUtils.hasArrayData(packages)) {
    return packages.map(e => ({
      id: e?.guaranteedPackageId ?? e?.id,
      name: e?.guaranteedPackageDescription ?? e?.name,
      checked: false,
    }));
  } else {
    return [];
  }
};

const getInitialFilterData = () => {
  return {
    fromDate: getDateBefore(DEFAULT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
    propertyStatus: [],
    propertyTypes: [],
    districtIds: [],
    cityId: 0,
    guaranteedPackages: [],
    contractStatus: [],
  };
};

const getApprovalIdByName = (nameArr = [], approvalStatusArr = []) => {
  if (isEmpty(nameArr) || isEmpty(approvalStatusArr)) {
    return [];
  }
  return approvalStatusArr
    .filter(it => nameArr.includes(it.propertyPostApprovalStatusName))
    .map(it => it.propertyPostApprovalStatusId);
};

const getFilterByState = (tabKey, filterOption, approvalStatus, keywords) => {
  // filter status
  const allStatuses = PROPERTY_STATUS_OPTIONS.map(e => e.id);
  const rentedStatusId = RENTED_STATUS;
  const isRentedSelected = filterOption?.propertyStatus?.some(e => e === rentedStatusId);
  const hasSelectedStatus = filterOption?.propertyStatus?.length > 0;
  const isSelectedAllStatus = filterOption?.propertyStatus?.length === 0;
  const statusNotIn = tabKey === PostType.rent && {
    propertyPostApprovalStatusId_not_in: getApprovalIdByName(
      [APPROVAL_STATUS.SOLD],
      approvalStatus,
    ),
  };
  let status = null;
  if (hasSelectedStatus) {
    const statusFilter = allStatuses.filter(e => {
      const isChecked = filterOption?.propertyStatus.includes(e);
      const searchRentedPropertyPosts = e === APPROVAL_STATUS.APPROVAL && isRentedSelected;
      return isChecked || searchRentedPropertyPosts;
    });
    const statusIds = getApprovalIdByName(statusFilter, approvalStatus);
    status = {propertyPostApprovalStatusId_in: statusIds};
  }

  // filter propertyTypes
  const hasSelectedType = filterOption?.propertyTypes?.length > 0;
  const propertyTypesFilter = hasSelectedType && {propertyTypeId_in: filterOption?.propertyTypes};

  // search input propertyCode
  const propertyCode = isEmpty(keywords) || {
    keywords: String(keywords).trim(),
  };

  // filter datetime
  const {fromDate, toDate} = filterOption;
  const fromDatetime = dateToTimestamp(new Date(moment(fromDate).startOf(CONSTANTS.DAY)));
  const toDatetime = dateToTimestamp(new Date(moment(toDate).endOf(CONSTANTS.DAY)));

  // filter area city
  const city =
    !filterOption?.cityId || filterOption?.cityId === 0 ? null : {cityId: filterOption?.cityId};
  const districtIds =
    filterOption?.districtIds?.length > 0
      ? {OR: filterOption?.districtIds?.map(e => ({districtId: e.id}))}
      : null;

  // filter packages
  const hasPackages = filterOption?.guaranteedPackages?.length > 0;
  const packageFilter = hasPackages && {guaranteedPackageId_in: filterOption?.guaranteedPackages};

  //contractStatus_in
  const hasContractStatus = filterOption?.contractStatus?.length > 0;
  const contractStatusFilter = hasContractStatus && {
    contractStatus_in: filterOption?.contractStatus,
  };

  const searchCriteria = {
    createdDatetime_gte: fromDatetime,
    createdDatetime_lte: toDatetime,
    ...status,
    ...statusNotIn,
    ...propertyTypesFilter,
    ...city,
    ...districtIds,
    ...packageFilter,
    ...contractStatusFilter,
    isPrivate: false,
  };
  if (tabKey === PostType.rent) {
    if (isRentedSelected && filterOption?.propertyStatus?.length === 1) {
      searchCriteria.isRented = true;
    } else if (!isRentedSelected && !isSelectedAllStatus) {
      searchCriteria.isRented_in = [null, false];
    }
    searchCriteria.forRent = true;
  } else {
    searchCriteria.forSale = true;
  }
  return {
    ...{where: searchCriteria},
    ...propertyCode,
  };
};

const YourPropertyFilterUtil = {
  getInitialFilterData,
  getFilterByState,
  LIMIT_RANGE_DATE,
};

export default YourPropertyFilterUtil;
