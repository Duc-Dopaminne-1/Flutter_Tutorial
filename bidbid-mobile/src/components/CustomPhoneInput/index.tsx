import React, { useState } from 'react';
import { View } from 'react-native';
import CountryPicker, { CountryCode, Country, CountryCodeList } from 'react-native-country-picker-modal';
import { colors } from '@/vars';
import { TextInputComponent } from '@/components/TextInput';
import { isIOS } from '@/shared/devices';
import { CustomText } from '../CustomText';
import styles from './styles';
import { language } from '@/i18n';
import { CCA2, PHONE_CODE } from '@/constants/app';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import ArrowDownSVG from '@/components/SVG/ArrowDownSVG';

const translationMap = {
  en: 'common',
  es: 'spa',
};

const CustomPhoneInput = ({ handleSubmit, setFieldValue, errors, values, setFieldError, isFocusInput }: any) => {
  const [countryPhoneCode, setCountryPhoneCode] = useState(PHONE_CODE);
  const textError = errors ? { color: colors.red_700 } : {};
  const lineError = errors ? { borderBottomColor: colors.red_700 } : {};
  const [isVisiblePicker, setVisiblePicker] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<CountryCode>(CCA2);
  const locale = useSelector((state: RootState) => state.app.locale);

  const onChangeText = (text: string) => {
    setFieldValue('phone', text);
    setFieldValue('phoneMain', `${values.phoneCode} ${text}`);
    if (errors?.phone) {
      setFieldError('phone', '');
    }
  };

  const onSelect = (country: Country) => {
    const countryCode = country.callingCode[0] ? `+${country.callingCode[0]}` : '';
    setCountryPhoneCode(countryCode);
    setCountryCode(country.cca2);
    setFieldValue('cca2', country.cca2);
    setFieldValue('phoneCode', countryCode);
    setFieldValue('phoneMain', `${countryCode} ${values.phone}`);
  };

  const onClosePicker = () => {
    setVisiblePicker(false);
  };

  const openPicker = () => {
    setVisiblePicker(true);
  };

  const onFocus = () => {
    setFieldError('phone', '');
  };

  return (
    <View style={styles.containers}>
      <View>
        <CountryPicker
          countryCode={countryCode}
          withFlagButton={false}
          onSelect={onSelect}
          onClose={onClosePicker}
          visible={isVisiblePicker}
          countryCodes={CountryCodeList as any}
          withFilter
          withEmoji
          withAlphaFilter
          withCallingCode
          withFlag
          translation={translationMap[locale]}
          filterProps={{
            placeholder: language('enterCountryName'),
          }}
        />

        <CustomText
          onPress={openPicker}
          title={countryCode}
          titleStyle={[styles.textStyle, textError]}
          contentStyle={[styles.textStyle, textError]}
          content={` ${countryPhoneCode}  `}
          containerStyle={[styles.callingCode, styles.wrapCode, lineError]}
          imageSecond={<ArrowDownSVG />}
        />
      </View>

      <View style={styles.wrapPhone}>
        <TextInputComponent
          onChangeText={onChangeText}
          // value={phone}
          styleConfig={textError}
          autoCompleteType="tel"
          autoFocus={isFocusInput}
          placeholder={language('phoneNumber')}
          textContentType={'telephoneNumber'}
          onFocus={onFocus}
          mask={'[000]-[000]-[0000000]'}
          keyboardType={isIOS ? 'number-pad' : 'numeric'}
          styleFormConfig={lineError}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          placeholderTextColor={colors.gray_500}
        />
      </View>
    </View>
  );
};

export default React.memo(CustomPhoneInput);
