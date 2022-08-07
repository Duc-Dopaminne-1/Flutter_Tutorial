import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import NotificationSettingItem from '@/screens/NotificationSetting/component/NotificationSettingItem';
import { language } from '@/i18n';
import { NOTIFICATION_SETTING } from '@/constants/app';

interface Prop {
  toggleSwitch?: (isEnabled: boolean, type: string) => void;
  isAuctionStart?: boolean;
  isWonAuction?: boolean;
  isLostHighest?: boolean;
}

export function NotificationSettingAuction(props: Prop): ReactElement {
  const { toggleSwitch, isAuctionStart, isWonAuction, isLostHighest } = props;

  return (
    <View style={styles.container}>
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        type={NOTIFICATION_SETTING.AUCTION_START_OR_END}
        isEnabled={isAuctionStart}
        title={language('auctionNotifications')}
        content={language('newAuction')}
      />
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        isEnabled={isWonAuction}
        type={NOTIFICATION_SETTING.WON_AUCTION}
        content={language('wonTheAuction')}
      />
      <NotificationSettingItem
        toggleSwitchCallBack={toggleSwitch}
        isEnabled={isLostHighest}
        type={NOTIFICATION_SETTING.LOST_HIGHEST_BID}
        content={language('highestBidder')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
});
