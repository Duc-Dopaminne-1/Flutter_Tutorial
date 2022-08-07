import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {LoanServicesView} from './LoanServiceContainer';

storiesOf('z|c2c/LoanServicesView', module).add('default', () => <LoanServicesView {...data} />);

const data = {
  amount: 0,
  duration: 1,
  interestIndex: 0,
  interestValue: 7,
  gotoLoanDetail: () => {},
};
