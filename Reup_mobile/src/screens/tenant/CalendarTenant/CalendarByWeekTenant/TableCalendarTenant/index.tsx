import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import _ from 'lodash';
import { tableWeekDays } from '@constants/vars';
import { CustomText } from '@components/CustomText';
import { calendarEventDetails, CalendarEventStatus } from './dummy';

interface Props {
};

const timeRange = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const TableCalendarTenant = (props: Props) => {

  const [listEventDate, setListDate] = useState([]);

  useEffect(() => {
    mapDates();
  }, []);

  const mapDates = () => {
    const listDates: any = [];

    calendarEventDetails.forEach((event, index) => {
      const dayOfWeekOfEvent = new Date(event.date).getDay();
      if (!listDates[dayOfWeekOfEvent]) listDates[dayOfWeekOfEvent] = [];
      listDates[dayOfWeekOfEvent].push({
        from: event.from,
        to: event.to,
        status: event.status
      });
    });

    setListDate(listDates);
  };

  const renderHeaderLine = () => {
    return (
      <View style={[styles.line, styles.grayBackground]}>
        {tableWeekDays.map((weekDay, index) => {
          const dateShape = index == 0 ? styles.firstDateShape : styles.dateShape;
          return (
            <View key={index} style={dateShape}>
              <CustomText
                style={styles.dateText}
                text={weekDay}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderTimeText = (hour: number) => {
    const hourText = hour <= 12 ? hour : (hour - 12);
    const amPmText = hour <= 12 ? ' AM' : ' PM';
    const dateText = `${hour}:00`;

    return (
      <View style={{ flexDirection: "row" }}>
        <CustomText
          style={styles.dateText}
          text={dateText}
        />
        <CustomText
          style={styles.smallDateText}
          text={amPmText}
        />
      </View>
    );
  };

  const getStyleByEventData = (hour: number, dayOfWeekIndex: number) => {
    const date: any[] = listEventDate[dayOfWeekIndex];
    if (!date) return undefined;
    let shapeStyle = undefined;

    date.forEach(event => {
      if (hour >= event.from && hour <= event.to) {
        if (event.status == CalendarEventStatus.APPROVE) {
          shapeStyle = styles.redBackground;
        }
        else if (event.status == CalendarEventStatus.PENDING) {
          shapeStyle = styles.veryLightPinkBackground;
        }
        else {
          shapeStyle = styles.greenBackground;
        }
      }
    });
    return shapeStyle;
  };

  const renderTimeLine = () => {
    const shapeStyle = [styles.borderLine];

    const dates = [];
    for (let i = 0; i < timeRange.length; i++) {
      dates.push(
        <View key={i} style={styles.line}>
          {tableWeekDays.map((day, index) => {
            const firstShapeStyle = index == 0 ? styles.firstDateShape : styles.dateShape;
            const shouldRenderTimeText = index == 0;
            const hour = timeRange[i];
            const shapeColor = getStyleByEventData(hour, index - 1);

            return (
              <View key={index} style={[firstShapeStyle, ...shapeStyle, shapeColor]}>
                {shouldRenderTimeText && renderTimeText(hour)}
              </View>
            );
          })}
        </View>,
      );
    }
    return dates;
  };

  return (
    <View style={styles.container}>
      {renderHeaderLine()}
      {renderTimeLine()}
    </View>
  );
};

export default TableCalendarTenant;
