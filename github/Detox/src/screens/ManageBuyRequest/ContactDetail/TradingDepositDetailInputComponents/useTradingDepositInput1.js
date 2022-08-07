import {CommissionCurrencyUnit, FLOAT_NUMBER_REGEX} from '../../../../assets/constants';
import NumberUtils from '../../../../utils/NumberUtils';
import {dateToTimestamp} from '../../../../utils/TimerCommon';
import {DEPOSIT_INPUTS} from '../../DetailRequestConstant';
import {TradingDepositAction} from '../TradingDepositDetailScreen';

const useTradingDepositInput1 = ({state, dispatch}) => {
  const onPickDateFrom = date => {
    const timestamp = dateToTimestamp(date);
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [DEPOSIT_INPUTS.depositPaymentTermFrom]: timestamp,
      },
    });
  };

  const onPickDateTo = date => {
    const timestamp = dateToTimestamp(date);
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [DEPOSIT_INPUTS.depositPaymentTermTo]: timestamp,
      },
    });
  };

  const handleOnChangeIntInputs = (text, field) => {
    let value = NumberUtils.parseIntValue(text);
    value = value === 0 || String(value) === 'NaN' ? '' : value;
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [field]: value,
      },
    });
  };
  const handleOnChangeFinalPrice = text =>
    handleOnChangeIntInputs(text, DEPOSIT_INPUTS.closingPrice);
  const handleOnChangeCommission = text => {
    const isValidNumber = FLOAT_NUMBER_REGEX.test(text);
    if (
      (state.deposit?.commissionUnitId === CommissionCurrencyUnit.PERCENTAGE && text > 100) ||
      (!isValidNumber && text !== '')
    ) {
      text = state.deposit?.commission;
    }

    if (text > 0) {
      text = NumberUtils.parseFloatValue(text);
    }

    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [DEPOSIT_INPUTS.commission]: text,
      },
    });
  };
  const handleOnChangeDepositedAmount = text =>
    handleOnChangeIntInputs(text, DEPOSIT_INPUTS.depositedAmount);
  const handleOnChangeDepositValidDuration = text =>
    handleOnChangeIntInputs(text, DEPOSIT_INPUTS.depositTerm);

  const handleOnChangeDepositMethod = item => {
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        paymentMethodId: item.id ?? '',
      },
    });
  };

  const handleOnChangeCommissionType = item => {
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        commissionUnitId: item[0].id ?? '',
        commission: '',
      },
    });
  };

  const handleOnChangeBank = item => {
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        bankName: item.bankId ?? '',
      },
    });
  };

  return {
    onPickDateFrom,
    onPickDateTo,
    handleOnChangeBank,
    handleOnChangeCommission,
    handleOnChangeCommissionType,
    handleOnChangeDepositMethod,
    handleOnChangeDepositValidDuration,
    handleOnChangeDepositedAmount,
    handleOnChangeFinalPrice,
  };
};

export default useTradingDepositInput1;
