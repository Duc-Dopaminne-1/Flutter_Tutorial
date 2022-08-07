import React, {useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SwiperButton, SwiperItem} from 'react-native-swiper-item';

import {
  useReadNotificationMutation,
  useUpdateNotificationStatusMutation,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal} from '../../assets/theme/metric';
import {SizeBox} from '../../components/SizeBox';
import {getTransactionDateTimeString} from '../../utils/TimerCommon';

const SEPARATOR = {
  MARGIN_ITEM: SIZES.MARGIN_8,
  MESSAGE_AND_DATE: SIZES.MARGIN_4,
  ICON_AND_MESSAGE: SIZES.SEPARATOR_12,
  PADDING_SCREEN: normal * 2,
};

const mapIconNotification = type => {
  switch (type) {
    case 'Suggestion':
      return IMAGES.IC_NOTI_SUGGEST;
    case 'Transaction':
      return IMAGES.IC_NOTI_TRANSACTION;
    case 'System':
      return IMAGES.IC_NOTI_SYSTEM;
    default:
      return IMAGES.IC_NOTI_SYSTEM;
  }
};

const NotificationItem = ({
  notification,
  onReadNotificationSuccess,
  onDeleteNotificationSuccess,
  onPress = () => {},
}) => {
  const [isExpanded] = useState(false);
  const [data, setData] = useState(notification);
  const swiperRef = useRef(null);

  const onError = () => {
    setData({...data, isUnread: true});
  };

  const onSuccess = () => {
    onReadNotificationSuccess && onReadNotificationSuccess();
  };

  const onDeleteSuccess = () => {
    onDeleteNotificationSuccess && onDeleteNotificationSuccess();
  };

  const {startApi} = useGraphqlApiLazy({
    showSpinner: false,
    graphqlApiLazy: useReadNotificationMutation,
    queryOptions: {},
    dataField: null,
    onSuccess,
    onError,
  });

  const {startApi: deleteNoti} = useGraphqlApiLazy({
    showSpinner: false,
    graphqlApiLazy: useUpdateNotificationStatusMutation,
    queryOptions: {},
    dataField: null,
    onSuccess: onDeleteSuccess,
    onError,
  });

  const {message, createdDatetime, isUnread} = notification;
  const titleProps = isExpanded ? {} : {numberOfLines: 0};
  const onPressItem = () => {
    if (notification.isUnread) {
      setData({...data, isUnread: false});
      startApi({
        variables: {
          input: {
            notificationId: notification.id,
            markRead: true,
            delete: false,
          },
        },
      });
    }
    onPress && onPress(notification);
  };

  const close = () => {
    swiperRef && swiperRef.current.close();
  };

  const markReadItem = () => {
    if (notification.isUnread) {
      setData({...data, isUnread: false});
      startApi({
        variables: {
          input: {
            notificationId: notification.id,
            markRead: true,
            delete: false,
          },
        },
      });
    }
    close();
  };

  const deleteNotification = () => {
    deleteNoti({
      variables: {
        input: {
          notificationId: notification.id,
          markRead: false,
          delete: true,
        },
      },
    });
    close();
  };

  const leftButton = (
    <SwiperButton style={styles.swipeButton}>
      <TouchableOpacity style={styles.expandRight} onPress={markReadItem}>
        <Image source={IMAGES.IC_READ_NOTIFICATION} />
      </TouchableOpacity>
    </SwiperButton>
  );

  const rightButton = (
    <SwiperButton style={styles.swipeButton}>
      <TouchableOpacity style={styles.expandLeft} onPress={deleteNotification}>
        <Image style={styles.rightIcon} source={IMAGES.IC_TRASH} />
      </TouchableOpacity>
    </SwiperButton>
  );

  return (
    <SwiperItem
      ref={swiperRef}
      disableSwipeIfNoButton={true}
      key={notification.id}
      leftButtons={notification.isUnread ? leftButton : null}
      rightButtons={rightButton}>
      <View style={[styles.container(isUnread)]}>
        <TouchableOpacity style={[HELPERS.row, HELPERS.fill]} onPress={onPressItem}>
          <View style={styles.mailIconContainer}>
            <View style={styles.circleContainer(isUnread)}>
              <Image
                source={mapIconNotification(notification.notificationType)}
                style={styles.iconNotify(isUnread)}
              />
            </View>
          </View>
          <SizeBox width={SEPARATOR.ICON_AND_MESSAGE} />
          <View style={styles.wrapperMessage}>
            <Text style={styles.message(isUnread)} {...titleProps}>
              {message}
            </Text>
            <SizeBox width={SEPARATOR.MESSAGE_AND_DATE} />
            <Text style={styles.txtDate}>{getTransactionDateTimeString(createdDatetime)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SwiperItem>
  );
};

const styles = StyleSheet.create({
  container: isUnread => ({
    paddingHorizontal: SIZES.PADDING_12,
    paddingVertical: SIZES.PADDING_12,
    backgroundColor: isUnread ? COLORS.PRIMARY_A10 : COLORS.NEUTRAL_WHITE,
    borderRadius: 5,
    borderWidth: isUnread ? 0 : 1,
    borderColor: COLORS.NEUTRAL_BORDER,
  }),
  message: isUnread => ({
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
    color: COLORS.BLACK_33,
    fontWeight: isUnread ? 'bold' : 'normal',
    flex: 1,
  }),
  txtDate: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    lineHeight: SIZES.FONT_14_LINE_HEIGHT,
    color: COLORS.GREY_82,
  },
  circleContainer: isUnread => ({
    backgroundColor: isUnread ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_GRAY_BG,
    borderRadius: 23,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  mailIconContainer: {
    alignSelf: 'center',
  },
  expandLeft: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLORS.PRIMARY_B100,
  },
  expandRight: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  swipeButton: {width: 64},
  rightIcon: {
    width: 24,
    height: 24,
  },
  iconNotify: isUnread => ({
    tintColor: isUnread ? COLORS.NEUTRAL_WHITE : COLORS.GRAY_A3,
  }),
  wrapperMessage: {
    flex: 1,
  },
});

export default React.memo(NotificationItem);
