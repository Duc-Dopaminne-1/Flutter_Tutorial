import React, { useState } from 'react';
import styles from "./styles";
import Calendar from '@components/Calendar';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import CustomMonthYearPicker from '@src/components/CustomMonthYearPicker';

interface Props {
  events: IEvent[];
  onDateChangeCallBack: (month: number, year: number) => void;
}

const CalendarByMonthTenant = (props: Props) => {
  const dispatch = useDispatch();
  const { onDateChangeCallBack, events } = props;
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const onDateChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    onDateChangeCallBack && onDateChangeCallBack(month, year);
  };

  return (
    <>
      <CustomMonthYearPicker
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onDateChange={onDateChange}
        iconRightStyle={styles.arrowStyle}
        textStyle={styles.timeFilterText}
        mainContainer={{ paddingHorizontal: 20, marginTop: 25, marginBottom: 15 }}
        container={{ borderWidth: 0 }}
      />
      <Calendar month={selectedMonth} year={selectedYear} event={events} />
    </>
  );
};

export default CalendarByMonthTenant;
