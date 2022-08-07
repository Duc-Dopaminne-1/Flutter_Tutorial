import React, { useEffect } from "react";
import { useState } from "react";
//@ts-ignore
import { Agenda } from "react-native-calendars";
import AgendaListItem from '@screens/manager/Calendar/CalendarDetails/AgendaList/Item';
import { IEvent } from "@reup/reup-api-sdk/libs/api/calendar/event/models";
import { Config } from "@src/configs/appConfig";
import moment from "moment";
import { filter } from "lodash";
import { View } from "react-native";
import { CustomText } from "@src/components/CustomText";
import styles from "./styles";
import { EventStatus } from "@reup/reup-api-sdk/libs/api/enum";

interface Props {
  selectDay?: string;
  agendaRef?: any;
  events: IEvent[];
  changeStatusEventCallback?: () => void;
}

const NUM_DAY_OF_WEEK = 7;

const AgendaList = (props: Props) => {
  const { selectDay, agendaRef, events, changeStatusEventCallback } = props;
  const [items, setItem] = useState({});

  useEffect(() => {
    agendaRef && agendaRef.current && agendaRef.current.chooseDay(moment(selectDay).startOf("week").format(Config.Manager.formatDateDisplay));
  }, [events]);

  const rowHasChanged = (r1: any, r2: any) => {
    return r1 !== r2;
  };

  const timeToString = (time: string) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const loadItems = (day: any) => {
    const newItems: any = [];
    for (let i = 0; i < NUM_DAY_OF_WEEK; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);
      newItems[strTime] = events && filter(events, function (item) {
        return moment(item.date_from).format(Config.Manager.formatDateDisplay) === strTime;
      });
    }
    const updateItems: any = {};
    Object.keys(newItems).forEach(key => { updateItems[key] = newItems[key]; });
    setItem(updateItems);
  };

  const renderItem = (item: IEvent) => {
    if (item.status !== EventStatus.Reject.valueOf()) {
      return <AgendaListItem item={item} changeStatusEventCallback={changeStatusEventCallback} />;
    } else {
      return null;
    }
  };

  const renderDay = (
    day: {
      dateString: string,
      day: number,
      month: number,
      timestamp: number,
      year: number
    },
    item: any
  ) => {
    const dayMonth = day && day.timestamp ? moment(day.timestamp).format('DD/MM') : '';
    const nameDay = day && day.timestamp ? moment(day.timestamp).format('ddd') : '';
    const dayMarginTop = items && day && day.dateString && Object.keys(items)[0] == day.dateString ? 5 : 35;
    const keys = items && Object.keys(items);
    const dayMarginBottom = day && day.dateString && keys[keys.length - 1] == day.dateString ? 15 : 0;
    return (
      <View style={[styles.viewDay, { marginTop: dayMarginTop, marginBottom: dayMarginBottom }]}>
        <CustomText style={styles.textDayMonth} text={dayMonth} styleContainer={{ width: '100%' }} />
        <CustomText style={styles.textNameDay} text={nameDay} styleContainer={{ width: '100%' }} />
      </View>
    );
  };

  return (
    <Agenda
      ref={agendaRef}
      useCustomReservation={true}
      items={items}
      selected={selectDay}
      loadItemsForMonth={loadItems.bind(undefined)}
      renderItem={renderItem.bind(undefined)}
      rowHasChanged={rowHasChanged.bind(undefined)}
      theme={{
        agendaDayTextColor: 'yellow',
        agendaDayNumColor: 'green',
        agendaTodayColor: 'red',
        agendaKnobColor: 'blue'
      }}
      renderDay={renderDay}
    />
  );
};

export default React.memo(AgendaList);
