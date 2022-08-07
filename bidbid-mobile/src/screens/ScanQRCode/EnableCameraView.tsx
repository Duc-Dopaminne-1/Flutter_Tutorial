import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { openSettings } from 'react-native-permissions';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomButton from '@/components/CustomButton';

export function EnableCameraView(): ReactElement {
  const enableLocationOnPressed = () => {
    openSettings();
  };

  return (
    <View style={styles.container}>
      <DefaultText {...{ style: styles.title }}>{language('enableLocationScreen.title')}</DefaultText>
      <DefaultText {...{ style: styles.description }}>{language('enableCameraDesc')}</DefaultText>
      <CustomButton onPress={enableLocationOnPressed} containerStyle={styles.enableLocationView} text={language('enableCamera')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    paddingHorizontal: 35,
    paddingBottom: 45,
    alignItems: 'center',
  } as ViewStyle,

  title: {
    textAlign: 'center',
    fontSize: fonts.size.s22,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  description: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: fonts.size.s12,
    color: colors.gray_600,
  } as TextStyle,

  enableLocationView: {
    marginVertical: 20,
  } as ViewStyle,
});
