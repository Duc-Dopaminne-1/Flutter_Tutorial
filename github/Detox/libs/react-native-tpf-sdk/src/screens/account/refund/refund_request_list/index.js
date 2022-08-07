import {
  getSummaryTransactionHandler,
  getListDepositRefundRequestHandler
} from '../../../../redux/actions/deposit';
import { ICGreenQuestion } from '../../../../assets/icons';
import { CommonTabHeader } from '../../../../components';
import AppText from '../../../../components/app_text';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { LIMIT_PAGE } from '../../../../global/app';
import { scale } from '../../../../utils/responsive';
import RefundRequestItem from '../refund_request_item';
import Modal from 'react-native-modal';

import styles from './styles';
import SCREENS_NAME from '../../../../constants/screens';
import themeContext from '../../../../constants/theme/themeContext';

const RefundRequestList = ({ navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.memberId);
  const list = useSelector(state => state.deposit.listRefundRequest);
  const isLoading = useSelector(state => state.deposit.listLoading);
  const isEndList = useSelector(state => state.deposit.isEndList);
  const pendingCount = useSelector(state => state.deposit.pendingTransactionCount);
  const paidCount = useSelector(state => state.deposit.paidTransactionCount);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [helpBoxVisible, setHelpBoxVisible] = useState(false);
  const theme = useContext(themeContext);
  const StatusTab = [
    {
      id: 1,
      title: 'refund_request.processing',
      count: pendingCount?.toString()
    },
    {
      id: 2,
      title: 'refund_request.completed',
      count: paidCount?.toString()
    }
  ];

  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        navigation.goBack();
      }
    });
  }, []);

  const onPressHelpBox = useCallback(() => {
    setHelpBoxVisible(true);
  }, []);

  const onCloseHelpBox = useCallback(() => {
    setHelpBoxVisible(false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      disableShadow: true,
      RightComponent: () => {
        return (
          <TouchableOpacity
            hitSlop={{
              top: scale(10),
              bottom: scale(10),
              left: scale(10),
              right: scale(10)
            }}
            onPress={onPressHelpBox}>
            <ICGreenQuestion color1={theme?.app?.primaryColor1} />
          </TouchableOpacity>
        );
      }
    });
  }, [navigation, onPressHelpBox]);

  const renderItem = useCallback(
    ({ item }) => {
      return <RefundRequestItem item={item} tabIndex={tabIndex} />;
    },
    [tabIndex]
  );
  const keyExtractor = useCallback((item, index) => (item?.id || index).toString(), []);

  useEffect(() => {
    dispatch(
      getSummaryTransactionHandler({
        params: {
          memberId
        }
      })
    );
  }, [dispatch, memberId]);

  const onFetch = useCallback(
    skipCount => {
      dispatch(
        getListDepositRefundRequestHandler({
          params: {
            memberId,
            status: tabIndex === 0 ? 1 : 2,
            skipCount: skipCount,
            maxResultCount: LIMIT_PAGE
          },
          callback: () => {
            setIsRefreshing(false);
          }
        })
      );
    },
    [dispatch, tabIndex, memberId]
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    onFetch(0);
    dispatch(
      getSummaryTransactionHandler({
        params: {
          memberId
        }
      })
    );
  }, [onFetch, dispatch, memberId]);

  useEffect(() => {
    onFetch(0);
  }, [onFetch]);

  const loadMore = useCallback(() => {
    if (!isEndList && !isLoading) {
      onFetch(list.length);
    }
  }, [isEndList, onFetch, list.length, isLoading]);

  const ListEmptyComponent = useCallback(
    () =>
      list.length !== 0 ? (
        isLoading ? (
          <ActivityIndicator />
        ) : null
      ) : isLoading ? (
        <ActivityIndicator />
      ) : (
        <AppText translate bold={true} style={styles.noData}>
          {'common.noData'}
        </AppText>
      ),
    [list, isLoading]
  );

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={styles.wrapper}>
        <CommonTabHeader
          justify
          translate
          tabs={StatusTab}
          tabIndex={tabIndex}
          onPress={setTabIndex}
        />
        <FlatList
          key={tabIndex}
          data={list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
          onEndReached={loadMore}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
      <Modal
        onBackdropPress={onCloseHelpBox}
        isVisible={helpBoxVisible}
        backdropColor={null}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-end'
        }}>
        <View style={styles.availableBalanceModal}>
          <View style={styles.triangle} />
          <View
            style={[
              styles.noticeView,
              {
                backgroundColor: theme?.app?.primaryColor3
              }
            ]}>
            <AppText translate medium style={styles.notice}>
              {'help_box.refund_request_message'}
            </AppText>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(RefundRequestList);
