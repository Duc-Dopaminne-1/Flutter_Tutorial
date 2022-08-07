import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {METRICS} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from '../Button/CustomButton';

const styles = StyleSheet.create({
  fullWidthButton: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGray: {
    backgroundColor: COLORS.GRAY_ED,
  },
  blackText: {color: COLORS.BLACK_31, ...FONTS.bold, ...FONTS.fontSize14},
  buttonOrange: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
    ...METRICS.marginBottom,
  },
  whiteText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.NEUTRAL_WHITE,
  },
});

const CustomBottomButton = ({
  containerStyle,
  onPressLeftButton,
  onPressRightButton,
  leftTitle = translate(STRINGS.CANCEL),
  leftTextStyle,
  rightTitle = translate(STRINGS.AGREE),
  rightTextStyle,
  showButtonRight = true,
  hideShadow,
  leftButtonStyle,
  rightButtonStyle,
}) => {
  const shadowStyle = hideShadow ? null : {...commonStyles.footerContainer, ...styles.borderTop};
  return (
    <View style={[shadowStyle, containerStyle]}>
      <CustomButton
        style={[
          commonStyles.buttonNext,
          styles.fullWidthButton,
          leftButtonStyle,
          showButtonRight ? styles.buttonGray : styles.buttonOrange,
        ]}
        titleStyle={[showButtonRight ? styles.blackText : styles.whiteText, leftTextStyle]}
        title={leftTitle}
        onPress={onPressLeftButton}
      />
      {showButtonRight && (
        <>
          <View style={commonStyles.separatorColumn12} />
          <CustomButton
            style={[
              commonStyles.buttonNext,
              styles.fullWidthButton,
              styles.buttonOrange,
              rightButtonStyle,
            ]}
            onPress={onPressRightButton}
            title={rightTitle}
            titleStyle={[styles.whiteText, rightTextStyle]}
          />
        </>
      )}
    </View>
  );
};

export default CustomBottomButton;
