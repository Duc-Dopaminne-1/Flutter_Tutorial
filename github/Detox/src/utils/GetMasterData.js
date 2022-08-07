import {filter, findIndex, isEmpty} from 'lodash';

import {APPROVAL_STATUS, POST_TYPE} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';

const getItem = (items, query) => {
  const index = findIndex(items, query);
  return index === -1 ? null : items[index];
};

const getPostTypeIdByName = (masterData, key) => {
  const item = getItem(masterData.postTypes.edges, {
    postTypeName: key,
  });
  return item ? item.postTypeId : '';
};

const getPostTypeNameById = (masterData, id) => {
  const item = getItem(masterData.postTypes.edges, {
    postTypeId: id,
  });
  return item ? item.postTypeName : '';
};

const getPostTypeStringById = (masterData, id) => {
  const name = getPostTypeNameById(masterData, id);
  if (!isEmpty(name) && name === POST_TYPE.C2C) {
    return translate(STRINGS.RETAIL_ESTATES);
  }
  if (!isEmpty(name) && name === POST_TYPE.B2C) {
    return translate(STRINGS.PROJECT);
  } else {
    return '';
  }
};

const getCtStatusKeyById = (masterData, id) => {
  const item = getItem(masterData.contactTradingStatus.edges, {contactTradingStatusId: id});
  return item ? item.contactTradingStatusName : '';
};

const getCtStatusDesById = (masterData, id) => {
  const item = getItem(masterData.contactTradingStatus.edges, {contactTradingStatusId: id});
  return item ? item.contactTradingStatusDescription : '';
};

const getCtStatusIdByKey = (masterData, key) => {
  const item = getItem(masterData.contactTradingStatus.edges, {contactTradingStatusName: key});
  return item ? item.contactTradingStatusId : '';
};

const getPropertyPostStatusById = (masterData, id) => {
  return getItem(masterData.propertyPostStatus.edges, {propertyPostStatusId: id});
};

const getPropertyPostStatusDescriptionById = (masterData, id) => {
  const item = getPropertyPostStatusById(masterData, id);
  return item ? item.propertyPostStatusDescription : '';
};

const getLegalInfoById = (masterData, id) => {
  return getItem(masterData.legalInfoes.edges, {legalInfoId: id});
};

const getLegalInfoDescriptionById = (masterData, id) => {
  const item = getLegalInfoById(masterData, id);
  return item ? item.legalInfoDescription : '';
};

const getPropertyTypeById = (masterData, id) => {
  return getItem(masterData.propertyTypes.edges, {propertyTypeId: id});
};
const getPropertyTypeDescriptionById = (masterData, id) => {
  const item = getPropertyTypeById(masterData, id);
  return item ? item.propertyTypeDescription : '';
};

const getBankById = (masterData, id) => {
  return getItem(masterData.banks.edges, {bankId: id});
};
const getBankDescriptionById = (masterData, id) => {
  const item = getBankById(masterData, id);
  return item ? item.bankName : '';
};

const getPropertyPostApprovalStatusByKey = (masterData, key) => {
  return getItem(masterData.propertyPostApprovalStatus.edges, {
    propertyPostApprovalStatusName: key,
  });
};

const getPropertyPostApprovalStatusByKeyArr = (masterData, keys = []) => {
  return filter(masterData?.propertyPostApprovalStatus?.edges ?? [], status =>
    keys.includes(status.propertyPostApprovalStatusName.toLowerCase()),
  );
};

const getPropertyPostApprovalStatusById = (masterData, id) => {
  return getItem(masterData.propertyPostApprovalStatus.edges, {
    propertyPostApprovalStatusId: id,
  });
};

/**
 * Get status string from status name key
 * @param {*} statusName status name key
 * @param {*} statusDescription status string
 * @returns status string
 */
const getPropertyPostApprovalStatusDescriptionByName = (statusName, statusDescription) => {
  switch (statusName) {
    case APPROVAL_STATUS.APPROVAL:
      return translate('propertyPost.status.approval');
    case APPROVAL_STATUS.WAITING:
      return translate('propertyPost.status.waitting');
    case APPROVAL_STATUS.REJECTED:
      return translate('propertyPost.status.rejected');
    case APPROVAL_STATUS.CLOSE:
      return translate('propertyPost.status.closed');
    case APPROVAL_STATUS.EXPIRED:
      return translate('propertyPost.status.expired');
    case APPROVAL_STATUS.RENTED:
      return translate('propertyPost.isRented');
    case APPROVAL_STATUS.SOLD:
      return translate('propertyPost.status.sold');
    default:
      return statusDescription ?? '';
  }
};

const getPropertyPostApprovalStatusDescriptionById = (masterData, id) => {
  const item = getPropertyPostApprovalStatusById(masterData, id) ?? {};
  const description = getPropertyPostApprovalStatusDescriptionByName(
    item.propertyPostApprovalStatusName,
    item.propertyPostApprovalStatusDescription,
  );
  return description;
};

const getPropertyPostApprovalStatusNameById = (masterData, id) => {
  const item = getPropertyPostApprovalStatusById(masterData, id) ?? {};
  const name = item.propertyPostApprovalStatusName ?? '';

  return name;
};

const getUnitOfMeasureById = (masterData, id) => {
  return getItem(masterData.unitOfMeasures.edges, {unitOfMeasureId: id});
};

const getUnitOfMeasureByKey = (masterData, key) => {
  return getItem(masterData.unitOfMeasures.edges, {unitOfMeasureCode: key});
};

const getUnitOfMeasureByIdFromItems = (items, id) => {
  return getItem(items, {unitOfMeasureId: id});
};

const getProjectStatusByKey = (masterData, key) => {
  return getItem(masterData.projectStatus.edges, {
    projectStatusName: key,
  });
};

const getProjectStatusById = (masterData, id) => {
  return getItem(masterData.projectStatus.edges, {
    projectStatusId: id,
  });
};

const getProjectStatusDescriptionById = (masterData, id) => {
  const item = getProjectStatusById(masterData, id);
  return item ? item.projectStatusDescription : '';
};

const getPendingReasonById = (masterData, id) => {
  return getItem(masterData.pendingReasons.edges, {pendingReasonId: id});
};

const getPendingReasonDescById = (masterData, id) => {
  const item = getPendingReasonById(masterData, id);
  return item ? item.pendingReasonDescription : '';
};

const getCommentObjectType = (masterData, type) => {
  const item = getItem(masterData.feedObjectTypes.edges, {feedObjectTypeName: type});
  return item ? {typeId: item.feedObjectTypeId, isActive: item.isActive} : '';
};

const getSupportServicesTicketStatus = (masterData, id) => {
  const item = getItem(masterData.supportServiceTicketStatuses.edges, {
    supportServiceTicketStatusId: id,
  });
  return item ? {status: item.supportServiceTicketStatusDescription} : '';
};

const supportServiceTicketProcessingStatuses = (masterData, id) => {
  const item = getItem(masterData.supportServiceTicketProcessingStatuses.edges, {
    supportServiceTicketProcessingStatusId: id,
  });
  return item ? {status: item.supportServiceTicketProcessingStatusDescription} : '';
};

const getCancelReasonTicket = (masterData, id) => {
  const item = getItem(masterData.supportServiceTicketCancelReasons.edges, {
    supportServiceTicketCancelReasonId: id,
  });
  return item ? item.supportServiceTicketCancelReasonDescription : '';
};

const getStatusTicket = (masterData, isRequest, id) => {
  if (isRequest) {
    return getSupportServicesTicketStatus(masterData, id);
  } else {
    return supportServiceTicketProcessingStatuses(masterData, id);
  }
};

const getRejectReasonTicket = (masterData, id) => {
  const item = getItem(masterData.supportServiceTicketRejectReasons.edges, {
    supportServiceTicketRejectReasonId: id,
  });
  return item ? item.supportServiceTicketRejectReasonDescription : '';
};

export {
  getBankById,
  getBankDescriptionById,
  getCancelReasonTicket,
  getCommentObjectType,
  getCtStatusDesById,
  getCtStatusIdByKey,
  getCtStatusKeyById,
  getLegalInfoById,
  getLegalInfoDescriptionById,
  getPendingReasonDescById,
  getPostTypeIdByName,
  getPostTypeStringById,
  getProjectStatusById,
  getProjectStatusByKey,
  getProjectStatusDescriptionById,
  getPropertyPostApprovalStatusById,
  getPropertyPostApprovalStatusByKey,
  getPropertyPostApprovalStatusByKeyArr,
  getPropertyPostApprovalStatusDescriptionById,
  getPropertyPostApprovalStatusDescriptionByName,
  getPropertyPostApprovalStatusNameById,
  getPropertyPostStatusById,
  getPropertyPostStatusDescriptionById,
  getPropertyTypeById,
  getPropertyTypeDescriptionById,
  getRejectReasonTicket,
  getStatusTicket,
  getSupportServicesTicketStatus,
  getUnitOfMeasureById,
  getUnitOfMeasureByIdFromItems,
  getUnitOfMeasureByKey,
  supportServiceTicketProcessingStatuses,
};
