import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {BasicProfileContain} from './BasicProfileFields';

storiesOf('z|auth/BasicProfileFields', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('BasicProfileFields', () => {
    return <BasicProfileContain {...data} />;
  });

const data = {
  onComponentChange: () => {},
  errorForField: () => {},
  isShowAvatar: false,
  renderVerifyEmail: () => {},
  firstName: 'agentconfirm',
  lastName: 'Rồng Lửa Q2',
  userName: 'b203957c-9740-47f5-aae2-49e16fe39ed2',
  phoneNumber: 'rank1',
  email: 'MDL000000025',
  gender: false,
  referralCode: 'MDL000000025',
};
