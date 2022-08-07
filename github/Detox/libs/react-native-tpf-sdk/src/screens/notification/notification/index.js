import {
  changeStatusNotificationHistoryHandle,
  deleteNotificationHistoryClear,
  deleteNotificationHistoryHandle,
  getGeneralNotificationHandle,
  getPersonalNotificationHistoryHandle
} from '../../../redux/actions/notification';
import { getShowAlertError } from '../../../redux/actions/system';
import { NOTIFICATION } from '../../../redux/actionsType';
import { BodyText, CheckBox, PrimaryButton, SubHead, WithLoading } from '../../../components/';
import Divider from '../../../components/divider';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { REMOVE_NOTIFICATION, REMOVE_NOTIFICATION_SUCCESS } from '../../../constants/errors';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch, useSelector } from 'react-redux';
import NotificationItem from '../components/notification_item';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

const Notification = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { memberId } = useSelector(state => state.auth);
  const {
    generalNotifications,
    isGeneralNotificationLoading: loading,
    totalGeneralNotifications: totalCount,
    totalGeneralUnreadCount,
    personalNotifications,
    isPersonalNotificationLoading: personalLoading,
    totalPersonalNotifications: personalTotalCount,
    totalPersonalUnreadCount,
    deleteNotificationResult
  } = useSelector(state => state.notification);
  const { lang } = useSelector(state => state.setting);

  const [selectedTab, setSelectedTab] = useState('0');
  const [isRemoveMode, setRemoveMode] = useState(false);
  const [removeList, setRemoveList] = useState([]);
  const [isDeleteAll, setIsDeleteAll] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      disableShadow: true
    });
  }, [navigation]);

  const onDeleteAllChange = useCallback(() => {
    if (isDeleteAll) {
      setRemoveList([]);
    }
    setIsDeleteAll(prevState => !prevState);
  }, [isDeleteAll]);

  const onChangeTab = useCallback(
    tabIndex => {
      setSelectedTab(tabIndex);
      if (isRemoveMode) {
        onDeleteMode();
      }
      setRemoveList([]);
    },
    [isRemoveMode, onDeleteMode]
  );
  const onPublishTab = useCallback(() => {
    onChangeTab('0');
  }, [onChangeTab]);

  const onPrivateTab = useCallback(() => {
    onChangeTab('1');
  }, [onChangeTab]);

  useEffect(() => {
    onFetch();
  }, [dispatch, lang, memberId, onFetch]);

  const onFetch = useCallback(() => {
    dispatch(
      getGeneralNotificationHandle({
        MemberId: memberId,
        Language: lang,
        SkipCount: 0,
        TypeFilter: 2 // -> General Notifications
      })
    );
    dispatch(
      getPersonalNotificationHistoryHandle({
        MemberId: memberId,
        Language: lang,
        SkipCount: 0,
        TypeFilter: 1 // -> General Notifications
      })
    );
  }, [dispatch, lang, memberId]);

  const onDeleteMode = useCallback(() => {
    setRemoveMode(!isRemoveMode);
  }, [isRemoveMode]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <NotificationItem
          item={item}
          isRemoveMode={isRemoveMode}
          isChecked={isDeleteAll ? isDeleteAll : removeList.indexOf(item) > -1}
          onAddRemove={onAddRemove}
          {...{ navigation }}
        />
      );
    },
    [isRemoveMode, isDeleteAll, removeList, onAddRemove, navigation]
  );

  const onAddRemove = useCallback(
    (checked, item) => {
      if (checked) {
        if (
          !isDeleteAll &&
          ((selectedTab === '0' && removeList?.length === totalCount - 1) ||
            (selectedTab === '1' && removeList?.length === personalTotalCount - 1))
        ) {
          setIsDeleteAll(prevState => !prevState);
        }

        setRemoveList(pre => {
          return [...pre, item];
        });
      } else {
        if (isDeleteAll) {
          setIsDeleteAll(prevState => !prevState);
          if (selectedTab === '0') {
            setRemoveList(generalNotifications.filter(t => t !== item));
          } else {
            setRemoveList(personalNotifications.filter(t => t !== item));
          }
        } else {
          setRemoveList(pre => {
            return [...pre.filter(t => t !== item)];
          });
        }
      }
    },
    [
      generalNotifications,
      isDeleteAll,
      personalNotifications,
      personalTotalCount,
      removeList,
      selectedTab,
      totalCount
    ]
  );

  const onShowPopup = () => {
    dispatch(
      getShowAlertError({
        ...REMOVE_NOTIFICATION,
        confirmAction: onRemove
      })
    );
  };

  useLayoutEffect(() => {
    navigation?.setOptions({
      RightComponent: () => (
        <TouchableOpacity onPress={onDeleteMode}>
          <SubHead translate color={CUSTOM_COLOR.PersianGreen}>
            {isRemoveMode ? 'common.cancel_03' : 'common.delete_01'}
          </SubHead>
        </TouchableOpacity>
      )
    });
  }, [isRemoveMode, navigation, onDeleteMode]);

  const onRemove = useCallback(() => {
    onDeleteMode();

    if (isDeleteAll) {
      dispatch(
        deleteNotificationHistoryHandle({
          memberId,
          removeList: [],
          isDeleteAll: true,
          typeFilter: selectedTab === '0' ? 2 : 1
        })
      );
    } else {
      dispatch(deleteNotificationHistoryHandle({ memberId, removeList }));
    }
    setRemoveList([]);
  }, [onDeleteMode, isDeleteAll, dispatch, memberId, selectedTab, removeList]);

  const renderSeparator = useCallback(() => <Divider style={styles.divider} />, []);

  const loadMore = useCallback(() => {
    if (!loading && generalNotifications?.length < totalCount) {
      dispatch(
        getGeneralNotificationHandle({
          MemberId: memberId,
          SkipCount: generalNotifications?.length
        })
      );
    }
  }, [dispatch, loading, memberId, generalNotifications?.length, totalCount]);

  const personalLoadMore = useCallback(() => {
    if (!personalLoading && personalNotifications?.length < personalTotalCount) {
      dispatch(
        getPersonalNotificationHistoryHandle({
          MemberId: memberId,
          SkipCount: personalNotifications?.length
        })
      );
    }
  }, [personalNotifications?.length, personalLoading, personalTotalCount, dispatch, memberId]);

  useEffect(() => {
    if (deleteNotificationResult?.isSuccess) {
      onFetch();
      dispatch(getShowAlertError(REMOVE_NOTIFICATION_SUCCESS));
      dispatch(deleteNotificationHistoryClear());
    }
  }, [deleteNotificationResult?.isSuccess, dispatch, onFetch]);

  const onReadAll = useCallback(() => {
    dispatch(
      changeStatusNotificationHistoryHandle({
        memberId: memberId,
        isChangeAll: true,
        typeFilter: selectedTab === '0' ? 2 : 1
      })
    );
  }, [dispatch, memberId, selectedTab]);

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={styles.body}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === '0' && styles.activeTab]}
            onPress={onPublishTab}
            activeOpacity={0.8}>
            <SubHead
              translate
              color={selectedTab === '0' ? CUSTOM_COLOR.PersianGreen : CUSTOM_COLOR.ShuttleGray}
              bold={selectedTab === '0'}>
              {'notification.general'}
              {totalGeneralUnreadCount ? `(${totalGeneralUnreadCount})` : ''}
            </SubHead>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === '1' && styles.activeTab]}
            onPress={onPrivateTab}
            activeOpacity={0.8}>
            <SubHead
              translate
              color={selectedTab === '1' ? CUSTOM_COLOR.PersianGreen : CUSTOM_COLOR.ShuttleGray}
              bold={selectedTab === '1'}>
              {'notification.tab_filter_1'}
              {totalPersonalUnreadCount ? `(${totalPersonalUnreadCount})` : ''}
            </SubHead>
          </TouchableOpacity>
        </View>

        <View>
          {isRemoveMode ? (
            <View style={styles.removeContainer}>
              <BodyText translate color={CUSTOM_COLOR.GreenBold} style={styles.removeAll}>
                {'common.delete_all'}
              </BodyText>
              <View style={styles.checkBoxContainer}>
                <CheckBox checked={isDeleteAll} onChange={onDeleteAllChange} />
              </View>
            </View>
          ) : (selectedTab === '0' && totalGeneralUnreadCount > 0) ||
            (selectedTab === '1' && totalPersonalUnreadCount > 0) ? (
            <TouchableOpacity activeOpacity={0.8} onPress={onReadAll}>
              <BodyText
                translate
                color={CUSTOM_COLOR.PersianGreen}
                semiBold
                style={styles.markRead}>
                {'common.read_all'}
              </BodyText>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.wrapper}>
          {selectedTab === '0' ? (
            <FlatList
              data={generalNotifications || []}
              contentContainerStyle={styles.contentListContainer}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={renderSeparator}
              keyExtractor={item => item?.idNotification + item?.creationTime}
              onEndReached={loadMore}
            />
          ) : (
            <FlatList
              data={personalNotifications || []}
              contentContainerStyle={styles.contentListContainer}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={renderSeparator}
              keyExtractor={item => item?.idNotification + item?.creationTime}
              onEndReached={personalLoadMore}
            />
          )}
        </View>
      </View>
      {isRemoveMode ? (
        <View style={styles.btnContainer}>
          <PrimaryButton
            translate
            title={'common.delete_now'}
            disabled={isEmpty(removeList) && !isDeleteAll}
            onPress={onShowPopup}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default WithLoading(Notification, [NOTIFICATION.DELETE_NOTIFICATION_HISTORY.HANDLER]);
