import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { WELCOME_SCREEN } from '@/navigation/screenKeys';
import { logout } from '@/redux/auth/actions';
import NotificationsService from '@/shared/notification';
import { logOutGoogleIfNeeded } from '@/shared/Social';
import { SocketManager } from '@/shared/socket/socket-manager';
import React, { memo, ReactElement, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import LogoutConfirmDialog from '../LogoutConfirmDialog';
import IconGrayLogoutSVG from '@/components/SVG/IconGrayLogoutSVG';

const LogoutContainer = (): ReactElement => {
  const dispatch = useDispatch();

  const [logConfirmDialogVisible, seLogConfirmDialogVisible] = useState(false);

  const logOutOnPressedCallback = useCallback(() => {
    NavigationActionsService.showLoading();
    dispatch(
      logout({
        onSuccess: async () => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.setRoot(WELCOME_SCREEN);
          NotificationsService.clearBadge();
          SocketManager.close();
          await logOutGoogleIfNeeded();
        },
        onFail: () => {
          NavigationActionsService.hideLoading();
        },
      }),
    );
  }, []);

  return (
    <>
      <CustomItemSetting
        onPress={() => seLogConfirmDialogVisible(true)}
        title={language('logout')}
        containerStyle={styles.container}
        image={<IconGrayLogoutSVG />}
      />
      <LogoutConfirmDialog
        isVisible={logConfirmDialogVisible}
        onBackdropPress={() => seLogConfirmDialogVisible(false)}
        confirmOnPressedCallback={logOutOnPressedCallback}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 5,
  },
});

export default memo(LogoutContainer);
