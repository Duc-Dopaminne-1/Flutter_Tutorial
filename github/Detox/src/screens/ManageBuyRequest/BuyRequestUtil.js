import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import moment from 'moment';

import {
  ContactTradingB2CCreatedByCurrentUserQueryVariables,
  TotalComissionUnit,
} from '../../api/graphql/generated/graphql';
import {
  BUY_REQUEST_TYPE,
  CONSTANTS,
  CONTACT_STATUS_ID,
  CONTACT_TRADING_TYPE,
} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {dateToTimestamp, getDateBefore} from '../../utils/TimerCommon';
import {RequestType} from './DetailRequestConstant';

// range giới hạn 1 năm.
const LIMIT_RANGE_DATE = 365;
// mặc định range 03 tháng.
const DEFAULT_RANGE_DATE = 30;
const DEFAULT_STATUS = false;

export const REQUEST_TYPES = [
  {
    id: CONTACT_TRADING_TYPE.BUY,
    name: 'Mua',
    checked: true,
  },
  {
    id: CONTACT_TRADING_TYPE.RENT,
    name: 'Thuê',
    checked: false,
  },
];

export const FILTER_STATUS_OPTIONS = [
  {
    id: CONTACT_STATUS_ID.Waiting,
    name: translate('contactTrading.status.waiting'),
    description: translate('contactTrading.status.waiting'),
    checked: false,
  },
  {
    id: CONTACT_STATUS_ID.Connected,
    name: translate('contactTrading.status.connected'),
    description: translate('contactTrading.status.connected'),
    checked: false,
  },
  {
    id: CONTACT_STATUS_ID.Negotiate,
    name: translate('contactTrading.status.negotiate'),
    description: translate('contactTrading.status.negotiate'),
    checked: false,
  },
  {
    id: CONTACT_STATUS_ID.Deposited,
    name: translate('contactTrading.status.deposit'),
    description: translate('contactTrading.status.deposit'),
    checked: false,
  },
  {
    id: CONTACT_STATUS_ID.Completed,
    name: translate('contactTrading.status.complete'),
    description: translate('contactTrading.status.complete'),
    checked: false,
  },
  {
    id: CONTACT_STATUS_ID.Pending,
    name: translate(STRINGS.PENDING),
    description: translate(STRINGS.PENDING),
    checked: false,
  },
  {
    id: CONTACT_STATUS_ID.Rejected,
    name: translate('common.decline'),
    description: translate('common.decline'),
    checked: false,
  },
];

const mapFilterStatuses = ({filterStatusState, statusSelected}) => {
  if (!filterStatusState) {
    return filterStatusState;
  }
  return filterStatusState.map(e => {
    let checked = false;
    if (e.id === statusSelected.id) {
      checked = true;
    }
    return {
      ...e,
      checked,
    };
  });
};

const getInitialFilterUI = type => {
  const isSending = type === BUY_REQUEST_TYPE.SENT;
  const baseModel = {
    keywords: '',
    isSending: isSending,
    tradingStatus: [],
    contactType: CONTACT_TRADING_TYPE.BUY,
    fromDate: getDateBefore(DEFAULT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
  };

  if (isSending) {
    const model = {
      ...baseModel,
      isRequester: DEFAULT_STATUS,
    };

    return model;
  } else {
    return {...baseModel};
  }
};

const filterDataToQueryParams = ({filterData}) => {
  const {tradingStatus, fromDate, toDate, isRequester, customerEmail, isSending} = filterData;

  const fromDatetime = dateToTimestamp(new Date(moment(fromDate).startOf(CONSTANTS.DAY)));
  const toDatetime = dateToTimestamp(new Date(moment(toDate).endOf(CONSTANTS.DAY)));
  const statusList =
    tradingStatus?.length > 0 ? {OR: tradingStatus?.map(e => ({contactTradingStatusId: e}))} : null;
  // ? {OR: [{contactTradingCode_contains: keywords}, {propertyCode_contains: keywords}]}
  // : null;

  let params = {
    ...statusList,
    contactType: CONTACT_TRADING_TYPE.BUY,
  };
  if (isSending) {
    const selfRequester = isRequester && customerEmail ? {customerEmail: customerEmail} : null;
    params = {
      ...params,
      ...selfRequester,
      createdDatetime_gte: fromDatetime,
      createdDatetime_lte: toDatetime,
    };
  } else {
    params = {
      ...params,
      updatedDatetime_gte: fromDatetime,
      updatedDatetime_lte: toDatetime,
    };
  }

  return params;
};

const getBuyRequestType = typeText => {
  let normalizedType = '';
  if (typeText) {
    const lowerCaseType = typeText.toLowerCase();
    if (lowerCaseType === RequestType.Sending.toLowerCase()) {
      normalizedType = RequestType.Sending;
    } else if (lowerCaseType === RequestType.Receiving.toLowerCase()) {
      normalizedType = RequestType.Receiving;
    }
  }

  return normalizedType;
};

const getInitialFilterUIB2C = () => {
  const baseModel = {
    fromDate: getDateBefore(LIMIT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
  };
  return {...baseModel, propertyTypeJson: []};
};

const mapFilterDataToQueryParamsB2C = filterData => {
  const {fromDate, toDate, projectSelect, propertyTypeJson = null} = filterData;
  const fromDatetime = dateToTimestamp(new Date(moment(fromDate).startOf(CONSTANTS.DAY)));
  const toDatetime = dateToTimestamp(new Date(moment(toDate).endOf(CONSTANTS.DAY)));
  const propertyTypes = propertyTypeJson?.length ? propertyTypeJson.map(e => e.id) : null;
  const queryParams: ContactTradingB2CCreatedByCurrentUserQueryVariables = omitBy(
    {
      page: 1,
      pageSize: 10,
      where: omitBy(
        {
          requestDate_gte: fromDatetime,
          requestDate_lte: toDatetime,
          contactTradingB2CStatusId_in: propertyTypes,
        },
        isNil,
      ),
      projectId: projectSelect?.id,
    },
    isNil,
  );
  return queryParams;
};

const calculateTotalComissionAmount = (comission = 0, comissionUnit, contractPrice = 0) => {
  let totalComAmount = (contractPrice * comission) / 100;
  switch (comissionUnit) {
    case TotalComissionUnit.Bymonth:
      totalComAmount = contractPrice * comission;
      break;
    case TotalComissionUnit.Byvnd:
      totalComAmount = comission;
      break;
  }
  return totalComAmount;
};

const getContactTitle = contactRole => {
  switch (contactRole) {
    case 'staff':
      return translate(STRINGS.CONSULTANT);
    case 'requester':
      return translate(STRINGS.REQUESTER);
    case 'buyer':
      return translate('contactTrading.buyer');
    case 'seller':
      return translate('contactTrading.propertyPoster');
    case 'owner':
      return translate('contactTrading.owner');
    default:
      return translate(STRINGS.REQUESTER);
  }
};

const BuyRequestUtil = {
  mapFilterDataToQueryParamsB2C,
  getInitialFilterUIB2C,
  getInitialFilterData: getInitialFilterUI,
  filterDataToQueryParams,
  getBuyRequestType,
  mapFilterStatuses,
  getContactTitle,
  calculateTotalComissionAmount,
  LIMIT_RANGE_DATE,
};

export default BuyRequestUtil;
