import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import RatingComponent from './RatingComponent';

storiesOf('StarRating', module) // format
  .add('default!', () => {
    const array = [];
    for (let i = 0; i <= 5; i += 0.5) {
      array.push(i);
    }

    return (
      <View>
        {array.map(i => (
          <RatingComponent key={i} rateNumber={i} backgroundColor={COLORS.NEUTRAL_WHITE} />
        ))}
      </View>
    );
  });
