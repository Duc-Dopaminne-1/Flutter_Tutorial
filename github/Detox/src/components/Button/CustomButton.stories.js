import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {commonStyles} from '../../assets/theme/styles';
import {SizeBox} from '../SizeBox';
import CustomButton, {CustomButtonTypes} from './CustomButton';

storiesOf('CustomButton', module).add('default', () => {
  return (
    <View style={{padding: 16}}>
      <Text>default</Text>
      <CustomButton {...props} style={commonStyles.buttonNext} />
      <SizeBox height={SIZES.SEPARATOR_12} />
      <Text>primary</Text>
      <CustomButton
        {...props}
        mode={'primary'}
        leftChild={
          <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.NEUTRAL_WHITE} />
        }
        rightChild={
          <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.NEUTRAL_WHITE} />
        }
      />
      <SizeBox height={SIZES.SEPARATOR_12} />
      <Text>outline</Text>
      <CustomButton {...props} mode={'outline'} />
    </View>
  );
});

const props: CustomButtonTypes = {
  mode: 'default',
  style: {},
  title: 'Title',
  onPress: () => {},
};
