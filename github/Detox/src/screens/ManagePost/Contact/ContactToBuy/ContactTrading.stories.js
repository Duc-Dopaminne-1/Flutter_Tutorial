import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../../storybook/utils/configDecorator';
import {CONTACT_TRADING_TYPE} from '../../../../assets/constants';
import ContactToBuyForm from './ContactToBuyForm';

const services = [
  {
    name: 'Công chứng theo yêu cầu',
    id: '3d610763-6890-45db-9d30-eb45a532a1e9',
    selected: false,
  },
  {
    name: 'Tín dụng BĐS',
    id: 'b09d47c9-91ac-48ea-9b11-66905e9d1622',
    selected: false,
  },
  {
    name: 'Pháp lý BĐS',
    id: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
    selected: false,
  },
];

storiesOf('z|ContactTrading', module) //format
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('B2C', () => (
    <ContactToBuyForm
      state={{
        showSuccessPopup: false,
        user: {},
        agentInfo: {},
        contactType: CONTACT_TRADING_TYPE.BUY,
      }}
      postTitle={''}
      setState={() => {}}
      onSubmitSuccess={() => {}}
      propertyPost={{
        price: 1700000000,
        forSale: true,
      }}
      services={services}
    />
  ))
  .add('SaleC2C', () => (
    <ContactToBuyForm
      state={{
        showSuccessPopup: false,
        user: {},
        agentInfo: {},
        contactType: CONTACT_TRADING_TYPE.BUY,
      }}
      setState={() => {}}
      onSubmitSuccess={() => {}}
      postTitle={''}
      propertyPost={{
        price: 1700000000,
        forSale: true,
      }}
      services={services}
    />
  ))
  .add('RentC2C', () => (
    <ContactToBuyForm
      state={{
        showSuccessPopup: false,
        user: {},
        agentInfo: {},
        contactType: CONTACT_TRADING_TYPE.RENT,
      }}
      setState={() => {}}
      onSubmitSuccess={() => {}}
      postTitle={''}
      propertyPost={{
        forRent: true,
        price: 1700000000,
        propertyPostForRentDto: {rentPrice: 15000000},
      }}
      services={services}
    />
  ));
