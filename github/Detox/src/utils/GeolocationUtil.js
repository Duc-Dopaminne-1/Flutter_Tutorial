import RNLocation from 'react-native-location';

import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';
import {STRINGS} from '../assets/localize/string';
import logService from '../service/logService';

const GEO_CONSTANTS = {
  PERMISSION_WHEN_IN_USE: 'whenInUse',
  PERMISSION_FINE: 'fine',
};

const requestPermission = ({
  iosType = GEO_CONSTANTS.PERMISSION_WHEN_IN_USE,
  androidType = GEO_CONSTANTS.PERMISSION_FINE,
  title = translate(STRINGS.PERMISSION_REQUEST),
  message = translate(STRINGS.ALLOW_LOCATION_ACCESS_TO_USE_FEATURE),
  onResult,
}) => {
  RNLocation.requestPermission({
    ios: iosType,
    android: {
      detail: androidType,
      rationale: {
        title: title,
        message: message,
        buttonPositive: translate(STRINGS.OK),
      },
    },
  }).then(granted => {
    onResult(granted);
  });
};

const checkPermission = ({
  iosType = GEO_CONSTANTS.PERMISSION_WHEN_IN_USE,
  androidType = GEO_CONSTANTS.PERMISSION_FINE,
  onfulfilled,
  onrejected,
}) => {
  RNLocation.checkPermission({
    ios: iosType,
    android: {
      detail: androidType,
    },
  }).then(
    value => onfulfilled(value),
    reason => onrejected(reason),
  );
};

const getLatestLocation = ({timeout = 15000, onResult}) => {
  RNLocation.getLatestLocation({timeout: timeout}).then(latestLocation => {
    onResult(latestLocation);
  });
};

const getLocationFullProcesss = (onSuccess, onError) => {
  const onResultPermission = granted => {
    if (granted) {
      getLatestLocation({onResult: onSuccess});
    } else {
      onError(translate(Message.ERR_NOT_GRANT_PERMISSION_LOCATION));
    }
  };

  const onfulfilled = value => {
    logService.log('onfulfilled: ', value);
    if (!value) {
      requestPermission({onResult: onResultPermission});
    } else {
      getLatestLocation({onResult: onSuccess});
    }
  };

  const onrejected = reason => {
    logService.log('reason rejected permission: ', reason);
    requestPermission({onResult: onResultPermission});
  };

  checkPermission({onfulfilled, onrejected});
};

export {
  checkPermission,
  GEO_CONSTANTS,
  getLatestLocation,
  getLocationFullProcesss,
  requestPermission,
};
