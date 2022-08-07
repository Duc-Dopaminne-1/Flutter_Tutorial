import React, { ReactElement, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NotificationSettingMessage } from '@/screens/NotificationSetting/component/NotificationSettingMessage';
import { NotificationSettingAuction } from '@/screens/NotificationSetting/component/NotificationSettingAuction';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationInit } from '@/redux/notification/reducer';
import { NotificationSettingMeetGreet } from '@/screens/NotificationSetting/component/NotificationSettingMeetGreet';
import { NOTIFICATION_SETTING } from '@/constants/app';
import { setNotificationSetting } from '@/redux/notification/actions';
import { NotificationSettingProfile } from '@/screens/NotificationSetting/component/NotificationSettingProfile';
import { NotificationSettingBidBid } from '@/screens/NotificationSetting/component/NotificationSettingBidBid';

export function NotificationSettingList(): ReactElement {
  const dispatch = useDispatch();
  const settings = useSelector((state: NotificationInit) => state.notification.setting.data);

  const toggleSwitch = useCallback((value: boolean, type: string) => {
    dispatch(
      setNotificationSetting({
        type,
        value,
      }),
    );
  }, []);

  return (
    <ScrollView style={styles.container}>
      <NotificationSettingMessage toggleSwitch={toggleSwitch} isNewMessage={settings[NOTIFICATION_SETTING.NEW_MESSAGE]} />
      <NotificationSettingAuction
        toggleSwitch={toggleSwitch}
        isAuctionStart={settings[NOTIFICATION_SETTING.AUCTION_START_OR_END]}
        isWonAuction={settings[NOTIFICATION_SETTING.WON_AUCTION]}
        isLostHighest={settings[NOTIFICATION_SETTING.LOST_HIGHEST_BID]}
      />
      <NotificationSettingMeetGreet
        toggleSwitch={toggleSwitch}
        isMeetReminder={settings[NOTIFICATION_SETTING.MEET_REMINDER]}
        isCancelMeet={settings[NOTIFICATION_SETTING.CANCEL_MEET]}
      />
      <NotificationSettingProfile
        toggleSwitch={toggleSwitch}
        isProfile={settings[NOTIFICATION_SETTING.PROFILE_WAS_LINKED]}
        isPayment={settings[NOTIFICATION_SETTING.PAYMENT]}
      />
      <NotificationSettingBidBid toggleSwitch={toggleSwitch} isNews={settings[NOTIFICATION_SETTING.SYSTEM]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});
