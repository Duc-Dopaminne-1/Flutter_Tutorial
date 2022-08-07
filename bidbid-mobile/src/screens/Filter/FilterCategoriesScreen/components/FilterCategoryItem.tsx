import React, { memo } from 'react';
import { View, ViewStyle, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { Category } from '@/models/';
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

interface FilterCategoryItemProps {
  style?: ViewStyle;
  category: Category;
  listSelected?: Category[];
  onPressed?: (item: Category) => void;
}

function FilterCategoryItem(props: FilterCategoryItemProps) {
  const { style = CONTAINER, listSelected = [], onPressed, category } = props;
  const localizeNameField = useLocalizeNameField();
  const checkIsSelected = () => {
    let isSelected = false;
    listSelected.map(item => {
      if (item.id === category.id) isSelected = true;
    });
    return isSelected;
  };

  const icon = checkIsSelected() ? <CheckedSVG /> : <CheckSVG />;

  return (
    <Pressable style={style} onPress={() => onPressed(category)}>
      <DefaultText {...{ style: TITLE }}>{localizeNameField(category)}</DefaultText>
      <View style={WRAPPER_RADIO_ICON}>{icon}</View>
    </Pressable>
  );
}

export default memo(FilterCategoryItem);
