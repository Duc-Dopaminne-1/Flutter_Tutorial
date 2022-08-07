import {storiesOf} from '@storybook/react-native';
import React from 'react';

import LinkTextButton from '../LinkTextButton';
import CustomButtonWithArrowRight from './CustomButtonWithArrowRight';
import {ViewMoreButton} from './ViewMoreButton';

storiesOf('Button', module)
  .add('LinkTextButton', () => {
    return <LinkTextButton />;
  })
  .add('CustomButtonWithArrowRight', () => {
    return <CustomButtonWithArrowRight title="Title" />;
  })
  .add('ViewMoreButton', () => {
    return <ViewMoreButton />;
  });
