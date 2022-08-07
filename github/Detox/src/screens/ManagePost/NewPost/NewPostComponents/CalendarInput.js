import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';

import {CONSTANTS} from '../../../../assets/constants';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {small} from '../../../../assets/theme/metric';
import ErrorText from '../../../../components/ErrorText';
import ModalPopup from '../../../../components/Modal/ModalPopup';
import {getCalendarDateTimeString, getTextDateFromTimeStamp} from '../../../../utils/TimerCommon';

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: CONSTANTS.INPUT_HEIGHT,
    justifyContent: 'center',
    paddingLeft: small,
    borderRadius: CONSTANTS.INPUT_BORDER_RADIUS,
  },
  valueText: {
    ...FONTS.regular,
    fontSize: 14,
  },
});

const MarkedDateProps = {selected: true, selectedColor: COLORS.PRIMARY_A100};
const CalendarInput = ({value, style, onChangeDate, error}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleShowCalendar = () => {
    const shouldShow = !showCalendar;
    setShowCalendar(shouldShow);
  };
  const onDayPress = date => {
    setShowCalendar(false);
    onChangeDate(date);
  };

  const onDismissPopup = () => {
    setShowCalendar(false);
  };

  const stringCurrentDate = getCalendarDateTimeString(value);

  return (
    <>
      <TouchableOpacity style={style} onPress={toggleShowCalendar}>
        <View style={styles.buttonContainer}>
          <Text style={styles.valueText}>{getTextDateFromTimeStamp(value)}</Text>
        </View>
      </TouchableOpacity>
      <ErrorText errorText={error} />
      {showCalendar && (
        <ModalPopup visible={showCalendar} onPressOutSide={onDismissPopup} animationType="slide">
          <Calendar
            style={styles.calendar}
            hideExtraDays
            onDayPress={onDayPress}
            minDate={moment().add(1, 'days').toDate()}
            maxDate={moment().add(3, 'months').toDate()}
            current={stringCurrentDate}
            markedDates={{[stringCurrentDate]: MarkedDateProps}}
          />
        </ModalPopup>
      )}
    </>
  );
};

export default CalendarInput;
