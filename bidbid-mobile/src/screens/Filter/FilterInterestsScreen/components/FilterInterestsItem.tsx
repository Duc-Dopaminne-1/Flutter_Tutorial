import React from 'react';
import { View, ViewStyle, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { INTERESTS_MODEL } from '@/models/';
import DefaultText from '@/components/CustomText/DefaultText';
import { useLocalizeNameField } from '@/shared/processing';
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

interface FilterInterestsItemProps {
  style?: ViewStyle;
  interests: INTERESTS_MODEL;
  onPressed?: (item: INTERESTS_MODEL) => void;
  isSelected: boolean;
}

function FilterInterestsItem(props: FilterInterestsItemProps) {
  const localizeNameField = useLocalizeNameField();
  const { style = CONTAINER, onPressed, interests, isSelected = false } = props;
  const icon = isSelected ? <CheckedSVG /> : <CheckSVG />;
  const name = localizeNameField(interests);
  return (
    <Pressable style={style} onPress={() => onPressed(interests)}>
      <DefaultText {...{ style: TITLE }}>{name}</DefaultText>
      <View style={WRAPPER_RADIO_ICON}>{icon}</View>
    </Pressable>
  );
}

export default FilterInterestsItem;
