import {Platform} from 'react-native';

import EnvironmentUtil from '../utils/EnvironmentUtil';

const logServiceDebug = console;

const logServiceRelease = {
  log: () => {},
};

const logService = EnvironmentUtil.isDebug ? logServiceDebug : logServiceRelease;

const logWithIcon = (icon, name, payload) => {
  if (EnvironmentUtil.isDebug) {
    // eslint-disable-next-line no-console
    console.info(icon, name);
    // eslint-disable-next-line no-console
    console.tron.log({[icon]: name, ...payload});
  }
};

export const logNavi = ({name, params}) => {
  logWithIcon('🖥 ', name, params);
};

export const logRestful = (url, payload) => {
  logWithIcon('🚀', url, payload);
};

export const logGraphql = ({operationName, variables}) => {
  logWithIcon('🚀', operationName, variables);
};

export const logNotification = (action, payload) => {
  logWithIcon('🔔', action, payload);
};

export const logStringee = (name, payload) => {
  logWithIcon('📞', Platform.OS + ' ' + name, payload);
};

export const logTPF = (name, payload) => {
  logWithIcon('TPF', name, payload);
};

export default logService;
