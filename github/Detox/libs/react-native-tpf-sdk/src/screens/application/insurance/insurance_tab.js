import { useNavigation } from '@react-navigation/native';
import {
  getOrderListHandle,
  getOrderListClear,
  getOrderTotalRecordClear,
  getOrderTotalRecordHandle
} from '../../../redux/actions/order';
import { CheckBox, SubHead } from '../../../components/';
import { CommonTabHeader } from '../../../components/';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { INSURANCE_ORDER_STATUS } from '../../../global/order_status';
import { scale } from '../../../utils/responsive';
import RecordCard from '../components/record_card';
import __ from 'lodash';
import { useMemo } from 'react';
import AppText from '../../../components/app_text';
import { ICEmpty } from '../../../assets/icons';
import { setOrderNewFlagHandle } from '../../../redux/actions/order';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import SCREENS_NAME from '../../../constants/screens';
import { getInsuranceRefundConfigHandler } from '../../../redux/actions/insurance';
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

const InsuranceTab = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
                application.create
              </SubHead>
            </TouchableOpacity>
          </>
        );
      }
    });
  }, []);
  const { memberId, topenId } = useSelector(state => state.auth);
  const list = useSelector(state => state.order.insuranceOrderList);
  const endList = useSelector(state => state.order.endInsuranceOrderList);
  const loading = useSelector(state => state.order.insuranceOrderLoading);
  const totalOrderSummary = useSelector(state => state.order.totalOrderSummary);

  const onFetchTotalCount = useCallback(() => {
    dispatch(getOrderTotalRecordHandle({ memberId }));
  }, [dispatch, memberId]);

  useEffect(() => {
    onFetchTotalCount();

    return () => {
      dispatch(getOrderTotalRecordClear());
    };
  }, [dispatch, memberId, onFetchTotalCount]);

  const StatusTab = useMemo(
    () => [
      {
        id: 0,
        title: 'application_list.draft',
        count: `${totalOrderSummary?.draft || 0}`,
        status: [INSURANCE_ORDER_STATUS.Draft]
      },
      {
        id: 1,
        title: 'application_list.need_to_handle',
        count: `${totalOrderSummary?.waiting || 0}`,
        status: [INSURANCE_ORDER_STATUS.WaitingForUpdate, INSURANCE_ORDER_STATUS.WaitingForPayment]
      },
      {
        id: 2,
        title: 'application_list.processing',
        count: `${totalOrderSummary?.processing || 0}`,
        status: [
          INSURANCE_ORDER_STATUS.PartnerProcessing,
          INSURANCE_ORDER_STATUS.WaitingForPartnerAcceptance
        ]
      },
      {
        id: 3,
        title: 'application_list.consider',
        count: `${totalOrderSummary?.waitingForConsider || 0}`,
        status: [INSURANCE_ORDER_STATUS.WaitingForConsider]
      },
      {
        id: 4,
        title: 'application_list.completed',
        count: `${totalOrderSummary?.completed || 0}`,
        status: [INSURANCE_ORDER_STATUS.Completed]
      },
      {
        id: 5,
        title: 'application_list.waiting_for_approve_cancel',
        count: `${totalOrderSummary?.waitingForApproveCancelOrder || 0}`,
        status: [INSURANCE_ORDER_STATUS.WaitingForApproveCancelOrder]
      },
      {
        id: 6,
        title: 'application_list.waiting_for_approve_stop',
        count: `${totalOrderSummary?.waitingForApproveStopOrder || 0}`,
        status: [INSURANCE_ORDER_STATUS.WaitingForApproveStopOrder]
      },
      {
        id: 7,
        title: 'application_list.liquidation',
        count: `${totalOrderSummary?.liquidationAgreement || 0}`,
        status: [INSURANCE_ORDER_STATUS.LiquidationAgreement]
      },
      {
        id: 8,
        title: 'application_list.cancel',
        count: `${totalOrderSummary?.canceled || 0}`,
        status: [INSURANCE_ORDER_STATUS.Canceled]
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
      dispatch(getOrderListClear());
    };
  }, [tabIndex, dispatch, navigation, onRefresh]);

  useEffect(() => {
    dispatch(getInsuranceRefundConfigHandler());
  }, [dispatch]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getInsuranceRefundConfigHandler());
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      getOrderListHandle({
        skipCount: 0,
        memberId,
        status: status?.join(',') || ''
      })
    );
    onFetchTotalCount();
  }, [dispatch, memberId, onFetchTotalCount, status]);

  const loadMore = useCallback(() => {
    if (!loading && !endList) {
      dispatch(
        getOrderListHandle({
          memberId,
          skipCount: list.length,
          status: status?.join(',') || ''
        })
      );
    }
  }, [loading, list.length, endList, dispatch, memberId, status]);

  const onPressItem = useCallback(
    (item, event) => {
      handleTouchItem(event, 'InsuranceItem', props.route, item, topenId);
      if (item?.isNew) {
        dispatch(
          setOrderNewFlagHandle({
            params: {
              id: item?.id,
              isNew: false
            }
          })
        );
      }
      navigation.navigate(SCREENS_NAME.INSURANCE_ORDER_DETAIL_SCREEN, { item });
    },
    [props.route, topenId, navigation, dispatch]
  );

  const renderItemRecords = ({ item }) => {
    return <RecordCard item={item} onPress={onPressItem} />;
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
        renderItem={renderItemRecords}
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        data={list || []}
        ListHeaderComponent={
          [1].includes(tabIndex) ? (
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
              {'application.no_application'}
            </AppText>
          </View>
        )}
      />
    </View>
  );
};

export default InsuranceTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Whisper,
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
