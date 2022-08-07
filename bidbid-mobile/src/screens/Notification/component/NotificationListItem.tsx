import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ReactElement } from 'react';
import { formatTime24 } from '@/shared/processing';
import { BidBidPush } from '@/vars/imagesSvg';
import { colors, fonts } from '@/vars';
import { notificationService } from '@/shared/notification';
import NavigationActionsService from '@/navigation/navigation';
import { readOne } from '@/redux/notification/actions';
import { isIOS } from '@/shared/devices';
import { NOTIFICATION_LINK, NOTIFICATION_TYPE } from '@/constants/app';
import { NOTIFICATION_DETAIL_SCREEN } from '@/navigation/screenKeys';
import HTMLView from 'react-native-htmlview';
import CustomTextLink from '@/components/CustomTextLink';
import { DeepLinkNotification } from '@/models';
import { getUser } from '@/redux/user/actions';
import DotSVG from '@/components/SVG/DotSVG';

interface Prop {
  item: any;
}
function NotificationListItem(props: Prop): ReactElement {
  const { icon, body, id, unread, type, entityId, title, sentAt } = props.item;

  const renderAvatar = () => {
    return (
      <View style={styles.wrapAvatar}>
        {unread ? <DotSVG /> : <View style={styles.unread} />}
        <View style={styles.wrapIcon}>{icon ? <Image source={{ uri: icon }} style={styles.avatar} /> : <BidBidPush />}</View>
      </View>
    );
  };

  const renderHtml = () => {
    return (
      <View style={styles.wrapHtml}>
        <HTMLView value={body} nodeComponentProps={{ numberOfLines: 1 }} stylesheet={styles} />
      </View>
    );
  };

  const renderBody = () => {
    if (type === DeepLinkNotification.PAYMENT_FAILED_REMIND_30 || type === DeepLinkNotification.PAYMENT_FAILED_END_BID_NOW) {
      const indexOfLink = body.indexOf(NOTIFICATION_LINK.PAYMENT_SETTING);
      const lengthPayment = NOTIFICATION_LINK.PAYMENT_SETTING.length;
      const textFirst = body.slice(0, indexOfLink);
      const textLink = body.slice(indexOfLink, indexOfLink + lengthPayment);
      const textLast = body.slice(indexOfLink + lengthPayment, body.length);
      return <CustomTextLink type={type} textFirst={textFirst} textLink={textLink} textLast={textLast} />;
    }

    if (type === DeepLinkNotification.PAYMENT_ISSUE || type === DeepLinkNotification.REVIEW_LOW) {
      const indexOfLink = body.indexOf(NOTIFICATION_LINK.EMAIL_BID_BID);
      const lengthPayment = NOTIFICATION_LINK.EMAIL_BID_BID.length;
      const textFirst = body.slice(0, indexOfLink);
      const textLink = body.slice(indexOfLink, indexOfLink + lengthPayment);
      const textLast = body.slice(indexOfLink + lengthPayment, body.length);
      return (
        <CustomTextLink email={NOTIFICATION_LINK.EMAIL_BID_BID} type={type} textFirst={textFirst} textLink={textLink} textLast={textLast} />
      );
    }

    return body;
  };

  const renderInfo = () => {
    return (
      <View style={styles.wrapInfo}>
        <Text style={styles.textTitle} numberOfLines={10}>
          {title ? <Text style={styles.textName}>{title} </Text> : null}
          {type === NOTIFICATION_TYPE.NEWS || type === NOTIFICATION_TYPE.UPDATES ? null : renderBody()}
        </Text>
        {type === NOTIFICATION_TYPE.NEWS || type === NOTIFICATION_TYPE.UPDATES ? renderHtml() : null}
        <Text style={styles.textTime}>{formatTime24(new Date(sentAt))}</Text>
      </View>
    );
  };

  const onPress = () => {
    if (unread) {
      NavigationActionsService.dispatchAction(
        readOne({
          id,
        }),
      );
    }

    if (type === NOTIFICATION_TYPE.NEWS || type === NOTIFICATION_TYPE.UPDATES) {
      NavigationActionsService.push(NOTIFICATION_DETAIL_SCREEN, {
        content: body,
      });
      return;
    }

    if (
      type === DeepLinkNotification.PAYMENT_ISSUE ||
      type === DeepLinkNotification.REVIEW_LOW ||
      type === DeepLinkNotification.PAYMENT_FAILED_END_BID_NOW
    ) {
      return;
    }

    if (type === DeepLinkNotification.VERIFY_REJECTED || type === DeepLinkNotification.VERIFY_APPROVED) {
      NavigationActionsService.dispatchAction(getUser({}));
    }

    notificationService.handleDeepLinkInApp(type, entityId);
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {renderAvatar()}
      {renderInfo()}
    </Pressable>
  );
}

export default React.memo(NotificationListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 26,
  },
  wrapInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 9,
  },
  textTitle: {
    flex: 1,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_700,
  },
  textName: {
    fontSize: fonts.size.s14,
    fontWeight: isIOS ? '600' : 'bold',
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_900,
  },
  textTime: {
    marginTop: 4,
    fontSize: fonts.size.s10,
    color: colors.gray_500,
    fontFamily: fonts.family.RobotoRegular,
  },
  wrapAvatar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapIcon: {
    marginLeft: 2,
  },
  avatar: {
    borderRadius: 16,
    height: 24,
    width: 24,
  },
  unread: {
    height: 8,
    width: 8,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  p: {
    color: colors.gray_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s12,
    fontWeight: null,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  ul: {
    color: colors.gray_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s12,
    fontWeight: null,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  strong: {
    color: colors.gray_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s12,
    fontWeight: null,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  em: {
    color: colors.gray_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s12,
    fontWeight: null,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  ol: {
    color: colors.gray_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s12,
    fontWeight: null,
  },
  wrapHtml: {
    height: 13,
  },
});
