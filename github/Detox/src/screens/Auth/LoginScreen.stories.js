import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {LoginContainer} from './LoginScreen';

storiesOf('z|auth/LoginScreen', module) //format
  .add('default', () => {
    return <LoginContainer canGoBack={false} {...data} />;
  });

const data = {
  route: {
    params: {
      isUnAuthorizedRequest: false,
    },
  },
};
