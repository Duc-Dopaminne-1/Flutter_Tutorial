import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {AComponent} from './AComponent';

storiesOf('AComponent', module) //format
  .add('default', () => <AComponent />);
