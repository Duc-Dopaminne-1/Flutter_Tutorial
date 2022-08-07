import { View, Keyboard } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import CustomInput from '@src/components/CustomInput';
import { Formik } from 'formik';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomButton } from '@src/components/CustomButton';
import { CustomText } from '@src/components/CustomText';
import { phoneValidation } from '@src/utils/validation';
import { SHIPPING_TYPE } from '@src/constants/screenKeys';
import { OrderPopup } from '@src/components/Popup/OrderPopup';
import { REGEX_POSTAL_CODE_CAD } from '@src/constants/vars';
import PhoneInput, { PickerData } from 'react-native-phone-input';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CountryCodePopup } from '@src/components/Popup/CountryCodePopup';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, getCountries, saveBillingAddress } from '@src/modules/payment/actions';
import { ICountry } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { RootState } from '@src/types/types';
import { CountriesPopup } from '@src/components/Popup/CountriesPopup';

const ShippingDetails = () => {
  const dispatch = useDispatch();

  let setFieldValueFormik: any;

  const popupRef: any = useRef(null);
  const lastNameRef: any = useRef(null);
  const addressRef: any = useRef(null);
  const cityRef: any = useRef(null);
  const postalCodeRef: any = useRef(null);
  const phoneRef: any = useRef(null);
  const countryCodeRef: any = useRef(null);

  const [pickerData, setPickerData] = useState<PickerData[]>();
  const [showCountriesPicker, setShowCountriesPicker] = useState<boolean>(false);
  const [countryUrl, setCountryUrl] = useState<string>();
  const [showPhonePicker, setShowPhonePicker] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [countryCodeValue, setCountryCodeValue] = useState<string>('US');

  const countries = useSelector<RootState, ICountry[]>((state: RootState) => state.payment.countries);

  useEffect(() => {
    countryCodeRef.current && setPickerData(countryCodeRef.current.getPickerData());
    dispatch(getCountries({}));
  }, []);

  const validateSchema = object().shape({
    first_name: string()
      .trim()
      .required(`${translate('error_validate_field.first_name')} ${translate('error_validate_field.input_is_require')}!`)
      .min(2, `${translate('error_validate_field.first_name')} ${translate('error_validate_field.input_too_short')}!`)
      .max(36, `${translate('error_validate_field.first_name')} ${translate('error_validate_field.input_too_long')}!`),
    last_name: string()
      .trim()
      .required(`${translate('error_validate_field.last_name')} ${translate('error_validate_field.input_is_require')}!`)
      .min(2, `${translate('error_validate_field.last_name')} ${translate('error_validate_field.input_too_short')}!`)
      .max(36, `${translate('error_validate_field.last_name')} ${translate('error_validate_field.input_too_long')}!`),
    address: string()
      .trim()
      .required(`${translate('error_validate_field.address')} ${translate('error_validate_field.input_is_require')}!`)
      .min(2, `${translate('error_validate_field.address')} ${translate('error_validate_field.input_too_short')}!`)
      .max(36, `${translate('error_validate_field.address')} ${translate('error_validate_field.input_too_long')}!`),
    city: string()
      .trim()
      .required(`${translate('error_validate_field.city')} ${translate('error_validate_field.input_is_require')}!`)
      .min(2, `${translate('error_validate_field.city')} ${translate('error_validate_field.input_too_short')}!`)
      .max(36, `${translate('error_validate_field.city')} ${translate('error_validate_field.input_too_long')}!`),
    country: string()
      .trim()
      .required(`${translate('error_validate_field.country')} ${translate('error_validate_field.input_is_require')}!`),
    region: string()
      .trim()
      .required(`${translate('error_validate_field.user_name')} ${translate('error_validate_field.input_is_require')}!`)
      .min(2, `${translate('error_validate_field.user_name')} ${translate('error_validate_field.input_too_short')}!`)
      .max(36, `${translate('error_validate_field.last_name')} ${translate('error_validate_field.input_too_long')}!`),
    postal_code: string()
      .trim()
      .required(`${translate('error_validate_field.postal_code')} ${translate('error_validate_field.input_is_require')}!`)
      .min(2, `${translate('error_validate_field.postal_code')} ${translate('error_validate_field.input_too_short')}!`)
      .matches(
        REGEX_POSTAL_CODE_CAD,
        `${translate('error_validate_field.postal_code')} ${translate('error_validate_field.is_not_valid')}!`,
      ),
    phone: string()
      .trim()
      .required(`${translate('error_validate_field.phone')} ${translate('error_validate_field.input_is_require')}!`)
      .test('phone', `${translate('error_validate_field.phone')} ${translate('error_validate_field.is_not_valid')}!`, value => {
        if (value && value.length >= 9 && value.length < 15) {
          return phoneValidation(value, countryCodeValue);
        }
        return false;
      }),
  });

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const onCancel = () => {
    popupRef.current && popupRef.current.showPopup();
  };

  const onPressGrayButton = () => {
    NavigationActionsService.popToRoot();
  };

  const onSubmitCollection = (values: any) => {
    Keyboard.dismiss();
    dispatch(
      saveShippingAddress({
        shippingAddress: {
          country: countryUrl ?? '',
          title: '',
          first_name: values.first_name,
          last_name: values.last_name,
          line1: values.address,
          line2: '',
          line3: '',
          line4: values.city,
          state: values.region,
          postcode: values.postal_code,
          phone_number: `${countryCode} ${values.phone}`,
          notes: '',
        },
      }),
    );
    dispatch(
      saveBillingAddress({
        billingAddress: {
          country: countryUrl ?? '',
          title: '',
          first_name: values.first_name,
          last_name: values.last_name,
          line1: values.address,
          line2: '',
          line3: '',
          line4: values.city,
          state: values.region,
          postcode: values.postal_code,
          phone_number: `${countryCode} ${values.phone}`,
          notes: '',
        },
      }),
    );
    NavigationActionsService.push(SHIPPING_TYPE, {}, true);
  };

  const onBackdropPress = () => {
    setShowPhonePicker(false);
    setShowCountriesPicker(false);
  };

  const onCountriesItemPress = (item: ICountry) => {
    setShowCountriesPicker(false);
    setCountryUrl(item.url);
    setFieldValueFormik && setFieldValueFormik('country', item.printable_name);
  };

  const onCountryCodeItemPress = (item: PickerData) => {
    setShowPhonePicker(false);
    setCountryCodeValue(item.iso2.toUpperCase());
    setCountryCode(item.dialCode);
  };

  const onPressPhonePicker = () => {
    setShowPhonePicker(true);
    Keyboard.dismiss();
  };

  const onPressCountryPicker = () => {
    setShowCountriesPicker(true);
    Keyboard.dismiss();
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        leftImage={BACK}
        leftAction={onBack}
        title={translate('order.shipping_details')}
        rightComponent={renderRightHeader()}
        rightAction={onCancel}
      />
    );
  };

  const renderRightHeader = () => {
    return <CustomText style={{ fontSize: 12, color: '#676877' }} text={translate('order.cancel')} />;
  };

  const renderFormik = () => {
    return (
      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          address: '',
          city: '',
          country: '',
          region: '',
          postal_code: '',
          phone: '',
        }}
        validateOnChange={true}
        onSubmit={onSubmitCollection}
        validationSchema={validateSchema}
      >
        {({ handleChange, handleSubmit, values, errors, touched, isValid, handleBlur, setFieldValue }) => {
          setFieldValueFormik = setFieldValue;
          return (
            <View style={styles.containerFormik}>
              <View>
                <CustomInput
                  onChangeText={handleChange('first_name')}
                  placeholder={translate('order.first_name')}
                  onSubmitEditing={() => {
                    lastNameRef.current.focus();
                  }}
                  returnKeyType="next"
                  value={values.first_name}
                  moreStyle={touched.first_name && errors.first_name ? { marginBottom: 0 } : styles.inputStyle}
                  onBlur={handleBlur('first_name')}
                />
                <ErrorMessage errorValue={touched.first_name && errors.first_name} />
                <CustomInput
                  inputRef={lastNameRef}
                  onChangeText={handleChange('last_name')}
                  placeholder={translate('order.last_name')}
                  onSubmitEditing={() => {
                    addressRef.current.focus();
                  }}
                  returnKeyType="next"
                  value={values.last_name}
                  moreStyle={touched.last_name && errors.last_name ? { marginBottom: 0 } : styles.inputStyle}
                  onBlur={handleBlur('last_name')}
                />
                <ErrorMessage errorValue={touched.last_name && errors.last_name} />
                <CustomInput
                  inputRef={addressRef}
                  onChangeText={handleChange('address')}
                  placeholder={translate('order.address')}
                  onSubmitEditing={() => {
                    cityRef.current.focus();
                  }}
                  returnKeyType="next"
                  value={values.address}
                  moreStyle={touched.address && errors.address ? { marginBottom: 0 } : styles.inputStyle}
                  onBlur={handleBlur('address')}
                />
                <ErrorMessage errorValue={touched.address && errors.address} />
                <CustomInput
                  inputRef={cityRef}
                  onChangeText={handleChange('city')}
                  placeholder={translate('order.city')}
                  returnKeyType="next"
                  value={values.city}
                  moreStyle={touched.city && errors.city ? { marginBottom: 0 } : styles.inputStyle}
                  onBlur={handleBlur('city')}
                />
                <ErrorMessage errorValue={touched.city && errors.city} />
                <CustomTouchable onPress={onPressCountryPicker}>
                  <CustomInput
                    onChangeText={handleChange('country')}
                    placeholder={translate('order.country')}
                    editable={false}
                    pointerEvents="none"
                    returnKeyType="next"
                    value={values.country}
                    moreStyle={touched.country && errors.country ? { marginBottom: 0 } : styles.inputStyle}
                    onBlur={handleBlur('country')}
                  />
                </CustomTouchable>
                <ErrorMessage errorValue={touched.country && errors.country} />
                <CustomInput
                  onChangeText={handleChange('region')}
                  placeholder={translate('order.region')}
                  onSubmitEditing={() => {
                    postalCodeRef.current.focus();
                  }}
                  returnKeyType="next"
                  value={values.region}
                  moreStyle={touched.region && errors.region ? { marginBottom: 0 } : styles.inputStyle}
                  onBlur={handleBlur('region')}
                />
                <ErrorMessage errorValue={touched.region && errors.region} />
                <CustomInput
                  inputRef={postalCodeRef}
                  onChangeText={handleChange('postal_code')}
                  placeholder={translate('order.postal_code')}
                  onSubmitEditing={() => {
                    phoneRef.current.focus();
                  }}
                  returnKeyType="next"
                  autoCapitalize="characters"
                  value={values.postal_code}
                  moreStyle={touched.postal_code && errors.postal_code ? { marginBottom: 0 } : styles.inputStyle}
                  onBlur={handleBlur('postal_code')}
                />
                <ErrorMessage errorValue={touched.postal_code && errors.postal_code} />
                <View style={[styles.phoneContainerStyle, { marginBottom: touched.phone && errors.phone ? 0 : 20 }]}>
                  <CustomTouchable style={styles.phoneCountryCodeContainer} onPress={onPressPhonePicker}>
                    <PhoneInput
                      ref={countryCodeRef}
                      style={{ flex: 1 }}
                      textProps={{
                        pointerEvents: 'none',
                        editable: false,
                      }}
                      textStyle={styles.phoneInputTextStyle}
                      flagStyle={styles.flagStyle}
                      value={countryCode}
                    />
                  </CustomTouchable>
                  <CustomInput
                    inputRef={phoneRef}
                    onChangeText={handleChange('phone')}
                    placeholder={translate('order.phone')}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                    keyboardType="phone-pad"
                    value={values.phone}
                    moreStyle={styles.phoneInputStyle}
                    onBlur={handleBlur('phone')}
                  />
                </View>
                <ErrorMessage errorValue={touched.phone && errors.phone} />
              </View>
              <CustomButton onPress={handleSubmit} disabled={!isValid} style={styles.buttonSubmit} text={translate('order.continue')} />
            </View>
          );
        }}
      </Formik>
    );
  };

  return (
    <Container>
      <CountriesPopup visible={showCountriesPicker} data={countries} onBackdropPress={onBackdropPress} onItemPress={onCountriesItemPress} />
      <CountryCodePopup
        visible={showPhonePicker}
        data={pickerData}
        onBackdropPress={onBackdropPress}
        onItemPress={onCountryCodeItemPress}
      />
      <OrderPopup ref={popupRef} onPressGrayButton={onPressGrayButton} />
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
          {renderFormik()}
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default ShippingDetails;
