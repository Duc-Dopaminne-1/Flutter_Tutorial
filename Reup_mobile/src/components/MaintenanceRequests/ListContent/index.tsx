import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, ImageSourcePropType, Alert } from 'react-native';
import {
  REQUEST_DETAIL, REQUEST_DETAIL_TENANT
} from '@constants/screenKeys';
import NavigationActionsService from '@src/navigation/navigation';
import styles from './styles';

import NewIcon from '@src/res/icons/new-request-icon/new-request-icon.png';
import PendingIcon from '@src/res/icons/pending-request-icon/pending-request-icon.png';
import InProgressIcon from '@src/res/icons/inprogress-request-icon/inprogress-request-icon.png';
import DoneIcon from '@src/res/icons/done-request-icon/done-request-icon.png';
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';
import ICON_TRASH from '@src/res/icons/icon-trash-blue.png';
import ICON_VIEW from 'src/res/icons/icon-view.png';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import translate from '@src/localize';
import { StatusMaintenanceRequest, Priority } from '@reup/reup-api-sdk/libs/api/enum';
import { CustomFlatList } from '@src/components/FlatList';
import { Theme } from '@src/components/Theme';
import { getFullName, getUserNameFromMail, isTenantApp, isManagerApp } from '@src/utils';
import { RootState } from '@src/types/types';
import { useSelector, useDispatch } from 'react-redux';
import { deleteRequest, getGeneral, getResidentRequestGeneral } from '@src/modules/Maintenance/actions';
import { QueryMaintenanceRequestGeneralParams } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';
import { formatApiToUI } from '@src/utils/date';
import ExpandView, { ItemModal } from '@src/components/ExpandView';
import { ResidentQueryMaintenanceRequestGeneralParams } from '@reup/reup-api-sdk/libs/api/resident/maintenance';

export const StatusEnum = {
  new: "Waiting",
  pending: "Pending",
  process: "Process",
  done: "Done"
};

export const getIconStatusRequest = (status: string) => {
  if (status == StatusMaintenanceRequest.Waiting) {
    return NewIcon;
  } else if (status == StatusMaintenanceRequest.Pending) {
    return PendingIcon;
  } else if (status == StatusMaintenanceRequest.InProgress) {
    return InProgressIcon;
  } else {
    return DoneIcon;
  }
};

export const getTitleButtonAssignee = (status: string) => {
  if (status == StatusMaintenanceRequest.Waiting) {
    return translate('requests.accept');
  } else if (status == StatusMaintenanceRequest.Pending) {
    return translate('requests.start');
  } else if (status == StatusMaintenanceRequest.InProgress) {
    return translate('requests.finish');
  } else {
    return translate('requests.reopen');
  }
};

export const getTitleStatusRequest = (status: string) => {
  if (status == StatusMaintenanceRequest.Waiting) {
    return translate('maintenance.waiting');
  } else if (status == StatusMaintenanceRequest.Pending) {
    return translate('maintenance.pending');
  } else if (status == StatusMaintenanceRequest.InProgress) {
    return translate('maintenance.in_progress');
  } else {
    return translate('maintenance.done');
  }
};

export const getStylePriority = (priority: string) => {
  if (priority.toLowerCase() == Priority.High.valueOf().toLowerCase()) {
    return styles.priorityHigh;
  } else if (priority.toLowerCase() == Priority.Medium.valueOf().toLowerCase()) {
    return styles.priorityMedium;
  } else {
    return styles.priorityLow;
  }
};

interface Props {
  showStatusIcon?: boolean;
  data: IPagination<IRequest>;
  onLoad: (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => void;
  listHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  flatListRef?: any;
  maintenanceFlatListRef?: any;
}

const ListContent = (props: Props) => {
  const { showStatusIcon = true, data, onLoad, listHeaderComponent = null, flatListRef = null, maintenanceFlatListRef = null } = props;
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [activeItem, setActiveItem] = useState<ItemModal>();

  useEffect(() => {
    if (isTenantApp()) {
      me && me.default_property && fetchGeneralMaintenanceRequest(me.default_property);
    } else {
      me && me.default_company && me.default_company.id && fetchGeneralMaintenanceRequest(me.default_company.id);
    }
  }, []);

  const fetchGeneralMaintenanceRequest = (id: string) => {
    if (isTenantApp()) {
      dispatch(
        getResidentRequestGeneral({
          property_id: id,
          onSuccess: async (data) => {
            console.log("===== Success general Tenant: ", data);
          },
          onFail: error => {
            console.log('Error', error && error.message);
          }
        })
      );
    } else {
      dispatch(
        getGeneral({
          companyId: id,
          onSuccess: async (data) => {
            console.log("===== Success general: ", data);
          },
          onFail: error => {
            console.log('Error', error && error.message);
          }
        })
      );
    }
  };

  const onDeleteRequest = (id: string) => {
    dispatch(
      deleteRequest({
        companyId: me && me.default_company ? me.default_company.id : '',
        id,
        onSuccess: data => {
          if (isTenantApp()) {
            me && me.default_property && fetchGeneralMaintenanceRequest(me.default_property);
          } else {
            me && me.default_company && me.default_company.id && fetchGeneralMaintenanceRequest(me.default_company.id);
          }
          flatListRef && flatListRef.current && flatListRef.current.reloadData();
          maintenanceFlatListRef && maintenanceFlatListRef.current && maintenanceFlatListRef.current.reloadData();
        },
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onPressTrash = (item: IRequest) => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          onDeleteRequest(item.id);
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  };

  const onPressView = (item: IRequest) => {
    if (isManagerApp()) {
      NavigationActionsService.push(
        REQUEST_DETAIL,
        {
          item,
          maintenanceFlatListRef: maintenanceFlatListRef,
          statusRequestFlatListRef: flatListRef
        }
      );
    } else {
      NavigationActionsService.push(
        REQUEST_DETAIL_TENANT,
        {
          item,
          maintenanceFlatListRef: maintenanceFlatListRef,
          statusRequestFlatListRef: flatListRef
        }
      );
    }

  };

  const _renderHeader = (item: IRequest) => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.header}>

          <View style={styles.headerIcon}>
            {showStatusIcon ?
              <Image style={styles.icon} source={getIconStatusRequest(item.status)} resizeMode="contain" />
              : <View style={styles.iconBlue} />
            }
            <CustomText style={styles.headerLabel} text={'Title'} />
          </View>
          <View style={styles.viewHeaderText}>
            <CustomText style={styles.headerText} text={item.title} numberOfLines={0} />
          </View>

        </View>
        {/* {!isActive ? <View style={styles.divider} /> : null} */}
      </View>
    );
  };

  const _renderContent = (item: IRequest) => {
    const creatorDisplayName = (item.creator.first_name && item.creator.last_name) ? getFullName(item.creator.first_name, item.creator.last_name) : getUserNameFromMail(item.creator.email);
    const assigneeDisplayName = (item.assignee && item.assignee.first_name && item.assignee.last_name ? getFullName(item.assignee.first_name, item.assignee.last_name) : item.assignee ? getUserNameFromMail(item.assignee.email) : '');
    const priorityDisplay = item.priority ? item.priority.valueOf() : '';
    const request_date = item.request_date ? `${formatApiToUI(item.request_date)}` : '';
    return (
      <View style={styles.content}>
        {/* Creator */}
        <View style={styles.creatorContainer}>
          <View style={[styles.headerIcon, styles.creatorView]}>
            <CustomText style={styles.headerLabel} text={'Creator'} />
          </View>
          <Image style={styles.thumbnail} resizeMode='contain' source={{ uri: item.creator.avatar }} />
          <CustomText style={styles.headerText} text={creatorDisplayName} />
        </View>

        {/* Category */}
        <View style={styles.creatorContainer}>
          <View style={[styles.headerIcon, styles.creatorView]}>
            <CustomText style={styles.headerLabel} text={'Category'} />
          </View>
          <CustomText style={styles.headerText} text={item.category.name} />
        </View>

        {/* Receiver */}
        <View style={styles.creatorContainer}>
          <View style={[styles.headerIcon, styles.creatorView]}>
            <CustomText style={styles.headerLabel} text={'Receiver'} />
          </View>
          <CustomText style={styles.headerText} text={assigneeDisplayName} />
        </View>

        {/* Date */}
        <View style={styles.creatorContainer}>
          <View style={[styles.headerIcon, styles.creatorView]}>
            <CustomText style={styles.headerLabel} text={'Date'} />
          </View>
          <CustomText style={styles.headerText} text={request_date} />
        </View>

        {/* Prority */}
        <View style={styles.creatorContainer}>
          <View style={[styles.headerIcon, styles.creatorView]}>
            <CustomText style={styles.headerLabel} text={'Prority'} />
          </View>
          <CustomText style={[styles.headerText, styles.priority, item.priority ? getStylePriority(item.priority) : null]} text={priorityDisplay} />
        </View>

        {/* Action */}
        <View style={styles.creatorContainer}>
          <View style={[styles.headerIcon, styles.creatorView]}>
            <CustomText style={styles.headerLabel} text={'Action'} />
          </View>
          {!isTenantApp() ? <CustomButton style={styles.trash} iconLeftStyle={styles.iconLeftStyle} iconLeft={ICON_TRASH} onPress={() => onPressTrash(item)} /> : null}
          <CustomButton style={styles.view} iconLeftStyle={styles.iconLeftStyle} iconLeft={ICON_VIEW} onPress={() => onPressView(item)} />
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  const onPressItem = (item: ItemModal) => {
    setActiveItem(item);
  };

  const renderItem = (item: IRequest) => {
    const expanded = item && activeItem && activeItem.item && item.id === activeItem.item.id && !activeItem.isActive;
    const itemModal: ItemModal = {
      item: item,
      isActive: expanded
    };
    return <ExpandView
      item={itemModal}
      onPressItem={onPressItem}
      expanded={expanded}
      componentContent={_renderContent(item)}
      componentHeader={_renderHeader(item)}
    />;
  };

  const renderFlatList = () => {
    return (
      <CustomFlatList
        ref={flatListRef}
        onLoad={onLoad}
        style={styles.customFlatlist}
        contentContainerStyle={styles.contentContainerFlatlist}
        data={data.results}
        hasNext={data.next !== null}
        loadMore
        pullToRefresh
        indicatorColor={Theme.building_system.indicator}
        renderItem={renderItem}
        listHeaderComponent={listHeaderComponent}
      />
    );
  };


  return (
    <View style={styles.container}>
      {renderFlatList()}
    </View>
  );
};

export default ListContent;
