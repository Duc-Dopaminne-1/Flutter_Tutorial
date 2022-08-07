import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {ConfirmDepositContainer} from './ConfirmDepositScreen';

storiesOf('z|b2c/ConfirmDepositContainer', module) //format
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('Default', () => {
    return <ConfirmDepositContainer {...data} />;
  });

const data = {
  toggleButton: () => {},
  info: {
    type: '',
    name: 'nguyen nhudl1',
    phone: '0987080100',
    code: 'ABC03',
    floor: '1',
    block: 'Vidi',
    price: '1đ',
    bookedMoney: '10,000,000đ',
    projectName: 'Project name',
    consultantName: 'consultantName',
    agentId: '',
    propertyPostId: '9bfa1a57-e1ae-468e-88e6-32a9656136e1',
    bookingTransactionId: 'ca360cd7-9621-421a-812f-31c6245c6cdd',
    policies: [],
  },
};
