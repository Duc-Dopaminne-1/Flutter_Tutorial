import React from 'react';
import { CustomSwitch } from '@src/components/CustomSwitch';
import { get } from 'lodash';
import { IUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { RootState } from '@src/types/types';
import NotificationsService from '@src/modules/notifications/service';
import NavigationActionsService from '@src/navigation/navigation';
import { Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '@src/modules/auth/actions';
import translate from '@src/localize';

const NotificationSwitch = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUser>((state: RootState) => state.auth.userData!);
  const allowNotification = get(me, ['notifications'], false);

  const onSwitchValueChange = (value: boolean) => {
    // Update profile notification and switch button
    dispatch(updateProfile({ data: { notifications: value } }));

    const permissionGranted = NotificationsService.getInstance().isNotificationPermissionGranted();

    if (!permissionGranted && value) {
      NavigationActionsService.showCustomPopup({
        text: translate('alert.open_notification_settings'),
        buttonRedTitle: translate('common.settings'),
        buttonGrayTitle: translate('common.ok'),
        onPressRedButton: () => {
          NavigationActionsService.hideCustomPopup();
          Linking.openSettings();
        },
      });

      setTimeout(() => {
        dispatch(updateProfile({ data: { notifications: false } }));
      }, 500);
    }
  };

  return <CustomSwitch switchValue={allowNotification} onValueChange={onSwitchValueChange} />;
};

export default NotificationSwitch;
