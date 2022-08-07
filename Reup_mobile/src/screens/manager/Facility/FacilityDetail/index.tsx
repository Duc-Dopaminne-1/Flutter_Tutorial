import React from 'react';
import Container from '@src/components/Container';
import { View, Alert } from 'react-native';
import translate from '@src/localize';
import { CustomButton } from '@src/components/CustomButton';
import { styles } from '@src/screens/manager/Facility/FacilityDetail/styles';
import { ICON_FACILITY, AVATAR_DEFAULT_RECTANGLE } from '@src/constants/icons';
import CustomInfoList from '@src/components/CustomInfoList';
import { CustomText } from '@src/components/CustomText';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomFlatList } from '@src/components/FlatList';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { WIDTH } from '@src/constants/vars';
import NavigationActionsService from '@src/navigation/navigation';
import { EDIT_FACILITY } from '@src/constants/screenKeys';
import { IFacility } from '@reup/reup-api-sdk/libs/api/company/facility/models';
import CustomSectionHeader from "@src/components/CustomSection"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { deleteFacility } from '@src/modules/FrontDesk/actions';

interface FacilityItem {
  facilityItem: IFacility;
}

const FacilityDetail = () => {

  const paddingLeftImage = 16;
  const paddingBetweenImage = 12;

  const { facilityItem } = useRoute().params as FacilityItem;
  const { flatList } = useRoute().params as any;
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!)

  const onPressEdit = (item: any) => {
    NavigationActionsService.push(EDIT_FACILITY, { item, flatList })
  }

  const handleDelete = () => {
    NavigationActionsService.showLoading();
    dispatch(deleteFacility({
      companyId: me.default_company.id ?? '',
      id: facilityItem.id,
      onSuccess: () => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData();
        NavigationActionsService.pop();
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }))
  }

  const onPressDeleteFacility = () => {
    Alert.alert(translate('alert.delete'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          handleDelete();
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
  }

  const renderSectionHeader = () => {
    return (
      <View style={styles.sectionHeader} >
        <CustomSectionHeader
          style={styles.sectionHeader}
          title={translate('facility_detail.title_section_header')}
          icon={ICON_FACILITY}
          isShowEdit={true}
          onPressFilter={onPressEdit.bind(undefined, facilityItem)}
        />
      </View >
    )
  }

  const renderBottomButton = () => {
    return (
      <View style={styles.bottomButtonView}>
        <CustomButton
          style={[styles.widthButton, styles.deleteButton]}
          text={translate('facility_detail.delete_facility')}
          textStyle={styles.textDeleteButton}
          onPress={onPressDeleteFacility}
        />
      </View>
    )
  }

  const renderItemSeparator = () => {
    return (
      <View style={{ width: paddingBetweenImage }} />
    );
  }

  const renderImageItem = (item: any) => {
    const imageWidth = (WIDTH - paddingLeftImage - paddingBetweenImage) / 2;
    const imageHeight = imageWidth * 2 / 3;
    return (
      <RectangleAvatar
        imageDefault={AVATAR_DEFAULT_RECTANGLE}
        avatar={item}
        width={imageWidth}
        height={imageHeight}
        styleImage={styles.imageContainer}
      />
    )
  }

  const renderContentView = () => {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentView}>
          <CustomText
            text={facilityItem.name}
            style={styles.titleContent}
            styleContainer={styles.titleContainer}
          />
          <CustomFlatList
            style={{ width: WIDTH }}
            horizontal={true}
            onLoad={onLoad}
            data={facilityItem.image_urls}
            ItemSeparatorComponent={renderItemSeparator}
            renderItem={(item: any) => renderImageItem(item)}
          />
          <CustomText
            text={facilityItem.description ?? ''}
            style={styles.descriptionContent}
            styleContainer={styles.descriptionContainer}
          />
        </View>
      </ScrollView>
    )
  }

  return (
    <Container
      isShowHeader={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      title={translate('facility_detail.title_navigation')}
      spaceBottom
    >
      <View style={styles.container}>
        {renderSectionHeader()}

        {renderContentView()}

        {renderBottomButton()}
      </View>
    </Container>
  );
};

export default FacilityDetail;
