import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {ForgotPassContainer} from './ForgotPasswordScreen';

const data = {
  route: {
    params: {
      isUnAuthorizedRequest: false,
    },
  },
};

storiesOf('z|auth/ForgotPassword', module).add('ForgotPass', () => {
  return <ForgotPassContainer canGoBack={false} {...data} />;
});
