import React from 'react';
import { View, ViewStyle, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { SEXUAL_ORIENTATION_MODEL } from '@/models/sexual-orirentation';
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

interface FilterSexualOrientationItemProps {
  style?: ViewStyle;
  sexualOrientation: SEXUAL_ORIENTATION_MODEL;
  listSelected?: SEXUAL_ORIENTATION_MODEL[];
  onPressed?: (item: SEXUAL_ORIENTATION_MODEL) => void;
}

function FilterSexualOrientationItem(props: FilterSexualOrientationItemProps) {
  const { style = CONTAINER, listSelected = [], onPressed, sexualOrientation } = props;
  const localizeNameField = useLocalizeNameField();

  const checkIsSelected = () => {
    let isSelected = false;
    listSelected.map(item => {
      if (item.id === sexualOrientation.id) isSelected = true;
    });
    return isSelected;
  };

  const icon = checkIsSelected() ? <CheckedSVG /> : <CheckSVG />;

  return (
    <Pressable style={style} onPress={() => onPressed(sexualOrientation)}>
      <DefaultText {...{ style: TITLE }}>{localizeNameField(sexualOrientation)}</DefaultText>
      <View style={WRAPPER_RADIO_ICON}>{icon}</View>
    </Pressable>
  );
}

export default React.memo(FilterSexualOrientationItem);
