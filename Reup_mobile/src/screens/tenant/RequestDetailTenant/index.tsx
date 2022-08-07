import React, { useState, useEffect } from 'react';
import { View, Image, Alert } from 'react-native';
import Container from '@src/components/Container';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import translate from '@src/localize';
import { capitalize, upperCase, findIndex } from 'lodash';
import ICON_REQUEST from '@src/res/icons/icon-request.png';
import CustomSectionHeader from "@src/components/CustomSection";
import RequestDetailItem from '@src/components/RequestDetailItem';
import { CustomText } from '@src/components/CustomText';
import {
  getIconStatusRequest, getTitleStatusRequest,
  getStylePriority, getTitleButtonAssignee, StatusEnum
} from '@src/components/MaintenanceRequests/ListContent';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { ImageViewerCustom } from '@src/components/ImageViewer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomFlatList } from '@src/components/FlatList';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { CustomButton } from '@src/components/CustomButton';
import { IRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';
import { StatusMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/enum';
import { getFullName, upperCaseFirstChar, getUserNameFromMail, getApartmentName } from '@src/utils';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useSelector, useDispatch } from 'react-redux';
import { ChangeStatusMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { getGeneral, changeStatusRequest, getResidentRequestGeneral } from '@src/modules/Maintenance/actions';
import NavigationActionsService from '@src/navigation/navigation';

interface Props {
  item: IRequest;
  maintenanceFlatListRef?: any;
  statusRequestFlatListRef?: any;
}

const RequestDetailTenant = () => {
  const dispatch = useDispatch();
  const { item, maintenanceFlatListRef = null, statusRequestFlatListRef = null } = useRoute().params as Props;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const currentStatus = item.status
  const statusText = capitalize(getTitleStatusRequest(currentStatus))
  const titleAssignee = getTitleButtonAssignee(currentStatus)
  const [idxSelectImage, setIdxSelectImage] = useState<number>();
  const [showImages, setShowImages] = useState<boolean>(false);
  const images = item.img_urls ? item.img_urls.map((img: string) => { return { url: img } }) : [];


  useEffect(() => {
  }, []);

  const fetchGeneralMaintenanceRequest = () => {
    dispatch(
      getResidentRequestGeneral({
        property_id: me && me.default_property ? me.default_property : '',
        onSuccess: async (data) => {
          console.log("===== Success general: ", data);
        },
        onFail: error => {
          console.log('Error', error && error.message);
        }
      })
    )
  }

  const onChangeStatusRequest = () => {
    const params: ChangeStatusMaintenanceRequest = {
      status: currentStatus === StatusMaintenanceRequest.InProgress ? StatusMaintenanceRequest.Done
        : (currentStatus === StatusMaintenanceRequest.Done ? StatusMaintenanceRequest.Waiting : "")
    }
    NavigationActionsService.showLoading();
    dispatch(
      changeStatusRequest({
        propertyId: me.default_property,
        id: item.id,
        params,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          fetchGeneralMaintenanceRequest();
          statusRequestFlatListRef && statusRequestFlatListRef.current && statusRequestFlatListRef.current.reloadData();
          maintenanceFlatListRef && maintenanceFlatListRef.current && maintenanceFlatListRef.current.reloadData();
          NavigationActionsService.pop();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const onPressImage = ({ item, index }: { item: any; index: number }) => {
    setIdxSelectImage(index);
    setShowImages(true);
  };

  const onBackdropPress = () => {
    setShowImages(false);
  };

  const renderItemImage = (item: any, index: number) => {
    return (
      <CustomTouchable onPress={() => onPressImage({ item, index })}>
        <RectangleAvatar avatar={item.url} size={80} styleContainer={styles.images} />
      </CustomTouchable>
    );
  };




  const renderStatus = () => {
    return <CustomText style={styles.titleStatus} numberOfLines={1} text={statusText} />;
  };

  const renderButtonAssignee = () => {
    if (currentStatus === StatusMaintenanceRequest.InProgress || currentStatus === StatusMaintenanceRequest.Done) {
      return (
        <View style={styles.buttonAssignee}>
          <CustomButton text={upperCase(titleAssignee)} textStyle={styles.titleButtonAssignee} onPress={onChangeStatusRequest} />
        </View>
      );
    }
  };

  const renderRequestDetails = () => {
    const displayCreator = item.creator.first_name && item.creator.last_name ? getFullName(item.creator.first_name, item.creator.last_name) : getUserNameFromMail(item.creator.email);
    const displayAssignee = item.assignee && item.assignee.first_name && item.assignee.last_name ? getFullName(item.assignee.first_name, item.assignee.last_name) : item.assignee ? getUserNameFromMail(item.assignee.email) : '';
    const displayPriority = item.priority ? item.priority?.valueOf() : '';
    const displayApartmentCode = item.unit ? getApartmentName(item.unit.block, item.unit.floor, item.unit.code) : '';
    return (
      <View style={{ flex: 1 }}>
        <CustomSectionHeader
          style={styles.headers}
          title={`${upperCase(translate('requests.request_details'))}`}
          styleTitle={styles.styleTitle}
          icon={ICON_REQUEST}
        />
        <KeyboardAwareScrollView>
          <RequestDetailItem
            title={translate('requests.title')}
            rightComponent={
              <CustomText styleContainer={styles.styleContainerTitle} style={styles.text} text={item.title} />
            } />
          <RequestDetailItem
            title={translate('requests.status')}
            rightComponent={
              <View style={styles.statusContainer}>
                <Image source={getIconStatusRequest(currentStatus)} resizeMode={'contain'} style={styles.icon} />
                {renderStatus()}
              </View>
            } />
          <RequestDetailItem
            title={translate('requests.creator')}
            rightComponent={
              <View style={styles.statusContainer}>
                <Image style={styles.thumbnail} resizeMode='contain' source={{ uri: item.creator.avatar }} />
                <CustomText style={styles.titleStatus} numberOfLines={1} text={displayCreator} />
              </View>
            } />
          <RequestDetailItem
            title={translate('requests.priority')}
            rightComponent={
              <View style={styles.statusContainer}>
                <CustomText style={[styles.priority, getStylePriority(displayPriority)]} text={displayPriority} />
              </View>
            } />
          <RequestDetailItem
            title={translate('requests.category')}
            rightComponent={
              <CustomText styleContainer={styles.styleContainerTitle} style={styles.text} text={item.category.name} />
            } />
          <RequestDetailItem
            title={translate('requests.send_to')}
            rightComponent={
              <CustomText styleContainer={styles.styleContainerTitle} style={styles.text} text={displayAssignee} />
            } />
          <RequestDetailItem
            title={translate('apartments.code')}
            rightComponent={
              <CustomText styleContainer={styles.styleContainerTitle} style={styles.text} text={displayApartmentCode} />
            } />
          <RequestDetailItem
            title={translate('requests.note')}
            rightComponent={
              <CustomText styleContainer={styles.styleContainerTitle} style={styles.text} text={item.note} />
            } />
          <View style={styles.file_image}>
            <RequestDetailItem
              title={translate('requests.file_image')}
              showLineBottom={false}
            />
            <CustomFlatList
              showEmpty={false}
              onLoad={onLoadImage}
              contentContainerStyle={styles.flatListImages}
              data={images}
              horizontal={true}
              renderItem={renderItemImage}
            />
            <ImageViewerCustom
              loading={showImages}
              images={images}
              index={idxSelectImage ?? 0}
              onBackdropPress={onBackdropPress} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
  };

  return (
    <Container
      isShowHeader={true}
      title={`${translate('requests.request_details')}`}
      spaceBottom={true}
      isDisplayMenuButton={false}
      isDisplayNotification={false}
      isDisplayBackButton={true}>
      {renderRequestDetails()}
      {renderButtonAssignee()}
    </Container >
  );
};

export default RequestDetailTenant;
