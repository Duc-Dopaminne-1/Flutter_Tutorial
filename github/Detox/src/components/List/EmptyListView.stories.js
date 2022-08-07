import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {EMPTY_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {EmptyListView} from './EmptyListView';

storiesOf('EmptyListView', module)
  .add('loading', () => {
    return <EmptyListView loading />;
  })
  .add('error', () => {
    return <EmptyListView loading={false} error={translate(Message.NTW_UNKNOWN_ERROR)} />;
  })
  .add('default', () => {
    return <EmptyListView type={EMPTY_TYPE.DEFAULT} />;
  })
  .add('YOUR_PROPERTY', () => {
    return <EmptyListView type={EMPTY_TYPE.YOUR_PROPERTY} />;
  })
  .add('BUY_REQUEST', () => {
    return <EmptyListView type={EMPTY_TYPE.BUY_REQUEST} />;
  })
  .add('CHAT', () => {
    return <EmptyListView type={EMPTY_TYPE.CHAT} />;
  })
  .add('PAYMENT', () => {
    return <EmptyListView type={EMPTY_TYPE.PAYMENT} />;
  })
  .add('RECENT_AGENT', () => {
    return <EmptyListView type={EMPTY_TYPE.RECENT_AGENT} />;
  })
  .add('SUGGESTED_AGENT', () => {
    return <EmptyListView type={EMPTY_TYPE.SUGGESTED_AGENT} />;
  });
