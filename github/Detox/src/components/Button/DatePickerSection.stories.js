import {storiesOf} from '@storybook/react-native';
import React from 'react';

import DatePickerSection from './DatePickerSection';

storiesOf('Picker/Date', module) //format
  .add('default', () => (
    <DatePickerSection
      headerTitle="Header title"
      placeholder="Placeholder"
      error="Error"
      isShowIcon
      isShowLabel
      isRequired
    />
  ));
