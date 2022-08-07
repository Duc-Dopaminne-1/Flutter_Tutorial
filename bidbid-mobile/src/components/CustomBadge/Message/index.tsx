import React, { ReactElement, memo } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, images } from '../../../vars';
import { useSelector } from 'react-redux';
import { MessageInit } from '../../../redux/messages/reducer';
import { isAndroid } from '../../../shared/devices';

interface CustomBadgeMessageProps {
  isFocused: boolean;
  getGradientIcon: (icon: string, isFocused: boolean) => ReactElement;
  label: string;
}

function CustomBadgeMessage(props: CustomBadgeMessageProps): ReactElement {
  const { isFocused, getGradientIcon, label } = props;
  const unread = useSelector((state: MessageInit) => state.message.totalUnread);
  const totalUnread = unread > 99 ? '99+' : unread;

  return (
    <View style={styles.container}>
      {unread > 0 ? (
        <ImageBackground source={images.badgeBlue} resizeMode={'contain'} style={styles.wrapBadge}>
          <Text allowFontScaling={false} style={styles.textBadge}>
            {totalUnread}
          </Text>
        </ImageBackground>
      ) : null}

      {getGradientIcon(label, isFocused)}
    </View>
  );
}

export default memo(CustomBadgeMessage);

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
