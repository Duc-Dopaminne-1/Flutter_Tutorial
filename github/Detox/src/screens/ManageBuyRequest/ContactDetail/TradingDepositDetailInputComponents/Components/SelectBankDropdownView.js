import React, {useEffect} from 'react';

import {PAYMENT_METHODS} from '../../../../../assets/constants';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {METRICS} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import DropdownWithTitle from '../../../../../components/DropdownWithTitle';
import {dropdownMapper} from '../../../../../utils/DataProcessUtil';

const getBankList = (banks, selectedBankName) => {
  const selectedBank = banks?.filter(
    e => e.bankId === selectedBankName || e.bankName === selectedBankName,
  );
  const bankList = dropdownMapper(
    banks,
    'bankId',
    'bankName',
    selectedBank?.length > 0 ? selectedBank[0].bankId : '',
  );

  return bankList;
};

const SelectBankDropdownView = ({
  onChosen,
  chosenMethodId,
  banksData,
  chosenBankName,
  error,
  disabled,
}) => {
  const bankListCustom =
    banksData?.map(e => ({
      ...e,
      bankName: `${e.bankName} (${e.bankCode})`,
    })) ?? [];

  const bankList = getBankList(bankListCustom, chosenBankName);

  const isPayCash = chosenMethodId === PAYMENT_METHODS.cash.id;

  const onChosenBank = item => {
    onChosen(item);
  };

  const onChosenPaymentByCash = () => {
    if (isPayCash) {
      onChosen('');
    }
  };
  useEffect(onChosenPaymentByCash, [chosenMethodId]);

  return (
    <>
      <DropdownWithTitle
        headerStyles={{...commonStyles.dropdownHeader, ...METRICS.smallPaddingTop}}
        inputStyle={
          isPayCash || disabled ? commonStyles.dropdownDisabled : commonStyles.dropdownInput
        }
        title={translate(STRINGS.BANK)}
        dropdownPlaceHolderStyle={
          disabled
            ? {...commonStyles.dropdownPlaceHolder, color: COLORS.TEXT_DARK_40}
            : commonStyles.dropdownPlaceHolder
        }
        dropdownTitle={isPayCash ? '--' : translate(STRINGS.SELECT_BANK)}
        popupTitle={isPayCash ? '--' : translate(STRINGS.SELECT_BANK)}
        items={bankList}
        showSearchBox
        error={error && translate(error)}
        itemSelected={() => {}} // TODO Parse data
        onChosen={onChosenBank}
        isRequiredAtLeastOne
        emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
        disabled={isPayCash || disabled}
      />
    </>
  );
};

export default SelectBankDropdownView;
