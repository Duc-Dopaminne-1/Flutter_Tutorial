import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {
  PLUS_SERVICES_AFTER_BUYING,
  PLUS_SERVICES_BEFORE_BUYING,
  PLUS_SERVICES_WHILE_BUYING,
} from '../../configs/Home';
import {PlusServiceView} from './PlusServiceScreen';

storiesOf('z|PlusServiceView', module).add('default', () => <PlusServiceView {...props} />);

const props = {
  onLoginPress: () => {},
  onPressItem: () => {},
  plusServices: {
    beforeBuying: PLUS_SERVICES_BEFORE_BUYING,
    whileBuying: PLUS_SERVICES_WHILE_BUYING,
    afterBuying: PLUS_SERVICES_AFTER_BUYING,
  },
};
