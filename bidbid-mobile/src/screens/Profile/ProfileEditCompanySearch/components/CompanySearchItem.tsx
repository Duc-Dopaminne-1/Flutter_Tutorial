import React, { memo } from 'react';
import { ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars/index';
import DefaultText from '@/components/CustomText/DefaultText';

const CONTAINER: ViewStyle = {
  height: 60,
  marginHorizontal: 15,
  flexDirection: 'row',
  alignItems: 'center',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_500,
  textAlign: 'justify',
};

interface CompanySearchItemProps {
  style?: ViewStyle;
  item?: any;
  itemOnPressed?: (item) => void;
}

function CompanySearchItem(props: CompanySearchItemProps) {
  const { style = CONTAINER, item, itemOnPressed } = props;
  const title = typeof item === 'string' ? item : item.name ? item.name : ' ';

  const onPressed = () => {
    itemOnPressed && itemOnPressed(item);
  };
  return (
    <TouchableOpacity style={style} onPress={onPressed}>
      <DefaultText style={TITLE}>{title}</DefaultText>
    </TouchableOpacity>
  );
}

export default memo(CompanySearchItem);
