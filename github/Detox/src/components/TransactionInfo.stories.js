import {storiesOf} from '@storybook/react-native';
import React from 'react';

import TransactionInfo from './TransactionInfo';

storiesOf('z|b2c/TransactionInfo', module).add('default', () => {
  return <TransactionInfo {...data} />;
});
const data = {
  projectName: 'projectName',
  amount: 100000,
  code: 'code',
  transactionCode: 'transactionCode',
  transactionIndex: '1',
};
