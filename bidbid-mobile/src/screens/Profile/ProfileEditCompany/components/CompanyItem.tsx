import React from 'react';
import { ViewStyle, View, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars/index';
import DefaultText from '@/components/CustomText/DefaultText';
import { language } from '@/i18n';
import NextSVG from '@/components/SVG/NextSVG';
import CloseSvg from '@/components/SVG/CloseSVG';

export type CompanyItemType = 'Add Company' | 'Other';
const CONTAINER: ViewStyle = {
  height: 90,
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
  textTransform: 'capitalize',
};

const WRAPPER_ICON_DELETE: ViewStyle = {};

interface CompanyItemProps {
  style?: ViewStyle;
  type: CompanyItemType;
  item?: any;
  schoolItemOnPressed?: (type: CompanyItemType) => void;
}

function CompanyItem(props: CompanyItemProps) {
  const { style = CONTAINER, type, item, schoolItemOnPressed } = props;
  const icon = type === 'Add Company' ? <NextSVG color={colors.blue_700} /> : <CloseSvg color={colors.red_700} />;
  const title = type === 'Add Company' ? language('profileGeneral.addCompany') : item.name;

  const onPressed = () => {
    schoolItemOnPressed && schoolItemOnPressed(type);
  };

  if (type === 'Add Company') {
    return (
      <TouchableOpacity style={style} onPress={onPressed}>
        <DefaultText {...{ style: TITLE }}>{title}</DefaultText>
        {icon}
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={style}>
        <DefaultText {...{ style: TITLE, numberOfLines: 2 }}>{title}</DefaultText>
        <TouchableOpacity style={WRAPPER_ICON_DELETE} onPress={onPressed}>
          {icon}
        </TouchableOpacity>
      </View>
    );
  }
}

export default React.memo(CompanyItem);
