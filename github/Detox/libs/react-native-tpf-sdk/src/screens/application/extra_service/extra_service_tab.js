import __ from 'lodash';
import { scale } from '../../../utils/responsive';
import RecordCard from '../components/record_card';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox, CommonTabHeader, SubHead } from '../../../components/';
import { useNavigation } from '@react-navigation/native';
import { FONT_SIZE } from '../../../constants/appFonts';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { EXTRA_SERVICE_ORDER_STATUS } from '../../../global/order_status';
import {
  getExtraServiceOrderListHandle,
  getExtraServiceOrderListClear,
  getExtraServiceOrderTotalRecordClear,
  getExtraServiceOrderTotalRecordHandle
} from '../../../redux/actions/extraService';
import AppText from '../../../components/app_text';
import { ICEmpty } from '../../../assets/icons';
import { setOrderNewFlagHandle } from '../../../redux/actions/order';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import SCREENS_NAME from '../../../constants/screens';
import themeContext from '../../../constants/theme/themeContext';

const ListHeaderComponent = ({ data, status, setChecked, tabIndex }) => {
  const checked01 =
    tabIndex === 0
      ? [...data].includes(EXTRA_SERVICE_ORDER_STATUS.New)
      : [...data].includes(status[0]);
  const checked02 =
    tabIndex === 0
      ? [...data].includes(EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment)
      : [...data].includes(status[1]);

  const checked03 =
    tabIndex === 0
      ? [...data].includes(EXTRA_SERVICE_ORDER_STATUS.WaitingForQuote)
      : [...data].includes(status[1]);

  const tabData01 = [
    EXTRA_SERVICE_ORDER_STATUS.New,
    EXTRA_SERVICE_ORDER_STATUS.PartnerInvestigating
  ];
  const tabData02 = [
    EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment,
    EXTRA_SERVICE_ORDER_STATUS.CompleteRemainingPayment
  ];
  const tabData03 = [EXTRA_SERVICE_ORDER_STATUS.WaitingForQuote];

  const onPress = (checked, value, tabData) => () => {
    if (checked && [...data].length === 1) {
      return;
    }

    const newdata = [...data];

    if (tabIndex === 0) {
      if ([...data].length > 2) {
        __.pull(newdata, tabData[0], tabData[1]);
      }
    } else {
      __.remove(newdata, o => o === value);
    }

    setChecked(checked ? newdata : tabIndex === 0 ? [...data, ...tabData] : [...data, value]);
  };

  return (
    <View style={styles.listHeaderComponent}>
      {tabIndex === 1 ? (
        <View style={styles.checkboxArea}>
          <CheckBox
            translate
            checked={checked01}
            style={styles.checkbox}
            onChange={onPress(checked01, status[0], tabData01)}
            label={'application_list.waiting_for_1_st_payment_checkbox'}
            labelNumberLine={2}
          />
          <CheckBox
            translate
            checked={checked02}
            style={styles.checkbox}
            onChange={onPress(checked02, status[1], tabData02)}
            label={'application_list.waiting_for_remaining_payment_checkbox'}
            labelNumberLine={2}
          />
        </View>
      ) : (
        <View style={styles.checkboxArea}>
          <CheckBox
            translate
            checked={checked01}
            style={styles.checkbox}
            onChange={onPress(checked01, status[0], tabData01)}
            label={'application_list.surveying'}
            labelNumberLine={2}
          />
          <CheckBox
            translate
            checked={checked03}
            style={styles.checkbox}
            onChange={onPress(checked03, status[4], tabData03)}
            label={'application_list.waiting_quote'}
            labelNumberLine={2}
          />
          <CheckBox
            translate
            checked={checked02}
            style={[styles.checkbox, styles.mtMedium]}
            onChange={onPress(checked02, status[1], tabData02)}
            label={'application_list.processing'}
            labelNumberLine={2}
          />
        </View>
      )}
    </View>
  );
};

const ExtraServiceTab = props => {
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
  const list = useSelector(state => state.extraService.orderList);
  const endList = useSelector(state => state.extraService.endOrderList);
  const loading = useSelector(state => state.extraService.orderListLoading);
  const totalOrderSummary = useSelector(state => state.extraService.totalOrderSummary);

  const onFetchTotalCount = useCallback(() => {
    dispatch(getExtraServiceOrderTotalRecordHandle({ memberId }));
  }, [dispatch, memberId]);

  useEffect(() => {
    onFetchTotalCount();

    return () => {
      dispatch(getExtraServiceOrderTotalRecordClear());
    };
  }, [dispatch, memberId, onFetchTotalCount, status]);

  const StatusTab = [
    {
      id: 0,
      title: 'application_list.processing',
      count: `${totalOrderSummary?.new || 0}`,
      status: [
        EXTRA_SERVICE_ORDER_STATUS.New,
        EXTRA_SERVICE_ORDER_STATUS.PartnerInvestigating,
        EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment,
        EXTRA_SERVICE_ORDER_STATUS.CompleteRemainingPayment,
        EXTRA_SERVICE_ORDER_STATUS.WaitingForQuote
      ]
    },
    {
      id: 1,
      title: 'application_list.wait_for_pay',
      count: `${totalOrderSummary?.waiting || 0}`,
      status: [
        EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment,
        EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment
      ]
    },
    {
      id: 3,
      title: 'application_list.completed',
      count: `${totalOrderSummary?.completed || 0}`,
      status: [EXTRA_SERVICE_ORDER_STATUS.Completed]
    },
    {
      id: 4,
      title: 'application_list.cancel',
      count: `${totalOrderSummary?.canceled || 0}`,
      status: [EXTRA_SERVICE_ORDER_STATUS.Canceled]
    }
  ];

  const [status, setStatus] = useState(StatusTab[0]?.status || []);
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const _check = value => {
    setStatus(value);
  };

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      onRefresh();
    });
    return () => {
      focusListener();
      dispatch(getExtraServiceOrderListClear());
    };
  }, [tabIndex, dispatch, navigation, onRefresh]);

  useEffect(() => {
    if (!loading && refreshing) {
      setRefreshing(false);
    }
  }, [loading, refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      getExtraServiceOrderListHandle({
        skipCount: 0,
        memberId,
        status: status?.join(',') || ''
      })
    );
    onFetchTotalCount();
  }, [dispatch, memberId, onFetchTotalCount, status]);

  useEffect(() => {
    onRefresh();
  }, [tabIndex, status, onRefresh]);

  const loadMore = useCallback(() => {
    if (!loading && !endList) {
      dispatch(
        getExtraServiceOrderListHandle({
          memberId,
          skipCount: list.length,
          status: status?.join(',') || ''
        })
      );
    }
  }, [loading, list.length, endList, dispatch, memberId, status]);

  const onPressItem = useCallback(
    (item, event) => {
      handleTouchItem(event, 'ExtraServiceItem', props.route, item, topenId);
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
      navigation.navigate('ExtraServiceOrderDetailScreen', { item });
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
        ListHeaderComponent={
          [0, 1].includes(tabIndex) ? (
            <ListHeaderComponent
              data={status}
              setChecked={_check}
              tabIndex={tabIndex}
              status={StatusTab[tabIndex]?.status || []}
            />
          ) : null
        }
        data={list || []}
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

export default ExtraServiceTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White
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
    paddingHorizontal: SPACING.XXNormal
  },
  checkbox: {
    marginRight: SPACING.Medium,
    alignItems: 'flex-start',
    maxWidth: '45%'
  },
  checkboxArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  mtMedium: {
    marginTop: SPACING.Medium
  }
});
