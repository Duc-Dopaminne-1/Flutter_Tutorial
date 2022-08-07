import {StyleSheet} from 'react-native';

import {CONTACT_TRADING_DEPOSIT_STATUS} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {small} from '../../assets/theme/metric';
import {CommonDetailTransactionStyles} from '../Transaction/DetailTransaction/Components/DetailTransactionConstant';

const styles = StyleSheet.create({
  ...CommonDetailTransactionStyles,
  contentContainer: {
    marginVertical: small,
  },
  timeText: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.TEXT_DARK_40,
  },
});

const REQUEST_DETAIL_ACTIONS = {
  SET_PENDING_REQUEST_INFO: 'SET_PENDING_REQUEST_INFO',
  SET_COMPLETE_REQUEST_INFO: 'SET_COMPLETE_REQUEST_INFO',
  SET_CONTACT_UPDATING_STATE: 'SET_CONTACT_UPDATING_STATE',
  SET_CONTACT_TRADING_INFO: 'SET_CONTACT_TRADING_INFO',
  SET_NEGOTIATION_REQUEST_INFO: 'SET_NEGOTIATION_REQUEST_INFO',
  SET_DEPOSIT_REQUEST_INFO: 'SET_DEPOSIT_REQUEST_INFO',
  RESET_DEPOSIT_REQUEST_INFO: 'RESET_DEPOSIT_REQUEST_INFO',
  RESET_COMPLETE_REQUEST_INFO: 'RESET_COMPLETE_REQUEST_INFO',
};

const RequestType = {
  Sending: 'Sending',
  Receiving: 'Receiving',
};

const StateType = {};

const EndRequestType = {
  Completed: 'Completed',
};

const CONTACT_ACTIONS = {
  FIELD: 'FIELD',
  POST_CODE: 'POST_CODE',
  SET_ERROR_STATE: 'SET_ERROR_STATE',
  SET_STATUS: 'SET_STATUS',
  EDIT_STATUS: 'EDIT_STATUS',
  VIEW_STATUS: 'VIEW_STATUS',
};

const CONTACT_FIELD = {
  fieldName: 'fieldName',
  location: 'location',
  postUrl: 'postUrl',
  postCode: 'postCode',
  postInfo: 'postInfo',
  city: 'city',
  district: 'district',
  fromPrice: 'fromPrice',
  toPrice: 'toPrice',
  fromArea: 'fromArea',
  toArea: 'toArea',
  areaMeasurement: 'areaMeasurement',
  contactType: 'contactType',
  propertyPostTypeId: 'propertyPostTypeId',
  project: 'project',
  interestedCity: 'interestedCity',
  interestedDistrict: 'interestedDistrict',
  interestedPrice: 'interestedPrice',
  direction: 'direction',
  action: 'action',
};

const DETAIL_FIELD = {
  transactionType: translate(STRINGS.TRANSACTION_TYPE),
  propertyType: translate(STRINGS.BDS_PROPERTY_TYPE),
  project: translate(STRINGS.PROJECT),
  area: translate(STRINGS.AREA),
  price: translate(STRINGS.INTERESTED_PRICE_DESCRIPTION),
  acreage: translate(STRINGS.ACREAGE),
  direction: translate(STRINGS.DIRECTION),
  floor: translate(STRINGS.FLOOR),
  block: translate(STRINGS.TOWER),
  note: translate(STRINGS.NOTE),
  productCode: translate(STRINGS.PRODUCT_CODE),
  subArea: translate(STRINGS.SUB_AREA),
};

const DEPOSIT_STATUS = {
  [CONTACT_TRADING_DEPOSIT_STATUS.sent]: translate('contactTrading.deposit.status.sent'),
  [CONTACT_TRADING_DEPOSIT_STATUS.accepted]: translate('contactTrading.deposit.status.accepted'),
  [CONTACT_TRADING_DEPOSIT_STATUS.rejected]: translate('contactTrading.deposit.status.rejected'),
  [CONTACT_TRADING_DEPOSIT_STATUS.signed]: translate('contactTrading.deposit.status.signed'),
};

const DEPOSIT_STATUS_COLOR = {
  [CONTACT_TRADING_DEPOSIT_STATUS.sent]: COLORS.ORANGE_0C,
  [CONTACT_TRADING_DEPOSIT_STATUS.accepted]: COLORS.BLUE_86,
  [CONTACT_TRADING_DEPOSIT_STATUS.rejected]: COLORS.RED_20,
  [CONTACT_TRADING_DEPOSIT_STATUS.signed]: COLORS.GREEN_60,
};

const DEPOSIT_STATUS_LINK_DESC = {
  [CONTACT_TRADING_DEPOSIT_STATUS.sent]: translate('contactTrading.deposit.status.sent'),
  [CONTACT_TRADING_DEPOSIT_STATUS.accepted]: translate('contactTrading.deposit.status.accepted'),
  [CONTACT_TRADING_DEPOSIT_STATUS.rejected]: translate('contactTrading.deposit.status.rejected'),
  [CONTACT_TRADING_DEPOSIT_STATUS.signed]: translate('contactTrading.deposit.status.signed'),
};

const EDIT_STATUS_TYPE = {
  negotiate: 'negotiate',
  deposit: 'deposit',
  complete: 'complete',
};

const DEPOSIT_INPUTS = {
  closingPrice: 'closingPrice',
  commission: 'commission',
  depositPaymentTermFrom: 'depositPaymentTermFrom',
  depositPaymentTermTo: 'depositPaymentTermTo',
  moveInDate: 'moveInDate',
  depositedAmount: 'depositedAmount',
  depositTerm: 'depositTerm',
  propertyPostId: 'propertyPostId',
  bankName: 'bankName',
};

const DEPOSIT_INPUTS2 = {
  attachment: 'attachment',
  recipientName: 'recipientName',
  recipientPhoneNumber: 'recipientPhoneNumber',
  recipientIdentityCard: 'recipientIdentityCard',
  recipientEmail: 'recipientEmail',
  depositorName: 'depositorName',
  depositorPhoneNumber: 'depositorPhoneNumber',
  depositorIdentityCard: 'depositorIdentityCard',
  depositorEmail: 'depositorEmail',
  paymentDatetime: 'paymentDatetime',
  amount: 'amount',
  notarizationDatetime: 'notarizationDatetime',
  notaryOffice: 'notaryOffice',
  depositNote: 'depositNote',
  payAmount: 'payAmount',
  paymentNote: 'paymentNote',
};

export {
  CONTACT_ACTIONS,
  CONTACT_FIELD,
  DEPOSIT_INPUTS,
  DEPOSIT_INPUTS2,
  DEPOSIT_STATUS,
  DEPOSIT_STATUS_COLOR,
  DEPOSIT_STATUS_LINK_DESC,
  DETAIL_FIELD,
  EDIT_STATUS_TYPE,
  EndRequestType,
  REQUEST_DETAIL_ACTIONS,
  RequestType,
  StateType,
  styles,
};
