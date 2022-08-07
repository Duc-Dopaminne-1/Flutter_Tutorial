import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {ViewBrokerInfo} from '.';

storiesOf('z|AgentManagePost', module) //format
  .add('default!', () => {
    return (
      <View>
        <ViewBrokerInfo />
        <ViewBrokerInfo name={'Agent name'} isAgent />
        <ViewBrokerInfo name={'Agent name'} rating={5} isAgent />
        <ViewBrokerInfo name={'Member name'} rating={5} isAgent={false} />
      </View>
    );
  });
