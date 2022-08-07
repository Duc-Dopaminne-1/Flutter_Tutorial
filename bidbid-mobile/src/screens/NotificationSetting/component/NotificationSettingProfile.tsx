import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import NotificationSettingItem from '@/screens/NotificationSetting/component/NotificationSettingItem';
import { language } from '@/i18n';
import { NOTIFICATION_SETTING } from '@/constants/app';

interface Prop {
  toggleSwitch?: (isEnabled: boolean, type: string) => void;
  isPayment?: boolean;
  isProfile?: boolean;
}

export function NotificationSettingProfile(props: Prop): ReactElement {
  const { isProfile, isPayment, toggleSwitch } = props;

  return (
    <View style={styles.container}>
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        type={NOTIFICATION_SETTING.PROFILE_WAS_LINKED}
        isEnabled={isProfile}
        title={language('profileNotifications')}
        content={language('haveAnAuction')}
      />
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        isEnabled={isPayment}
        type={NOTIFICATION_SETTING.PAYMENT}
        content={language('receivedOrFailed')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
});
