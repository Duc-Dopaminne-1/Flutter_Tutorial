import React from 'react';

import {PAYMENT_METHODS} from '../../../../../assets/constants';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {METRICS} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import DropdownWithTitle from '../../../../../components/DropdownWithTitle';

export const paymentMethodOption = [
  {
    id: PAYMENT_METHODS.transfer.id,
    name: PAYMENT_METHODS.transfer.description,
    checked: false,
  },
  {
    id: PAYMENT_METHODS.cash.id,
    name: PAYMENT_METHODS.cash.description,
    checked: false,
  },
];
const mapData = chosenId => {
  return paymentMethodOption.map(e => ({
    ...e,
    name: e.name || e.description,
    checked: e.id === chosenId,
  }));
};

const SelectDepositMethodDropdown = ({chosenMethodId, onChosen, disabled}) => {
  const depositMethodList = mapData(chosenMethodId);
  const onChosenDepositMethod = item => {
    onChosen(item);
  };
  return (
    <>
      <DropdownWithTitle
        headerStyles={{...commonStyles.dropdownHeader, ...METRICS.smallPaddingTop}}
        inputStyle={disabled ? commonStyles.dropdownDisabled : commonStyles.dropdownInput}
        title={translate(STRINGS.DEPOSIT_METHOD)}
        dropdownPlaceHolderStyle={
          disabled
            ? {...commonStyles.dropdownPlaceHolder, color: COLORS.TEXT_DARK_40}
            : commonStyles.dropdownPlaceHolder
        }
        dropdownTitle={translate(STRINGS.SELECT_DEPOSIT_METHOD)}
        popupTitle={translate(STRINGS.SELECT_DEPOSIT_METHOD)}
        items={depositMethodList}
        showSearchBox
        error={''}
        itemSelected={() => {}} // TODO Parse data
        onChosen={onChosenDepositMethod}
        isRequiredAtLeastOne
        emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
        disabled={disabled}
      />
    </>
  );
};

export default SelectDepositMethodDropdown;
