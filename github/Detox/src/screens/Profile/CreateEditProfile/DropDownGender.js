import React, {useEffect, useState} from 'react';

import {CONSTANTS} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {METRICS} from '../../../assets/theme/metric';
import DropdownWithTitle from '../../../components/DropdownWithTitle';

export const GENDERS = {
  1: 'MALE',
  2: 'FEMALE',
};

export const getGenderKey = value => {
  switch (value) {
    case 'MALE':
      return 1;
    case 'FEMALE':
      return 2;
    default:
      return 0;
  }
};

const DropDownGender = ({onChosenGender, initialGender, inputStyle}) => {
  const [genderItems, setGenderItems] = useState(CONSTANTS.GENDERS);

  useEffect(() => {
    const genders = CONSTANTS.GENDERS.map(gender => ({...gender, checked: false}));
    switch (initialGender) {
      case 'MALE':
        genders[0].checked = true;
        break;
      case 'FEMALE':
        genders[1].checked = true;
        break;

      default:
        break;
    }
    setGenderItems(genders);
  }, [initialGender]);

  return (
    <DropdownWithTitle
      style={METRICS.smallMarginTop}
      title={translate(STRINGS.GENDER)}
      dropdownTitle={translate(STRINGS.CHOOSE_GENDER)}
      popupTitle={translate(STRINGS.GENDER)}
      items={genderItems}
      showSearchBox={false}
      error={''}
      inputStyle={inputStyle}
      itemSelected={() => {}} // TODO Parse data
      onChosen={onChosenGender}
    />
  );
};

export default DropDownGender;
