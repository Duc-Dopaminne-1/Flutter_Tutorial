import React, { useState, useRef, useEffect } from 'react';
import styles from './styles';
import { View } from 'react-native';
import { CustomText } from '../CustomText';
import PhoneInput from 'react-native-phone-input';
import PhoneNumber from '../../../node_modules/react-native-phone-input/lib/phoneNumber';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import CustomInput from '../CustomInput';
import { CustomTouchable } from '../CustomTouchable';
import { Config } from '@src/configs/appConfig';
export const CountryCodeList: CountryCode[] = ["AF", "EG", "AL", "DZ", "AD", "AO", "AI", "AG",
  "AR", "AM", "AW", "AU", "AZ", "PL", "BS", "BH", "BD",
  "BB", "BY", "BZ", "BJ", "BM", "BT", "BO", "BA",
  "BW", "BR", "BN", "BG", "BF", "BI", "BE", "PT", "KH",
  "CM", "CA", "CV", "TD", "CL", "CO", "KM", "CG", "CD",
  "CR", "HR", "CU", "CW", "AE", "CI", "DO", "CF", "DJ",
  "DM", "EC", "SV", "ER", "EE", "ET", "FJ", "GA", "GM",
  "GH", "GI", "GL", "GD", "GE", "GP", "GU", "GT", "GG",
  "GF", "GN", "GQ", "GW", "GY", "HT", "US", "HN", "HU",
  "GR", "NL", "KR", "HK", "IS", "ID", "IR", "IQ", "IE",
  "IL", "IT", "JM", "JE", "JO", "KZ", "KE", "KI", "XK",
  "KW", "KG", "LV", "LS", "LB", "LR", "LY", "LI", "LT",
  "LU", "LA", "IO", "MA", "MO", "MK", "MG", "MW", "MY",
  "MV", "ML", "MT", "MQ", "MR", "MU", "YT", "MX", "FM",
  "MD", "MC", "ME", "MS", "MZ", "MM", "MN", "NO", "ZA",
  "SS", "NA", "NR", "NP", "NC", "NZ", "RU", "JP", "NI",
  "NE", "NG", "NU", "OM", "PK", "PW", "PS", "PA", "PG",
  "PY", "PE", "PH", "PR", "FI", "PF", "PR", "QA", "MP",
  "KY", "CC", "CK", "FK", "FO", "MH", "SB", "TC", "VG",
  "VI", "AX", "RO", "RW", "RE", "PM", "WS", "AS", "SM",
  "SN", "RS", "SC", "SL", "SO", "LK", "BL", "SH", "KN",
  "LC", "MF", "VC", "SD", "SR", "SJ", "SZ", "SY", "ST",
  "CZ", "CY", "TJ", "TZ", "VA", "TH", "TR", "CH", "SE",
  "TL", "TG", "TK", "TO", "TT", "KP", "CN", "TN", "TM",
  "TV", "ES", "EH", "UG", "UA", "UY", "UZ", "VU", "VE",
  "VN", "GP", "WF", "YE", "ZM", "ZW", "AT", "DK", "TW",
  "CX", "IM", "NF", "DE", "SA", "IN"];


const CustomPhoneInput = ({
                            description,
                            value,
                            countryCodeValue,
                            inputRef,
                            moreStyle,
                            onChangePhoneNumber,
                            onFocus,
                            onBlur
                          }: any) => {
  const [countryPhoneCode, setCountryPhoneCode] = useState<string>(countryCodeValue ? countryCodeValue : Config.Manager.phoneCodeDefault);

  const initialCountry = value ? PhoneNumber.getCountryCodeOfNumber(countryPhoneCode + value) : Config.Manager.countryCodeDefault;


  const [isVisiblePicker, setVisiblePicker] = useState<boolean>(false);
  const phoneRef = useRef(null);
  const [phoneInput, setPhoneInput] = useState<string>('');

  const onSelect = (country: Country) => {
    console.log('**** 4444', country);
    onChangePhoneNumber(phoneInput, (country.callingCode[0] ? `+${country.callingCode[0]}` : "") + phoneInput, (country.callingCode[0] ? `+${country.callingCode[0]}` : ""));
    setCountryPhoneCode(country.callingCode[0] ? `+${country.callingCode[0]}` : "");
    phoneRef.current.selectCountry(country.cca2.toLowerCase());
  };

  useEffect(() => {
    setPhoneInput(value ? value : '');
  }, []);

  return (
    <View style={styles.containers}>
      {description ? <CustomText style={styles.description} text={description} /> : null}
      <View style={[styles.formBar, moreStyle]}>
        <CountryPicker
          countryCode={'US'}
          withFilter={true}
          withAlphaFilter={true}
          withCallingCode={true}
          onSelect={onSelect}
          onClose={() => {
            setVisiblePicker(false);
          }}
          visible={isVisiblePicker}
          withFlagButton={false}
          countryCodes={CountryCodeList}
        />
        <CustomTouchable
          onPress={() => {
            setVisiblePicker(true);
          }}
          style={styles.phoneView}>
          <PhoneInput
            ref={phoneRef}
            initialCountry={initialCountry}
            textStyle={styles.textStyle}
            allowZeroAfterCountryCode={false}
            disabled
            style={styles.flag}
          />
          <CustomText
            text={countryPhoneCode}
            style={styles.textStyle}
            styleContainer={styles.callingCode} />
        </CustomTouchable>
        <View>
          <CustomInput
            inputRef={inputRef}
            onChangeText={(text: string) => {
              setPhoneInput(text);
              onChangePhoneNumber(text, countryPhoneCode + text, countryPhoneCode);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType={'number-pad'}
            textStyle={styles.textStyle}
            value={value}
            mask={false}
            containerStyle={{ paddingHorizontal: 5 }}
            moreStyle={styles.fakeInput}
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(CustomPhoneInput);
