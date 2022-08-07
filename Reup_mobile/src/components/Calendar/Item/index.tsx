import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { Theme } from '@components/Theme';
import { EventStatus } from '@reup/reup-api-sdk/libs/api/enum';
import moment from 'moment';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { monthOrDayFormatNumberToString } from '@src/utils/date';
import { filter } from 'lodash';
import { Config } from '@src/configs/appConfig';

type Props = {
  hasDate: boolean,
  date: number,
  status?: EventStatus,
  event: any,
  month: number,
  year: number,
  onPress: (data: any, date: number, month: number, year: number) => void
};


const CalendarItem = (props: Props) => {
  const { hasDate, date, status, event, onPress, month, year } = props;
  const dateColor = [Theme.calendar.veryLightPinkBackground, Theme.calendar.blueBackground, Theme.calendar.greenBackground];
  const textColor = [Theme.calendar.reject, Theme.calendar.textColorWhite, Theme.calendar.textColorWhite];

  const onPressDay = () => {
    if (status) {
      const strDay = monthOrDayFormatNumberToString(date);
      const strMonth = monthOrDayFormatNumberToString(month);
      const strYear = monthOrDayFormatNumberToString(year);
      const data = filter(event, (x: IEvent) => moment(x.date_from).format(Config.Manager.formatDateDisplay) === `${strYear}-${strMonth}-${strDay}`);
      onPress(data, date, month, year);
    }
  };

  const getBackgroundColor = (status: EventStatus) => {
    if (status == EventStatus.Accept) {
      return dateColor[2];
    } else if (status == EventStatus.Waiting) {
      return dateColor[1];
    } else if (status == EventStatus.Expired) {
      return dateColor[0];
    }
  };

  const getTextColor = (status: EventStatus) => {
    if (status == EventStatus.Waiting) {
      return textColor[1];
    } else if (status == EventStatus.Accept) {
      return textColor[2];
    } else {
      return textColor[0];
    }
  };

  return (
    <TouchableOpacity
      key={date}
      style={[
        styles.dateContainer,
        status && hasDate ? { backgroundColor: getBackgroundColor(status) } : {},
      ]}
      onPress={onPressDay}
    >
      <Text style={[styles.date, status ? { color: getTextColor(status) } : {}]} key={date}>
        {hasDate ? date : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default CalendarItem;
