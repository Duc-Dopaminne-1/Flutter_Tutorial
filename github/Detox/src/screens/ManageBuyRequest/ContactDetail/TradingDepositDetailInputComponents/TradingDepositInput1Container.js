import React from 'react';

import TradingDepositInput1View from './Components/TradingDepositInput1View';
import useTradingDepositInput1 from './useTradingDepositInput1';

const getDefaultNumberOfDepositTimes = (editable, depositedTimes) => {
  const plusOneWhileEditing = editable ? 1 : 0;
  return ((depositedTimes || 0) + plusOneWhileEditing)?.toString();
};

const TradingDepositInput1Container = ({
  state,
  dispatch,
  errors,
  banks,
  focusedInput,
  onFocusInput,
  onBlurInput,
}) => {
  const context = useTradingDepositInput1({state, dispatch});

  const {propertyPostInfo = {}} = state.contactTradingInfo ?? {};
  const editingInfo = state?.deposit;
  const {
    depositStatus,
    rejectReason,
    depositUpdatedNumber,
    closingPrice,
    commission,
    commissionUnitId,
    commissionTpl,
    depositedAmount,
    depositPaymentTermFrom,
    depositPaymentTermTo,
    depositTerm,
    bankName,
    paymentMethodId,
  } = editingInfo ?? {};

  const numberOfDepositTimes = getDefaultNumberOfDepositTimes(state.canEdit, depositUpdatedNumber);

  const {
    price,
    commission: propertyCommission,
    propertyCode,
    saleCommissionCurrencyUnitId,
    commissionTpl: defaultCommissionTpl,
  } = propertyPostInfo ?? {};

  return (
    <TradingDepositInput1View
      editable={state.canEdit}
      errors={errors}
      postPrice={price}
      postCommission={propertyCommission}
      propertyCode={propertyCode}
      postCommissionUnitId={saleCommissionCurrencyUnitId}
      numberOfDepositTimes={numberOfDepositTimes}
      depositStatus={depositStatus}
      rejectReason={rejectReason}
      depositUpdatedNumber={depositUpdatedNumber}
      closingPrice={closingPrice}
      commission={commission}
      commissionUnitId={commissionUnitId}
      commissionTpl={commissionTpl ?? defaultCommissionTpl}
      depositedAmount={depositedAmount}
      depositPaymentTermFrom={depositPaymentTermFrom}
      depositPaymentTermTo={depositPaymentTermTo}
      depositTerm={depositTerm}
      bankName={bankName}
      paymentMethodId={paymentMethodId}
      banksData={banks}
      propertyPostInfo={propertyPostInfo}
      focusedInput={focusedInput}
      onFocusInput={onFocusInput}
      onBlurInput={onBlurInput}
      onChangeFinalPrice={context.handleOnChangeFinalPrice}
      onChangeDepositedAmount={context.handleOnChangeDepositedAmount}
      onPickDepositFromDate={context.onPickDateFrom}
      onPickDepositToDate={context.onPickDateTo}
      onChosenDepositMethod={context.handleOnChangeDepositMethod}
      onChosenBank={context.handleOnChangeBank}
      onChangeDepositValidDuration={context.handleOnChangeDepositValidDuration}
      onChangeCommission={context.handleOnChangeCommission}
      onChangeCommissionType={context.handleOnChangeCommissionType}
    />
  );
};

export default TradingDepositInput1Container;
