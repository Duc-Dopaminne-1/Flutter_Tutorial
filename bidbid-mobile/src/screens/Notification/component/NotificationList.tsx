import * as React from 'react';
import { FlatList, Text, View, ScrollView } from 'react-native';
import { StyleSheet, RefreshControl } from 'react-native';
import { ReactElement, useContext, useEffect, useState } from 'react';
import NavigationActionsService from '@/navigation/navigation';
import { deleteOne, getNotification, getTotalUnRead } from '@/redux/notification/actions';
import { useSelector } from 'react-redux';
import { NotificationInit } from '@/redux/notification/reducer';
import store from '@/redux/store';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { NotificationContext } from '@/screens/Notification/NotificationContext';
import { CustomSwipeAble } from '@/components/CustomSwipe';
import NotificationListItem from '@/screens/Notification/component/NotificationListItem';
import { isIOS } from '@/shared/devices';
import Spinner from '@/components/Spinner';
import NoNotificationSVG from '@/components/SVG/NoNotificationSVG';
import NotificationListClearAll from '@/screens/Notification/component/NotificationListClearAll';

let rows = {};
let productIdCloseSwipe = '';

function NotificationList(): ReactElement {
  const { data: listNotification, shouldHideLoading } = useSelector((state: NotificationInit) => state.notification);
  const [refreshing, setRefreshing] = useState(false);
  const [showRefreshingIndicator, setShowRefreshingIndicator] = useState(false);
  const { onSetStatusData } = useContext(NotificationContext);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    onFetch(true);
  }, []);

  useEffect(() => {
    NavigationActionsService.hideLoading();
    if (shouldHideLoading && listNotification.length === 0) {
      setLoading(false);
      // data empty
      onSetStatusData(true);
    } else if (shouldHideLoading && listNotification.length !== 0) {
      setLoading(false);
      onSetStatusData(false);
    }
  }, [listNotification]);

  const onFetch = (isReset: boolean) => {
    const { page } = store.getState().notification;
    if (isReset) {
      NavigationActionsService.dispatchAction(getTotalUnRead({}));
    }

    NavigationActionsService.dispatchAction(
      getNotification({
        page: isReset ? 1 : page + 1,
        isRefresh: isReset,
        onSuccess: () => {
          setShowRefreshingIndicator(false);
        },
        onFail: () => {
          setShowRefreshingIndicator(false);
        },
      }),
    );
  };

  const onEndReached = async () => {
    onFetch(false);
  };

  const onRefresh = React.useCallback(async () => {
    setShowRefreshingIndicator(true);
    onFetch(true);
  }, [refreshing]);

  const swipeRightOpen = (id: string) => {
    if (productIdCloseSwipe !== '' && productIdCloseSwipe !== id) {
      if (rows[productIdCloseSwipe]) {
        rows[productIdCloseSwipe].close();
      }
    }
    productIdCloseSwipe = id;
  };

  const resetDataLocal = () => {
    productIdCloseSwipe = '';
  };

  const onPressClose = () => {
    resetDataLocal();
  };

  const onPressDelete = (id: string) => {
    if (rows[productIdCloseSwipe]) {
      rows[productIdCloseSwipe].close();
    }
    NavigationActionsService.dispatchAction(deleteOne({ id }));
    onPressClose();
  };

  const renderItem = ({ item }) => {
    const { id } = item;
    return (
      <CustomSwipeAble
        _productSwipeRef={row => (rows[id] = row)}
        product={item}
        onPressDelete={() => onPressDelete(id)}
        swipeRightOpen={() => swipeRightOpen(id)}
      >
        <NotificationListItem item={item} />
      </CustomSwipeAble>
    );
  };

  const onFuncEndReached = () => {
    if (refreshing) return;
    setRefreshing(true);
    onEndReached().then(() => {
      setRefreshing(false);
    });
  };

  const renderEmpty = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.wrapEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <NoNotificationSVG />
        <View style={styles.wrapTextNoEmpty}>
          <Text style={styles.textEmpty}>{language('noNotification')}</Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Spinner loading={isLoading} />
      {shouldHideLoading && listNotification.length === 0 && !isLoading ? (
        renderEmpty()
      ) : (
        <>
          <NotificationListClearAll />
          <FlatList
            data={listNotification}
            refreshing={refreshing}
            refreshControl={<RefreshControl refreshing={showRefreshingIndicator} onRefresh={onRefresh} />}
            onEndReached={onFuncEndReached}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => item + index}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  wrapEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  wrapTextNoEmpty: {
    marginTop: 10,
  },
  textEmpty: {
    fontSize: fonts.size.s16,
    color: colors.gray_last_time,
    fontWeight: isIOS ? '600' : 'bold',
    fontFamily: fonts.family.PoppinsRegular,
  },
});

export default React.memo(NotificationList);
