import React from 'react';
import { ViewStyle, View, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';
import NextSVG from '@/components/SVG/NextSVG';

export enum CellEnum {
  LOCATION,
  GENDER,
  SEXUAL_ORIENTATION,
  INTERESTS,
  AGE_RANGE,
  CATEGORIES,
  AUCTION_STATUS,
  PROFILES,
  IG_USERNAME,
}

const CONTAINER: ViewStyle = {
  height: 65,
  flexDirection: 'row',
};

const LEFT_VIEW: ViewStyle = {
  flex: 1,
  paddingVertical: 5,
  flexDirection: 'column',
  justifyContent: 'space-around',
};

const RIGHT_VIEW: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
};

const DESCRIPTION: TextStyle = {
  fontSize: fonts.size.s14,
  color: colors.gray_500,
};

const CIRCLE: ViewStyle = {
  height: 4,
  width: 4,
  backgroundColor: colors.gray_500,
  borderRadius: 20,
  marginTop: isIOS ? 0 : -3,
};

const WRAP_DESCRIPTION: ViewStyle = { flexDirection: 'row', alignItems: 'center' };

interface CellDetailProps {
  title: string;
  description?: string;
  type?: CellEnum;
  onPress?: (type: CellEnum) => void;
  isFromLocation?: boolean;
  countryDesc?: string;
}

function CellDetail(props: CellDetailProps) {
  const { title, description, type, onPress, isFromLocation, countryDesc } = props;

  const renderSubTitle = () => {
    if (countryDesc) {
      return (
        <View style={WRAP_DESCRIPTION}>
          <DefaultText {...{ style: DESCRIPTION, numberOfLines: 1 }}>{countryDesc} </DefaultText>
          <View style={CIRCLE} />
          <DefaultText {...{ style: DESCRIPTION, numberOfLines: 1 }}>{` ${description}`}</DefaultText>
        </View>
      );
    } else {
      return (
        <View style={WRAP_DESCRIPTION}>
          <DefaultText {...{ style: DESCRIPTION, numberOfLines: 1 }}>{language('myCurrentLocation')}</DefaultText>
          <View style={CIRCLE} />
          <DefaultText {...{ style: DESCRIPTION, numberOfLines: 1 }}>{` ${description}`}</DefaultText>
        </View>
      );
    }
  };
  return (
    <TouchableOpacity style={CONTAINER} onPress={() => onPress && onPress(type)}>
      <View style={LEFT_VIEW}>
        <DefaultText {...{ style: TITLE }}>{title}</DefaultText>
        {isFromLocation
          ? renderSubTitle()
          : description && <DefaultText {...{ style: DESCRIPTION, numberOfLines: 1 }}>{description}</DefaultText>}
      </View>
      <View style={RIGHT_VIEW}>
        <NextSVG />
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(CellDetail);
