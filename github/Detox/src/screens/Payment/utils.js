import isEmpty from 'lodash/isEmpty';

import {PaymentMethod, PaymentUnit} from '../../api/graphql/generated/graphql';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import ArrayUtils from '../../utils/ArrayUtils';
import NumberUtils from '../../utils/NumberUtils';

const BANKS = [
  {
    id: 0,
    image: IMAGES.LOGO_BIDV,
    paymentUnit: PaymentUnit.Bidv,
    checked: true,
  },
];

export const B2C_PAYMENT_METHODS = [
  {
    id: PaymentMethod.Banktransfer,
    paymentMethod: PaymentMethod.Banktransfer,
    title: translate('common.bankTransfer'),
    description: translate('transaction.nationalBankTransferDescription'),
    checked: false,
    isActive: true,
    paymentMethodOrder: 0,
    transactionPaymentUnitDtos: BANKS,
  },
  {
    id: PaymentMethod.Ewallet,
    paymentMethod: PaymentMethod.Ewallet,
    title: translate('common.payWithVNPay'),
    description: translate('transaction.vnpayTransferDescription'),
    checked: false,
    isActive: true,
    paymentMethodOrder: 1,
    transactionPaymentUnitDtos: null,
  },
  {
    id: PaymentMethod.Cash,
    paymentMethod: PaymentMethod.Cash,
    title: translate('common.cash'),
    description: translate('transaction.cashTransferDescription'),
    checked: false,
    isActive: true,
    paymentMethodOrder: 2,
    transactionPaymentUnitDtos: null,
  },
];

export const initialPaymentMethod = (data: Array, fundAccounts: Array) => {
  if (ArrayUtils.hasArrayData(data)) {
    const customData = data.map(e => {
      if (e.paymentMethod === PaymentMethod.Cash) {
        return {...e, transactionPaymentUnitDtos: fundAccounts};
      } else {
        return {...e};
      }
    });

    return customData;
  }
  return data;
};

export const mapAvailablePaymentMethods = (data: Array, selectedItemId) => {
  const items = [...data];
  if (ArrayUtils.hasArrayData(items)) {
    const result = items
      ?.filter(e => e?.isActive)
      ?.map((elem, index) => ({
        ...elem,
        visible: !isEmpty(selectedItemId) ? elem?.id === selectedItemId : index === 0,
        checked: !isEmpty(selectedItemId) ? elem?.id === selectedItemId : index === 0,
      }));
    return result;
  }
  return [];
};

const groupBy = keys => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map(key => obj[key]).join('-');
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

/**
 * customListTopenLandOffices
 * @param {*} items data input filter
 * @param {*} key filter groups by key
 * @returns  join all groups by cityId and add first item header groups
 */
export const customListTopenLandOffices = (items: Array, key = 'cityId') => {
  if (ArrayUtils.hasArrayData(items)) {
    const groupByCity = groupBy([key]);
    const data = groupByCity(items);

    let result = [];
    const allGroups = Object.keys(data);
    allGroups.forEach(groupKey => {
      const cityIdInt = NumberUtils.parseIntValue(groupKey);
      const isVisible = items.filter(e => e.cityId === cityIdInt)?.some(s => s?.isActive);
      const resultItem = {
        fundAccountId: null,
        cityId: cityIdInt,
        visible: isVisible,
        checked: false,
        phoneNumber: null,
        branchName: null,
        branchAddress: null,
        faxNumber: null,
        fundEmail: null,
      };
      result.push(resultItem);
      const dataItem = data[groupKey].map(item => ({...item, visible: true}));
      result = [...result, ...dataItem];
    });

    return result.filter(r => r.visible);
  }

  return [];
};
