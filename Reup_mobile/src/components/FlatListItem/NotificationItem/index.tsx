import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { AVATAR_DEFAULT_RECTANGLE } from '@src/constants/icons';
import { ICompanyBulletinBoardNotification } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification/models';
import CustomStatusButton from '@src/components/CustomStatusButton';
import { NotificationType } from '@reup/reup-api-sdk/libs/api/enum';
import translate from '@src/localize';
import { isManagerApp } from '@src/utils';
import { formatApiToUI } from '@src/utils/date';

interface Props {
  onPress: (item: ICompanyBulletinBoardNotification) => void;
  item: ICompanyBulletinBoardNotification;
};

const NotificationItem = (props: Props) => {
  const { item, onPress } = props;
  const thumbnail = item
    ? item.thumbnail
      ? item.thumbnail
      : item.image_urls[0] ?? ''
    : ''
  const title = item
    ? item.title ?? ''
    : ''
  const status = item
    ? item.status ?? ''
    : ''
  const description = item
    ? item.description ?? ''
    : ''
  const date = item
    ? item.modified ?? ''
    : ''

  const getType = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Incident:
        return translate('notification_detail.incident_report')
      case NotificationType.General:
      default:
        return translate('notification_detail.general_notification')
    }
  }

  const type = item
    ? getType(item.type) ?? ''
    : ''
  const renderStatusOrDate = () => (
    isManagerApp()
      ? <CustomStatusButton status={status} />
      : <CustomText
        numberOfLines={1}
        style={styles.date}
        text={formatApiToUI(date)} />
  )
  return (
    <CustomTouchable onPress={() => onPress(item)} style={[styles.container]}>
      <RectangleAvatar
        imageDefault={AVATAR_DEFAULT_RECTANGLE}
        avatar={thumbnail}
        styleContainer={styles.image}
        width={63}
        height={63}
      />
      <View style={styles.contentContainer}>
        <View style={styles.containerTime}>
          <View style={styles.containerInfo}>
            <CustomText numberOfLines={1} style={styles.name} text={title} />
            <CustomText numberOfLines={1} style={styles.type} text={type} />
          </View>
          {renderStatusOrDate()}
        </View>
        <CustomText
          numberOfLines={2}
          style={styles.description}
          text={description} />
      </View>
    </CustomTouchable >
  );
};

export default React.memo(NotificationItem);
