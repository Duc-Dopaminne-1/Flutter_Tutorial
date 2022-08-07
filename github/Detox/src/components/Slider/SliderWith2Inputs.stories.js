import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import SliderWith2Inputs from './SliderWith2Inputs';

storiesOf('Slider', module) //format
  .add('.SliderWith2Inputs!', () => (
    <View style={{marginHorizontal: 16}}>
      <SliderWith2Inputs {...data} />
    </View>
  ));

const data = {
  editable: true,
  input1Title: 'Topener mua',
  input1TitleDescription: '0 VND',
  input1TitleDescriptionStyle: [
    {color: '#333333', fontFamily: 'Nunito-Regular', fontSize: 16, includeFontPadding: true},
    {marginTop: 8},
  ],
  input1TitleStyle: {
    color: '#333333',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    includeFontPadding: true,
  },
  input1Value: 66,
  input2Title: 'Topener bán',
  input2TitleDescription: '0 VND',
  input2TitleDescriptionStyle: [
    {color: '#333333', fontFamily: 'Nunito-Regular', fontSize: 16, includeFontPadding: true},
    {marginTop: 8},
  ],
  input2TitleStyle: {
    color: '#333333',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    includeFontPadding: true,
  },
  input2Value: 34,
  markerOffsetX: 12,
  markerStyle: {
    borderColor: '#CCD1D9',
    borderWidth: 4,
    elevation: 1,
    shadowColor: '#3b4a74',
    shadowOffset: {height: 3, width: 3},
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  max: 100,
  min: 0,
  showSlideHeader: false,
  titleStyle: {color: '#333333', fontFamily: 'Nunito-Bold', fontSize: 16, includeFontPadding: true},
  trackSelectedStyle: {backgroundColor: '#3360FF'},
  trackStyle: {height: 4},
  trackUnselectedStyle: {backgroundColor: '#FFC13D'},
  values: [66],
  onBlurInput1: () => {},
  onBlurInput2: () => {},
  onChangeInput1: () => {},
  onChangeInput2: () => {},
  onValuesChange: () => {},
  onValuesChangeFinish: () => {},
  onValuesChangeStart: () => {},
  input2Validator: () => {},
  input1Validator: () => {},
};
