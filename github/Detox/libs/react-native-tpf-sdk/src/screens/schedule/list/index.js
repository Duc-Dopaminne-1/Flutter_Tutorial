import { useNavigation } from '@react-navigation/native';
import FloatFooter from '../../../components/float_footer';
import PrimaryButton from '../../../components/primary_button';
import ScheduleList from '../../../components/schedule_list';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { ICFilter, ICWhiteCheck } from '../../../assets/icons';
import DropDownWithCheckBoxes from '../../../components/dropdown_with_checkboxes';
import { ScheduleState } from '../../../global/schedule_state';
import { useDispatch, useSelector } from 'react-redux';
import { getShowAlertError } from '../../../redux/actions/system';
import { DELETE_SCHEDULE_1, DELETE_SCHEDULE_2, CALL_API_ERROR } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import {
  deleteScheduleHandle,
  getListScheduleClear,
  getListScheduleHandle
} from '../../../redux/actions/schedule';
import { createSelector } from 'reselect';
import {
  scheduleListLoadingSelector,
  scheduleListPageSelector,
  scheduleListSelector
} from '../../../redux/selectors/schedule';
import { LIMIT_PAGE } from '../../../global/app';
import RNCalendarEvents from 'react-native-calendar-events';
import AppText from '../../../components/app_text';
import { MEMBER_TYPE } from '../../../global/member_type';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import themeContext from '../../../constants/theme/themeContext';

const listSelector = createSelector(scheduleListSelector, list => list);
const pageSelector = createSelector(scheduleListPageSelector, page => page);
const loadingSelector = createSelector(scheduleListLoadingSelector, loading => loading);

const Schedule = props => {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentStatus, setCurrentStatus] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState([]);
  const [boxVisible, setBoxVisible] = useState(false);
  const [deleteItems, setDeleteItems] = useState([]);

  const page = useSelector(pageSelector);
  const list = useSelector(listSelector);
  const loading = useSelector(loadingSelector);
  const [isRefreshing, setRefreshing] = React.useState(false);
  const role = useSelector(state => state?.auth?.role || '');
  const { topenId } = useSelector(state => state.auth);
  const onOpenFilter = useCallback(() => setFilterVisible(true), []);

  const onFetch = useCallback(
    payload => {
      dispatch(
        getListScheduleHandle({
          ...payload
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    onFetch();
    return () => {
      dispatch(getListScheduleClear());
    };
  }, [dispatch, onFetch]);

  useEffect(() => {
    if (page === 0 && isRefreshing) {
      setRefreshing(false);
    }
  }, [page, isRefreshing]);

  const loadMore = useCallback(() => {
    if (loading === null) {
      return;
    }
    const skipCount = page * LIMIT_PAGE;
    const status = currentStatus.join(',');
    dispatch(getListScheduleHandle({ SkipCount: skipCount, status }));
  }, [dispatch, loading, page, currentStatus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getListScheduleClear());
    const status = currentStatus.join(',');
    onFetch({ status });
  }, [dispatch, onFetch, currentStatus]);

  const onPressItem = useCallback(
    (item, event) => {
      handleTouchItem(event, 'ScheduleItem', props.route, item, topenId);
      navigation.navigate(SCREENS_NAME.SCHEDULE_DETAIL, {
        item,
        callback: onRefresh
      });
    },
    [navigation, onRefresh, props.route, topenId]
  );

  const selectAllBoxStyle = useMemo(() => {
    return [styles.checkBox, deleteItems?.length === list?.length && styles.checkedBox];
  }, [deleteItems, list]);

  const onPressSelectAll = useCallback(() => {
    let _data = [];
    if (deleteItems?.length !== list?.length) {
      _data = list.map(item => item?.id);
    }
    setDeleteItems(_data);
  }, [deleteItems, list]);

  const onCheckBox = useCallback((data, value) => {
    let newData = [];
    if (data.includes(value)) {
      const index = data.indexOf(value);
      newData = [...data];
      newData.splice(index, 1);
    } else {
      newData = data.concat([value]);
    }
    return newData;
  }, []);

  //Select item to delete
  const onSelectItem = useCallback(
    item => {
      const newData = onCheckBox(deleteItems, item?.id);
      setDeleteItems(newData);
    },
    [deleteItems, onCheckBox]
  );

  const headerTitleButton = useMemo(() => {
    let _title = 'common.delete';
    if (boxVisible) {
      _title = 'common.cancel';
    } else {
      _title = 'common.delete';
    }
    return _title;
  }, [boxVisible]);

  const onPressDeleteButton = useCallback(() => {
    if (boxVisible) {
      setDeleteItems([]);
      setBoxVisible(false);
    } else {
      setBoxVisible(true);
    }
  }, [boxVisible]);

  const onCloseModal = useCallback(() => {
    setCurrentStatus(filters);
    setFilterVisible(false);
  }, [filters]);

  const chooseItem = useCallback(
    value => {
      const newData = onCheckBox(currentStatus, value);
      setCurrentStatus(newData);
    },
    [currentStatus, onCheckBox]
  );

  const onConfirmSelect = useCallback(() => {
    setFilterVisible(false);
    setFilters(currentStatus);
    const status = currentStatus.join(',');
    dispatch(getListScheduleClear());
    onFetch({ status });
  }, [currentStatus, onFetch, dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      RightComponent: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerRightBtn} onPress={onPressDeleteButton}>
            <AppText
              translate
              semiBold
              style={[styles.headerRightText, { color: theme?.app?.primaryColor1 }]}>
              {headerTitleButton}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenFilter}>
            <ICFilter />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, onOpenFilter, onPressDeleteButton, headerTitleButton]);

  const _onCreate = () => {
    navigation.navigate(SCREENS_NAME.CREATE_SCHEDULE_SCREEN, {
      callback: onRefresh,
      from: SCREENS_NAME.SCHEDULE_LIST_SCREEN
    });
  };

  const dispatchDeleteSchedule = useCallback(
    permission => {
      dispatch(
        deleteScheduleHandle({
          permission,
          params: {
            ids: deleteItems
          },
          from: SCREENS_NAME.SCHEDULE_LIST_SCREEN,
          callback: (err, res) => {
            if (!err) {
              dispatch(getShowAlertError(DELETE_SCHEDULE_2));
            } else {
              dispatch(getShowAlertError(CALL_API_ERROR));
            }
          }
        })
      );
      setDeleteItems([]);
      setBoxVisible(false);
    },
    [deleteItems, dispatch]
  );

  const deleteSchedule = useCallback(() => {
    RNCalendarEvents.checkPermissions()
      .then(status => {
        if (status !== 'authorized') {
          RNCalendarEvents.requestPermissions().then(res => {
            dispatchDeleteSchedule(res);
          });
        } else {
          dispatchDeleteSchedule(status);
        }
      })
      .catch(err => {});
  }, [dispatchDeleteSchedule]);

  const _onDelete = useCallback(() => {
    dispatch(getShowAlertError({ ...DELETE_SCHEDULE_1, confirmAction: deleteSchedule }));
  }, [dispatch, deleteSchedule]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        {filters.length !== 0 ? (
          <AppText translate semiBold style={styles.title}>
            common.search_results
          </AppText>
        ) : (
          <View />
        )}
        {boxVisible && (
          <View style={styles.selectAllView}>
            <AppText translate style={styles.selectAllText}>
              {'common.select_all'}
            </AppText>
            <TouchableOpacity style={selectAllBoxStyle} onPress={onPressSelectAll}>
              <ICWhiteCheck style={styles.checkIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScheduleList
        data={list}
        checkBoxVisible={boxVisible}
        deleteItems={deleteItems}
        onSelectItem={onSelectItem}
        onPressItem={boxVisible ? onSelectItem : onPressItem}
        loading={loading}
        loadMore={loadMore}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
      <FloatFooter style={styles.bottomBtn}>
        {boxVisible ? (
          <PrimaryButton
            translate
            disabled={deleteItems.length === 0}
            onPress={_onDelete}
            title={'common.delete_now'}
          />
        ) : (
          MEMBER_TYPE.Topener === role && (
            <PrimaryButton translate onPress={_onCreate} title={'create_schedule.btn_create'} />
          )
        )}
      </FloatFooter>
      <DropDownWithCheckBoxes
        translateTitle
        translateItem
        modalIsOpen={filterVisible}
        closeModal={onCloseModal}
        title={'common.identification_information'}
        list={ScheduleState}
        chooseItem={chooseItem}
        currentValue={currentStatus}
        onConfirm={onConfirmSelect}
      />
    </View>
  );
};

export default React.memo(Schedule);
