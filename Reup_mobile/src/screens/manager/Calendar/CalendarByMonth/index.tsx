import React, { useState, useEffect } from 'react';
import styles from "./styles";
import Calendar from '@components/Calendar';
import CustomMonthYearPicker from '@src/components/CustomMonthYearPicker';
import moment from 'moment';
import { filter } from 'lodash';
import { useDispatch } from 'react-redux';
import { getListEvent } from '@src/modules/calendar/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { LimitGetAll } from '@src/constants/vars';
import { getStartAndEndDate } from '@src/utils/date';
import { Alert } from 'react-native';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { IQueryEventRequest } from '@reup/reup-api-sdk/libs/api/calendar/event';
import { EventStatus } from '@reup/reup-api-sdk/src/api/enum';
import translate from '@src/localize';

interface Props {
  onDateChangeCallBack: (month: number, year: number) => void;
  params: IQueryEventRequest;
  callBackData: (data: IEvent[]) => void;
}

const CalendarByMonth = (props: Props) => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState<IEvent[]>([]);
  const { onDateChangeCallBack, params, callBackData } = props;
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const onGetListEventOfMonth = (isLoading: boolean) => {
    isLoading && NavigationActionsService.showLoading();
    const objDate = getStartAndEndDate(selectedMonth, selectedYear);
    setEvents([]);
    dispatch(
      getListEvent({
        page: 1,
        limit: LimitGetAll,
        isSave: false,
        q: {
          ...params,
          from_date: moment(objDate.startDate).startOf('day').toISOString(),
          to_date: moment(objDate.endDate).endOf('day').toISOString()
        },
        onSuccess: data => {
          isLoading && NavigationActionsService.hideLoading();
          data && data.results && callBackData && callBackData(filter(data.results, (item: IEvent) => item.status !== EventStatus.Reject));
          data && data.results && setEvents(filter(data.results, (item: IEvent) => item.status !== EventStatus.Reject));
        },
        onFail: error => {
          isLoading && NavigationActionsService.hideLoading();
          callBackData && callBackData([]);
          setEvents([]);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  useEffect(() => {
    onGetListEventOfMonth(true);
  }, [selectedYear, selectedMonth, params]);

  const onDateChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    onDateChangeCallBack && onDateChangeCallBack(month, year);
  };

  const changeStatusEventCallback = () => {
    onGetListEventOfMonth(false);
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
      <Calendar changeStatusEventCallback={changeStatusEventCallback} month={selectedMonth} year={selectedYear} event={events} />
    </>
  );
};

export default CalendarByMonth;
