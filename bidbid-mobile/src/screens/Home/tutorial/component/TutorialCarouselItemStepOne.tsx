import React, { ReactElement, useContext, memo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { language } from '@/i18n';
import { TutorialContext } from '@/screens/Home/tutorial/TutorialContext';
import NavigationActionsService from '@/navigation/navigation';
import { updateSetting } from '@/redux/app/actions';
import { set } from '@/services/storage';
import { IS_FIRST_INSTALL } from '@/constants/app';
import CustomAnimationShake from '@/components/CustomAnimationShake';
import HandSVG from '@/components/SVG/HandSVG';

function TutorialCarouselItemStepOne(): ReactElement {
  const { onNextStep } = useContext(TutorialContext);

  const onPressSkip = async () => {
    await set(IS_FIRST_INSTALL, 'false');
    NavigationActionsService.dispatchAction(
      updateSetting({
        data: false,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground borderRadius={12} source={images.tutorial2} style={styles.wrapSecondComponent}>
        <View style={styles.wrapSecondComponent}>
          <HandSVG />
          <Text style={styles.textSecondTitle}>{language('readyConnecting')}</Text>
          <Text style={styles.textSecondSubTitle}>{language('hereKnow')}</Text>

          <CustomAnimationShake>
            <Pressable style={styles.wrapSecondBtn} onPress={onNextStep}>
              <Text style={styles.textSecondButton}>{language('startTutorial')}</Text>
            </Pressable>
          </CustomAnimationShake>
        </View>
        <View style={styles.wrapSkip}>
          <Text style={styles.textSecondSkip} onPress={onPressSkip}>
            {language('skip')}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

export default memo(TutorialCarouselItemStepOne);

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
    fontSize: fonts.size.s33,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: fonts.fontWeight.bold,
    marginTop: 8,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  textSecondSubTitle: {
    color: colors.white,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: fonts.fontWeight.bold,
    marginTop: 15,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  wrapSecondBtn: {
    paddingHorizontal: 50,
    alignSelf: 'center',
    paddingVertical: 17,
    borderRadius: 36,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: colors.red_700,
  },
  textSecondButton: {
    fontSize: fonts.size.s18,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: fonts.fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
  },
  wrapSkip: {
    marginBottom: 20,
  },
  textSecondSkip: {
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_700_alpha,
    textAlign: 'center',
    fontWeight: fonts.fontWeight.bold,
  },
});
