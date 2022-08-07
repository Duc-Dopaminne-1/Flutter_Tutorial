import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../../storybook/utils/configDecorator';
import {
  PLUS_SERVICES_AFTER_BUYING,
  PLUS_SERVICES_BEFORE_BUYING,
  PLUS_SERVICES_WHILE_BUYING,
} from '../../../../configs/Home';
import PlusServiceBlock from '.';

storiesOf('Home/PlusServices', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('default', () => <PlusServiceBlock {...props} />);

const props = {
  isHomePage: true,
  plusServices: {
    beforeBuying: PLUS_SERVICES_BEFORE_BUYING,
    whileBuying: PLUS_SERVICES_WHILE_BUYING,
    afterBuying: PLUS_SERVICES_AFTER_BUYING,
  },
};
