import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import SearchHeader from './SearchHeader';

storiesOf('z|search/HeaderSearch', module)
  .add('default', () => {
    return (
      <View style={{backgroundColor: COLORS.BACKGROUND}}>
        <SearchHeader {...props} />
      </View>
    );
  })
  .add('Search Map', () => {
    return (
      <View style={{backgroundColor: COLORS.BACKGROUND}}>
        <SearchHeader isSearchMap={false} {...props} />
      </View>
    );
  });

const props = {
  onMapPress: () => {},
};
