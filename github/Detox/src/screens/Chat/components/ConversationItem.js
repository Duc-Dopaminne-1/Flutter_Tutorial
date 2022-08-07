import React, {useContext, useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SwiperButton, SwiperItem} from 'react-native-swiper-item';

import {AppContext} from '../../../appData/appContext/appContext';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal} from '../../../assets/theme/metric';
import {getMessageContentByType} from '../types';
import Avatar from './Avatar';

export const ITEM_HEIGHT = 80;

const ConversationItem = ({
  avatar,
  name,
  isGroup,
  groupName,
  unreadCount = 0,
  lastMessage,
  lastMessageType,
  date,
  onPress,
  onPressDelete,
}) => {
  const swiperRef = useRef(null);
  const {showAppModal} = useContext(AppContext);

  const onPressRight = () => {
    showAppModal({
      isVisible: true,
      title: translate('chat.confirmDelete.title'),
      message: translate('chat.confirmDelete.message'),
      cancelText: translate('chat.confirmDelete.left'),
      okText: translate('chat.confirmDelete.right'),
      cancelButtonStyle: styles.cancelButtonStyle,
      cancelTextStyle: styles.cancelTextStyle,
      okButtonStyle: styles.okButtonStyle,
      onCancelHandler: () => {
        onPressDelete();
        swiperRef.current.close();
      },
      onOkHandler: () => {},
    });
  };

  const rightButton = (
    <SwiperButton>
      <TouchableOpacity style={styles.rightButton} onPress={onPressRight}>
        <Image style={styles.rightIcon} source={IMAGES.IC_TRASH} />
        <Text style={styles.rightText}>{translate('common.delete')}</Text>
      </TouchableOpacity>
    </SwiperButton>
  );

  return (
    <SwiperItem
      ref={swiperRef}
      style={{height: ITEM_HEIGHT}}
      disableSwipeIfNoButton={true}
      rightButtons={rightButton}>
      <View style={styles.container}>
        <TouchableOpacity style={[HELPERS.fillRow]} onPress={onPress}>
          <Avatar url={avatar} isGroup={isGroup} />
          <View style={styles.boxName}>
            <View style={HELPERS.row}>
              <Text style={styles.name} numberOfLines={1}>
                {isGroup ? groupName : name}
              </Text>
              <Text style={styles.date}>{date}</Text>
            </View>
            <View style={HELPERS.row}>
              <Text
                style={[
                  styles.lastMessage,
                  {color: unreadCount > 0 ? COLORS.BLACK_31 : COLORS.TEXT_DARK_40},
                ]}
                numberOfLines={1}>
                {getMessageContentByType(lastMessageType, lastMessage)}
              </Text>
              {unreadCount > 0 && (
                <View style={styles.unreadCountContainer}>
                  <Text style={styles.unreadCount}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SwiperItem>
  );
};

export default React.memo(ConversationItem);

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    padding: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  rightButton: {
    ...HELPERS.center,
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
    backgroundColor: COLORS.STATE_ERROR,
  },
  rightIcon: {
    width: 16,
    height: 16,
  },
  rightText: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
    marginTop: 2,
  },
  boxName: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.BLACK_31,
    flex: 1,
  },
  date: {
    ...FONTS.regular,
    fontSize: 12,
    marginLeft: normal,
    color: COLORS.GRAY_A3,
  },
  lastMessage: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_31,
    flex: 1,
  },
  unreadCountContainer: {
    marginLeft: normal,
    paddingHorizontal: 5,
    borderRadius: SIZES.BORDER_RADIUS_100,
    backgroundColor: COLORS.PRIMARY_B100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 18,
    minWidth: 18,
  },
  unreadCount: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
  },
  cancelButtonStyle: {
    flex: 1,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.STATE_ERROR,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  cancelTextStyle: {
    color: COLORS.STATE_ERROR,
  },
  okButtonStyle: {
    flex: 1,
  },
});
