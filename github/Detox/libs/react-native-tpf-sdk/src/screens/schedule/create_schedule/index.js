import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ICCalendar, ICGreenClock, ICWireFrameContact } from '../../../assets/icons';
import { CustomInput, WithLoading } from '../../../components/';
import AppText from '../../../components/app_text';
import DateTimePickerInput from '../../../components/date_time_picker_input';
import Divider from '../../../components/divider';
import FloatFooter from '../../../components/float_footer';
import PrimaryButton from '../../../components/primary_button';
import { CREATE_SCHEDULE, SCHEDULE_ERROR_INPUT, TIME_INPUT_ERROR } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import themeContext from '../../../constants/theme/themeContext';
import { ATTRIBUTE_TYPE } from '../../../global/entity_type';
import { REMIND_BEFORE } from '../../../global/remind_before';
import { ScheduleType } from '../../../global/schedule_type';
import { getLeadListHandle } from '../../../redux/actions/lead';
import { createOrEditScheduleHandle } from '../../../redux/actions/schedule';
import { getShowAlertError } from '../../../redux/actions/system';
import { LEAD } from '../../../redux/actionsType';
import { styles } from './styles';
import { AppLoading } from '../../../components';

const DropdownItem = React.memo(({ item, onPressItem, currentValue, theme }) => {
  const _onPress = useCallback(() => {
    return typeof onPressItem === 'function' && onPressItem(item);
  }, [item, onPressItem]);
  const _selectBoxStyle = useMemo(() => {
    return [
      styles.selectBox,
      currentValue?.id === item?.id && { borderColor: theme?.app?.primaryColor1 }
    ];
  }, [currentValue, item]);
  return (
    <View style={styles.dropdownItem}>
      <TouchableOpacity style={styles.rowItem} onPress={_onPress}>
        <View style={_selectBoxStyle}>
          {currentValue?.id === item?.id && (
            <View style={[styles.iconTick, { backgroundColor: theme?.app?.primaryColor1 }]} />
          )}
        </View>
        <AppText translate style={styles.dropdownItemTxt}>
          {item?.displayValue || ''}
          {item?.name}
        </AppText>
      </TouchableOpacity>
      <Divider />
    </View>
  );
});

const CreateSchedule = ({ navigation, route }) => {
  const theme = useContext(themeContext);
  const { callback: navigationCallback, from, reference, scheduleType } = route.params || {};
  const dispatch = useDispatch();
  const listLead = useSelector(state => state.lead.list);
  const memberId = useSelector(state => state.auth.memberId);
  useEffect(() => {
    if (from === SCREENS_NAME.SCHEDULE_LIST_SCREEN) {
      dispatch(getLeadListHandle({ memberId, skipCount: 0, limit: null }));
    }
  }, [dispatch, memberId, from]);

  const [formState, setFormState] = useState({
    reference: reference ? reference : [],
    description: '',
    date: moment(new Date()).format('DD/MM/YYYY'),
    fromTime: moment(new Date()).add(5, 'minutes').format('HH: mm'),
    toTime: moment(new Date()).add(5, 'minutes').format('HH: mm'),
    location: '',
    remindBefore: REMIND_BEFORE[1],
    notes: ''
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!reference) {
      setFormState(prev => ({ ...prev, reference: listLead[0] }));
    }
  }, [listLead, reference]);

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

  const dispatchCreateScheduleAction = useCallback(
    permission => {
      setLoading(true);

      dispatch(
        createOrEditScheduleHandle({
          from,
          permission,
          params: {
            memberId: memberId,
            referenceId: formState.reference?.id,
            referenceName:
              scheduleType === ScheduleType.DEAL || scheduleType === ScheduleType.ADDED_SERVICE
                ? formState.reference?.contactName
                : formState.reference?.name,
            description: formState.description,
            fromDateTime: moment(`${formState.date} ${formState.fromTime}`, 'DD/MM/YYYY HH:mm'),
            toDateTime: moment(`${formState.date} ${formState.toTime}`, 'DD/MM/YYYY HH:mm'),
            location: formState.location,
            notes: formState.notes,
            remindBefore: formState.remindBefore?.value,
            referenceType: scheduleType || 'Lead',
            orderType: scheduleType === ScheduleType.ADDED_SERVICE ? 'AddedServices' : null
          },
          callback: status => {
            setLoading(false);
            if (status) {
              dispatch(
                getShowAlertError({
                  ...CREATE_SCHEDULE,
                  closeAction: () => {
                    navigation.goBack();
                  }
                })
              );
              // typeof navigationCallback === 'function' && navigationCallback();
            } else {
              dispatch(getShowAlertError(SCHEDULE_ERROR_INPUT));
            }
          }
        })
      );
    },
    [dispatch, formState, navigation, scheduleType, memberId, from]
  );

  const onCreate = useCallback(() => {
    const fromTime = moment(`${formState.date} ${formState.fromTime}`, 'DD/MM/YYYY HH:mm');

    const toTime = moment(`${formState.date} ${formState.toTime}`, 'DD/MM/YYYY HH:mm');

    if (toTime.diff(fromTime, 'seconds') <= 0) {
      return dispatch(getShowAlertError(TIME_INPUT_ERROR));
    }
    RNCalendarEvents.checkPermissions()
      .then(status => {
        if (status !== 'authorized') {
          RNCalendarEvents.requestPermissions().then(res => {
            dispatchCreateScheduleAction(res);
          });
        } else {
          dispatchCreateScheduleAction(status);
        }
      })
      .catch(err => {});
  }, [dispatchCreateScheduleAction, formState, dispatch]);

  const onPressAlarmItem = useCallback(
    value => {
      setFormState({ ...formState, remindBefore: value });
    },
    [formState]
  );

  const onPressReferItem = useCallback(
    value => {
      setFormState({ ...formState, reference: value });
    },
    [formState]
  );

  const renderDropdownItem = useCallback((item, currentValue, onPressItem) => {
    return (
      <DropdownItem
        item={item}
        onPressItem={onPressItem}
        currentValue={currentValue}
        theme={theme}
      />
    );
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
      <AppLoading loading={isLoading} />
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
          {from !== SCREENS_NAME.SCHEDULE_LIST_SCREEN ? (
            <>
              <AppText translate style={styles.titleName}>
                {'create_schedule_detail.customer'}
              </AppText>
              <Text
                style={[
                  styles.contactName,
                  { color: theme?.text?.primary, fontFamily: theme?.fonts?.MEDIUM }
                ]}>
                {scheduleType === ScheduleType.DEAL || scheduleType === ScheduleType.ADDED_SERVICE
                  ? reference.contactName
                  : formState.reference?.name}
              </Text>
            </>
          ) : (
            <CustomInput
              translateTitle
              translatePlaceholder
              type="select"
              title={'create_schedule.customer'}
              style={styles.textValue}
              placeholder={'create_schedule.customer_placeholder'}
              selectOptions={listLead}
              onChangeText={onChangeValue('reference')}
              renderDropdownItem={({ item }) =>
                renderDropdownItem(item, formState.reference, onPressReferItem)
              }
              labelInput={formState.reference?.name}
              hasRightButton
              icDropdown={<ICWireFrameContact />}
            />
          )}
          <CustomInput
            translateTitle
            translatePlaceholder
            title={'create_schedule.content'}
            style={styles.textValue}
            placeholder={'create_schedule.content_placeholder'}
            onChangeText={onChangeValue('description')}
          />

          <DateTimePickerInput
            translateTitle
            translatePlaceholder
            type={'date'}
            title={'create_schedule.day'}
            style={styles.textValue}
            placeholder={'create_schedule.day_placeholder'}
            iconComponent={<ICCalendar stroke={theme?.icon?.color1} />}
            onChangeText={onChangeValue('date')}
            value={formState.date}
            name="date"
            onOpen={onPressDateTimePicker}
            onCancel={onCancelDateTimePicker}
            pickerVisible={dateTimePickerVisible.date}
          />

          <View style={styles.row}>
            <View style={{ width: '46 %' }}>
              <DateTimePickerInput
                translateTitle
                translatePlaceholder
                iconComponent={<ICGreenClock color1={theme?.icon?.color1} />}
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
                iconComponent={<ICGreenClock color1={theme?.icon?.color1} />}
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
          />
          <CustomInput
            translateTitle
            translatePlaceholder
            translateItem
            // translatePlaceholder
            type="select"
            title={'create_schedule.alarm'}
            editable={false}
            style={[styles.textValue]}
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
        <PrimaryButton
          disabled={!formState.reference}
          translate
          onPress={onCreate}
          title={'create_schedule.btn_create'}
        />
      </FloatFooter>
    </View>
  );
};

export default React.memo(CreateSchedule);
