import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {Text, View} from 'react-native';

import {normal} from '../../../assets/theme/metric';
import {SecondInfoMainRow} from './ConfirmPropertyComponents';

storiesOf('z|b2c/SecondInfoMainRow', module) //format
  .add('Mode Booking', () => {
    return (
      <View style={{padding: normal}}>
        <SecondInfoMainRow data={data} />

        <Text style={{marginVertical: normal}}>Deposit Mode</Text>
        <SecondInfoMainRow data={{...data, currentMode: 'MODE_DEPOSIT'}} />
      </View>
    );
  });

const data = {
  isAgentUser: true,
  numberOfBooking: 10,
  buyCommission: '1%',
  price: '112,123 VNĐ',
  currentMode: 'MODE_BOOKING', // 'MODE_BOOKING'
  propertyPrice: '432,123 VNĐ',
  expectedPrice: '11 Triệu/m2',
};
