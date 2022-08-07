import React, {useState} from 'react';

import {CONTACT_TRADING_TYPE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import DropdownListView from './DropdownListView';

export const contactTypesList = [
  {
    id: CONTACT_TRADING_TYPE.BUY,
    name: translate('common.sell'),
    checked: true,
  },
  {
    id: CONTACT_TRADING_TYPE.RENT,
    name: translate('common.rent'),
    checked: false,
  },
];

const SelectTransactionTypeDropdownView = ({onSelected = () => {}}) => {
  const [contactTypes] = useState(contactTypesList.map(e => ({...e})));
  const onChosenTransactionType = item => {
    if (item) {
      onSelected(item);
    }
  };
  return (
    <>
      <DropdownListView
        data={contactTypes}
        viewTitle={translate(STRINGS.TRANSACTION_TYPE)}
        modalTitle={translate(STRINGS.TRANSACTION_TYPE)}
        placeHolder={translate(STRINGS.TRANSACTION_TYPE)}
        onSelected={onChosenTransactionType}
      />
    </>
  );
};

export default SelectTransactionTypeDropdownView;
