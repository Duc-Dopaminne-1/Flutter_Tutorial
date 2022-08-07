import React, { useEffect, useImperativeHandle, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BACKGROUND_COLOR } from './constants/colors';
import storeConfig from './redux/store/configureStore';
import RootNavigator from './routes/RootNavigator';
import { initLanguge } from './i18n';
import themeContext from './constants/theme/themeContext';
import { theme as DefaultTheme } from './constants/theme/theme';
import { TpfSdkClient } from '../index';
import AppConfigs from './configs/appConfigs';
import { configureFonts } from './constants/appFonts';
import settingContext from './constants/setting/settingContext';
const Root = React.forwardRef(({ onLoaded, theme, remoteAddress, eventHandlers, setting }, ref) => {
  useEffect(() => {
    AppConfigs.END_POINT = remoteAddress;
    AppConfigs.AUTHOR_SDK = setting.appId;
    TpfSdkClient.setEventHandlers(eventHandlers);
  }, [setting, AppConfigs, remoteAddress]);

  const themeInitial = useMemo(
    () => ({
      ...DefaultTheme,
      app: Object.assign({}, DefaultTheme.app, theme?.app),
      button: Object.assign({}, DefaultTheme.button, theme?.button),
      icon: Object.assign({}, DefaultTheme.icon, theme?.icon),
      text: Object.assign({}, DefaultTheme.text, theme?.text),
      fonts: configureFonts(theme?.fonts)
      // ...other theme //
    }),
    [DefaultTheme, theme]
  );
  useImperativeHandle(ref, () => {
    return {
      connect: data => TpfSdkClient.connect(data),
      disConnect: () => TpfSdkClient.disConnect(),
      changeLanguage: lang => initLanguge(lang),
      showApplications: params => TpfSdkClient.showApplications(params),
      showHistorys: params => TpfSdkClient.showHistorys(params),
      showBalance: params => TpfSdkClient.showBalance(params),
      showRefund: params => TpfSdkClient.showRefund(params),
      showProductSuggest: params => TpfSdkClient.showProductSuggest(params),
      showProducts: params => TpfSdkClient.showProducts(params),
      showDetailNotification: params => TpfSdkClient.showDetailNotification(params),
      requestLogin: params => TpfSdkClient.requestLogin(params)
    };
  });

  useEffect(() => {
    initLanguge();
  }, []);

  return (
    <themeContext.Provider value={themeInitial}>
      <settingContext.Provider value={setting}>
        <Provider store={storeConfig.store}>
          <RootSiblingParent>
            <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR.White} />
            <PersistGate loading={null} persistor={storeConfig.persistor}>
              <RootNavigator onLoaded={onLoaded} ref={ref} />
            </PersistGate>
          </RootSiblingParent>
        </Provider>
      </settingContext.Provider>
    </themeContext.Provider>
  );
});

export default Root;
