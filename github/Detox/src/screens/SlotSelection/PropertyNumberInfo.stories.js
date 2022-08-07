import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView, Text} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import PropertyNumberInfo from './PropertyNumberInfo';

storiesOf('z|b2c/PropertyNumberInfo', module).add('default', () => {
  return (
    <ScrollView contentContainerStyle={{...HELPERS.center}}>
      <Text>Tab Item</Text>
      <PropertyNumberInfo title={'Title'} count={200} focused={true} progressColor={COLORS.GREEN} />
      <PropertyNumberInfo
        title={'Title'}
        count={200}
        focused={false}
        progressColor={COLORS.BLUE_56}
      />
    </ScrollView>
  );
});
