import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import NotificationSettingItem from '@/screens/NotificationSetting/component/NotificationSettingItem';
import { language } from '@/i18n';
import { NOTIFICATION_SETTING } from '@/constants/app';

interface Prop {
  toggleSwitch?: (isEnabled: boolean, type: string) => void;
  isNewMessage?: boolean;
}

export function NotificationSettingMessage(props: Prop): ReactElement {
  const { toggleSwitch, isNewMessage } = props;

  return (
    <View style={styles.container}>
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        type={NOTIFICATION_SETTING.NEW_MESSAGE}
        isEnabled={isNewMessage}
        title={language('messageNotifications')}
        content={language('newMessage')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
});
