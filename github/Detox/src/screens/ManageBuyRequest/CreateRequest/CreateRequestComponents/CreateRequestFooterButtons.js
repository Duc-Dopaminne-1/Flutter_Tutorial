import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';

const styles = StyleSheet.create({
  buttonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...HELPERS.center,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 5,
    borderColor: COLORS.PRIMARY_A100,
    ...METRICS.marginRight,
  },
  buttonNext: {
    ...HELPERS.fillRow,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  buttonCancelTitle: {
    ...commonStyles.txtFontSize14,
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
  nextButtonLeftView: {
    flex: 3 / 4,
    ...HELPERS.center,
    backgroundColor: COLORS.TRANSPARENT,
  },
  nextButtonRightView: {
    flex: 1 / 4,
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
    ...commonStyles.txtFontSize14,
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
  },
  nextButtonRightText: {
    ...commonStyles.txtFontSize12,
    ...FONTS.regular,
    color: COLORS.NEUTRAL_WHITE,
  },
});
const CancelButton = ({onPressButton, title}) => {
  const handleOnPressButton = () => {
    onPressButton();
  };
  return (
    <CustomButton
      style={styles.buttonCancel}
      title={title}
      titleStyle={styles.buttonCancelTitle}
      onPress={handleOnPressButton}
    />
  );
};
const NextButton = ({onPressButton, title, subTitle}) => {
  const handleOnPressButton = () => {
    onPressButton();
  };
  return (
    <TouchableOpacity style={styles.buttonNext} onPress={handleOnPressButton}>
      <View style={styles.nextButtonLeftView}>
        <Text style={styles.nextButtonLeftText}>{title}</Text>
      </View>
      <View style={styles.nextButtonRightView}>
        <View style={styles.opacityView} />
        <Text style={styles.nextButtonRightText}>{subTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CreateRequestFooterButtons = ({
  onPressCancel = () => {},
  onPressNext = () => {},
  nextButtonTitle = translate(STRINGS.NEXT),
  nextButtonSubTitle = '1/2',
  cancelButtonTitle = translate(STRINGS.DISCARD),
}) => {
  return (
    <>
      <CancelButton onPressButton={onPressCancel} title={cancelButtonTitle} />
      <NextButton
        onPressButton={onPressNext}
        title={nextButtonTitle}
        subTitle={nextButtonSubTitle}
      />
    </>
  );
};

export default CreateRequestFooterButtons;
