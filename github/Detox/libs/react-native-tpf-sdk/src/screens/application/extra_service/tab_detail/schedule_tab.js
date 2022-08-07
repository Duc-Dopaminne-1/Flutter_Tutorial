import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from '../../../../components/';
import ScheduleList from '../../../../components/schedule_list';
import { FONT_SIZE } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR } from '../../../../constants/colors';
import SCREENS_NAME from '../../../../constants/screens';
import { SPACING } from '../../../../constants/size';
import { LIMIT_PAGE } from '../../../../global/app';
import { ScheduleType } from '../../../../global/schedule_type';
import { handleTouchItem } from '../../../../helpers/handleTouchItem';
import {
  getListInFinanceScheduleClear,
  getListInFinanceScheduleHandle
} from '../../../../redux/actions/schedule';
import {
  scheduleListInFinanceLoadingSelector,
  scheduleListInFinancePageSelector,
  scheduleListInFinanceSelector
} from '../../../../redux/selectors/schedule';
import { scale } from '../../../../utils/responsive';

const ScheduleTab = ({ item, route }, ref) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const scheduleList = useSelector(scheduleListInFinanceSelector);
  const scheduleLoading = useSelector(scheduleListInFinanceLoadingSelector);
  const schedulePage = useSelector(scheduleListInFinancePageSelector);
  const { topenId } = useSelector(state => state.auth);

  const [isScheduleRefreshing, setScheduleRefreshing] = useState(false);
  const onFetchSchedule = useCallback(() => {
    dispatch(getListInFinanceScheduleClear());
    dispatch(
      getListInFinanceScheduleHandle({
        ReferenceType: ScheduleType.ADDED_SERVICE,
        referenceId: item?.id
      })
    );
  }, [dispatch, item]);

  const loadScheduleMore = useCallback(() => {
    if (scheduleLoading === null) {
      return;
    }
    const skipCount = schedulePage * LIMIT_PAGE;
    dispatch(
      getListInFinanceScheduleHandle({
        type: ScheduleType.ADDED_SERVICE,
        referenceId: item?.id,
        SkipCount: skipCount
      })
    );
  }, [dispatch, scheduleLoading, schedulePage, item]);

  const onRefreshSchedule = useCallback(() => {
    setScheduleRefreshing(true);
    onFetchSchedule();
  }, [onFetchSchedule]);

  useImperativeHandle(ref, () => {
    return {
      onRefreshSchedule
    };
  });

  useEffect(() => {
    onFetchSchedule();
  }, [onFetchSchedule]);

  useEffect(() => {
    if (schedulePage === 0 && isScheduleRefreshing) {
      setScheduleRefreshing(false);
    }
  }, [schedulePage, isScheduleRefreshing]);

  useEffect(() => {
    return () => dispatch(getListInFinanceScheduleClear());
  }, [dispatch]);

  const onPressSchedule = useCallback(
    (schedule, e) => {
      handleTouchItem(e, 'ScheduleItem', route, schedule, topenId);
      navigation.navigate(SCREENS_NAME.SCHEDULE_DETAIL, {
        item: schedule,
        callback: onFetchSchedule,
        scheduleType: ScheduleType.ADDED_SERVICE
      });
    },
    [topenId, navigation, onFetchSchedule, route]
  );

  return (
    <View style={styles.container}>
      <ScheduleList
        data={scheduleList}
        onPressItem={onPressSchedule}
        loading={scheduleLoading}
        loadMore={loadScheduleMore}
        onRefresh={onRefreshSchedule}
        isRefreshing={isScheduleRefreshing}
      />
    </View>
  );
};

export default React.memo(React.forwardRef(ScheduleTab));

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  emptyListContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTitle: {
    marginTop: scale(20),
    fontSize: FONT_SIZE.SubHead
  }
});
