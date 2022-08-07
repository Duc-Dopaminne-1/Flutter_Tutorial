import Divider from '../../../components/divider';
import { SPACING } from '../../../constants/size';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import ScheduleItem from '../../../screens/schedule/components/schedule_item';

const response = {
  items: [
    {
      date: '24/12',
      from: '15:30',
      to: '16:30',
      state: 0,
      address: '1239 Misty Cloud Pointe, Arlington, NY1239 Misty Cloud Pointe, Arlington, NY'
    },
    {
      date: '24/12',
      from: '15:30',
      to: '16:30',
      state: 1,
      address: '2239 Misty Cloud Pointe, Arlington, NY'
    },
    {
      date: '24/12',
      from: '15:30',
      to: '16:30',
      state: 2,
      address: '3239 Misty Cloud Pointe, Arlington, NY'
    },
    {
      date: '24/12',
      from: '15:30',
      to: '16:30',
      state: 3,
      address: '4239 Misty Cloud Pointe, Arlington, NY'
    },
    {
      date: '24/12',
      from: '15:30',
      to: '16:30',
      state: 1,
      address: '2239 Misty Cloud Pointe, Arlington, NY'
    },
    {
      date: '24/12',
      from: '15:30',
      to: '16:30',
      state: 2,
      address: '3239 Misty Cloud Pointe, Arlington, NY'
    },
    {
      date: '24/12',
      from: '15:30',
      to: '16:30',
      state: 3,
      address: '4239 Misty Cloud Pointe, Arlington, NY'
    }
  ]
};

const ScheduleTab = props => {
  const data = response;

  return (
    <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
      {data.items.map((value, index) => {
        return (
          <View>
            <ScheduleItem item={value} />
            <View style={{ height: SPACING.Medium }} />
            <Divider />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default React.memo(ScheduleTab);

export const styles = StyleSheet.create({
  wrapper: {
    paddingTop: SPACING.Large,
    paddingHorizontal: SPACING.Medium,
    paddingBottom: SPACING.HasBottomButton
  }
});
