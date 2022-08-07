import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {CONSTANTS, FLOAT_NUMBER_REGEX, KEY_BOARD_TYPE} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import InputSection from '../../../../components/InputSection';
import NumberUtils from '../../../../utils/NumberUtils';

const getPriceUnit = price => {
  switch (true) {
    case price > 0 && price < CONSTANTS.MILLION:
      return CONSTANTS.CURRENCY_UNIT.vnd;
    case price >= CONSTANTS.MILLION && price < CONSTANTS.BILLION:
      return CONSTANTS.CURRENCY_UNIT.million;
    case price >= CONSTANTS.BILLION:
      return CONSTANTS.CURRENCY_UNIT.billion;
    default:
      return CONSTANTS.CURRENCY_UNIT.vnd;
  }
};

const getPriceByUnit = (price, unit) => {
  let pricePerUnit, isDecimal;
  switch (unit) {
    case CONSTANTS.CURRENCY_UNIT.vnd:
      return NumberUtils.formatNumberToCurrencyNumber(price, 0);
    case CONSTANTS.CURRENCY_UNIT.million:
      pricePerUnit = price / CONSTANTS.MILLION;
      isDecimal = pricePerUnit.toFixed(3) % 1 > 0;
      return isDecimal ? pricePerUnit.toFixed(3) : pricePerUnit.toFixed(0);
    case CONSTANTS.CURRENCY_UNIT.billion:
      pricePerUnit = price / CONSTANTS.BILLION;
      isDecimal = pricePerUnit.toFixed(3) % 1 > 0;
      return isDecimal ? pricePerUnit.toFixed(3) : pricePerUnit.toFixed(0);
    default:
      return price;
  }
};

const PricePerSquareInput = ({price, squareLength}) => {
  const pricePerSquare = FLOAT_NUMBER_REGEX.test(price / squareLength) ? price / squareLength : 0;
  const unit = getPriceUnit(pricePerSquare);
  const formattedPrice = getPriceByUnit(pricePerSquare, unit);

  return (
    <InputSection
      customStyle={{...METRICS.resetMargin}}
      headerTitle={translate('common.unitPrice')}
      placeholder={translate('common.unitPrice')}
      placeHolderColor={COLORS.TEXT_DARK_40}
      headerStyles={commonStyles.blackTextBold16}
      inputContainerStyle={commonStyles.inputBorderWithIcon}
      inputStyle={styles.inputWithRightComponent}
      value={`${formattedPrice ?? ''}`}
      keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
      editable={false}
      customRightComponent={
        <View style={styles.inputRightContainer}>
          <Text style={styles.txtInput}>{`${unit} / m²`}</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  inputWithRightComponent: {
    width: '80%',
    height: '100%',
    fontSize: SIZES.FONT_16,
  },
  txtInput: {
    ...commonStyles.txtFontSize16,
    ...FONTS.regular,
    color: COLORS.BLACK_33,
  },
  inputRightContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

export default PricePerSquareInput;
