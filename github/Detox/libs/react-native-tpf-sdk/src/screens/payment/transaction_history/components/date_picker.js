import CustomInput from '../../../../components/custom_input';
import { SPACING } from '../../../../constants/size';
import moment from 'moment';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ATTRIBUTE_TYPE } from '../../../../global/entity_type';

const DatePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  useEffect(() => {
    if (moment(endDate).diff(moment(startDate)) < 0) {
      setEndDate(startDate);
      setStartDate(endDate);
    }
  }, [endDate, startDate]);

  return (
    <View style={styles.datePickerWrapper}>
      <CustomInput
        translateTitle
        value={startDate}
        onChangeText={setStartDate}
        type={ATTRIBUTE_TYPE.date}
        title={'common.start_date'}
        style={styles.inputLeft}
      />
      <CustomInput
        translateTitle
        value={endDate}
        onChangeText={setEndDate}
        type={ATTRIBUTE_TYPE.date}
        title={'common.end_date'}
        style={styles.inputRight}
      />
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  datePickerWrapper: {
    flexDirection: 'row',
    paddingBottom: SPACING.Large
  },
  inputLeft: {
    flex: 1,
    marginRight: SPACING.Large
  },
  inputRight: {
    flex: 1
  }
});
