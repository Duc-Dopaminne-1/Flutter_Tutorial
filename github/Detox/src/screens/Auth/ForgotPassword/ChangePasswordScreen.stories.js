import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {ChangePasswordContainer} from './ChangePasswordScreen';

const data = {
  route: {
    params: {
      isUnAuthorizedRequest: false,
    },
  },
};

storiesOf('z|auth/ChangePasswordScreen', module).add('ForgotPass', () => {
  return <ChangePasswordContainer canGoBack={false} {...data} />;
});
