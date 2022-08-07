import { changeStatusNotificationHistoryHandle } from '../../../redux/actions/notification';
import {
  ICDocument,
  ICMore,
  ICNotiRead,
  ICNotiUnread,
  ICPhone,
  ICSupportGrey,
  ICWallet
} from '../../../assets/icons';
import { BodyText, CheckBox, SubHead } from '../../../components/';
import { FONT_FAMILY } from '../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import { formatDate } from '../../../helpers/formatTime';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';

const NotificationItem = props => {
  const { item, isRemoveMode, onAddRemove, isChecked, navigation } = props;
  const memberId = useSelector(state => state.auth.memberId);
  const dispatch = useDispatch();

  const icon = useMemo(() => {
    switch (item?.action?.toLowerCase()) {
      case 'event':
        return <ICMore />;

      case 'news':
        return <ICMore />;

      case 'banner':
        return <ICMore />;

      case 'offer':
        return <ICMore />;

      case 'member.supportrequest.tocustomer':
        return <ICSupportGrey />;

      case 'transaction.lead':
        return <ICPhone />;

      case 'transaction.deal.credit':
        return <ICDocument />;

      case 'transaction.order.credit':
        return <ICDocument />;

      case 'transaction.order.extraservice':
        return <ICDocument />;

      case 'transaction.order.insurance':
        return <ICDocument />;

      case 'transaction.balance':
        return <ICWallet />;

      case 'rank':
        return <ICMore />;

      case 'point':
        return <ICWallet />;

      default:
        return <ICMore />;
    }
  }, [item?.action]);

  const onPress = () => {
    // Change status
    dispatch(
      changeStatusNotificationHistoryHandle({
        memberId: memberId,
        idNotification: item?.idNotification,
        item
      })
    );

    const data = JSON.parse(item?.data);

    // Navigation
    switch (item?.action?.toLowerCase()) {
      case 'event':
        if (data?.id) {
          navigation.navigate(SCREENS_NAME.EVENT_DETAIL_SCREEN, {
            item: { id: data.id }
          });
        }
        break;

      case 'news':
        if (data?.id) {
          navigation.navigate(SCREENS_NAME.NEWS_DETAIL_SCREEN, {
            item: { id: data.id }
          });
        }
        break;

      case 'banner':
        break;

      case 'offer':
        break;

      case 'member.supportrequest.tocustomer':
        navigation.navigate(SCREENS_NAME.SUPPORT_DETAIL_SCREEN, {
          item: { id: data?.id || data?.supportRequestId }
        });
        break;

      case 'transaction.lead':
        navigation.navigate(SCREENS_NAME.LEAD_DETAIL_SCREEN, {
          item: { id: data?.id }
        });
        break;

      case 'transaction.deal.credit':
        navigation.navigate(SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN, {
          item: { id: data?.id }
        });
        break;

      case 'transaction.order.credit':
        navigation.navigate(SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN, {
          item: { id: data?.id }
        });
        break;

      case 'transaction.order.extraservice':
        navigation.navigate(SCREENS_NAME.EXTRA_SERVICE_ORDER_DETAIL_SCREEN, {
          item: { id: data?.id }
        });
        break;

      case 'transaction.order.insurance':
        navigation.navigate(SCREENS_NAME.INSURANCE_ORDER_DETAIL_SCREEN, {
          item: { id: data?.id }
        });
        break;

      case 'transaction.balance':
        navigation.navigate(SCREENS_NAME.ACCOUNT_BALANCE_SCREEN);
        break;

      case 'group.topener.member.joinrequest':
        navigation.navigate(SCREENS_NAME.JOIN_REQUESTION_SCREEN, {
          GroupId: data?.groupId
        });
        break;

      case 'group.topener.member.approved':
        navigation.navigate(SCREENS_NAME.GROUP_TOPENER_SCREEN);
        break;

      case 'group.topener.member.rejected':
        navigation.navigate(SCREENS_NAME.FIND_GROUP_TOPENER_SCREEN);
        break;

      case 'group.topener.memberleave.request':
        navigation.navigate(SCREENS_NAME.LEAVE_REQUESTION_SCREEN, {
          GroupId: data?.groupId
        });
        break;

      case 'group.topener.leader.reject.leaverequest':
        navigation.navigate(SCREENS_NAME.GROUP_TOPENER_SCREEN);
        break;

      case 'group.topener.approve.leaverequest':
        navigation.navigate(SCREENS_NAME.GROUP_TOPENER_SCREEN, {
          data: data?.groupId,
          action: 'requestFromNoti'
        });
        break;

      case 'group.topener.assignee.leader':
        navigation.navigate(SCREENS_NAME.GROUP_TOPENER_SCREEN);
        break;

      case 'group.topener.leader.request.leavegroup':
        navigation.navigate(SCREENS_NAME.GROUP_TOPENER_SCREEN, {
          data: data?.groupId,
          action: 'requestFromNoti'
        });
        break;

      case 'rank':
        break;

      case 'point':
        break;

      default:
        break;
    }
  };

  const onCheck = useCallback(checked => onAddRemove(checked, item), [item, onAddRemove]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={!isRemoveMode ? onPress : null}
      activeOpacity={0.8}>
      <>
        <View style={styles.leftContainer}>
          {item?.status ? <ICNotiRead {...{ icon }} /> : <ICNotiUnread {...{ icon }} />}
          <View style={styles.infoContainer}>
            <BodyText
              semiBold
              color={item?.status ? CUSTOM_COLOR.ShuttleGray : CUSTOM_COLOR.BlueStone}
              style={styles.title}>
              {item?.title}
            </BodyText>
            <SubHead
              bold={false}
              color={CUSTOM_COLOR.ShuttleGray}
              numberOfLines={3}
              // textAlign={{ textAlign: 'justify' }}
            >
              {item?.content}
            </SubHead>
            <SubHead bold={false} color={CUSTOM_COLOR.ShuttleGray} style={styles.dateText}>
              {formatDate(item?.creationTime)}
            </SubHead>
          </View>
        </View>
      </>

      <>
        {/* Check box */}
        <View style={styles.checkBoxContainer}>
          {isRemoveMode ? (
            <CheckBox style={styles.checkbox} checked={isChecked} onChange={onCheck} />
          ) : (
            <View style={styles.checkbox} />
          )}
        </View>
      </>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: SPACING.Normal,
    marginVertical: SPACING.Medium
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1
  },
  infoContainer: {
    marginHorizontal: SPACING.XNormal,
    flex: 1
  },
  checkbox: {
    width: scale(20),
    height: scale(20)
  },
  dateText: {
    marginTop: SPACING.Normal
  },
  checkBoxContainer: {
    justifyContent: 'center'
  },
  title: {}
});
