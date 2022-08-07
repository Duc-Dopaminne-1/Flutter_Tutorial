import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {SelectPaymentMethodContainer} from './SelectPaymentMethodScreen';

storiesOf('z|b2c/SelectPaymentMethod', module) //format
  .add('Default', () => {
    return <SelectPaymentMethodContainer />;
  });
