import {TRANSACTION_MODE} from '../assets/constants';
import MeasureUtils from './MeasureUtils';

export const isDepositStatus = projectStatus => {
  return [TRANSACTION_MODE.MOVE_DEPOSIT, TRANSACTION_MODE.DEPOSIT].includes(projectStatus);
};

export const getPriceForSlot = ({projectStatus, priceNoVat, priceVat}) => {
  if (isDepositStatus(projectStatus)) {
    return MeasureUtils.getPriceDescriptionNoUnitInput(
      priceNoVat >= priceVat ? priceNoVat : priceVat,
    );
  } else {
    return null;
  }
};

export const getPriceForConfirm = ({
  isDespositTransaction,
  data: {propertyPrice, expectedPrice},
  translate,
}) => {
  const lablePrice = isDespositTransaction
    ? translate('project.confirmProperty.priceVAT')
    : translate('common.expectedPrice');
  const price = isDespositTransaction ? propertyPrice : expectedPrice;
  return {
    price,
    lablePrice,
  };
};
