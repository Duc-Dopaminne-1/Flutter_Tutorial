import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import AgentItem from '.';

storiesOf('AgentItem', module).add('default', () => {
  return (
    <ScrollView>
      <AgentItem {...props} />
    </ScrollView>
  );
});

const props = {
  onPress: () => {},
  agentInfo: {
    nameAgent: 'Võ Khắc Phúc',
    avatarAgent: null,
    groupName: 'Rồng Vàng 1',
    rankAgent: 'Diamond Plus',
    propertyInterested: [
      {id: '2e2b0611-e1fc-4406-b13f-8afafff1c675', name: 'apartment'},
      {id: '48cceac6-e202-494d-9b06-2374042f1044', name: 'villa'},
      {id: 'b2ba5130-faa5-458c-aba8-58c505ac59b9', name: 'house'},
    ],
    areaInterested: [{cityId: 1, cityName: 'Hồ Chí Minh', districtId: 24, districtName: 'Thủ Đức'}],
    rateNumber: 3,
    rankName: 'rank5',
    agentId: '377dc01c-72cd-4cf8-8a24-8def5e71c16e',
    numberPropertySell: 0,
  },
};
