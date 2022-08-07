import React, { useState, useRef, useEffect } from 'react';
import styles from './styles';
import { View, Image } from 'react-native';
import { IC_NOTIFICATION_HEADER } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import ADD_PLUS from '@res/icons/icon-plus-round.png';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import Container from '@src/components/Container';
import translate from '@src/localize';
import NavigationActionsService from '@src/navigation/navigation';
import { NOTIFICATION_DETAILS, NEW_NOTIFICATION, FILTER } from '@src/constants/screenKeys';
import NotificationItem from '@src/components/FlatListItem/NotificationItem';
import CustomSectionHeader from '@src/components/CustomSection';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { QueryCompanyBulletinBoardNotificationParams } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyBulletinBoardNotification } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification/models';
import { getListNotification } from '@src/modules/bulletin/actions';
import { LimitLoadMore } from '@src/constants/vars';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { BulletinPostStatus, SortDir, NotificationSortBy, NotificationType } from '@reup/reup-api-sdk/libs/api/enum';
import { markReadAllNotification } from '@src/modules/notifications/notification/actions';

const Notifications = () => {
  const dispatch = useDispatch()
  const flatList = useRef<any>(null)
  const [isLoadData, setLoadData] = useState<boolean>(false)
  const [params, setParams] = useState<QueryCompanyBulletinBoardNotificationParams>({
    status: undefined,
    sort_by: undefined,
    sort_dir: undefined,
    property_id: '',
    country_id: '',
  })

  const dataSortByLatest: ObjDropdown[] = [
    { _key: "all", _value: translate('general_notification.all') },
    { _key: SortDir.ASC, _value: translate('general_notification.latest') },
    { _key: SortDir.DESC, _value: translate('general_notification.newest') },
  ]

  const dataStatus: ObjDropdown[] = [
    { _key: "all", _value: translate('general_notification.all_status') },
    { _key: BulletinPostStatus.Denied, _value: translate('general_notification.denied') },
    { _key: BulletinPostStatus.Pending, _value: translate('general_notification.pending') },
    { _key: BulletinPostStatus.Approved, _value: translate('general_notification.approved') },
  ]

  const dataType: ObjDropdown[] = [
    { _key: "all", _value: translate('general_notification.all_type') },
    { _key: NotificationType.General, _value: translate('new_notification.general_notification') },
    { _key: NotificationType.Incident, _value: translate('new_notification.incident_report') },
  ]

  const showByObj: ObjDropdown[] = [
    { _key: "all", _value: translate('general_notification.all_notifications') },
    { _key: 'my_notification', _value: translate('general_notification.my_notifications') },
    { _key: 'building_notification', _value: translate('general_notification.building_notifications') }
  ]

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!)
  const badgeNumber = useSelector<RootState, number>((state: RootState) => state.notifications.notificationInfo.badge);
  const defaultCompanyId = me.default_company.id ?? ''

  const listNotification = useSelector<RootState, IPagination<ICompanyBulletinBoardNotification>>(
    (state: RootState) => state.bulletin.listNotification
  )

  useEffect(() => {
    if (badgeNumber > 0) {
      dispatch(markReadAllNotification({
        callBack: () => { }
      }))
    }
  }, [])

  useEffect(() => {
    if (isLoadData && me && me.default_company && me.default_company.id) {
      const p = {
        status: undefined,
        sort_by: undefined,
        sort_dir: undefined,
        property_id: '',
        country_id: '',
      }
      onReloadDataWithParams(p)
    }
  }, [me.default_company.id])

  const onReloadDataWithParams = (p: QueryCompanyBulletinBoardNotificationParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchDataNotifications(1, p);
    }, 200)
  }

  const fetchDataNotifications = (
    page: number,
    params: QueryCompanyBulletinBoardNotificationParams,
    onLoadSuccess?: () => void,
    onLoadFailure?: () => void,
  ) => {
    dispatch(
      getListNotification({
        id: defaultCompanyId,
        page,
        limit: LimitLoadMore,
        params,
        onSuccess: () => {
          setLoadData(true)
          onLoadSuccess && onLoadSuccess()
        },
        onFail: () => {
          setLoadData(true)
          onLoadFailure && onLoadFailure()
        },
      })
    )
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchDataNotifications(page, params, onLoadSuccess, onLoadFailure)
  };

  const onApplyFilter = (filter: any) => {
    const p: QueryCompanyBulletinBoardNotificationParams = {
      status: filter.status && filter.status !== 'all' ? filter.status : undefined,
      sort_by: filter.sortByLatest && filter.sortByLatest !== 'all' ? NotificationSortBy.Modified : undefined,
      sort_dir: filter.sortByLatest && filter.sortByLatest !== 'all' ? filter.sortByLatest : undefined,
      country_id: filter.country ?? '',
      property_id: filter.building ?? '',
      me: filter.showBy && filter.showBy === 'my_notifications' ? true : false,
      type: filter.allType && filter.allType !== 'all' ? filter.allType : undefined,
    }
    onReloadDataWithParams(p)
  };

  const onPressItem = (item: ICompanyBulletinBoardNotification) => {
    NavigationActionsService.push(NOTIFICATION_DETAILS, { item: item, ref: flatList });
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 4,
      isSortByLatest: true,
      indexSortByLatest: 0,
      isStatus: true,
      dataStatus: dataStatus,
      dataSortByLatest: dataSortByLatest,
      isAllType: true,
      dataType: dataType,
      isShowBy: true,
      indexShowBy: 1,
      dataShowBy: showByObj,
      indexStatus: 2,
      indexAllType: 3,
      onFilter: onApplyFilter
    });
  };

  const onPressAdd = () => {
    NavigationActionsService.push(NEW_NOTIFICATION, { ref: flatList });
  };

  const _renderItem = (item: ICompanyBulletinBoardNotification) => {
    return <NotificationItem
      item={item}
      onPress={onPressItem} />;
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <View style={{ width: 14 }} />
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  return (
    <Container isDisplayNotification={false}
      title={translate('general_notification.notifications')}
      isShowHeader={true} spaceBottom={true}>
      <View style={styles.container}>
        <CustomSectionHeader
          style={styles.sectionHeader}
          title={translate("general_notification.header_notification")}
          icon={IC_NOTIFICATION_HEADER}
          isShowFilter={true}
          onPressFilter={onPressFilter}
          styleTitle={styles.titleHeader}
        />

        <View style={styles.listContainer}>
          <CustomFlatList
            ref={flatList}
            loadMore={true}
            pullToRefresh={true}
            hasNext={listNotification.next}
            onLoad={onLoad}
            ItemSeparatorComponent={_itemSeparator}
            data={listNotification.results}
            renderItem={_renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={onPressAdd}
            iconLeft={ADD_PLUS}
            text={translate('general_notification.title_button')}
            style={styles.button} />
        </View>
      </View>
    </Container >
  );
};

export default Notifications;
