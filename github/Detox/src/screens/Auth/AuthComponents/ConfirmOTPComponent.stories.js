import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {ConfirmOTPContainer} from './ConfirmOTPComponent';

const data = {
  route: {
    params: {
      isUnAuthorizedRequest: false,
    },
  },
};

storiesOf('z|auth/ConfirmOTPComponent', module).add('ConfirmOTPComponent', () => {
  return <ConfirmOTPContainer autoFocus={false} canGoBack={false} {...data} />;
});
