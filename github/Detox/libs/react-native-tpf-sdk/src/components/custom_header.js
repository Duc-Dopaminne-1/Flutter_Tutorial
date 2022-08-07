import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICBack } from '../assets/icons';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { CUSTOM_COLOR } from '../constants/colors';
import { SPACING, STATUS_BAR_HEIGHT } from '../constants/size';
import { Shadow } from '../constants/stylesCSS';
import { scale } from '../utils/responsive';
import AppText from './app_text';

const CustomHeader = props => {
  const {
    navigation,
    title,
    rightButton,
    style,
    translate = false,
    styleHeaderTitle = {},
    colorIconBack
  } = props;

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.headerContainer, style]}>
      <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
        <ICBack color={colorIconBack} />
      </TouchableOpacity>
      <AppText translate={translate} semiBold style={[styles.headerTitle, styleHeaderTitle]}>
        {title}
      </AppText>
      {rightButton}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    ...Shadow,
    flexDirection: 'row',
    minHeight: scale(44),
    paddingVertical: scale(9),
    paddingHorizontal: SPACING.Medium,
    alignItems: 'center',
    backgroundColor: CUSTOM_COLOR.White,
    paddingTop: STATUS_BAR_HEIGHT
  },
  headerTitle: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center',
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: -1,
    paddingTop: STATUS_BAR_HEIGHT
  }
});
