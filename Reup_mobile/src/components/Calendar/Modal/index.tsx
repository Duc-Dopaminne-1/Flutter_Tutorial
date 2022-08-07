import React, { useEffect, useState } from 'react';
import { FlatList, Image, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import AgendaListItem from '@screens/manager/Calendar/CalendarDetails/AgendaList/Item';
import { CLOSE_ICON_X } from '@constants/icons';
import styles from './styles';
import moment from 'moment';
import { EventStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { clone, filter, map } from 'lodash';

type Props = {
  eventInDay: any;
  closeModal: () => void;
  changeStatusEventCallback?: () => void;
};

const ModalCalendar = (props: Props) => {
  const { eventInDay, closeModal, changeStatusEventCallback } = props;
  const [events, setEvents] = useState<IEvent[]>(eventInDay);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const renderHeader = () => {
    const listEventInDay = eventInDay.slice().reverse();
    if (listEventInDay[0] && listEventInDay[0].date_from) {
      return (
        <View style={styles.wrapDate} >
          <Text style={styles.date} >{moment(listEventInDay[0].date_from).format('dddd - Do MMMM, YYYY')}</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const changeStatusOnPress = (loading: boolean) => {
    setIsLoading(loading);
  };

  const changeStatusEvent = (idEvent: string, status: string) => {
    const cloneEvents = clone(events);
    const mapEvents = map(cloneEvents, (event: IEvent) => {
      if (idEvent === event.id) {
        return { ...event, status: status };
      } else {
        return event;
      }
    });
    setEvents(mapEvents);
    changeStatusEventCallback && changeStatusEventCallback();
  };

  const renderItem = ({ item }: any) => {
    if (item.status !== EventStatus.Reject.valueOf()) {
      return (
        <View style={styles.wrapItem} >
          <AgendaListItem changeStatusOnPress={changeStatusOnPress} changeStatusEventCallback={changeStatusEvent} item={item} />
        </View>
      );
    } else {
      return null;
    }
  };

  const renderIndicator = () => {
    if (isLoading) {
      return (
        <View style={styles.containerIndicator}>
          <View style={styles.indicator}>
            <ActivityIndicator size='small' color='white' />
          </View>
        </View >
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={closeModal} style={styles.wrapIconClose} >
        <Image style={styles.iconClose} source={CLOSE_ICON_X} />
      </TouchableOpacity>
      {renderHeader()}
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      {renderIndicator()}
    </View>
  );
};

export default ModalCalendar;
