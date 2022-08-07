import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import NotificationSettingItem from '@/screens/NotificationSetting/component/NotificationSettingItem';
import { language } from '@/i18n';
import { NOTIFICATION_SETTING } from '@/constants/app';

interface Prop {
  toggleSwitch?: (isEnabled: boolean, type: string) => void;
  isNews?: boolean;
}

export function NotificationSettingBidBid(props: Prop): ReactElement {
  const { isNews, toggleSwitch } = props;

  return (
    <View style={styles.container}>
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        type={NOTIFICATION_SETTING.SYSTEM}
        isEnabled={isNews}
        title={language('bidbidNotifications')}
        content={language('newsOffers')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
});
