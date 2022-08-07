import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {ViewAgentRank} from '.';

storiesOf('z|RankItems', module) //format
  .add('default', () => {
    return (
      <View style={{alignItems: 'center'}}>
        <ViewAgentRank rank={'rank1'} />
        <ViewAgentRank rank={'rank2'} />
        <ViewAgentRank rank={'rank3'} />
        <ViewAgentRank rank={'rank4'} />
        <ViewAgentRank rank={'rank5'} />
      </View>
    );
  });
