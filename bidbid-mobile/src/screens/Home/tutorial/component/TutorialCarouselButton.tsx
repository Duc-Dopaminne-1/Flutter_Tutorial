import React, { useContext, memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { language } from '@/i18n';
import CustomButtonIcon from '@/components/CustomButtonIcon';
import { TutorialContext } from '@/screens/Home/tutorial/TutorialContext';
import { onClickIconFilter, TouchDiscovery } from '@/shared/global';
import CustomAnimationShake from '@/components/CustomAnimationShake';
import { vs } from '@/vars/scaling';
import RevertSVG from '@/components/SVG/RevertSVG';

interface TutorialCarouselButtonProp {
  index?: number;
}

function TutorialCarouselButton(props: TutorialCarouselButtonProp) {
  const { index } = props;
  const { onNextStep } = useContext(TutorialContext);

  const onPressLove = () => {
    onClickIconFilter.next(TouchDiscovery.Like);
  };

  const onPressBack = () => {
    onClickIconFilter.next(TouchDiscovery.Back);
  };

  const renderButtonFirst = () => {
    return (
      <CustomAnimationShake>
        <Pressable style={styles.container} onPress={onNextStep}>
          <Text style={styles.textButton}>{language('letDoIt')}</Text>
        </Pressable>
      </CustomAnimationShake>
    );
  };

  const renderButtonLove = (isShowFull = false, onPress = () => {}) => {
    return (
      <View style={!isShowFull && styles.containerButtonLove}>
        <CustomButtonIcon
          onPress={onPress}
          containerStyle={[styles.containerBtn, isShowFull && styles.hideShadow]}
          imagesPng={images.thumbUpPng}
        />
      </View>
    );
  };

  const renderButtonBack = (isShowFull = false, onPress = () => {}) => {
    return (
      <View style={!isShowFull && styles.containerButtonLove}>
        <CustomButtonIcon
          onPress={onPress}
          containerStyle={[styles.containerBtn, isShowFull && styles.hideShadow]}
          imagesPng={images.thumbDownPng}
        />
      </View>
    );
  };

  const renderButtonFull = (isHideButton = false) => {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={[styles.containerButton, isHideButton && styles.hideView]}>
        <CustomButtonIcon containerStyle={[styles.containerBtn, styles.hideShadow]} icon={<RevertSVG />} />
        {renderButtonBack(true)}
        {renderButtonLove(true)}
      </View>
    );
  };

  const renderButton = () => {
    // index is step tutorial
    switch (index) {
      case 0:
        return renderButtonFirst();
      case 1:
      case 4:
      case 5:
        return renderButtonFull();
      case 2:
        return renderButtonLove(false, onPressLove);
      case 3:
        return renderButtonBack(false, onPressBack);
      case 6:
        return renderButtonFull(true);
      default:
        return null;
    }
  };

  return renderButton();
}

export default memo(TutorialCarouselButton);

const styles = StyleSheet.create({
  container: {
    width: '60%',
    alignSelf: 'center',
    paddingVertical: 16,
    borderRadius: 36,
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: colors.red_700,
  },
  textButton: {
    fontSize: fonts.size.s18,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: fonts.fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
  },
  containerButton: {
    paddingTop: vs(28),
    paddingBottom: vs(33),
    flexDirection: 'row',
    paddingHorizontal: 51,
    justifyContent: 'center',
    opacity: 0.4,
  },
  containerButtonLove: {
    paddingTop: vs(28),
    paddingBottom: vs(33),
    flexDirection: 'row',
    paddingHorizontal: 51,
    justifyContent: 'center',
  },
  containerBtn: {
    marginHorizontal: 12,
  },
  hideShadow: {
    elevation: 0,
  },
  hideView: {
    opacity: 0,
  },
});
