import React, { ReactElement } from 'react';
import { ViewStyle, Text, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { Category } from '@/models/category';
import { useLocalizeNameField } from '@/shared/processing';

const CONTAINER: ViewStyle = {
  minWidth: 90,
  paddingVertical: 8,
  paddingHorizontal: 20,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderRadius: 30,
  marginHorizontal: 6,
  marginVertical: 6,
  borderColor: colors.gray_400,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s14,
  fontFamily: fonts.family.PoppinsRegular,
  color: colors.gray_600,
  fontWeight: '500',
  textAlign: 'center',
};

interface PlaceABidCategoryProps {
  style?: ViewStyle;
  item?: Category;
  itemsSelected?: number[];
  index?: number;
  itemOnPressed?: (item: Category, index: number) => void;
}

export function PlaceABidCategoryItem(props: PlaceABidCategoryProps): ReactElement {
  const { style = CONTAINER, item, index, itemsSelected, itemOnPressed } = props;
  let isSelected = itemsSelected.includes(item.id as number);
  if (!isSelected) {
    isSelected = itemsSelected.includes(item.name as any);
  }

  const backgroundColor = isSelected ? colors.blue_700 : colors.transparent;
  const textColor = isSelected ? colors.white : colors.text_light_gray;
  const borderColor = isSelected ? colors.transparent : colors.gray_400;
  const localizeNameField = useLocalizeNameField();

  return (
    <TouchableOpacity
      style={[style, { backgroundColor: backgroundColor, borderColor: borderColor }]}
      onPress={() => itemOnPressed(item, index)}
    >
      <Text style={[TITLE, { color: textColor }]}>{localizeNameField(item)}</Text>
    </TouchableOpacity>
  );
}
