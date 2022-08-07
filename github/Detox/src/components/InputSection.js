import PropsTypes from 'prop-types';
import React, {useState} from 'react';
import {Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

import {CONSTANTS, MAX_LENGTH} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, small} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import NumberUtils from '../utils/NumberUtils';
import {getColorStyleTextEditable} from '../utils/UiUtils';
import InputMultiLineView from './InputMultiLineView';
import RequiredStar from './RequiredStar';

const styles = StyleSheet.create({
  titleHeader: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_10,
  },
  titleDescription: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_40,
  },
  errorText: {
    color: COLORS.STATE_ERROR,
    fontSize: 12,
    ...FONTS.regular,
  },
  inputWithComponent: {
    backgroundColor: COLORS.TRANSPARENT,
    ...FONTS.regular,
    flex: 1,
  },
  inputContainerAndroid: {
    paddingVertical: 0,
  },
  limitedLengthText: {
    ...HELPERS.fill,
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.GRAY_A3,
    textAlign: 'right',
  },
});
const InputSection = ({
  headerTitle,
  headerStyles,
  headerContainerStyle,
  headerRightComponent = null,
  titleDescription,
  titleDescriptionStyle,
  placeholder,
  placeHolderColor,
  onChangeText,
  keyboardType,
  value,
  editable,
  customStyle,
  error,
  inputStyle,
  isRequired,
  maxLength,
  checkOnlyNumber,
  inputContainerStyle,
  customRightComponent,
  showMultilineInputView = false,
  customLeftComponent,
  type = false,
  options,
  isInputIntPrice = false,
  isInputFloatPrice = false,
  formatValue = null,
  showLimitedLength = false,
  textValidation = text => true,
  inputRef,
  name = '',
  ...textInputProps
}) => {
  const textValue = formatValue !== null ? formatValue(value) : value;
  const textColorStyle = getColorStyleTextEditable(editable);
  const disableStyle = !editable ? {backgroundColor: COLORS.GREY_ED} : {};

  const onChangeTextLocal = oldText => {
    const validText = textValidation(oldText);

    if (!validText) {
      return;
    }

    switch (true) {
      case isInputFloatPrice:
        let text = NumberUtils.removeAllComma(oldText);
        if (NumberUtils.isValidFloatNumber(text)) {
          onChangeText(text, name);
        }
        break;
      case isInputIntPrice:
        text = NumberUtils.removeAllComma(oldText);
        if (NumberUtils.isValidIntNumber(text)) {
          onChangeText(text, name);
        }
        break;
      case checkOnlyNumber:
        text = oldText.replace(',', '.');
        if (!isNaN(text)) {
          onChangeText(text, name);
        }
        break;
      default:
        onChangeText(oldText, name);
        break;
    }
  };

  const renderTextInputView = () => {
    if (customRightComponent || customLeftComponent) {
      return (
        <View
          style={[
            commonStyles.borderedInput,
            disableStyle,
            inputContainerStyle,
            textColorStyle,
            Platform.OS === 'android' ? styles.inputContainerAndroid : {},
            HELPERS.rowCenter,
          ]}>
          {customLeftComponent}
          <TextInput
            ref={inputRef}
            placeholderTextColor={placeHolderColor}
            placeholder={placeholder}
            style={[styles.inputWithComponent, disableStyle, textColorStyle, inputStyle]}
            onChangeText={onChangeTextLocal}
            keyboardType={keyboardType}
            returnKeyType="done"
            value={textValue}
            editable={editable}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={maxLength}
            {...textInputProps}
          />
          {customRightComponent}
        </View>
      );
    }
    if (showMultilineInputView) {
      return (
        <InputMultiLineView
          placeholderTextColor={placeHolderColor}
          placeholder={placeholder}
          style={[commonStyles.borderedInput, disableStyle, textColorStyle, inputStyle]}
          onChangeText={onChangeTextLocal}
          keyboardType={keyboardType}
          value={textValue}
          editable={editable}
          autoCorrect={false}
          autoCapitalize="none"
          maxLength={maxLength}
          {...textInputProps}
        />
      );
    }
    if (type) {
      return (
        <TextInputMask
          type={type}
          options={options}
          value={textValue}
          maxLength={maxLength}
          editable={editable}
          keyboardType={keyboardType}
          returnKeyType="done"
          onChangeText={onChangeTextLocal}
          placeholder={placeholder}
          style={[commonStyles.borderedInput, disableStyle, textColorStyle, inputStyle]}
          {...textInputProps}
        />
      );
    }
    return (
      <TextInput
        ref={inputRef}
        placeholderTextColor={placeHolderColor}
        placeholder={placeholder}
        style={[commonStyles.borderedInput, disableStyle, textColorStyle, inputStyle]}
        onChangeText={onChangeTextLocal}
        keyboardType={keyboardType}
        returnKeyType="done"
        value={textValue}
        editable={editable}
        autoCorrect={false}
        autoCapitalize="none"
        maxLength={maxLength}
        {...textInputProps}
      />
    );
  };

  return (
    <View style={[METRICS.smallVerticalPadding, customStyle]}>
      <View style={[HELPERS.rowSpaceBetweenCenter, headerContainerStyle]}>
        {!!headerTitle && (
          <Text style={[styles.titleHeader, headerStyles]}>
            {headerTitle} {isRequired && <RequiredStar />}
          </Text>
        )}
        {maxLength && showLimitedLength && (
          <Text style={styles.limitedLengthText}>{`${textValue?.length ?? '0'}/${maxLength}`}</Text>
        )}
        {headerRightComponent}
      </View>
      {!!titleDescription && (
        <Text style={[styles.titleDescription, titleDescriptionStyle]}>{titleDescription}</Text>
      )}
      {renderTextInputView()}
      {error ? <Text style={styles.errorText}>{translate(error)}</Text> : null}
    </View>
  );
};

InputSection.propTypes = {
  headerTitle: PropsTypes.string,
  placeholder: PropsTypes.string,
  onChangeText: PropsTypes.func,
  keyboardType: PropsTypes.string,
  value: PropsTypes.string,
  editable: PropsTypes.bool,
  error: PropsTypes.string,
  isRequired: PropsTypes.bool,
  maxLength: PropsTypes.number,
  checkOnlyNumber: PropsTypes.bool,
  inputStyle: PropsTypes.object,
};

InputSection.defaultProps = {
  headerTitle: '',
  placeholder: '',
  onChangeText: () => {},
  keyboardType: 'default',
  value: '',
  editable: true,
  error: '',
  isRequired: false,
  maxLength: MAX_LENGTH.default,
  checkOnlyNumber: false,
  inputStyle: null,
};

export const PasswordInputSection = props => {
  const [isShow, setIsShow] = useState(false);

  const onPress = () => {
    setIsShow(!isShow);
  };

  return (
    <InputSection
      {...props}
      secureTextEntry={!isShow}
      customRightComponent={
        <TouchableOpacity
          style={{marginLeft: small}}
          onPress={onPress}
          hitSlop={CONSTANTS.HIT_SLOP}>
          <Image source={isShow ? IMAGES.IC_EYE_SLASH : IMAGES.IC_EYE} />
        </TouchableOpacity>
      }
    />
  );
};
export default InputSection;
