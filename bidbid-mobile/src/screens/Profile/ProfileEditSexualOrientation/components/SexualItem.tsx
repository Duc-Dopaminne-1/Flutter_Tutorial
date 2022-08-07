import React from 'react';
import { ViewStyle, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars/index';
import DefaultText from '@/components/CustomText/DefaultText';
import { useLocalizeNameField } from '@/shared/processing';
import CheckedSVG from '@/components/SVG/CheckedSVG';
import CheckSVG from '@/components/SVG/CheckSVG';

const CONTAINER: ViewStyle = {
  height: 44,
  marginHorizontal: 15,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
  flex: 1,
  marginRight: 20,
};
interface SexualItemProps {
  style?: ViewStyle;
  item: any;
  listSelected?: number[];
  onPress?: (item: any) => void;
  maxItems: number;
}

function SexualItem(props: SexualItemProps) {
  const { style = CONTAINER, listSelected = [], onPress, item, maxItems } = props;
  const isSelected = listSelected.includes(item.id);
  const localizeNameField = useLocalizeNameField();

  const icon = isSelected ? <CheckedSVG /> : <CheckSVG />;
  const opacity = (listSelected && listSelected.length === maxItems && isSelected) || listSelected.length < maxItems ? 1 : 0.5;
  return (
    <Pressable
      style={[style, { opacity: opacity }]}
      onPress={() => {
        onPress(item);
      }}
    >
      <DefaultText {...{ style: TITLE, numberOfLines: 1 }}>{localizeNameField(item)}</DefaultText>
      {icon}
    </Pressable>
  );
}

export default React.memo(SexualItem);
