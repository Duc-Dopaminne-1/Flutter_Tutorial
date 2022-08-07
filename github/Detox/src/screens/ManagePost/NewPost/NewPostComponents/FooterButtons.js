import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {small, smallNormal} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import CustomIconButton from '../../../../components/CustomIconButton';

const styles = StyleSheet.create({
  fullWidthButton: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: small,
  },
  buttonCancelTitle: {
    ...commonStyles.txtFontSize16,
    ...FONTS.bold,
    color: COLORS.BLACK_33,
  },
  buttonNextTitle: {
    ...commonStyles.txtFontSize16,
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
  },
  buttonCancel: {
    backgroundColor: COLORS.GREY_ED,
  },
  buttonPreview: {
    ...commonStyles.buttonNext,
    ...HELPERS.center,
    width: 45,
    height: 45,
    borderRadius: SIZES.BORDER_RADIUS_8,
    marginRight: smallNormal,
    backgroundColor: COLORS.TEXT_GRAY_50,
  },
  buttonIcon: {
    backgroundColor: COLORS.TEXT_GRAY_50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  previewIcon: {
    tintColor: COLORS.PRIMARY_A100,
  },
  disableIcon: {
    opacity: 0.2,
  },
});

const FooterButtons = ({
  style = {},
  cancelButtonStyle = {},
  containerStyle = {},
  cancelTextStyle = {},
  nextTextStyle = {},
  disabledNext = false,
  disabledCancel = false,
  hiddenNextButton = false,
  hiddenCancelButton = false,
  onPressCancel = () => {},
  onPressNext = () => {},
  nextButtonTitle = translate(STRINGS.NEXT),
  cancelButtonTitle = translate(STRINGS.CANCEL),
  isShowPreview,
  showContactButtons,
  disableContact,
  disabledPreview,
  onPressPreview = () => {},
  onPressMessage,
  onPressCall,
}) => {
  return (
    <View style={[HELPERS.fillRow, containerStyle]}>
      {isShowPreview && (
        <CustomIconButton
          style={styles.buttonPreview}
          customImageSize={20}
          iconColor={disabledPreview ? COLORS.GRAY_A3 : COLORS.BLACK_31}
          image={IMAGES.EYE_FILL}
          imageStyle={[styles.previewIcon, disabledPreview && styles.disableIcon]}
          onPress={onPressPreview}
          disabled={disabledPreview}
        />
      )}
      {showContactButtons && (
        <>
          <CustomButton
            disabled={disableContact}
            style={[styles.buttonIcon, cancelButtonStyle]}
            iconLeftSource={IMAGES.MESSAGE_FILL}
            onPress={onPressMessage}
          />
          <View style={commonStyles.separatorColumn8} />
          <CustomButton
            disabled={disabledCancel}
            style={[styles.buttonIcon, cancelButtonStyle]}
            iconLeftSource={IMAGES.CALL_FILL}
            onPress={onPressCall}
          />
        </>
      )}
      {!hiddenCancelButton && (
        <CustomButton
          disabled={disabledCancel}
          style={[
            commonStyles.buttonNext,
            styles.fullWidthButton,
            styles.buttonCancel,
            cancelButtonStyle,
          ]}
          title={cancelButtonTitle}
          titleStyle={[styles.buttonCancelTitle, cancelTextStyle]}
          onPress={onPressCancel}
        />
      )}
      {!hiddenNextButton && (
        <>
          <View style={[commonStyles.separatorColumn12]} />
          <CustomButton
            style={[commonStyles.buttonNext, styles.fullWidthButton, style]}
            disabled={disabledNext}
            onPress={onPressNext}
            title={nextButtonTitle}
            titleStyle={[styles.buttonNextTitle, nextTextStyle]}
          />
        </>
      )}
    </View>
  );
};

export default FooterButtons;
