import React, { useState } from 'react';
import { View } from 'react-native';
import styles from '@screens/tenant/MaintenanceReportsTenant/styles';
import { WIDTH } from '@constants/vars';
import CustomDateTimePicker, { getToday } from '@components/CustomDateTimePicker';

const DatePicker = () => {
  const [dateStart, setDateStart] = useState(getToday());
  const [dateEnd, setDateEnd] = useState(getToday());

  const onDateChangeStart = (date: any) => {
    setDateStart(date);
  };

  const onDateChangeEnd = (date: any) => {
    setDateEnd(date);
  };

  return (
    <View style={[styles.viewDatePickers]}>
      <CustomDateTimePicker styleContainers={{ width: WIDTH / 2 - 25 }} date={dateStart} onDateChange={onDateChangeStart} />
      <CustomDateTimePicker styleContainers={{ width: WIDTH / 2 - 25 }} date={dateEnd} onDateChange={onDateChangeEnd} />
    </View>
  );
};

export default React.memo(DatePicker);
