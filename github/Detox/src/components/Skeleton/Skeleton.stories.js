import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {
  SkeletonEvent,
  SkeletonFiveStep,
  SkeletonNews,
  SkeletonProjectHome,
  SkeletonPropertyHome,
} from '.';

storiesOf('SkeletonView', module).add('.default', () => {
  return (
    <ScrollView>
      <SkeletonEvent />
      <SkeletonFiveStep />
      <SkeletonNews />
      <SkeletonProjectHome />
      <SkeletonPropertyHome />
    </ScrollView>
  );
});
