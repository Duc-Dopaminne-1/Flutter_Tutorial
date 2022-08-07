import React from 'react';
import { View, ViewStyle, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars/index';
import { Gender, GENDER_TYPE } from '@/models/gender';
import { useLocalizeNameField } from '@/shared/processing';
import MaleSVG from '@/components/SVG/MaleSVG';
import FemaleSVG from '@/components/SVG/FemaleSVG';
import GenderOtherSVG from '@/components/SVG/GenderOtherSVG';

const RAI_TO = 1.3;
const PADDING = 25;
const CONTAINER: ViewStyle = {
  height: (screenWidth / 3 - PADDING) * RAI_TO,
  width: screenWidth / 3 - PADDING,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  elevation: 12,
  shadowColor: colors.gray_product,
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.3,
  shadowRadius: 7,
};

const SPACE_VIEW: ViewStyle = {
  height: 10,
};

interface GenderButtonProps {
  style?: ViewStyle;
  genderSelected: Gender;
  onPress?: (gender: Gender) => void;
  gender: Gender;
}

function GenderButton(props: GenderButtonProps) {
  const { style = CONTAINER, gender, genderSelected, onPress } = props;
  const localizeNameField = useLocalizeNameField();
  const backgroundColor = genderSelected && gender.id === genderSelected.id ? colors.blue_700 : colors.white;
  const iconTintColor = genderSelected && gender.id === genderSelected.id ? colors.white : colors.gray_400;

  const getIcon = () => {
    switch (gender.code) {
      case GENDER_TYPE.MALE:
        return <MaleSVG color={iconTintColor} />;
      case GENDER_TYPE.FEMALE:
        return <FemaleSVG color={iconTintColor} />;
      case GENDER_TYPE.OTHER:
        return <GenderOtherSVG color={iconTintColor} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity {...props} style={[style, { backgroundColor: backgroundColor }]} onPress={() => onPress(gender)}>
      {getIcon()}
      <View style={SPACE_VIEW} />
      <Text numberOfLines={1} style={genderSelected && gender.id === genderSelected.id ? styles.textSelected : styles.text}>
        {localizeNameField(gender)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: fonts.size.s16,
    color: colors.gray_500,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textSelected: {
    fontSize: fonts.size.s16,
    color: colors.white,
    fontFamily: fonts.family.PoppinsBold,
  },
});

export default React.memo(GenderButton);
