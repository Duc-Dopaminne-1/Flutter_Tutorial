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
import { NOTIFICATION_DETAILS_TENANT, FILTER_TENANT, NEW_NOTIFICATION_TENANT } from '@src/constants/screenKeys';
import NotificationItem from '@src/components/FlatListItem/NotificationItem';
import CustomSectionHeader from '@src/components/CustomSection';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyBulletinBoardNotification } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification/models';
import { getListNotification } from '@src/modules/bulletin/actions';
import { LimitLoadMore } from '@src/constants/vars';
import { QueryResidentBulletinBoardNotificationParams } from '@reup/reup-api-sdk/libs/api/resident/bulletin/notification';
import { markReadAllNotification } from '@src/modules/notifications/notification/actions';

const NotificationsTenant = () => {
  const dispatch = useDispatch();
  const flatList = useRef<any>(null);
  const [isLoadData, setLoadData] = useState<boolean>(false);

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const badgeNumber = useSelector<RootState, number>((state: RootState) => state.notifications.notificationInfo.badge);

  const listNotification = useSelector<RootState, IPagination<ICompanyBulletinBoardNotification>>(
    (state: RootState) => state.bulletin.listNotification
  );

  useEffect(() => {
    if (isLoadData && me && me.default_property) {
      const p: QueryResidentBulletinBoardNotificationParams = {};
      onReloadDataWithParams(p);
    }
  }, [me.default_property]);

  useEffect(() => {
    if (badgeNumber > 0) {
      dispatch(markReadAllNotification({
        callBack: () => { }
      }));
    }
  }, []);

  const onReloadDataWithParams = (p: QueryResidentBulletinBoardNotificationParams) => {
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchDataNotifications(1, p);
    }, 200);
  };

  const fetchDataNotifications = (
    page: number,
    params: QueryResidentBulletinBoardNotificationParams,
    onLoadSuccess?: () => void,
    onLoadFailure?: () => void,
  ) => {
    dispatch(
      getListNotification({
        id: me.default_property,
        page,
        limit: LimitLoadMore,
        params,
        onSuccess: () => {
          setLoadData(true);
          onLoadSuccess && onLoadSuccess();
        },
        onFail: () => {
          setLoadData(true);
          onLoadFailure && onLoadFailure();
        },
      })
    );
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    const params = {};
    fetchDataNotifications(page, params, onLoadSuccess, onLoadFailure);
  };

  const onPressItem = (item: ICompanyBulletinBoardNotification) => {
    NavigationActionsService.push(NOTIFICATION_DETAILS_TENANT, { item: item, ref: flatList });
  };


  const onPressAdd = () => {
    NavigationActionsService.push(NEW_NOTIFICATION_TENANT, { ref: flatList });
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
          isShowFilter={false}
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

export default NotificationsTenant;
