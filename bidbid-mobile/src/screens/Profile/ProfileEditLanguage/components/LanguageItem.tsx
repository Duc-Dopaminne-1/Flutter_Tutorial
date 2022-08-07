import React from 'react';
import { ViewStyle, View, Text, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { LANGUAGE_MODEL } from '@/models/language';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import { useLocalizeNameField } from '@/shared/processing';
import { ADD_LANGUAGES_KEY } from '@/constants/app';
import NextSVG from '@/components/SVG/NextSVG';
import CloseSvg from '@/components/SVG/CloseSVG';

export type LanguageItemType = 'Add Languages' | 'Other';
const CONTAINER: ViewStyle = {
  height: 70,
  flexDirection: 'row',
  backgroundColor: colors.white,
  paddingVertical: 15,
  paddingHorizontal: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.gray_100,
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
  marginHorizontal: 15,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
  marginLeft: 7,
  flexShrink: 1,
  marginRight: 15,
};
const WRAPPER_ICON_DELETE: ViewStyle = {};

interface LanguageItemProps {
  style?: ViewStyle;
  item?: LANGUAGE_MODEL;
  type: LanguageItemType;
  itemOnPressed?: (type: LanguageItemType, item?: LANGUAGE_MODEL, index?: number) => void;
}

function LanguageItem(props: LanguageItemProps) {
  const localizeNameField = useLocalizeNameField();
  const { style = CONTAINER, item, type, itemOnPressed } = props;
  const icon = type === ADD_LANGUAGES_KEY ? <NextSVG /> : <CloseSvg color={colors.red_700} />;
  const title = type === ADD_LANGUAGES_KEY ? language('profileGeneral.addLanguages') : localizeNameField(item);

  const onPressed = () => {
    itemOnPressed && itemOnPressed(type, item);
  };

  if (type === ADD_LANGUAGES_KEY)
    return (
      <TouchableOpacity style={style} onPress={onPressed}>
        <Text style={TITLE}>{title}</Text>
        {icon}
      </TouchableOpacity>
    );
  else
    return (
      <View style={style}>
        <DefaultText {...{ style: TITLE }}>{title}</DefaultText>
        <TouchableOpacity style={WRAPPER_ICON_DELETE} onPress={onPressed}>
          {icon}
        </TouchableOpacity>
      </View>
    );
}

export default React.memo(LanguageItem);
