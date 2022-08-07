import React from 'react';

import TradingDepositInput2View from './Components/TradingDepositDetail2View';
import {useTradingDepositInput2} from './useTradingDepositInput2';

const TradingDepositInput2Container = ({
  state,
  dispatch,
  errors,
  photoViewer,
  focusedInput,
  onFocusInput,
  onBlurInput,
}) => {
  const {deposit: editingDepositInfo = {}} = state ?? {};

  const context = useTradingDepositInput2({state, dispatch});

  return (
    <TradingDepositInput2View
      paymentProgressDtos={editingDepositInfo?.paymentProgressDtos}
      notarizationDatetime={editingDepositInfo?.notarizationDatetime}
      notaryOffice={editingDepositInfo?.notaryOffice}
      attachment={editingDepositInfo?.attachment}
      canEdit={state.canEdit}
      invalidPaymentDatetime={context.invalidPaymentDatetime}
      errors={errors}
      onChangeItemDepositAmount={context.onChangeItemDepositAmount}
      onChangeItemPaymentDatetime={context.onChangeItemPaymentDatetime}
      onChangeItemPaymentTerms={context.onChangeItemPaymentTerms}
      onPressNewProgress={context.onPressNewProgress}
      onPressEraseProgress={context.onPressEraseProgress}
      showAddPaymentProgressBtn={context.showAddPaymentProgressBtn}
      onPickNotarizeDate={context.onPickNotarizeDate}
      onChangeNotaryOffice={context.onChangeNotaryOffice}
      handleOnSelectedImages={context.handleOnSelectedImages}
      photoViewer={photoViewer}
      onPressDownloadContract={context.onPressDownloadContract}
      onChangeNote={context.onChangeNote}
      focusedInput={focusedInput}
      onFocusInput={onFocusInput}
      onBlurInput={onBlurInput}
    />
  );
};

export default TradingDepositInput2Container;
