import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {FloorSection} from './FloorSection';

storiesOf('z|b2c/FloorSection!', module) //format
  .add('default!', () => {
    return (
      <>
        <FloorSection />
        <FloorSection floor="" />
      </>
    );
  });
