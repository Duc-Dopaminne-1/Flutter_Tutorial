import React, {useContext} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {logout} from '../../api/authApi';
import {usePushNotification} from '../../api/masterData/usePushNotification';
import {AppContext} from '../../appData/appContext/useAppContext';
import {clearAuthState} from '../../appData/authState';
import {clearVisitedItemsC2C} from '../../appData/c2c/actions';
import {getPushNotificationId} from '../../appData/user/selectors';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {METRICS} from '../../assets/theme/metric';
import CustomListItem from '../../components/CustomListItem';
import {removeExternalUserId} from '../../pushNotification/OneSignalPush';
import {StringeeContext} from '../Call/StringeeContext';
import {callAfterInteraction} from '../commonHooks';
import {useTPFClient} from '../TPF/hooks/useTPFClient';
import profileCommonStyle from './profileCommonStyle';

const SignOutButton = () => {
  const {showAppSpinner, showAppModal, setIsLoggedIn} = useContext(AppContext);
  const {clearLocalDatabase, unRegisterPush} = useContext(StringeeContext);
  const tpfClient = useTPFClient();
  const dispatch = useDispatch();
  const pushNotificationId = useSelector(getPushNotificationId);
  const {changePushNotificationMode} = usePushNotification({
    onSuccess: onFinishChangePushNotification,
    onError: onFinishChangePushNotification,
  });

  async function onFinishChangePushNotification() {
    unRegisterPush();
    tpfClient.logout();
    clearLocalDatabase();
    removeExternalUserId(pushNotificationId);
    await logout();
    await dispatch(clearAuthState());
    dispatch(clearVisitedItemsC2C());
    setIsLoggedIn(false);
    showAppSpinner(false);
  }

  const onOkHandler = () => {
    callAfterInteraction(() => {
      showAppSpinner(true);
      changePushNotificationMode(false); //disable push notification to user
    });
  };

  const onSignOut = async () => {
    showAppModal({
      isVisible: true,
      message: translate(STRINGS.LOGOUT_MESSAGE),
      cancelText: translate(STRINGS.CANCEL),
      onOkHandler: onOkHandler,
    });
  };

  return (
    <View style={profileCommonStyle.profileNavContainer}>
      <CustomListItem
        title={translate(STRINGS.LOGOUT)}
        imageSource={IMAGES.IC_MORE_LOGOUT}
        backgroundIcon={COLORS.RED_03}
        onPress={onSignOut}
        customStyle={[METRICS.resetMargin, METRICS.horizontalPadding]}
      />
    </View>
  );
};

export default SignOutButton;
