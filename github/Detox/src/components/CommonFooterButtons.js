import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {commonStyles} from '../assets/theme/styles';
import CustomButton from './CustomButton';

const styles = StyleSheet.create({
  footerButton: {
    width: '100%',
    height: 45,
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
  },
  footerButtonSave: {
    ...FONTS.bold,
    ...commonStyles.txtFontSize14,
  },
  footerButtonCancel: {
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
  },
  footerButtonCancelTitle: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.bold,
    ...FONTS.fontSize14,
  },
});

export const ConfirmButton = ({
  onPressButton,
  customStyle,
  disabled,
  title = translate(STRINGS.SAVE),
}) => {
  return (
    <CustomButton
      style={[styles.footerButton, customStyle]}
      title={title}
      titleStyle={styles.footerButtonSave}
      onPress={onPressButton}
      disabled={disabled}
    />
  );
};

export const CancelButton = ({
  onPressButton,
  customStyle,
  title = translate(STRINGS.DISCARD),
  titleStyle,
}) => {
  return (
    <CustomButton
      style={[styles.footerButton, styles.footerButtonCancel, customStyle]}
      title={title}
      onPress={onPressButton}
      titleStyle={[styles.footerButtonCancelTitle, titleStyle]}
    />
  );
};

export const CommonButtonsFooter = ({
  onPressButtonSave = () => {},
  onPressButtonDiscard = () => {},
  confirmTitle,
  cancelTitle,
  confirmButtonCustomStyle,
  cancelButtonCustomStyle,
  disableConfirm,
  cancelTitleStyle,
}) => {
  const handleOnPressConfirm = () => {
    onPressButtonSave();
  };
  const handleOnPressCancel = () => {
    onPressButtonDiscard();
  };
  return (
    <>
      <ConfirmButton
        onPressButton={handleOnPressConfirm}
        customStyle={confirmButtonCustomStyle}
        disabled={disableConfirm}
        title={confirmTitle}
      />
      <View style={commonStyles.separatorRow16} />
      <CancelButton
        onPressButton={handleOnPressCancel}
        customStyle={cancelButtonCustomStyle}
        title={cancelTitle}
        titleStyle={cancelTitleStyle}
      />
      <View style={commonStyles.separatorRow16} />
    </>
  );
};
