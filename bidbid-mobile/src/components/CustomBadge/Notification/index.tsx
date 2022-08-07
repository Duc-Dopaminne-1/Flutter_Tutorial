import React, { ReactElement, useEffect, memo } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { colors, fonts, images } from '../../../vars';
import { useSelector } from 'react-redux';
import { NotificationInit } from '../../../redux/notification/reducer';
import NotificationsService from '../../../shared/notification';
import { MessageInit } from '../../../redux/messages/reducer';
import { isAndroid } from '../../../shared/devices';

interface CustomBadgeNotificationProps {
  isFocused: boolean;
  getGradientIcon: (icon: string, isFocused: boolean) => ReactElement;
  label: string;
}

function CustomBadgeNotification(props: CustomBadgeNotificationProps): ReactElement {
  const { isFocused, getGradientIcon, label } = props;
  const unreadNoti = useSelector((state: NotificationInit) => state.notification.unread);
  const unreadChat = useSelector((state: MessageInit) => state.message.totalUnread);
  const totalUnread = unreadNoti > 99 ? '99+' : unreadNoti;

  useEffect(() => {
    NotificationsService.setBadge(unreadNoti + unreadChat);
  }, [unreadNoti, unreadChat]);

  return (
    <View style={styles.container}>
      {unreadNoti > 0 ? (
        <ImageBackground source={images.badgeRed} resizeMode={'contain'} style={styles.wrapBadge}>
          <Text allowFontScaling={false} style={styles.textBadge}>
            {totalUnread}
          </Text>
        </ImageBackground>
      ) : null}

      {getGradientIcon(label, isFocused)}
    </View>
  );
}

export default memo(CustomBadgeNotification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapBadge: {
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    minHeight: 20,
    position: 'absolute',
    right: -18,
    top: isAndroid ? -10 : -11,
  },
  textBadge: {
    fontSize: fonts.size.s9,
    fontFamily: fonts.family.RobotoRegular,
    color: colors.white,
  },
});
