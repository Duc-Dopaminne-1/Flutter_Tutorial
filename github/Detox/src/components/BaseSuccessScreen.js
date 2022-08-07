import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import {useHardwareBackPress} from '../hooks/useHardwareBackPress';
import FooterButtons from '../screens/ManagePost/NewPost/NewPostComponents/FooterButtons';
import BaseScreen from './BaseScreen';
import CustomButton from './Button/CustomButton';
import CustomIconButton from './CustomIconButton';

const styles = StyleSheet.create({
  baseScreenContainer: {
    backgroundColor: COLORS.BACKGROUND,
  },
  bodyContainer: {
    ...HELPERS.fill,
    ...METRICS.horizontalPadding,
  },
  upperContainer: {
    flex: 1 / 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  belowContainer: {
    flex: 1 / 2,
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  iconCheck: {
    width: '42%',
    height: '42%',
  },
  iconName: {
    ...HELPERS.center,
    ...HELPERS.fullWidth,
    ...METRICS.paddingLeft,
  },
  separatorRow35: {
    height: 35,
  },
  textDescription: {
    ...FONTS.fontSize14,
    ...FONTS.lineHeight18,
    ...FONTS.regular,
    color: COLORS.BLACK_33,
    textAlign: 'center',
  },
  textTitle: {
    ...commonStyles.blackTextBold20,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonBackToRequestListScreen: {
    width: '100%',
    backgroundColor: COLORS.PRIMARY_A100,
    borderColor: COLORS.PRIMARY_A100,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 5,
    paddingVertical: 10,
    height: 45,
  },
  buttonBackToHomeScreen: {
    width: '100%',
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GRAY_BD,
    borderRadius: 5,
    paddingVertical: 10,
    height: 45,
  },
  buttonBackToHomeTitle: {
    ...FONTS.bold,
    ...commonStyles.txtFontSize14,
    color: COLORS.GREY_82,
  },
  buttonBackToRequestListTitle: {
    ...FONTS.bold,
    ...commonStyles.txtFontSize14,
    color: COLORS.NEUTRAL_WHITE,
  },
  descriptionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button2Style: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
  },
});

const BaseSuccessScreen = ({
  onPressButton1 = () => {},
  onPressButton2 = () => {},
  title,
  description,
  buttonText1,
  buttonText2,
  image,
  enableBottomButton = false,
  button2Style,
  buttonText2Style,
  buttonText1Style,
  contentStyle,
  iconName,
}) => {
  useHardwareBackPress();

  return (
    <BaseScreen showHeader={false} containerStyle={styles.baseScreenContainer}>
      <View style={styles.bodyContainer}>
        <View style={[styles.upperContainer, contentStyle]}>
          {isEmpty(iconName) && (
            <Image
              source={image ?? IMAGES.IMG_TICKER_SUCCESS}
              style={styles.iconCheck}
              resizeMode="contain"
            />
          )}
          {!isEmpty(iconName) && (
            <CustomIconButton
              style={styles.iconName}
              iconName={iconName}
              customImageSize={150}
              iconColor={COLORS.STATE_SUCCESS}
              disabled={true}
            />
          )}
          <View style={styles.separatorRow35} />
          <View style={styles.descriptionContainer}>
            {title && <Text style={styles.textTitle}>{title}</Text>}
            {description && <Text style={styles.textDescription}>{description}</Text>}
          </View>
        </View>
        {enableBottomButton || (
          <View style={styles.belowContainer}>
            {buttonText1 && (
              <CustomButton
                style={styles.buttonBackToRequestListScreen}
                title={buttonText1}
                titleStyle={styles.buttonBackToRequestListTitle}
                onPress={onPressButton1}
              />
            )}
            <View style={commonStyles.separatorRow16} />
            {buttonText2 && (
              <CustomButton
                style={styles.buttonBackToHomeScreen}
                title={buttonText2}
                titleStyle={styles.buttonBackToHomeTitle}
                onPress={onPressButton2}
              />
            )}
          </View>
        )}
      </View>
      {enableBottomButton && (
        <View style={commonStyles.footerContainer}>
          <FooterButtons
            onPressNext={onPressButton1}
            nextButtonTitle={buttonText1}
            nextTextStyle={buttonText1Style}
            hiddenNextButton={!buttonText1}
            onPressCancel={onPressButton2}
            cancelButtonTitle={buttonText2}
            hiddenCancelButton={!buttonText2}
            cancelTextStyle={[buttonText2Style, {color: COLORS.PRIMARY_A100}]}
            cancelButtonStyle={[styles.button2Style, button2Style]}
          />
        </View>
      )}
    </BaseScreen>
  );
};

export default BaseSuccessScreen;
