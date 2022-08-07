import React, { memo } from 'react';
import { View, ViewStyle, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { Category } from '@/models/';
import DefaultText from '@/components/CustomText/DefaultText';
import CheckedSVG from '@/components/SVG/CheckedSVG';
import CheckSVG from '@/components/SVG/CheckSVG';
import { FindProfiles } from '@/models/findProfiles';

const CONTAINER: ViewStyle = {
  height: 50,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 15,
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

interface FilterProfileItemProps {
  style?: ViewStyle;
  data: FindProfiles;
  listSelected?: Category[];
  onPressed?: (item: FindProfiles) => void;
}

function FilterProfilesItem(props: FilterProfileItemProps) {
  const { style = CONTAINER, listSelected = [], onPressed, data } = props;

  const checkIsSelected = () => {
    let isSelected = false;
    listSelected.map(item => {
      if (item.id === data.id) isSelected = true;
    });
    return isSelected;
  };

  const icon = checkIsSelected() ? <CheckedSVG /> : <CheckSVG />;

  return (
    <Pressable style={style} onPress={() => onPressed(data)}>
      <DefaultText style={TITLE}>{data.name}</DefaultText>
      <View style={WRAPPER_RADIO_ICON}>{icon}</View>
    </Pressable>
  );
}

export default memo(FilterProfilesItem);
