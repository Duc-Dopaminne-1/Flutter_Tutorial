import React, { useState } from 'react';
import styles from './styles';
import { View, ScrollView, Alert } from 'react-native';
import { IC_NOTIFICATION_HEADER, AVATAR_DEFAULT_RECTANGLE } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import { CustomText } from '@src/components/CustomText';
import CustomSectionHeader from '@src/components/CustomSection';
import NavigationActionsService from '@src/navigation/navigation';
import { useRoute } from '@react-navigation/native';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { CustomFlatList } from '@src/components/FlatList';
import { CustomTouchable } from '@src/components/CustomTouchable';
import FastImage from 'react-native-fast-image';
import { ImageViewerCustom } from '@src/components/ImageViewer';
import { ICompanyBulletinBoardNotification } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification/models';
import { getUserName, formatTime } from '@src/utils';
import { BulletinPostStatus, NotificationType } from '@reup/reup-api-sdk/libs/api/enum';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import CustomStatusButton from '@src/components/CustomStatusButton';
import { denyNotification, approveNotification } from '@src/modules/bulletin/actions';

interface Props {
  item: ICompanyBulletinBoardNotification,
  ref: any,
}

const NotificationDetails = () => {
  const dispatch = useDispatch()
  const router = useRoute();
  const { item, ref } = router.params as Props
  const [idxSelectImage, setIdxSelectImage] = useState<number>();
  const [showImages, setShowImages] = useState<boolean>(false);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultCompanyId = me && me.default_company && me.default_company.id ? me.default_company.id : ''

  const onPressApprove = () => {
    NavigationActionsService.showLoading()
    if (defaultCompanyId && item && item.id) {
      dispatch(
        approveNotification({
          companyId: defaultCompanyId,
          notificationId: item.id,
          onSuccess: () => {
            NavigationActionsService.hideLoading()
            ref && ref.current && ref.current.reloadData()
            NavigationActionsService.pop();
          },
          onFail: (error) => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      )
    }
  };

  const onPressDeny = () => {
    NavigationActionsService.showLoading()
    if (defaultCompanyId && item && item.id) {
      dispatch(
        denyNotification({
          companyId: defaultCompanyId,
          notificationId: item.id,
          onSuccess: () => {
            NavigationActionsService.hideLoading()
            ref && ref.current && ref.current.reloadData()
            NavigationActionsService.pop();
          },
          onFail: (error) => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      )
    }
  };

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate("notification_detail.notification_header")}
        icon={IC_NOTIFICATION_HEADER}
      />
    )
  }

  const onLoadImage = () => {
  }

  const onBackdropPress = () => {
    setShowImages(false);
  }

  const onPressImage = ({ index }: { item: any; index: number }) => {
    setIdxSelectImage(index)
    setShowImages(true);
  }

  const renderItemImage = (item: IImageInfo, index: number) => {
    return (
      <CustomTouchable onPress={() => onPressImage({ item, index })}>
        <FastImage source={{ uri: item.url }} style={styles.images} />
      </CustomTouchable>
    );
  }

  const renderImages = () => {
    if (item.image_urls && item.image_urls.length != 0) {
      const listImage: IImageInfo[] = [
        ...item.image_urls.map(item => ({
          url: item
        }))
      ]
      return (
        <View style={styles.file_image}>
          <CustomFlatList
            onLoad={onLoadImage}
            contentContainerStyle={styles.flatListImages}
            data={listImage}
            horizontal={true}
            renderItem={renderItemImage}
          />
          <ImageViewerCustom
            loading={showImages}
            images={listImage}
            index={idxSelectImage ?? 0}
            onBackdropPress={onBackdropPress} />
        </View>
      )
    } else {
      return null
    }
  }

  const getType = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Incident:
        return translate('notification_detail.incident_report')
      case NotificationType.General:
      default:
        return translate('notification_detail.general_notification')
    }
  }

  const renderCreator = () => {
    const userName = item && item.creator ? getUserName(item.creator.first_name, item.creator.last_name) : ''
    const status = item && item.status ? item.status : ''
    const avatar = item && item.creator ? item.creator.avatar : ''
    const type = item ? getType(item.type) : ''

    return (
      <View style={styles.content}>
        <RectangleAvatar
          imageDefault={AVATAR_DEFAULT_RECTANGLE}
          avatar={avatar}
          styleContainer={styles.avatar}
          width={40}
          height={40}
        />
        <View style={styles.contentContainer}>
          <CustomText numberOfLines={1} style={styles.name} text={userName} />
          <CustomText style={styles.type} text={type} />
        </View>
        <CustomStatusButton status={status} />
      </View>
    )
  }

  const renderContent = () => {
    const time = item && formatTime(item.modified)
    return (
      <>
        <CustomText style={styles.created} text={time} />
        <CustomText style={styles.title} text={item && item.title} />
        <CustomText style={styles.des} text={item && item.description} />
        {renderImages()}
      </>
    )
  }

  const renderBottomComponent = () => {
    const status = item && item.status ? item.status : ''
    if (status == BulletinPostStatus.Denied || status == BulletinPostStatus.Approved) {
      return null
    } else {
      return (<View style={styles.buttonContainer}>
        <CustomButton
          onPress={onPressApprove}
          text={translate('notification_detail.approve')}
          style={styles.buttonApproved}
          textStyle={styles.textApprove}
        />
        <CustomButton
          onPress={onPressDeny}
          text={translate('notification_detail.denied')}
          style={styles.buttonDenied}
          textStyle={styles.textDenied}
        />
      </View>
      )
    }
  }

  return (
    <Container isDisplayNotification={false}
      spaceBottom={true}
      title={translate('notification_detail.notification_details')}
      isShowHeader={true}
      isDisplayMenuButton={false}>
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.listContainer}>
          <ScrollView style={styles.containerScrollView}>
            {renderCreator()}
            {renderContent()}
          </ScrollView>
        </View>
        {renderBottomComponent()}
      </View>
    </Container >
  );
};

export default NotificationDetails;
