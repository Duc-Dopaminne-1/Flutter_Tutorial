import React, {useState} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import CountryPicker, {DEFAULT_THEME} from 'react-native-country-picker-modal';

import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import InputSection from './InputSection';

const styles = StyleSheet.create({
  phoneCodePickerContainer: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDropdownArrow: {
    width: 12,
    height: 8,
    marginHorizontal: 6,
  },
  columnSeparator: {
    height: '75%',
    width: 1,
    backgroundColor: COLORS.GREY_E4,
  },
});

const initialCountryCode = 'VN';

const phoneCodePicker = ({onSelect, phoneCodePicked, editable}) => {
  return (
    <View style={styles.phoneCodePickerContainer} pointerEvents={editable ? 'auto' : 'none'}>
      <CountryPicker
        withCallingCode
        withCallingCodeButton
        withAlphaFilter
        withFlagButton
        countryCode={phoneCodePicked}
        theme={{
          ...DEFAULT_THEME,
          fontFamily: Platform.select({
            ios: FONTS.regular.fontFamily,
            android: FONTS.regular.fontFamily,
          }),
          fontSize: 14,
          color: COLORS.BLACK_33,
        }}
        onSelect={onSelect}
        isVisible
      />
      <Image
        source={IMAGES.IC_DROPDOWN_ARROW}
        style={styles.iconDropdownArrow}
        resizeMode="contain"
      />
      <View style={styles.columnSeparator} />
    </View>
  );
};

const PhoneInputSection = ({
  headerTitle,
  headerStyles,
  customStyle,
  inputStyle,
  value,
  keyboardType,
  isRequired,
  editable,
  error,
  onChangeText,
  inputContainerStyle,
  placeholder,
  onChangePhoneCode,
}) => {
  const [country, setCountry] = useState(initialCountryCode);
  const onSelect = selectedCountry => {
    setCountry(selectedCountry.cca2);
    onChangePhoneCode(selectedCountry.callingCode);
  };
  const phoneCodePickerView = phoneCodePicker({phoneCodePicked: country, onSelect, editable});
  return (
    <>
      <InputSection
        headerTitle={headerTitle}
        headerStyles={headerStyles}
        customStyle={customStyle}
        placeholder={placeholder}
        inputContainerStyle={inputContainerStyle}
        inputStyle={inputStyle}
        value={value}
        keyboardType={keyboardType}
        isRequired={isRequired}
        editable={editable}
        error={error}
        onChangeText={onChangeText}
        customLeftComponent={phoneCodePickerView}
      />
    </>
  );
};

export default PhoneInputSection;
