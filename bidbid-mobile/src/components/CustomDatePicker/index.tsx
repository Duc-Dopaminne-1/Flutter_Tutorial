import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { styles } from './styles';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import DatePicker from 'react-native-date-picker';
import { formatHourMinus } from '@/shared/processing';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';

let dateTimeIOS = null;

export function CustomDatePicker(props: any) {
  const { icon, mode, onDatePicked, setFieldValue } = props;
  const locale = useSelector((state: RootState) => state.app.locale);

  useEffect(() => {
    if (mode === 'date') {
      const date = dateToString(moment().toDate());
      setFieldValue('date', date);
      setValue(date);
    } else {
      const time = formatTimeInit(moment().toDate());
      setFieldValue('time', time);
      setValue(time);
    }
  }, []);

  const dateToString = date => {
    return !date ? '' : moment(date).format('L');
  };

  const tDate = dateToString(null);

  const [value, setValue] = useState(tDate);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().toDate());

  const setShowDate = () => {
    setShowPicker(true);
  };

  const onBackdropPress = () => {
    setShowPicker(false);
  };

  const formatTimeInit = (time: Date) => {
    let hours: number = time ? time?.getHours() : 0;
    let minus: number = time ? time?.getMinutes() : 0;
    let typeTime = 'am';

    if (hours > 12) {
      hours = hours - 12;
      typeTime = 'pm';
    } else if (hours === 12) {
      typeTime = 'pm';
    }

    if (minus > 0 && minus < 15) {
      minus = 0;
    } else if (minus >= 15 && minus < 30) {
      minus = 15;
    } else if (minus >= 30 && minus < 45) {
      minus = 30;
    } else {
      minus = 45;
    }

    const minusFormatted = minus < 15 ? '0' + minus : minus;
    const hoursFormatted = hours < 10 ? '0' + hours : hours;
    return hoursFormatted + ':' + minusFormatted + ' ' + typeTime;
  };

  const onConfirmBtnPressed = (dateTime = '') => {
    if (!dateTime) {
      setShowPicker(false);
      return;
    }

    let strDate = '';
    if (mode === 'time') {
      strDate = formatHourMinus(dateTime);
    } else {
      strDate = dateToString(dateTime);
    }

    setShowPicker(false);
    setValue(strDate);
    onDatePicked(strDate);
    setSelectedDate(dateTime as any);
  };

  const onChangePickerIOS = selectedDate => {
    dateTimeIOS = selectedDate;
    // setSelectedDate(selectedDate);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') {
      onConfirmBtnPressed(selectedDate);
    } else if (event.type == 'dismissed') {
      setShowPicker(false);
    }
  };

  const styleTitle = value !== '' ? styles.infoText : styles.infoTextPlaceholder;
  const valueTitle = value !== '' ? value : '';

  if (Platform.OS === 'ios') {
    return (
      <View>
        <CustomButton
          onPress={setShowDate}
          containerStyle={styles.wrapDate}
          wrapSecondIconStyle={styles.wrapIcon}
          wrapBtn={styles.wrapBtn}
          iconSecondStyle={styles.icon}
          textStyle={styleTitle}
          text={valueTitle}
          iconSecond={icon}
        />

        <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={showPicker} style={styles.wrapModal}>
          <TouchableOpacity style={styles.container} onPress={onBackdropPress}>
            <View>
              <View style={styles.headerPicker}>
                <TouchableOpacity onPress={onBackdropPress}>
                  <Text style={styles.cancelBtnText}>{language('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onConfirmBtnPressed(dateTimeIOS)}>
                  <Text style={styles.confirmBtnText}>{language('confirm')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fullDivider} />
              {mode === 'date' ? (
                <DatePicker date={selectedDate} style={styles.pickerIos} mode={mode} onDateChange={onChangePickerIOS} locale={locale} />
              ) : (
                ((
                  <DatePicker
                    minuteInterval={15}
                    date={selectedDate}
                    style={styles.pickerIos}
                    mode={mode}
                    onDateChange={onChangePickerIOS}
                    locale={locale}
                  />
                ) as any)
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  } else {
    return (
      <>
        <CustomButton
          onPress={setShowDate}
          containerStyle={styles.wrapDate}
          wrapSecondIconStyle={styles.wrapIcon}
          wrapBtn={styles.wrapBtn}
          iconSecondStyle={styles.icon}
          textStyle={styleTitle}
          text={valueTitle}
          iconSecond={icon}
        />

        {showPicker && mode === 'date' && (
          <DateTimePicker
            style={styles.datePicker}
            value={moment(selectedDate).toDate()}
            mode={mode}
            display="default"
            onChange={onChange}
            // format="MM-DD-YYYY"
          />
        )}
        {showPicker && mode === 'time' && (
          <DateTimePicker
            display="spinner"
            minuteInterval={15}
            style={styles.timePicker}
            value={moment(selectedDate).toDate()}
            mode={mode}
            // display="default"
            onChange={onChange}
          />
        )}
      </>
    );
  }
}
