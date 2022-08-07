import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {initialState} from '../AuthComponents/types';
import {InfoTopenerContainer, InfoTopenerContainerProps} from './InfoTopenerScreen';

storiesOf('z|auth/InfoTopenerScreen', module) //format
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('default', () => {
    return <InfoTopenerContainer canGoBack={false} {...props} />;
  });

const props: InfoTopenerContainerProps = {
  inputViewsProps: {
    state: {
      ...initialState,
      permanentAddress: {city: {}, district: {}, ward: {}, street: ''},
    },
    validates: {
      step2: {},
    },
    areaCities: [],
    addressCities: [],
    contactCities: [],
  },
};
