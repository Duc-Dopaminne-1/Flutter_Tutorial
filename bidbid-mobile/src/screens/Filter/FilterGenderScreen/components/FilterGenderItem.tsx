import React from 'react';
import { View, ViewStyle, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { Gender } from '@/models/gender';
import DefaultText from '@/components/CustomText/DefaultText';
import { useLocalizeGenderName } from '@/shared/processing';
import CheckedSVG from '@/components/SVG/CheckedSVG';
import CheckSVG from '@/components/SVG/CheckSVG';

const CONTAINER: ViewStyle = {
  height: 50,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const WRAPPER_RADIO_ICON: ViewStyle = {
  height: 50,
  width: 50,
  justifyContent: 'center',
  alignItems: 'center',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
};

interface FilterGenderItemProps {
  style?: ViewStyle;
  onPressed?: (gender: Gender) => void;
  gender: Gender;
  isSelected: boolean;
}

function FilterGenderItem(props: FilterGenderItemProps) {
  const { style = CONTAINER, gender, onPressed = () => {}, isSelected = false } = props;
  const getGenderName = useLocalizeGenderName();

  const icon = isSelected ? <CheckedSVG /> : <CheckSVG />;

  return (
    <Pressable style={style} onPress={() => onPressed(gender)}>
      <DefaultText {...{ style: TITLE }}>{getGenderName(gender)}</DefaultText>
      <View style={WRAPPER_RADIO_ICON}>{icon}</View>
    </Pressable>
  );
}

export default FilterGenderItem;
