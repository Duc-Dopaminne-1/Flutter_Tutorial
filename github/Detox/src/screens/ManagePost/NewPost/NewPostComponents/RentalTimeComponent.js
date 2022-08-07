import React, {useEffect, useState} from 'react';

import {GLOBAL_ACTIONS} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';

const mapTimes = (json, checkedId) => {
  const listTypes = json ?? null;
  if (!listTypes || !Array.isArray(listTypes)) {
    return [];
  }

  return listTypes.map(item => ({
    id: item.id,
    name: item.name,
    checked: item.id === checkedId ? true : false,
    value: item.value,
  }));
};

const RentalTimeComponent = ({state, dispatch, data, error}) => {
  const [listTypes, setListTypes] = useState([]);

  const onChangeState = (id, name, value) => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_RENTAL_TIME,
      payload: {
        id: id,
        value: value,
        name: name,
      },
    });
  };

  useEffect(() => {
    const selectedId = state?.rentPeriod?.id;
    const timeList = mapTimes(data, selectedId);
    if (!selectedId && timeList.length > 0) {
      timeList[1].checked = true;
      const item = timeList[1];
      onChangeState(item.id, item.name, item.value);
    }
    setListTypes(timeList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSelectTimeItem = item => {
    if (!item) {
      onChangeState('', '', '');
      return;
    }
    onChangeState(item.id, item.name, item.value);
  };
  return (
    <DropdownWithTitle
      style={METRICS.smallNormalMarginTop}
      title={translate(STRINGS.RENTAL_TIME)}
      titleStyle={commonStyles.blackText14}
      isRequired={true}
      colorTheme={COLORS.PRIMARY_A100}
      inputStyle={commonStyles.inputBorderWithIcon}
      dropdownTitle={translate(STRINGS.RENTAL_TIME)}
      popupTitle={translate(STRINGS.RENTAL_TIME)}
      headerStyles={commonStyles.blackText14}
      items={listTypes}
      onChosen={onSelectTimeItem}
      error={error}
    />
  );
};

export default RentalTimeComponent;
