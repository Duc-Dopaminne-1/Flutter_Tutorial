import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {initialState} from '../AuthComponents/types';
import {InfoAccountContainer, InfoAccountContainerProps} from './InfoAccountScreen';

storiesOf('z|auth/InfoAccountScreen', module) //format
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('default', () => {
    return <InfoAccountContainer canGoBack={false} {...props} />;
  });

const props: InfoAccountContainerProps = {
  inputViewsProps: {
    state: initialState,
    validates: {
      step1: {},
    },
    areaCities: [],
    addressCities: [],
    contactCities: [],
  },
  agreePolicy: {
    html: '',
    isAgree: false,
    modalRef: {},
    openModal: () => {},
  },
  onPressButtonNext: () => {},
  onPressCancel: () => {},
};
