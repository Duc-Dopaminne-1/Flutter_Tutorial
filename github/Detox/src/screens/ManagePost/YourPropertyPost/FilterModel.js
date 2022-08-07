import {PostContractStatus} from '../../../api/graphql/generated/graphql';
import {APPROVAL_STATUS} from '../../../assets/constants';
import {translate} from '../../../assets/localize';

export const RENTED_STATUS = 'APPROVAL_STATUS.RENTED';
export const PROPERTY_STATUS_OPTIONS = [
  {
    id: APPROVAL_STATUS.APPROVAL,
    name: translate('propertyPost.status.approval'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.WAITING,
    name: translate('propertyPost.status.waitting'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.REQUEST,
    name: translate('propertyPost.status.requestedToUpdate'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.REJECTED,
    name: translate('propertyPost.status.rejected'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.CLOSE,
    name: translate('propertyPost.status.closed'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.EXPIRED,
    name: translate('propertyPost.status.expired'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.SOLD,
    name: translate('propertyPost.status.sold'),
    checked: false,
  },
];

export const PROPERTY_RENT_STATUS_OPTIONS = [
  {
    id: APPROVAL_STATUS.APPROVAL,
    name: translate('propertyPost.isForRent'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.WAITING,
    name: translate('propertyPost.status.waitting'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.REQUEST,
    name: translate('propertyPost.status.requestedToUpdate'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.REJECTED,
    name: translate('propertyPost.status.rejected'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.EXPIRED,
    name: translate('propertyPost.status.expired'),
    checked: false,
  },
  {
    id: APPROVAL_STATUS.CLOSE,
    name: translate('propertyPost.status.closed'),
    checked: false,
  },
  {
    id: RENTED_STATUS,
    name: translate('propertyPost.isRented'),
    checked: false,
  },
];

export const CONTRACT_STATUS = [
  {
    id: PostContractStatus.Unsent,
    name: translate('propertyPost.contractStatus.unsent'),
    checked: false,
  },
  {
    id: PostContractStatus.Waittosign,
    name: translate('propertyPost.contractStatus.waitToSign'),
    checked: false,
  },
  {
    id: PostContractStatus.Waitforpay,
    name: translate('propertyPost.contractStatus.waitForPay'),
    checked: false,
  },
  {
    id: PostContractStatus.Haspaid,
    name: translate('propertyPost.contractStatus.hasPaid'),
    checked: false,
  },
  {
    id: PostContractStatus.Refuse,
    name: translate('propertyPost.contractStatus.refuse'),
    checked: false,
  },
];
