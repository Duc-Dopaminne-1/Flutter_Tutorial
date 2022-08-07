import {storiesOf} from '@storybook/react-native';
import React from 'react';

import WelcomeScreen from './WelcomeScreen';

const data = {
  route: {
    params: {
      isUnAuthorizedRequest: false,
    },
  },
};

storiesOf('z|auth/WelcomeScreen', module).add('Default', () => {
  return <WelcomeScreen canGoBack={false} {...data} />;
});
