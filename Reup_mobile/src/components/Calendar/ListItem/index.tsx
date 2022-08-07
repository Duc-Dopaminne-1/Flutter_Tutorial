import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import moment from 'moment';
import { weekDays } from '@src/constants/vars';
import CalendarItem from '@components/Calendar/Item';
import { CalendarContext } from '@components/Calendar/CalendarContext';
import { filter, map } from 'lodash';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { EventStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { monthOrDayFormatNumberToString } from '@src/utils/date';
import { Config } from '@src/configs/appConfig';

type Props = {
  month: number;
  year: number;
  event: any;
};

const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const ListDate = (props: Props) => {
  const { year, month, event } = props;
  const input = `${month}-${year}`;
  const output = moment(input, 'MM-YYYY');
  const user: any = useContext(CalendarContext);

  const onPressDay = ((data: any, date: number, month: number, year: number) => {
    const strDay = monthOrDayFormatNumberToString(date);
    const strMonth = monthOrDayFormatNumberToString(month);
    const strYear = monthOrDayFormatNumberToString(year);
    user.openModal(filter(data, (x: IEvent) => moment(x.date_from).format(Config.Manager.formatDateDisplay) === `${strYear}-${strMonth}-${strDay}`));
  });

  const returnDateAsNumber = (date: string) => {
    switch (date) {
      case 'Sunday':
        return 0;

      case 'Monday':
        return 1;

      case 'Tuesday':
        return 2;

      case 'Wednesday':
        return 3;

      case 'Thursday':
        return 4;

      case 'Friday':
        return 5;

      default:
        return 6;
    }
  };

  const dates: any = [];
  const startDate = output.startOf('month').format('dddd');
  const months = output.month();
  let dateOfMonth = nDays[months];
  if (months == 1) {
    // February
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      dateOfMonth += 1;
    }
  }
  let date = 0 - returnDateAsNumber(startDate);
  for (let i = 0; i < 5; i++) {
    dates.push(
      <View key={i} style={styles.line}>
        {weekDays.map(() => {
          date++;
          const hasDate = date > 0 && date <= dateOfMonth;

          // Check status event Tomorrow
          const strDay = monthOrDayFormatNumberToString(date);
          const strMonth = monthOrDayFormatNumberToString(month);
          const strYear = monthOrDayFormatNumberToString(year);
          const eventOfDate = event.slice().reverse().find((x: IEvent) => moment(x.date_from).format(Config.Manager.formatDateDisplay) === `${strYear}-${strMonth}-${strDay}`);
          const filterEventsWithDate = filter(event.slice().reverse(), (x: IEvent) => moment(x.date_from).format(Config.Manager.formatDateDisplay) === `${strYear}-${strMonth}-${strDay}`);
          let statusNow = eventOfDate && eventOfDate.status ? eventOfDate.status : null;
          if (date == parseInt(moment().format('D'))) {
            // Get status event Today
            let findEventTimeSameNow: IEvent = filterEventsWithDate.find((x: IEvent) => moment(x.date_from).isSameOrAfter(moment()));
            if (!findEventTimeSameNow) {
              findEventTimeSameNow = filterEventsWithDate.length && filterEventsWithDate[filterEventsWithDate.length - 1] || null;
            }
            const filterEventsDuplicateFrom = findEventTimeSameNow && filter(filterEventsWithDate, (item: IEvent) => item.date_from == findEventTimeSameNow.date_from) || [];
            let status = (filterEventsDuplicateFrom.length && filterEventsDuplicateFrom[0].status) || null;
            if (filterEventsDuplicateFrom.length > 1) {
              const findEventWaiting = filterEventsDuplicateFrom.find((x: IEvent) => x.status == EventStatus.Waiting);
              status = findEventWaiting && findEventWaiting.status || status;
            }
            statusNow = status;
          } else {
            // Get status event Tomorrow, Yesterday
            statusNow = eventOfDate && eventOfDate.status ? eventOfDate.status : null;
          }

          return <CalendarItem onPress={onPressDay} month={month} year={year} event={event} status={statusNow} key={Math.random()} hasDate={hasDate} date={date} />;
        })}
      </View>);
  }

  if (date < dateOfMonth) {
    dates.push(
      <View key={Math.random()} style={styles.line}>
        {weekDays.map(() => {
          date++;
          return (
            <TouchableOpacity style={[styles.dateContainer]} key={date}>
              <Text style={styles.date} key={date}>
                {date <= dateOfMonth ? date : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>,
    );
  }

  return dates;
};

export default React.memo(ListDate);
