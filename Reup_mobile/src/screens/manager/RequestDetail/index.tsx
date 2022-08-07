import React, { useState, useEffect } from 'react';
import { View, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import Container from '@src/components/Container';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import translate from '@src/localize';
import { capitalize, upperCase, findIndex, find } from 'lodash';
import ICON_COMMENT from '@src/res/icons/icon-comment.png';
import ICON_REQUEST from '@src/res/icons/icon-request.png';
import { CLOSE } from '@src/constants/icons';
import FILE_DOCS from '@src/res/icons/files/document.png';
import FILE_PDF from '@src/res/icons/files/pdf.png';
import FILE_XLS from '@src/res/icons/files/xls.png';
import ICON_SEND from '@src/res/icons/icon_send.png';
import NewIcon from '@src/res/icons/new-request-icon/new-request-icon.png';
import PendingIcon from '@src/res/icons/pending-request-icon/pending-request-icon.png';
import InProgressIcon from '@src/res/icons/inprogress-request-icon/inprogress-request-icon.png';
import DoneIcon from '@src/res/icons/done-request-icon/done-request-icon.png';
import CustomSectionHeader from "@src/components/CustomSection";
import RequestDetailItem from '@src/components/RequestDetailItem';
import { CustomText } from '@src/components/CustomText';
import {
  getIconStatusRequest, getTitleStatusRequest,
  getStylePriority, getTitleButtonAssignee, StatusEnum
} from '@src/components/MaintenanceRequests/ListContent';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { ImageViewerCustom } from '@src/components/ImageViewer';
import CustomInput from '@src/components/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomFlatList } from '@src/components/FlatList';
import RectangleAvatar from '@src/components/RectangleAvatar';
import DropdownNative, { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { CustomButton } from '@src/components/CustomButton';
import ItemComment from '@src/components/Comments/ItemComment';
import { IRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';
import { Role, StatusMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/enum';
import { getFullName, upperCaseFirstChar, getUserNameFromMail, getApartmentName } from '@src/utils';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useSelector, useDispatch } from 'react-redux';
import { QueryMaintenanceRequestGeneralParams, ChangeStatusMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { getGeneral, changeStatusRequest, assigneeMaintenanceRequest } from '@src/modules/Maintenance/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { getListStaff, getUserPermissions } from '@src/modules/Company/actions';
import { Config } from '@src/configs/appConfig';
import { ICompanyUserPermission } from '@reup/reup-api-sdk/libs/api/company/user';

interface Props {
  item: IRequest;
  maintenanceFlatListRef?: any;
  statusRequestFlatListRef?: any;
}

const RequestDetail = () => {
  const dispatch = useDispatch();
  const { item, maintenanceFlatListRef = null, statusRequestFlatListRef = null } = useRoute().params as Props;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [currentStatus, setCurrentStatus] = useState<string>(item.status);
  const [icon, setIcon] = useState<any>(getIconStatusRequest(currentStatus));
  const [statusText, setStatusText] = useState<string>(capitalize(getTitleStatusRequest(currentStatus)));
  const [titleAssignee, setTitleAssignee] = useState<string>(getTitleButtonAssignee(currentStatus));
  const [idxSelectImage, setIdxSelectImage] = useState<number>();
  const [showImages, setShowImages] = useState<boolean>(false);
  const [images, setImages] = useState<any[]>(item.img_urls ? item.img_urls.map((img: string) => { return { url: img } }) : []);
  const [userPermissions, setUserPermissions] = useState<ICompanyUserPermission>();

  useEffect(() => {
    fetchListStaff();
    fetchUserPermissions();
  }, []);

  let listStatus: ObjDropdown[] =
    [
      { _key: StatusMaintenanceRequest.Waiting, _value: upperCaseFirstChar(StatusMaintenanceRequest.Waiting.valueOf()) },
      { _key: StatusMaintenanceRequest.Pending, _value: upperCaseFirstChar(StatusMaintenanceRequest.Pending.valueOf()) },
      { _key: StatusMaintenanceRequest.InProgress, _value: upperCaseFirstChar(StatusMaintenanceRequest.InProgress.valueOf().replace("_", " ")) },
      { _key: StatusMaintenanceRequest.Done, _value: upperCaseFirstChar(StatusMaintenanceRequest.Done.valueOf()) },
    ];

  const [idxStatus, setIdxStatus] = useState<number>(findIndex(listStatus, { _key: currentStatus }));

  // Popup Choose Assignee
  const [sendTo, setSendTo] = useState<string>(item.assignee && item.assignee.first_name && item.assignee.last_name ? getFullName(item.assignee.first_name, item.assignee.last_name) : item.assignee ? getUserNameFromMail(item.assignee.email) : '');
  const [isAssigneeModalVisible, setAssigneeModalVisible] = useState<boolean>(false);
  const [selectedListAssignee, setSelectedListAssignee] = useState<string[]>([item.assignee && item.assignee.user_id ? item.assignee.user_id : '']);
  const [assignee, setAssignee] = useState<ICompanyUser[]>([]);
  const dataAssignee: ObjDropdown[] = [
    ...assignee.map(item => ({
      _key: item.user ? item.user.user_id : '',
      _value: !item.user.first_name && !item.user.last_name
        ? getUserNameFromMail(item.user.email)
        : getFullName(item.user.first_name, item.user.last_name)
    }))
  ]

  const assigneeRequest = (assigneeId: string) => {
    NavigationActionsService.showLoading()
    dispatch(
      assigneeMaintenanceRequest({
        companyId: me && me.default_company ? me.default_company.id : '',
        id: item.id,
        params: {
          assignee: assigneeId
        },
        onSuccess: data => {
          statusRequestFlatListRef && statusRequestFlatListRef.current && statusRequestFlatListRef.current.reloadData();
          maintenanceFlatListRef && maintenanceFlatListRef.current && maintenanceFlatListRef.current.reloadData();
          NavigationActionsService.hideLoading();
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const onSelectAssigneeDone = (selectedList: string[]) => {
    setAssigneeModalVisible(false);
    console.log('selectedList: ', selectedList);
    setSelectedListAssignee(selectedList);
    const objFind = dataAssignee && find(dataAssignee, { _key: selectedList[0] });
    if (objFind) {
      setSendTo(objFind._value);
      // Call API Update Request
      assigneeRequest(objFind._key);
    } else {
      setSendTo("");
    }
  };

  const onOpenAssigneeModal = () => {
    setAssigneeModalVisible(true);
  };

  const onCloseAssigneeModal = () => {
    setAssigneeModalVisible(false);
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Assignee';
  };

  const renderAssignee = () => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          key={'assignee'}
          hideModalContentWhileAnimating
          isVisible={isAssigneeModalVisible}
          useNativeDriver
          customBackdrop={
            <TouchableWithoutFeedback onPress={onCloseAssigneeModal}>
              <View style={styles.backgroundModal} />
            </TouchableWithoutFeedback>
          }
        >
          <CustomSelect
            checkListData={dataAssignee}
            selectedList={selectedListAssignee}
            onCloseModal={onCloseAssigneeModal}
            onDone={(selectedList: string[]) => {
              onSelectAssigneeDone(selectedList);
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('requests.send_to')}
          text={sendTo ? setTextFromKey(dataAssignee, selectedListAssignee) : 'Please Assignee'}
          onPress={onOpenAssigneeModal}
          mainContainer={styles.mainContainerSendTo}
          moreStyle={styles.moreStyleSendTo}
          styleTouchable={styles.styleTouchable}
          textStyle={styles.textStyleSendTo}
          containerStyle={styles.containerStyleSendTo}
          descriptionStyle={styles.descriptionStyle}
        />
        <View style={styles.line}></View>
      </View>
    );
  }

  const renderSendTo = () => {
    if (userPermissions && userPermissions.role === Role.Staff && currentStatus === StatusMaintenanceRequest.Pending) {
      return renderAssignee();
    } else {
      if (userPermissions && userPermissions.role !== Role.Staff) {
        return renderAssignee();
      } else {
        return (
          <RequestDetailItem
            title={translate('requests.send_to')}
            rightComponent={
              <CustomText styleContainer={styles.styleContainerTitle} style={styles.text} text={sendTo} />
            } />
        );
      }
    }
  }

  const fetchListStaff = () => {
    const companyId = me && me.default_company ? me.default_company.id : ''
    if (companyId) {
      // API: Get list staff
      dispatch(
        getListStaff({
          id: companyId,
          isSave: false,
          limit: Config.Manager.limitGetAll,
          page: 1,
          onSuccess: data => {
            setAssignee(data.results);
          },
        }));
    }
  };

  const fetchUserPermissions = () => {
    const companyId = me && me.default_company ? me.default_company.id : ''
    dispatch(
      getUserPermissions({
        companyId,
        onSuccess: (data: ICompanyUserPermission) => {
          console.log('data: ', data);
          setUserPermissions(data);
        }
      })
    )
  }

  const fetchGeneralMaintenanceRequest = () => {
    dispatch(
      getGeneral({
        companyId: me && me.default_company ? me.default_company.id : '',
        onSuccess: async (data) => {
          console.log("===== Success general: ", data);
        },
        onFail: error => {
          console.log('Error', error && error.message);
        }
      })
    )
  }

  const onChangeStatusRequest = (id: string, status: string, isPopTo: boolean = false) => {
    const params: ChangeStatusMaintenanceRequest = {
      status: status
    }
    NavigationActionsService.showLoading();
    dispatch(
      changeStatusRequest({
        companyId: me && me.default_company ? me.default_company.id : '',
        id,
        params,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          fetchGeneralMaintenanceRequest();
          statusRequestFlatListRef && statusRequestFlatListRef.current && statusRequestFlatListRef.current.reloadData();
          maintenanceFlatListRef && maintenanceFlatListRef.current && maintenanceFlatListRef.current.reloadData();
          isPopTo && NavigationActionsService.pop();
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

  const updateUIStatus = (status: string) => {
    if (status == StatusMaintenanceRequest.Waiting) {
      setIcon(NewIcon);
      setTitleAssignee(translate('requests.accept'));
    } else if (status == StatusMaintenanceRequest.Pending) {
      setIcon(PendingIcon);
      setTitleAssignee(translate('requests.start'));
    } else if (status == StatusMaintenanceRequest.InProgress) {
      setIcon(InProgressIcon);
      setTitleAssignee(translate('requests.finish'));
    } else {
      setIcon(DoneIcon);
      setTitleAssignee(translate('requests.reopen'));
    }
  }

  const onChangeDropDownStatus = (obj: any) => {
    setIdxStatus(findIndex(listStatus, { _key: obj._key }));
    setCurrentStatus(obj._key);
    updateUIStatus(obj._key);
    onChangeStatusRequest(item.id, obj._key);
  };

  const renderStatus = () => {
    if (userPermissions && userPermissions.role != Role.Staff) {
      return <DropdownNative
        arrData={listStatus}
        containerStyle={styles.dropdownContainer}
        selected={idxStatus}
        lineBottom={false}
        onChangeDropDown={onChangeDropDownStatus}
        linearGradientColors={["transparent", "transparent"]}
        textStyle={styles.titleStatus}
        iconRightStyle={styles.arrowImage}
        textTitle={"Choose Status"}
        isHideTitle={true}
      />;
    } else {
      return <CustomText style={styles.titleStatus} numberOfLines={1} text={statusText} />;
    }
  };

  const onPressAssignee = (item: IRequest) => {
    const findIndexStatus = findIndex(listStatus, { _key: currentStatus })
    if (findIndexStatus == 3) {
      setIdxStatus(0);
      setCurrentStatus(listStatus[0]._key);
      updateUIStatus(listStatus[0]._key);
      onChangeStatusRequest(item.id, listStatus[0]._key, true);
    } else {
      setIdxStatus(findIndexStatus + 1);
      setCurrentStatus(listStatus[findIndexStatus + 1]._key);
      updateUIStatus(listStatus[findIndexStatus + 1]._key);
      onChangeStatusRequest(item.id, listStatus[findIndexStatus + 1]._key, true);
    }
  };

  const renderButtonAssignee = () => {
    if ((currentStatus == StatusMaintenanceRequest.Waiting || currentStatus == StatusMaintenanceRequest.Done) && userPermissions && userPermissions.role === Role.Staff) {
      return null;
    } else {
      return (
        <View style={styles.buttonAssignee}>
          <CustomButton text={upperCase(titleAssignee)} textStyle={styles.titleButtonAssignee} onPress={onPressAssignee.bind(undefined, item)} />
        </View>
      );
    }
  };

  const renderRequestDetails = () => {
    const displayCreator = !item.creator.first_name && !item.creator.last_name ? getFullName(item.creator.first_name, item.creator.last_name) : getUserNameFromMail(item.creator.email);
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
                <Image source={icon} resizeMode={'contain'} style={styles.icon} />
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
          {renderSendTo()}
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

export default RequestDetail;
