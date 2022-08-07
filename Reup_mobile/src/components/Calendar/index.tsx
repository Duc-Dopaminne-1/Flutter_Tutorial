import React, { useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import { weekDays } from '@src/constants/vars';
import ListDate from '@components/Calendar/ListItem';
import Modal from 'react-native-modal';
import ModalCalendar from '@components/Calendar/Modal';
import { CalendarProvider } from '@components/Calendar/CalendarContext';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';

type Props = {
  month: number;
  year: number;
  event: IEvent[];
  changeStatusEventCallback?: () => void;
};

const Calendar = (props: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { year, month, event = [], changeStatusEventCallback } = props;
  const [eventInDay, setEventInDay] = useState(false);
  const [events, setEvents] = useState<IEvent[]>(event);

  useEffect(() => {
    setEvents(event);
  }, [event]);

  const openModal = (data: any) => {
    setEventInDay(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <CalendarProvider
      value={{
        openModal
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {weekDays.map(day => (
            <Text style={styles.date} key={day}>
              {day}
            </Text>
          ))}
        </View>
        <ListDate key={Math.random()} event={events} month={month} year={year} />
      </View>
      <Modal
        key={'calendar'}
        isVisible={isModalVisible}
        hideModalContentWhileAnimating
        useNativeDriver
        customBackdrop={
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backgroundModal} />
          </TouchableWithoutFeedback>
        }
      >
        <ModalCalendar changeStatusEventCallback={changeStatusEventCallback} closeModal={closeModal} eventInDay={eventInDay} />
      </Modal>
    </CalendarProvider>
  );
};

export default Calendar;
