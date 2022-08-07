import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {Text} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {commonStyles} from '../../assets/theme/styles';
import SliderWithInput from './SliderWithInput';

storiesOf('Slider', module) //format
  .add('SliderWithInput!', () => <SliderWithInput {...data} />);

const data = {
  values: [40],
  max: 100,
  min: 0,
  onValuesChange: () => {},
  headerTitle: 'Slider With Input',
  titleStyle: commonStyles.blackTextBold14,
  headerRightComp: <Text style={commonStyles.blackText14}>20.000.000 VND</Text>,
  editable: true,
  markerStyle: {borderColor: COLORS.YELLOW_BASIC},
  trackSelectedStyle: {backgroundColor: COLORS.YELLOW_BASIC},
  trackUnselectedStyle: {backgroundColor: COLORS.GRAY_C9},
  trackStyle: {height: 2},
  onValuesChangeStart: () => {},
  onValuesChangeFinish: () => {},
  inputValue: 40,
};
