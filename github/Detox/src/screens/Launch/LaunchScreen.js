import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {persistStore} from 'redux-persist';

import {useGetMasterData} from '../../api/masterData/useGetMasterDataAction';
import {refreshTokenAction} from '../../api/userApi';
import {AppContext} from '../../appData/appContext/useAppContext';
import {setAppLanguage, setOnboardingVersionViewed} from '../../appData/appSettings';
import {getAppLanguage, getOnboardingVersionViewed} from '../../appData/appSettings/selectors';
import {clearAuthState, setAuthState} from '../../appData/authState';
import {store} from '../../appData/store';
import {getUserId} from '../../appData/user/selectors';
import {setMainLocaleLanguage, translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {commonStyles} from '../../assets/theme/styles';
import LaunchBackgroundComponent from '../../components/LaunchBackgroundComponent';
import Onboarding from '../../components/Onboarding';
import Configs from '../../configs';
import {FeatureConfig} from '../../configs/FeatureConfig';
import {isSecuredBinary} from '../../service/checkSecurity';
import logService from '../../service/logService';
import {getUserCredentials} from '../../service/secureData';
import {callAfterInteraction, useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import {VersionModal} from './VersionModal';

const LaunchScreen = ({navigation}) => {
  const {showAppSpinner, setIsLoggedIn, setIsAppLoaded, clearLaunchUrl, showErrorAlert} =
    useContext(AppContext);
  const [isOnboarding, setOnBoarding] = useState(false);
  const [isSecurityEnv, setSecurityEnv] = useState(false);

  const onSuccessGetMasterData = () => {
    showAppSpinner(false);
    callAfterInteraction(() => {
      setIsAppLoaded(true);
      navigation.replace(ScreenIds.MainTab);
    });
  };

  const onErrorGetMasterData = () => {
    showAppSpinner(false);
    callAfterInteraction(async () => {
      setIsAppLoaded(true);
      clearLaunchUrl();
      await store.dispatch(clearAuthState());
      showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR), startGetMasterData);
    });
  };

  const {startGetMasterData} = useGetMasterData({
    onSuccess: onSuccessGetMasterData,
    onError: onErrorGetMasterData,
  });

  const checkSecurity = async () => {
    showAppSpinner(true);
    const canRunApp = await isSecuredBinary();
    showAppSpinner(false);
    if (canRunApp) {
      setSecurityEnv(true);
    } else {
      callAfterInteraction(() => {
        showErrorAlert(translate(STRINGS.UNSECURED_ENVIRONMENT));
      });
    }
  };

  const checkLogin = async () => {
    showAppSpinner(true);

    const savedUserId = getUserId(store.getState());
    if (!savedUserId) {
      //no user store on redux storage => clear credential
      await store.dispatch(clearAuthState());
    }

    let userCredentials = null;
    try {
      userCredentials = await getUserCredentials();
    } catch (error) {
      logService.log('error: ', error);
    }

    const accessToken = userCredentials?.accessToken;
    if (accessToken) {
      await store.dispatch(setAuthState(userCredentials));
      const response = await refreshTokenAction(userCredentials?.refreshToken);
      if (response) {
        setIsLoggedIn(true);
        startGetMasterData();
        return;
      }
    }

    await store.dispatch(clearAuthState());
    setIsLoggedIn(false);
    startGetMasterData();
  };

  const gotoNext = () => {
    showAppSpinner(true);
    store.dispatch(setOnboardingVersionViewed(Configs.onboardingVersion));
    checkLogin();
  };

  const loadInitFlowData = async () => {
    persistStore(store, null, async () => {
      const language = getAppLanguage(store.getState());
      setMainLocaleLanguage(language);
      store.dispatch(setAppLanguage(language));

      const onboardingVersionViewed = getOnboardingVersionViewed(store.getState());
      const needShowOnboarding = onboardingVersionViewed !== Configs.onboardingVersion;
      if (needShowOnboarding) {
        setOnBoarding(true);
        showAppSpinner(false);
        return;
      }

      await checkLogin();
    });
  };

  useMount(() => {
    SplashScreen.hide();
    setIsLoggedIn(false);
    setIsAppLoaded(false);
    checkSecurity();
    if (FeatureConfig.disableCheckAppVersion) {
      loadInitFlowData();
    }
  });

  return (
    <View testID="launch_screen" style={commonStyles.screenContainer}>
      {isOnboarding ? <Onboarding gotoNext={gotoNext} /> : <LaunchBackgroundComponent />}
      {!FeatureConfig.disableCheckAppVersion && isSecurityEnv && (
        <VersionModal onCheckDone={loadInitFlowData} />
      )}
    </View>
  );
};

export default LaunchScreen;
