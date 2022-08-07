import React from 'react';
import { ViewStyle, Text, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { LANGUAGE_MODEL } from '@/models/language';
import { useLocalizeNameField } from '@/shared/processing';

const CONTAINER: ViewStyle = {
  height: 60,
  marginHorizontal: 10,
  flexDirection: 'row',
  alignItems: 'center',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s18,
  fontFamily: fonts.family.SSPRegular,
  color: colors.text_light_gray,
  fontWeight: '500',
  textAlign: 'center',
};

interface LanguageSearchItemProps {
  style?: ViewStyle;
  item?: LANGUAGE_MODEL;
  itemOnPressed?: (item: LANGUAGE_MODEL, index?: number) => void;
}

function LanguageSearchItem(props: LanguageSearchItemProps) {
  const { style = CONTAINER, item, itemOnPressed } = props;
  const localizeNameField = useLocalizeNameField();

  const onPressed = () => {
    itemOnPressed && itemOnPressed(item);
  };

  return (
    <TouchableOpacity style={style} onPress={onPressed}>
      <Text style={TITLE}>{localizeNameField(item)}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(LanguageSearchItem);
