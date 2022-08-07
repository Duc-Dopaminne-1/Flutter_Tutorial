import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import NotificationSettingItem from '@/screens/NotificationSetting/component/NotificationSettingItem';
import { language } from '@/i18n';
import { NOTIFICATION_SETTING } from '@/constants/app';

interface Prop {
  toggleSwitch?: (isEnabled: boolean, type: string) => void;
  isMeetReminder?: boolean;
  isCancelMeet?: boolean;
}

export function NotificationSettingMeetGreet(props: Prop): ReactElement {
  const { isMeetReminder, isCancelMeet, toggleSwitch } = props;

  return (
    <View style={styles.container}>
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        type={NOTIFICATION_SETTING.MEET_REMINDER}
        isEnabled={isMeetReminder}
        title={language('greetNotifications')}
        content={language('greetReminder')}
      />
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        isEnabled={isCancelMeet}
        type={NOTIFICATION_SETTING.CANCEL_MEET}
        content={language('cancelMeetGreet')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
});
