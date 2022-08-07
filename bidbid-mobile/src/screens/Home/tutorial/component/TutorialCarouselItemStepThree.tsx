import React, { ReactElement, memo } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { language } from '@/i18n';
import CustomAnimationLoopSwipe from '@/components/CustomAnimationLoopSwipe';
import HandLeftSVG from '@/components/SVG/HandLeftSVG';

function TutorialCarouselItemStepThree(): ReactElement {
  return (
    <View style={styles.container}>
      <ImageBackground borderRadius={12} source={images.tutorial3} style={styles.wrapSecondComponent}>
        <CustomAnimationLoopSwipe>
          <HandLeftSVG />
        </CustomAnimationLoopSwipe>
        <Text style={styles.textSecondTitle}>{language('slideLeft')}</Text>
        <View style={styles.wrapLine} />
        <Text style={styles.textSecondSubTitle}>{language('slideLeftNote')}</Text>
      </ImageBackground>
    </View>
  );
}

export default memo(TutorialCarouselItemStepThree);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  wrapSecondComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSecondTitle: {
    color: colors.white,
    fontSize: fonts.size.s24,
    fontFamily: fonts.family.PoppinsMediumItalic,
    fontWeight: fonts.fontWeight.bold,
    marginTop: 8,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  textSecondSubTitle: {
    color: colors.white,
    fontSize: fonts.size.s19,
    fontFamily: fonts.family.PoppinsRegular,
    paddingHorizontal: 35,
    textAlign: 'center',
  },
  wrapLine: {
    height: 5,
    width: 130,
    backgroundColor: colors.red_600,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
  },
});
