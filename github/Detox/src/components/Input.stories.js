import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {InputWithUnit} from '../screens/ManagePost/DetailPropertyPost/BottomInfo';
import {InputButton} from './InputButton';
import {RangeInputSelect} from './RangeInputSelect';

const containerStyle = {backgroundColor: 'cornsilk'};

export const grayBackgroundDecorator = storyFn => (
  <>
    <View style={containerStyle}>{storyFn()}</View>
  </>
);

storiesOf('Input/InputWithUnit', module) // format
  .addDecorator(grayBackgroundDecorator)
  .add('default', () => {
    return (
      <View style={containerStyle}>
        <InputWithUnit title="title" value="value" error="error" isDropdown />
        <InputWithUnit title="title" value="value" error="error" isDropdown={false} />
      </View>
    );
  });

storiesOf('Input/InputButton', module)
  .addDecorator(grayBackgroundDecorator)
  .add('default', () => {
    return (
      <>
        <InputButton editable={false} />
        <InputButton editable />
      </>
    );
  });

storiesOf('Input/RangeInputSelect', module).add('default', () => {
  return <RangeInputSelect />;
});
