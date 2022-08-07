import React, { ReactElement, memo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { updateSetting } from '@/redux/app/actions';
import { set } from '@/services/storage';
import { IS_FIRST_INSTALL } from '@/constants/app';
import CustomAnimationShake from '@/components/CustomAnimationShake';
import BidBidSVG from '@/components/SVG/BidBidSVG';

function TutorialCarouselItemStepSix(): ReactElement {
  const onStart = async () => {
    await set(IS_FIRST_INSTALL, 'false');
    NavigationActionsService.dispatchAction(
      updateSetting({
        data: false,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground borderRadius={12} source={images.tutorial7} style={styles.wrapSecondComponent}>
        <BidBidSVG />

        <CustomAnimationShake>
          <Pressable style={styles.wrapSecondBtn} onPress={onStart}>
            <Text style={styles.textSecondButton}>{language('startConnecting')}</Text>
          </Pressable>
        </CustomAnimationShake>
      </ImageBackground>
    </View>
  );
}

export default memo(TutorialCarouselItemStepSix);

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
  wrapSecondBtn: {
    paddingHorizontal: 50,
    alignSelf: 'center',
    paddingVertical: 17,
    borderRadius: 36,
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: colors.red_700,
  },
  textSecondButton: {
    fontSize: fonts.size.s18,
    fontFamily: fonts.family.PoppinsSemiBold,
    color: colors.white,
    textAlign: 'center',
  },
});
