import { useNavigation } from '@react-navigation/native';
import { CommonTabHeader, SubHead } from '../../../components/';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CREDIT_ORDER_STATUS } from '../../../global/order_status';
import RecordCard from '../components/record_card';
import { scale } from '../../../utils/responsive';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/appFonts';
import {
  getCreditOrderListHandle,
  getCreditOrderListOrderClear,
  getTotalRecordClear,
  getTotalRecordHandle,
  setDealNewFlagHandle
} from '../../../redux/actions/credit';
import { useCallback } from 'react';
import { SPACING } from '../../../constants/size';
import __ from 'lodash';
import { CheckBox } from '../../../components/';
import { useMemo } from 'react';
import AppText from '../../../components/app_text';
import { ICEmpty } from '../../../assets/icons';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import { MEMBER_TYPE } from '../../../global/member_type';
import SCREENS_NAME from '../../../constants/screens';
import { getDepositMoneyHandler } from '../../../redux/actions/deposit';
import themeContext from '../../../constants/theme/themeContext';

const ListHeaderComponent = ({ data, status, setChecked, title1, title2 }) => {
  const checked01 = [...data].includes(status[0]);
  const checked02 = [...data].includes(status[1]);

  const onPress = (checked, value) => () => {
    if (checked && [...data].length === 1) {
      return;
    }

    const newdata = [...data];

    __.remove(newdata, o => o === value);

    setChecked(checked ? newdata : [...data, value]);
  };

  return (
    <ScrollView
      horizontal
      bounces={false}
      showsHorizontalScrollIndicator={false}
      style={styles.listHeaderComponent}>
      <CheckBox
        translate
        label={title1}
        checked={checked01}
        style={styles.checkbox}
        onChange={onPress(checked01, status[0])}
      />
      <CheckBox
        translate
        label={title2}
        checked={checked02}
        style={styles.checkbox}
        onChange={onPress(checked02, status[1])}
      />
    </ScrollView>
  );
};

const CreditTab = props => {
  const navigation = useNavigation();
  const theme = useContext(themeContext);
  useEffect(() => {
    navigation.setOptions({
      RightComponent: () => {
        return (
          <>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => navigation.navigate(SCREENS_NAME.SELECT_PRODUCT_TYPE_SCREEN, {})}>
              <SubHead
                translate
                color={theme?.app?.primaryColor1 ?? TEXT_COLOR.Orange}
                style={styles.create}>
                {'application.create'}
              </SubHead>
            </TouchableOpacity>
          </>
        );
      }
    });
  }, []);
  const dispatch = useDispatch();
  const { memberId, topenId } = useSelector(state => state.auth);
  const role = useSelector(state => state.auth.role);
  const list = useSelector(state => state.credit.orderList);
  const loading = useSelector(state => state.credit.orderListLoading);
  const endList = useSelector(state => state.credit.endOrderList);
  const totalOrderSummary = useSelector(state => state.credit.totalOrderSummary);
  const onFetchTotalCount = useCallback(() => {
    dispatch(
      getTotalRecordHandle({
        memberId,
        isTopener: role === MEMBER_TYPE.Topener ? true : false
      })
    );
  }, [dispatch, memberId, role]);

  useEffect(() => {
    onFetchTotalCount();
    return () => {
      dispatch(getTotalRecordClear());
    };
  }, [dispatch, memberId, onFetchTotalCount]);

  const StatusTab = useMemo(
    () => [
      {
        id: 0,
        title: 'application_list.draft',
        count: `${totalOrderSummary?.new || 0}`,
        status: [CREDIT_ORDER_STATUS.Draft]
      },
      {
        id: 1,
        title: 'application_list.need_to_handle',
        count: `${totalOrderSummary?.waiting || 0}`,
        status: [CREDIT_ORDER_STATUS.WaitingForUpdate, CREDIT_ORDER_STATUS.WaitingForPayment]
      },
      {
        id: 2,
        title: 'application_list.processing',
        count: `${totalOrderSummary?.processing || 0}`,
        status: [
          CREDIT_ORDER_STATUS.WaitingForOperatorAcceptance,
          CREDIT_ORDER_STATUS.WaitingForPartnerAcceptance,
          CREDIT_ORDER_STATUS.WaitingForAssessment
        ]
      },
      {
        id: 3,
        title: 'application_list.approved',
        count: `${totalOrderSummary?.approved || 0}`,
        status: [CREDIT_ORDER_STATUS.Approved, CREDIT_ORDER_STATUS.Disbursing]
      },
      {
        id: 4,
        title: 'application_list.completed',
        count: `${totalOrderSummary?.completed || 0}`,
        status: [CREDIT_ORDER_STATUS.Completed]
      },
      {
        id: 5,
        title: 'application_list.cancel',
        count: `${totalOrderSummary?.canceled || 0}`,
        status: [CREDIT_ORDER_STATUS.Canceled, CREDIT_ORDER_STATUS.Rejected]
      }
    ],
    [totalOrderSummary]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState(StatusTab[0]?.status || []);

  const _check = value => {
    setStatus(value);
  };

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      onRefresh();
    });
    return () => {
      focusListener();
      dispatch(getCreditOrderListOrderClear());
    };
  }, [tabIndex, dispatch, navigation, onRefresh, status]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getDepositMoneyHandler());
    });
    return () => {
      focusListener();
    };
  }, [dispatch, navigation]);

  useEffect(() => {
    if (!loading && refreshing) {
      setRefreshing(false);
    }
  }, [loading, refreshing]);

  useEffect(() => {
    onRefresh();
  }, [tabIndex, onRefresh, status]);

  const onRefresh = useCallback(
    (refresh = true) => {
      setRefreshing(refresh);
      dispatch(
        getCreditOrderListHandle({
          skipCount: 0,
          memberTopenerId: memberId,
          status: status?.join(',') || '',
          isTopener: role === MEMBER_TYPE.Topener ? true : false
        })
      );
      onFetchTotalCount();
    },
    [dispatch, memberId, onFetchTotalCount, role, status]
  );

  const loadMore = useCallback(() => {
    if (!loading && !endList) {
      dispatch(
        getCreditOrderListHandle({
          memberTopenerId: memberId,
          skipCount: list.length,
          status: status?.join(',') || '',
          isTopener: role === MEMBER_TYPE.Topener ? true : false
        })
      );
    }
  }, [loading, endList, dispatch, memberId, list.length, status, role]);

  const onPressItem = useCallback(
    (item, event) => {
      handleTouchItem(event, 'CreditItem', props.route, item, topenId);
      if (item.isNew) {
        dispatch(
          setDealNewFlagHandle({
            params: {
              id: item?.id,
              isNew: false
            }
          })
        );
      }
      navigation.navigate(SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN, {
        orderId: item?.id,
        item
      });
    },
    [props.route, topenId, navigation, dispatch]
  );

  const renderItemRecords = ({ item }) => {
    return <RecordCard item={item} onPress={onPressItem} tabIndex={tabIndex} />;
  };

  const keyExtractor = element => '' + element?.id;

  const changeTab = index => {
    setTabIndex(index);
    setStatus(StatusTab[index]?.status || []);
  };
  return (
    <View style={styles.container}>
      <CommonTabHeader translate tabs={StatusTab} tabIndex={tabIndex} onPress={changeTab} />
      <FlatList
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItemRecords}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        data={list || []}
        ListHeaderComponent={
          [5].includes(tabIndex) ? (
            <ListHeaderComponent
              data={status}
              title2="application_list.refuse"
              setChecked={_check}
              tabIndex={tabIndex}
              title1="application_list.user_cancels"
              status={StatusTab[tabIndex]?.status || []}
            />
          ) : [1].includes(tabIndex) ? (
            <ListHeaderComponent
              data={status}
              title2="application_list.wait_for_pay"
              setChecked={_check}
              tabIndex={tabIndex}
              title1="application_list.additional_documents"
              status={StatusTab[tabIndex]?.status || []}
            />
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <ICEmpty />
            <AppText translate style={styles.emptyTitle}>
              application.no_application
            </AppText>
          </View>
        )}
      />
    </View>
  );
};

export default CreditTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.White,
    flex: 1
  },
  emptyListContainer: {
    paddingTop: scale(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTitle: {
    marginTop: scale(20),
    fontSize: FONT_SIZE.SubHead
  },
  wrapper: {
    paddingBottom: SPACING.HasBottomButton
  },
  listHeaderComponent: {
    marginTop: SPACING.XXNormal,
    paddingLeft: SPACING.XXNormal
  },
  checkbox: {
    marginRight: SPACING.XXNormal
  }
});
