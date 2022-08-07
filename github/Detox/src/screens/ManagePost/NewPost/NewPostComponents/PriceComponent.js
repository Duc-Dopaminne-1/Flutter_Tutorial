import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {CONSTANTS, KEY_BOARD_TYPE} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import InputSection from '../../../../components/InputSection';
import MeasureUtils from '../../../../utils/MeasureUtils';
import NumberUtils from '../../../../utils/NumberUtils';

export const INPUT_ACCESSORY_VIEW_ID = 'PRICE_INPUT';

const PriceComponent = ({
  style,
  title,
  value,
  placeholder = '0',
  error,
  unitText,
  negotiable,
  onCheckNegotiatePrice,
  onChangePrice = () => {},
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const onFocus = () => {
    setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
  };

  return (
    <View style={style}>
      <InputSection
        customStyle={METRICS.resetMargin}
        headerTitle={title}
        placeholder={placeholder}
        placeHolderColor={COLORS.TEXT_DARK_40}
        headerStyles={commonStyles.blackTextBold16}
        inputContainerStyle={styles.inputContainer(isFocus)}
        inputStyle={styles.input}
        value={`${value}`}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        error={error}
        isRequired
        editable
        onChangeText={onChangePrice}
        customRightComponent={
          <View style={styles.inputRightContainer}>
            <Text style={styles.txtInput}>{unitText}</Text>
          </View>
        }
        headerRightComponent={
          <CustomCheckbox
            style={styles.rowCheckBox}
            images={['checkbox', 'checkbox-blank-outline']}
            customCheckedBox
            iconCheckedColor={COLORS.PRIMARY_A100}
            iconColor={COLORS.GRAY_C9}
            textStyle={commonStyles.blackText16}
            parentCheckedValue={negotiable}
            checkValue={isChecked => onCheckNegotiatePrice(isChecked)}
            title={translate('newPost.canBeNegotiate')}
          />
        }
        onFocus={onFocus}
        onBlur={onBlur}
        isInputIntPrice
        textValidation={MeasureUtils.isValidPriceValue}
        formatValue={NumberUtils.formatNumberToCurrencyNumber}
        inputAccessoryViewID={INPUT_ACCESSORY_VIEW_ID}
      />
      <Text style={commonStyles.blackText14}>{NumberUtils.mapNumberToWord(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: SIZES.FONT_16,
    width: '80%',
    height: '100%',
  },
  inputContainer: isFocused => ({
    ...commonStyles.inputBorderWithIcon,
    ...(isFocused && {borderColor: COLORS.PRIMARY_A100}),
  }),
  txtInput: {
    ...commonStyles.txtFontSize14,
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
  rowCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CONSTANTS.ITEM_HEIGHT,
  },
});

export default PriceComponent;
