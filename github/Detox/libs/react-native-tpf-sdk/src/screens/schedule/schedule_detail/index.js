import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton, SecondaryButton, OutLineButton } from '../../../components/';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import { CALL_API_ERROR, DELETE_SCHEDULE_1, DELETE_SCHEDULE_2 } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import { CANCEL_SCHEDULE_SUCCESSFULLY } from '../../../constants/success';
import themeContext from '../../../constants/theme/themeContext';
import { CANCEL_SCHEDULE_1 } from '../../../constants/warnings';
import { ScheduleState, ScheduleStatus } from '../../../global/schedule_state';
import { ScheduleType } from '../../../global/schedule_type';
import { formatNumber } from '../../../helpers/formatNumber';
import { getPartnerDetailHandle } from '../../../redux/actions/partner';
import {
  deleteScheduleHandle,
  exportFileHandle,
  getScheduleDetailClear,
  getScheduleDetailHandle,
  updateScheduleStatusHandle
} from '../../../redux/actions/schedule';
import { getShowAlertError } from '../../../redux/actions/system';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import { scheduleDetailSelector } from '../../../redux/selectors/schedule';
import styles from './styles';
const Item = React.memo(({ label, value, isFirst, translate = false, translateValue = false }) => {
  const _itemStyle = useMemo(() => {
    return [styles.item, isFirst && styles.itemFirst];
  }, [isFirst]);
  return (
    <View style={_itemStyle}>
      <AppText translate={translate} style={styles.normalText}>
        {label}
      </AppText>
      <AppText translateValue={translateValue} medium style={styles.value}>
        {value}
      </AppText>
    </View>
  );
});

const ScheduleDetail = ({ navigation, route }) => {
  const { item, callback, from } = route.params || {};
  const dispatch = useDispatch();
  const scheduleDetail = useSelector(scheduleDetailSelector);
  const orderDetail = useSelector(state => state.extraService.orderDetail);
  const { name, serviceFee, price } = orderDetail?.ordersItem || {};
  const partner = useSelector(state => partnerItemSelector(state, orderDetail?.partnerId));
  const {
    id,
    description,
    fromDate,
    toDate,
    fromTime,
    toTime,
    status,
    referenceName,
    location,
    feedback,
    remindBefore,
    notes,
    referenceType
  } = scheduleDetail || {};

  const { fonts, app } = useContext(themeContext) || {};

  const time = useMemo(() => {
    let _time = '';
    if (fromDate === toDate) {
      _time = fromTime + ' - ' + toTime + ' | ' + toDate;
    } else {
      _time = fromTime + ' | ' + fromDate + ' - ' + toTime + ' | ' + toDate;
    }
    return _time;
  }, [fromDate, toDate, fromTime, toTime]);

  let stateSchedule = ScheduleState.find(t => t.status === status);

  const _remindBefore = useMemo(() => {
    if (remindBefore === 0) {
      return <AppText translate>{'schedule.noRemind'}</AppText>;
    }
    if (remindBefore === 60) {
      return (
        <AppText translate>
          {'common.before'}1{'time.hours'}
        </AppText>
      );
    }
    if (remindBefore === 3600) {
      <AppText translate>
        {'common.before'}1{'time.days'}
      </AppText>;
    }
    return (
      <AppText translate>
        {'common.before'}
        {remindBefore + ''}
        {'time.minutes'}
      </AppText>
    );
  }, [remindBefore]);

  const onPressUpdateSchedule = useCallback(() => {
    navigation.navigate(SCREENS_NAME.UPDATE_SCHEDULE, {
      scheduleDetail,
      callback: onFetch,
      from
    });
  }, [navigation, scheduleDetail, onFetch, from]);

  const dispatchDeleteSchedule = useCallback(
    permission => {
      dispatch(
        getShowAlertError({
          ...DELETE_SCHEDULE_1,
          confirmAction: () => {
            return dispatch(
              deleteScheduleHandle({
                permission,
                params: {
                  ids: [id]
                },
                from,
                callback: (err, res) => {
                  if (!err) {
                    dispatch(getShowAlertError(DELETE_SCHEDULE_2));
                    navigation.goBack();
                    callback();
                  } else {
                    dispatch(getShowAlertError(CALL_API_ERROR));
                  }
                }
              })
            );
          }
        })
      );
    },
    [dispatch, id, navigation, callback, from]
  );

  const onDeleteSchedule = useCallback(() => {
    RNCalendarEvents.checkPermissions()
      .then(_status => {
        if (_status !== 'authorized') {
          RNCalendarEvents.requestPermissions().then(res => {
            dispatchDeleteSchedule(res);
          });
        } else {
          dispatchDeleteSchedule(_status);
        }
      })
      .catch(err => {});
  }, [dispatchDeleteSchedule]);

  useLayoutEffect(() => {
    navigation.setOptions({
      RightComponent: () => (
        <TouchableOpacity
          style={styles.headerRight}
          onPress={
            status === ScheduleStatus.UPCOMING || status === ScheduleStatus.WAITINGFORPARTNERACCEPT
              ? onPressUpdateSchedule
              : onDeleteSchedule
          }>
          <AppText
            translate
            semiBold
            style={[styles.headerRightText, { color: app?.primaryColor1 }]}>
            {status === ScheduleStatus.UPCOMING || status === ScheduleStatus.WAITINGFORPARTNERACCEPT
              ? 'common.update'
              : 'schedule.delete'}
          </AppText>
        </TouchableOpacity>
      )
    });
  }, [navigation, onPressUpdateSchedule, status, onDeleteSchedule]);

  const onFetch = useCallback(() => {
    dispatch(
      getScheduleDetailHandle({
        params: item?.id
      })
    );
  }, [dispatch, item]);

  useEffect(() => {
    dispatch(getPartnerDetailHandle({ Id: orderDetail?.partnerId }));
  }, []);

  useEffect(() => {
    onFetch();
    return () => dispatch(getScheduleDetailClear());
  }, [onFetch, dispatch]);

  const dispatchUpdateStatus = useCallback(
    permission => {
      dispatch(
        getShowAlertError({
          ...CANCEL_SCHEDULE_1,
          confirmAction: () => {
            dispatch(
              updateScheduleStatusHandle({
                permission,
                params: {
                  id,
                  status: ScheduleStatus.CANCELED
                },
                callback: (err, res) => {
                  if (!err) {
                    onFetch();
                    callback();
                    dispatch(getShowAlertError(CANCEL_SCHEDULE_SUCCESSFULLY));
                  } else {
                    dispatch(getShowAlertError(CALL_API_ERROR));
                  }
                }
              })
            );
          }
        })
      );
    },
    [dispatch, id, callback, onFetch]
  );

  const onPressCancel = useCallback(() => {
    RNCalendarEvents.checkPermissions()
      .then(_status => {
        if (_status !== 'authorized') {
          RNCalendarEvents.requestPermissions().then(res => {
            dispatchUpdateStatus(res);
          });
        } else {
          dispatchUpdateStatus(_status);
        }
      })
      .catch(err => {});
  }, [dispatchUpdateStatus]);
  const onPressConfirm = useCallback(() => {
    navigation.navigate(SCREENS_NAME.REVIEW_SCHEDULE, {
      scheduleId: id,
      callback: onFetch
    });
  }, [navigation, id, onFetch]);

  const onExportFile = useCallback(() => {
    dispatch(exportFileHandle({ orderId: orderDetail?.orderId, ScheduleId: id }));
  }, [dispatch, orderDetail, id]);

  return (
    <View style={styles.container}>
      {!scheduleDetail ? (
        <ActivityIndicator />
      ) : (
        <>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            <View style={styles.group}>
              <View style={[styles.rowValue, { alignItems: 'flex-start' }]}>
                <Text style={[styles.scheduleDesc, { fontFamily: fonts?.SEMIBOLD }]}>
                  {description}
                </Text>
                <View style={[styles.state, { backgroundColor: stateSchedule.backgroundColor }]}>
                  <AppText translate semiBold style={styles.stateTxt}>
                    {stateSchedule.title}
                  </AppText>
                </View>
              </View>
              <Divider width={'100%'} style={styles.divider} />
              <View style={styles.rowValue}>
                <AppText translate style={styles.normalText}>
                  {'common.customer'}
                </AppText>
                <Text style={[styles.customerName, { fontFamily: fonts?.SEMIBOLD }]}>
                  {referenceName}
                </Text>
              </View>
              {referenceType === ScheduleType.ADDED_SERVICE && (
                <>
                  <View style={styles.rowValue}>
                    <AppText translate style={styles.normalText}>
                      {'schedule.phone_number'}
                    </AppText>
                    <Text style={[styles.customerName, { fontFamily: fonts?.SEMIBOLD }]}>
                      {orderDetail?.phone}
                    </Text>
                  </View>
                  <View style={styles.rowValue}>
                    <AppText translate style={styles.normalText}>
                      {'schedule.supplier'}
                    </AppText>
                    <Text style={[styles.customerName, { fontFamily: fonts?.SEMIBOLD }]}>
                      {partner?.name}
                    </Text>
                  </View>
                  <View style={styles.rowValue}>
                    <AppText translate style={styles.normalText}>
                      {'schedule.supplier_phone'}
                    </AppText>
                    <Text style={[styles.customerName, { fontFamily: fonts?.SEMIBOLD }]}>
                      {partner?.phoneNumber}
                    </Text>
                  </View>
                  <View style={styles.rowValue}>
                    <AppText translate style={styles.normalText}>
                      {'create_schedule.service_product_name'}
                    </AppText>
                    <Text style={[styles.customerName, { fontFamily: fonts?.SEMIBOLD }]}>
                      {name}
                    </Text>
                  </View>
                  <View style={styles.rowValue}>
                    <AppText translate style={styles.normalText}>
                      {'create_schedule.quotes'}
                    </AppText>
                    <Text style={[styles.customerName, { fontFamily: fonts?.SEMIBOLD }]}>
                      {`${formatNumber(serviceFee || price)} VND`}
                    </Text>
                  </View>
                  <View style={styles.rowValue}>
                    <AppText translate style={styles.normalText}>
                      {'schedule.profile_code'}
                    </AppText>
                    <Text style={[styles.customerName, { fontFamily: fonts?.SEMIBOLD }]}>
                      {orderDetail?.code}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View style={styles.break} />
            {referenceType === ScheduleType.ADDED_SERVICE && (
              <View style={[styles.group, styles.ItemStyle]}>
                <OutLineButton
                  translate
                  title={'schedule.export_file'}
                  onPress={onExportFile}
                  style={styles.outLine}
                />
              </View>
            )}
            <View style={styles.break} />
            <View style={[styles.group, { paddingHorizontal: SPACING.Medium }]}>
              <Item translate label={'common.time'} value={time} />
              <Item translate label={'create_schedule.address'} value={location} />
              <Item
                translate
                translateValue
                value={_remindBefore}
                label={'create_schedule.alarm'}
              />
              <Item translate label={'common.note'} value={notes} />
              {status === ScheduleStatus.COMPLETED && (
                <Item translate label={'common.feedback'} value={feedback} />
              )}
            </View>
          </ScrollView>
          {status === ScheduleStatus.UPCOMING && (
            <View style={styles.btnView}>
              <SecondaryButton
                translate
                title={'schedule.cancel'}
                style={styles.cancelBtn}
                onPress={onPressCancel}
              />
              <PrimaryButton
                translate
                title={'schedule.done'}
                onPress={onPressConfirm}
                style={styles.confirmBtn}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default React.memo(ScheduleDetail);
