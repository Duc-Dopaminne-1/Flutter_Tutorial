import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ICCalendar, ICGreenClock } from '../../../assets/icons';
import { CustomInput } from '../../../components/';
import AppText from '../../../components/app_text';
import DateTimePickerInput from '../../../components/date_time_picker_input';
import Divider from '../../../components/divider';
import FloatFooter from '../../../components/float_footer';
import PrimaryButton from '../../../components/primary_button';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { SCHEDULE_ERROR_INPUT, TIME_INPUT_ERROR } from '../../../constants/errors';
import { UPDATE_SCHEDULE_SUCCESSFULLY } from '../../../constants/success';
import themeContext from '../../../constants/theme/themeContext';
import { ATTRIBUTE_TYPE } from '../../../global/entity_type';
import { REMIND_BEFORE } from '../../../global/remind_before';
import { ScheduleStatus } from '../../../global/schedule_state';
import { getLeadListHandle } from '../../../redux/actions/lead';
import { createOrEditScheduleHandle } from '../../../redux/actions/schedule';
import { getShowAlertError } from '../../../redux/actions/system';
import { leadLoadingSelector } from '../../../redux/selectors/lead';
import { styles } from './styles';
import { AppLoading } from '../../../components';

const DropdownItem = React.memo(({ item, onPressItem, currentValue }) => {
  const _onPress = useCallback(() => {
    return typeof onPressItem === 'function' && onPressItem(item);
  }, [item, onPressItem]);
  const _selectBoxStyle = useMemo(() => {
    return [
      styles.selectBox,
      currentValue?.id === item?.id && {
        borderColor: CUSTOM_COLOR.PersianGreen
      }
    ];
  }, [currentValue, item]);
  return (
    <View style={styles.dropdownItem}>
      <TouchableOpacity style={styles.rowItem} onPress={_onPress}>
        <View style={_selectBoxStyle}>
          {currentValue?.id === item?.id && <View style={styles.iconTick} />}
        </View>
        <AppText translate style={styles.dropdownItemTxt}>
          {item?.displayValue || ''}
          {item?.name || ''}
        </AppText>
      </TouchableOpacity>
      <Divider />
    </View>
  );
});

const UpdateSchedule = ({ route, navigation }) => {
  const { scheduleDetail, callback } = route.params || {};
  const {
    description,
    fromDate,
    fromTime,
    toTime,
    referenceId,
    location,
    notes,
    remindBefore,
    referenceName,
    id,
    referenceType,
    status
  } = scheduleDetail || {};
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.memberId);

  const { fonts } = useContext(themeContext) || {};

  useEffect(() => {
    dispatch(getLeadListHandle({ memberId, skipCount: 0, limit: null }));
  }, [dispatch, memberId]);
  const _remindBefore = REMIND_BEFORE.find(item => item.value === remindBefore);
  const listLeadLoading = useSelector(leadLoadingSelector);
  const [isLoading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    description,
    date: fromDate,
    fromTime: fromTime,
    toTime: toTime,
    location,
    remindBefore: _remindBefore,
    notes,
    referenceType,
    status
  });

  const [dateTimePickerVisible, setDateTimePickerVisible] = useState({
    date: false,
    fromTime: false,
    toTime: false
  });

  const onPressDateTimePicker = useCallback(
    name => {
      setDateTimePickerVisible({ ...dateTimePickerVisible, [name]: true });
    },
    [dateTimePickerVisible]
  );

  const onCancelDateTimePicker = useCallback(
    name => {
      setDateTimePickerVisible({ ...dateTimePickerVisible, [name]: false });
    },
    [dateTimePickerVisible]
  );

  const onDispatchSchedule = useCallback(
    permission => {
      setLoading(true);
      dispatch(
        createOrEditScheduleHandle({
          permission,
          params: {
            id,
            memberId: memberId,
            referenceId: referenceId,
            referenceName: referenceName,
            description: formState.description,
            fromDateTime: moment(`${formState.date} ${formState.fromTime}`, 'DD/MM/YYYY HH:mm'),
            toDateTime: moment(`${formState.date} ${formState.toTime}`, 'DD/MM/YYYY HH:mm'),
            location: formState.location,
            notes: formState.notes,
            remindBefore: formState.remindBefore?.value,
            referenceType: referenceType || 'Lead',
            status: formState.status
          },
          callback: status => {
            setLoading(false);
            if (status) {
              navigation.goBack();
              callback();
              dispatch(getShowAlertError(UPDATE_SCHEDULE_SUCCESSFULLY));
            } else {
              dispatch(getShowAlertError(SCHEDULE_ERROR_INPUT));
            }
          }
        })
      );
    },
    [dispatch, formState, id, callback, navigation, memberId, referenceId, referenceName]
  );
  const onUpdate = useCallback(() => {
    const fromTime = moment(`${formState.date} ${formState.fromTime}`, 'DD/MM/YYYY HH:mm');

    const toTime = moment(`${formState.date} ${formState.toTime}`, 'DD/MM/YYYY HH:mm');

    if (toTime.diff(fromTime, 'seconds') <= 0) {
      return dispatch(getShowAlertError(TIME_INPUT_ERROR));
    }
    RNCalendarEvents.checkPermissions()
      .then(status => {
        if (status !== 'authorized') {
          RNCalendarEvents.requestPermissions().then(res => {
            onDispatchSchedule(res);
          });
        } else {
          onDispatchSchedule(status);
        }
      })
      .catch(err => {});
  }, [onDispatchSchedule, formState, dispatch]);

  const onPressAlarmItem = useCallback(
    value => {
      setFormState({ ...formState, remindBefore: value });
    },
    [formState]
  );

  const renderDropdownItem = useCallback((item, currentValue, onPressItem) => {
    return <DropdownItem item={item} onPressItem={onPressItem} currentValue={currentValue} />;
  }, []);

  const onChangeValue = useCallback(
    field => value => {
      if (['date', 'fromTime', 'toTime'].includes(field)) {
        setDateTimePickerVisible({ ...dateTimePickerVisible, [field]: false });
      }
      let valueParse;
      switch (field) {
        case 'date':
          valueParse = moment(value).format('DD/MM/YYYY');
          break;
        case 'fromTime':
          valueParse = moment(value).format('HH:mm');
          break;
        case 'toTime':
          valueParse = moment(value).format('HH:mm');
          break;
        default:
          valueParse = value;
          break;
      }
      setFormState({ ...formState, [field]: valueParse });
    },
    [formState, dateTimePickerVisible]
  );

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <AppLoading loading={isLoading || listLeadLoading} />

      <KeyboardAwareScrollView
        style={styles.body}
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wrapper}>
        <View style={styles.box}>
          <AppText translate bold={true} style={styles.title}>
            {'create_schedule.info'}
          </AppText>
          <>
            <AppText translate style={styles.titleName}>
              {'create_schedule_detail.customer'}
            </AppText>
            <Text style={[styles.contactName, { fontFamily: fonts?.MEDIUM }]}>{referenceName}</Text>
          </>
          <CustomInput
            translateTitle
            translatePlaceholder
            title={'create_schedule.content'}
            style={styles.textValue}
            placeholder={'create_schedule.content_placeholder'}
            onChangeText={onChangeValue('description')}
            value={formState.description}
          />

          <DateTimePickerInput
            translateTitle
            translatePlaceholder
            type={'date'}
            title={'create_schedule.day'}
            style={styles.textValue}
            placeholder={'create_schedule.day_placeholder'}
            iconComponent={<ICCalendar />}
            onChangeText={onChangeValue('date')}
            name="date"
            value={formState.date}
            onOpen={onPressDateTimePicker}
            onCancel={onCancelDateTimePicker}
            pickerVisible={dateTimePickerVisible.date}
          />

          <View style={styles.row}>
            <View style={{ width: '46 %' }}>
              <DateTimePickerInput
                translateTitle
                translatePlaceholder
                iconComponent={<ICGreenClock />}
                title={'create_schedule.from'}
                type={'time'}
                style={styles.textValue}
                placeholder={'create_schedule.from_placeholder'}
                onChangeText={onChangeValue('fromTime')}
                value={formState.fromTime}
                name="fromTime"
                onOpen={onPressDateTimePicker}
                onCancel={onCancelDateTimePicker}
                pickerVisible={dateTimePickerVisible.fromTime}
              />
            </View>
            <View style={{ width: '46%' }}>
              <DateTimePickerInput
                translateTitle
                translatePlaceholder
                iconComponent={<ICGreenClock />}
                title={'create_schedule.to'}
                type={'time'}
                style={styles.textValue}
                placeholder={'create_schedule.to_placeholder'}
                onChangeText={onChangeValue('toTime')}
                value={formState.toTime}
                name="toTime"
                onOpen={onPressDateTimePicker}
                onCancel={onCancelDateTimePicker}
                pickerVisible={dateTimePickerVisible.toTime}
              />
            </View>
          </View>
          <CustomInput
            translateTitle
            translatePlaceholder
            title={'create_schedule.address'}
            style={styles.textValue}
            placeholder={'create_schedule.address_placeholder'}
            onChangeText={onChangeValue('location')}
            value={formState.location}
          />
          <CustomInput
            translateTitle
            translatePlaceholder
            translateItem
            type="select"
            title={'create_schedule.alarm'}
            editable={false}
            style={styles.textValue}
            renderDropdownItem={({ item }) =>
              renderDropdownItem(item, formState.remindBefore, onPressAlarmItem)
            }
            selectOptions={REMIND_BEFORE}
            labelInput={
              <AppText translate style={styles.dropdownItemTxt}>
                {formState.remindBefore?.value !== 0 && 'common.before'}
                {formState.remindBefore?.displayValue || ''}
                {formState.remindBefore?.name || ''}
              </AppText>
            }
            hasRightButton
          />
          <CustomInput
            translateTitle
            translatePlaceholder
            title={'create_schedule.note'}
            placeholder={'create_schedule.note_placeholder'}
            editable={false}
            style={[styles.textValue]}
            onChangeText={onChangeValue('notes')}
            maxLength={256}
            type={ATTRIBUTE_TYPE.textarea}
            value={formState.notes}
            multiline
            hasExtend
          />
        </View>
      </KeyboardAwareScrollView>
      <FloatFooter style={styles.bottomBtn}>
        <PrimaryButton translate onPress={onUpdate} title={'common.update'} />
      </FloatFooter>
    </View>
  );
};

export default React.memo(UpdateSchedule);
