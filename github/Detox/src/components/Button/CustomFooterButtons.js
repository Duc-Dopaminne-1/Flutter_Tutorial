import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from './CustomButton';

const styles = StyleSheet.create({
  buttonCancel: {
    paddingVertical: 13,
    ...HELPERS.fillCenter,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: 48,
  },
  buttonNext: {
    ...HELPERS.fillRow,
    borderRadius: SIZES.BORDER_RADIUS_8,
    paddingVertical: 13,
    backgroundColor: COLORS.PRIMARY_A100,
    height: 48,
  },
  buttonCancelTitle: {
    ...commonStyles.txtFontSize16,
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
  nextButtonFullView: {
    ...HELPERS.fillCenter,
    backgroundColor: COLORS.TRANSPARENT,
  },
  nextButtonLeftView: {
    flex: 3,
    ...HELPERS.center,
    backgroundColor: COLORS.TRANSPARENT,
  },
  nextButtonRightView: {
    flex: 1,
    maxWidth: 50,
    ...HELPERS.center,
  },
  opacityView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    opacity: 0.2,
  },
  nextButtonLeftText: {
    ...commonStyles.txtFontSize16,
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
  },
  nextButtonRightText: {
    ...commonStyles.txtFontSize12,
    ...FONTS.regular,
    color: COLORS.NEUTRAL_WHITE,
  },
  titleCancelButtonOnDisableButtonNext: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.bold,
  },
});

const CancelButton = ({onPressButton, title, style, titleStyle}) => {
  const handleOnPressButton = () => {
    onPressButton();
  };
  return (
    <CustomButton
      style={{...styles.buttonCancel, ...style}}
      title={title}
      titleStyle={[styles.buttonCancelTitle, titleStyle]}
      onPress={handleOnPressButton}
    />
  );
};

const NextButton = ({style = {}, disabled = false, onPressButton, titleStyle, title, subTitle}) => {
  const handleOnPressButton = () => {
    onPressButton();
  };

  const ContentNextView = () => {
    if (subTitle) {
      return (
        <View style={HELPERS.fillRow}>
          <View style={styles.nextButtonLeftView}>
            <Text style={[styles.nextButtonLeftText, titleStyle]}>{title}</Text>
          </View>
          <View style={styles.nextButtonRightView}>
            <View style={styles.opacityView} />
            <Text style={styles.nextButtonRightText}>{subTitle}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.nextButtonFullView}>
          <Text style={[styles.nextButtonLeftText, titleStyle]}>{title}</Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.buttonNext, style]}
      onPress={handleOnPressButton}>
      <ContentNextView />
    </TouchableOpacity>
  );
};

const CustomFooterButtons = ({
  nextButtonStyle = {},
  cancelButtonStyle = {},
  containerStyle = {},
  cancelTextStyle = {},
  nextTextStyle = {},
  disabledNext = false,
  hideNextButton = false,
  hideCancelButton = false,
  onPressCancel = () => {},
  onPressNext = () => {},
  nextButtonTitle = translate(STRINGS.NEXT),
  nextButtonSubTitle,
  cancelButtonTitle = translate(STRINGS.DISCARD),
}) => {
  const styleTitleCancel = hideNextButton ? styles.titleCancelButtonOnDisableButtonNext : {};
  return (
    <View style={[HELPERS.fillRow, containerStyle]}>
      {!hideCancelButton && (
        <CancelButton
          titleStyle={[styleTitleCancel, cancelTextStyle]}
          style={cancelButtonStyle}
          onPressButton={onPressCancel}
          title={cancelButtonTitle}
        />
      )}
      {hideCancelButton || hideNextButton || <View style={commonStyles.separatorColumn16} />}
      {!hideNextButton && (
        <NextButton
          style={nextButtonStyle}
          disabled={disabledNext}
          onPressButton={onPressNext}
          title={nextButtonTitle}
          subTitle={nextButtonSubTitle}
          titleStyle={nextTextStyle}
        />
      )}
    </View>
  );
};

export default CustomFooterButtons;
