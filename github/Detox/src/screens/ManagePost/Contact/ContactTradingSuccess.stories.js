import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {ContactSuccessContainer} from './ContactSuccessContainer';

storiesOf('z|contact/ContactTradingSuccess', module)
  .add('B2C', () => (
    <ContactSuccessContainer
      title={translate('contactTrading.success.title')}
      subTitle={translate('contactTrading.success.description')}
      continueButtonTitle={translate('contactTrading.success.continue')}
      detailButtonTitle={translate('contactTrading.success.detail')}
    />
  ))
  .add('C2C', () => (
    <ContactSuccessContainer
      title={translate('contactTrading.success.title')}
      subTitle={translate('contactTrading.success.description')}
      continueButtonTitle={translate('common.continueSearch')}
      detailButtonTitle={translate(STRINGS.VIEW_DETAIL)}
    />
  ));
