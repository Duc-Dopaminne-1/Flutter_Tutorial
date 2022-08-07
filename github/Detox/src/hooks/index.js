import {useContext, useState} from 'react';

import {AppContext} from '../appData/appContext/useAppContext';
import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';
import CallUtil from '../utils/CallUtil';
import NumberUtils from '../utils/NumberUtils';
import UrlUtils from '../utils/UrlUtils';

const valueMinMax = (value, min, max) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};

export const useValidateFloat = (
  defaulValue,
  minValue,
  maxValue,
  minRange = 0,
  maxRange = 100,
  maxFractionDigit = 2,
) => {
  const [value, setValue] = useState(defaulValue);
  const onChange = text => {
    const newText = text.replace(',', '.');
    const isValid = NumberUtils.isValidFloatNumberInRange(
      newText,
      minRange,
      maxRange,
      maxFractionDigit,
    );
    if (isValid) {
      setValue(newText);
    }
  };
  const onBlur = () => {
    setValue(valueMinMax(value, minValue, maxValue));
  };
  return {value, setValue, onChange, onBlur};
};

export const useContactInfo = (phone, email) => {
  const {showErrorAlert} = useContext(AppContext);

  const callPhone = () => {
    const url = CallUtil.callUrl(phone);
    UrlUtils.openUrl(url, () => {
      showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
    });
  };

  const sendEmail = () => {
    if (email) {
      const url = `mailto:${email}`;
      UrlUtils.openUrl(url, () => {
        showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
      });
    }
  };
  return {callPhone, sendEmail};
};

export const useSetRangeValue = initValue => {
  const [fromValue, setFromValue] = useState(initValue[0]);
  const [toValue, setToValue] = useState(initValue[1]);

  const setRangeValue = value => {
    if (value && Array.isArray(value)) {
      setFromValue(value[0]);
      setToValue(value[1]);
    }
  };

  const onChangeFromValue = (value, rawValue) => {
    setFromValue(rawValue ?? '');
  };

  const onChangeToValue = (value, rawValue) => {
    setToValue(rawValue || '');
  };

  const onBlur = () => {
    if (NumberUtils.parseIntValue(fromValue) > NumberUtils.parseIntValue(toValue)) {
      setToValue(fromValue);
      setFromValue(toValue);
    }
  };
  return {value: [fromValue, toValue], onBlur, setRangeValue, onChangeFromValue, onChangeToValue};
};
