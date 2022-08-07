import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {ItemInvestor} from './InvestorInformationList';

storiesOf('z|ItemInvestor', module) //format
  .add('default', () => {
    return (
      <View>
        <ItemInvestor item={item} />
      </View>
    );
  });

const item = {
  code: 'MCDT00045',
  logo: null,
  investorName: 'toanglan2',
  address: 'test1 test, An Phú Tây, Bình Chánh, Hồ Chí Minh.',
  phone: '0123456789',
  height: 90,
};
