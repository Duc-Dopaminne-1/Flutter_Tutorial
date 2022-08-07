import React, {useContext} from 'react';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {METRICS} from '../../../assets/theme/metric';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import logService from '../../../service/logService';
import {getLocationFullProcesss} from '../../../utils/GeolocationUtil';

const FindNearMeComponent = ({state, onCheckFindNearMe}) => {
  const {showErrorAlert} = useContext(AppContext);
  const getLocationSuccesss = location => {
    logService.log('location: ', location);
    onCheckFindNearMe(location, true);
  };

  const getLocationFail = error => {
    showErrorAlert(error);
    onCheckFindNearMe(null, false);
  };

  const onCheck = () => {
    const value = !state.findNearest;
    if (value) {
      getLocationFullProcesss(getLocationSuccesss, getLocationFail);
    } else {
      onCheckFindNearMe(null, value);
    }
  };

  return (
    <CustomCheckbox
      title={translate(STRINGS.FIND_EXPERTS_NEAREST_ME)}
      images={['checkbox', 'checkbox-blank-outline']}
      customCheckedBox
      style={METRICS.tinyMarginTop}
      checkValue={onCheck}
      shouldGetValueOutSide={true}
      parentCheckedValue={state.findNearest}
    />
  );
};

export default FindNearMeComponent;
