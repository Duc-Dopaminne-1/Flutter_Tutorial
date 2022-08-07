import {StringeeServerAddress} from 'stringee-react-native';

import Configs, {getConfigs} from '../../configs';

export const getServerAddresses = () => {
  if (Configs.stringee.IS_CLOUD) {
    return {};
  }
  return {
    serverAddresses: [
      new StringeeServerAddress(getConfigs().stringee.SERVER.V1, getConfigs().stringee.SERVER.PORT), //
      new StringeeServerAddress(getConfigs().stringee.SERVER.V2, getConfigs().stringee.SERVER.PORT),
    ],
  };
};

export const getWidgetKey = () => {
  if (Configs.stringee.IS_CLOUD) {
    return Configs.stringee.CHAT_WIDGET_CLOUD;
  }
  return getConfigs().stringee.CHAT_WIDGET;
};
