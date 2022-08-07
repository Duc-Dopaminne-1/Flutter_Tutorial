import { View, Image, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK, PAYPAL_CARD, HELP } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import { PaymentMethodItem } from '@src/components/PaymentMethodItem';
import { Formik, FormikErrors } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CHECKBOX from '@res/icons/checkbox.png';
import UNCHECKBOX from '@res/icons/uncheckbox.png';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { REVIEW_ORDER } from '@src/constants/screenKeys';
import { OrderPopup } from '@src/components/Popup/OrderPopup';
import creditCardType, { CreditCardTypeInfo } from 'credit-card-type';
import { REGEX_POSTAL_CODE_CAD } from '@src/constants/vars';
import { createTokenWithCard } from '@src/utils/stripe';
import { ProviderEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';
import { ICountry, IAddress } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { CountriesPopup } from '@src/components/Popup/CountriesPopup';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { saveBillingAddress, addCreditCard } from '@src/modules/payment/actions';
import { CustomPopup } from '@src/components/CustomPopup';

enum CreditCardType {
  VISA = 'Visa',
  MASTERCARD = 'Mastercard',
  AMERICAN_EXPRESS = 'American Express',
  DISCOVER = 'Discover',
}

const PaymentDetails = () => {
  const creditCardFormat = '[0000] [0000] [0000] [0000]';
  const creditCardFormat2 = '[0000] [000000] [00000]';
  const securityCodeFormat = '[000]';
  const securityCodeFormat2 = '[0000]';

  const dispatch = useDispatch();

  let setFieldValueFormik: any;
  let validateFormFomik: () => Promise<FormikErrors<any>>;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showCountriesPicker, setShowCountriesPicker] = useState<boolean>(false);
  const [countryUrl, setCountryUrl] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<ProviderEnum>(ProviderEnum.Stripe);
  const [isCheck, setCheck] = useState<boolean>(false);
  const [maskCVC, setMaskCVC] = useState<string>(securityCodeFormat);
  const [maskCardNumber, setMaskCardNumber] = useState<string>(creditCardFormat);
  const [maskCardNumberInfo, setMaskCardNumberInfo] = useState<CreditCardTypeInfo>({
    niceType: '',
    code: {
      name: '',
      size: 0,
    },
  });

  const popupRef: any = useRef(null);
  const expirationDateRef: any = useRef(null);
  const securityCodeRef: any = useRef(null);
  const postalCodeRef: any = useRef(null);
  const addressRef: any = useRef(null);
  const cityRef: any = useRef(null);

  const cardNumber: any = useRef('');
  const expirationDate: any = useRef('');
  const securityCode: any = useRef('');
  const postalCode: any = useRef('');
  const address: any = useRef('');
  const city: any = useRef('');
  const country: any = useRef('');
  const region: any = useRef('');

  const countries = useSelector<RootState, ICountry[]>((state: RootState) => state.payment.countries);
  const billingAddress = useSelector<RootState, IAddress>((state: RootState) => state.payment.billingAddress);

  useEffect(() => {
    validateFormFomik && validateFormFomik();
  }, [isCheck]);

  const onMask = () => {
    if (Object.keys(maskCardNumberInfo.niceType ?? '').length > 0) {
      setMaskCVC(maskCardNumberInfo.niceType === CreditCardType.AMERICAN_EXPRESS ? securityCodeFormat2 : securityCodeFormat);
      setMaskCardNumber(maskCardNumberInfo.niceType === CreditCardType.AMERICAN_EXPRESS ? creditCardFormat2 : creditCardFormat);
    }
  };

  const validDate = (dateValue: string): boolean => {
    var date = new Date();
    const arrDate = dateValue.split('/');

    if (parseInt(arrDate[1]) < date.getFullYear() % 100) {
      return false;
    } else if (parseInt(arrDate[1]) === date.getFullYear() % 100) {
      if (parseInt(arrDate[0]) < date.getMonth() + 1) {
        return false;
      }
    }
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(dateValue);
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const onCancel = () => {
    popupRef.current && popupRef.current.showPopup();
  };

  const onPressGrayButton = () => {
    NavigationActionsService.popToRoot();
  };

  const onButtonCreditCardPress = async (values: any) => {
    Keyboard.dismiss();
    try {
      NavigationActionsService.showLoading();
      !isCheck &&
        dispatch(
          saveBillingAddress({
            billingAddress: {
              country: countryUrl ?? '',
              title: '',
              first_name: billingAddress.first_name,
              last_name: billingAddress.last_name,
              line1: values.address,
              line2: '',
              line3: '',
              line4: values.city,
              state: values.region,
              postcode: billingAddress.postcode,
              phone_number: billingAddress.phone_number,
              notes: '',
            },
          }),
        );
      const stripeToken = await createTokenWithCard({
        number: values.card_number,
        expMonth: parseInt(values.expiration_date.split('/')[0]),
        expYear: parseInt(values.expiration_date.split('/')[1]),
        cvc: values.security_code,
        addressZip: values.postal_code,
      });
      dispatch(
        addCreditCard({
          token: stripeToken.tokenId,
          onSuccess: () => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.push(REVIEW_ORDER, { provider: paymentMethod }, true);
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.showErrorPopup(error);
          },
        }),
      );
    } catch (error) {
      setTimeout(() => {
        NavigationActionsService.hideLoading();
        NavigationActionsService.showErrorPopup(error);
      }, 500);
    }
  };

  const onPressCheckBox = () => {
    setCheck(!isCheck);
  };

  const onBackdropPress = () => {
    setShowCountriesPicker(false);
    setShowTooltip(false);
  };

  const onCountriesItemPress = (item: ICountry) => {
    setShowCountriesPicker(false);
    setCountryUrl(item.url);
    setFieldValueFormik && setFieldValueFormik('country', item.printable_name);
  };

  const onButtonPaypalPress = () => {
    Keyboard.dismiss();
    NavigationActionsService.push(REVIEW_ORDER, { provider: paymentMethod }, true);
  };

  const onPressCreditCard = () => {
    Keyboard.dismiss();
    setPaymentMethod(ProviderEnum.Stripe);
  };

  const onPressPayPal = () => {
    Keyboard.dismiss();
    setPaymentMethod(ProviderEnum.PayPal);
  };

  const onPressRightIcon = () => {
    Keyboard.dismiss();
    setShowTooltip(true);
  };

  const onPressCountry = () => {
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

  const renderPayPalInfo = () => {
    return (
      <View style={styles.paypalInfoContainer}>
        <CustomText style={styles.paypalInfo} text={translate('order.paypal_info')} />
        <Image style={styles.paypalCard} source={PAYPAL_CARD} />
      </View>
    );
  };

  const validateSchema = object().shape({
    card_number: string()
      .trim()
      .required(`${translate('error_validate_field.card_number')} ${translate('error_validate_field.input_is_require')}!`)
      .test('card_number', `${translate('error_validate_field.card_number')} ${translate('error_validate_field.is_not_valid')}!`, value => {
        if (Object.is(undefined, value)) {
          return true;
        }
        if (
          (maskCardNumberInfo.niceType === CreditCardType.AMERICAN_EXPRESS && value.length !== 17) ||
          (maskCardNumberInfo.niceType !== CreditCardType.AMERICAN_EXPRESS && value.length !== 19)
        ) {
          return false;
        }
        return true;
      }),
    expiration_date: string()
      .trim()
      .required(`${translate('error_validate_field.expiration_date')} ${translate('error_validate_field.input_is_require')}!`)
      .test(
        'expiration_date',
        `${translate('error_validate_field.expiration_date')} ${translate('error_validate_field.is_not_valid')}!`,
        value => {
          if (Object.is(undefined, value)) {
            return true;
          }
          return validDate(value);
        },
      ),
    security_code: string()
      .trim()
      .required(`${translate('error_validate_field.security_code')} ${translate('error_validate_field.input_is_require')}!`)
      .test(
        'security_code',
        `${translate('error_validate_field.security_code')} ${translate('error_validate_field.is_not_valid')}!`,
        (value: string) => {
          if (Object.is(undefined, value)) {
            return true;
          }
          if (maskCardNumberInfo.code?.size !== value.length) {
            return false;
          }
          return true;
        },
      ),
    postal_code: string()
      .trim()
      .required(`${translate('error_validate_field.postal_code')} ${translate('error_validate_field.input_is_require')}!`)
      .matches(
        REGEX_POSTAL_CODE_CAD,
        `${translate('error_validate_field.postal_code')} ${translate('error_validate_field.is_not_valid')}!`,
      ),
  });

  const validateSchemaBilling = object().shape({
    card_number: string()
      .trim()
      .required(`${translate('error_validate_field.card_number')} ${translate('error_validate_field.input_is_require')}!`)
      .test('card_number', `${translate('error_validate_field.card_number')} ${translate('error_validate_field.is_not_valid')}!`, value => {
        if (Object.is(undefined, value)) {
          return true;
        }
        if (
          (maskCardNumberInfo.niceType === CreditCardType.AMERICAN_EXPRESS && value.length !== 17) ||
          (maskCardNumberInfo.niceType !== CreditCardType.AMERICAN_EXPRESS && value.length !== 19)
        ) {
          return false;
        }
        return true;
      }),
    expiration_date: string()
      .trim()
      .required(`${translate('error_validate_field.expiration_date')} ${translate('error_validate_field.input_is_require')}!`)
      .test(
        'expiration_date',
        `${translate('error_validate_field.expiration_date')} ${translate('error_validate_field.is_not_valid')}!`,
        value => {
          if (Object.is(undefined, value)) {
            return true;
          }
          return validDate(value);
        },
      ),
    security_code: string()
      .trim()
      .required(`${translate('error_validate_field.security_code')} ${translate('error_validate_field.input_is_require')}!`)
      .test(
        'security_code',
        `${translate('error_validate_field.security_code')} ${translate('error_validate_field.is_not_valid')}!`,
        (value: string) => {
          if (Object.is(undefined, value)) {
            return true;
          }
          if (maskCardNumberInfo.code?.size !== value.length) {
            return false;
          }
          return true;
        },
      ),
    postal_code: string()
      .trim()
      .required(`${translate('error_validate_field.postal_code')} ${translate('error_validate_field.input_is_require')}!`)
      .matches(
        REGEX_POSTAL_CODE_CAD,
        `${translate('error_validate_field.postal_code')} ${translate('error_validate_field.is_not_valid')}!`,
      ),
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
  });

  const renderCreditCardInfo = () => {
    return (
      <Formik
        initialValues={{
          card_number: cardNumber.current,
          expiration_date: expirationDate.current,
          security_code: securityCode.current,
          postal_code: postalCode.current,
          address: address.current,
          city: city.current,
          country: country.current,
          region: region.current,
        }}
        onSubmit={onButtonCreditCardPress}
        validationSchema={isCheck ? validateSchema : validateSchemaBilling}
      >
        {({ setFieldValue, handleSubmit, values, errors, touched, isValid, handleBlur, validateForm }) => {
          setFieldValueFormik = setFieldValue;
          validateFormFomik = validateForm;
          return (
            <View style={styles.containerFormik}>
              <View>
                <CustomInput
                  mask={maskCardNumber}
                  description={translate('order.card_number_description')}
                  onChangeText={(text: string) => {
                    if (creditCardType(text).length === 1) {
                      setMaskCardNumberInfo(creditCardType(text)[0]);
                      onMask();
                    }
                    setFieldValue('card_number', text);
                    cardNumber.current = text;
                  }}
                  value={values.card_number}
                  placeholder={translate('order.card_number')}
                  onSubmitEditing={() => {
                    expirationDateRef.current.focus();
                  }}
                  returnKeyType="next"
                  keyboardType="number-pad"
                  moreStyle={[styles.inputStyle, { marginBottom: touched.card_number && errors.card_number ? 0 : 20 }]}
                  onBlur={handleBlur('card_number')}
                />
                <ErrorMessage errorValue={touched.card_number && errors.card_number} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <CustomInput
                      mask={'[00]{/}[00]'}
                      inputRef={expirationDateRef}
                      description={translate('order.expiration_date_description')}
                      onChangeText={(text: string) => {
                        if (parseInt(text.charAt(0)) > 1 && parseInt(text.charAt(0)) < 10) {
                          text = [text.slice(0, 0), '0', text.slice(0)].join('') + '/';
                        }
                        setFieldValue('expiration_date', text);
                        expirationDate.current = text;
                      }}
                      value={values.expiration_date}
                      placeholder={translate('order.expiration_date')}
                      onSubmitEditing={() => {
                        securityCodeRef.current.focus();
                      }}
                      returnKeyType="next"
                      keyboardType="number-pad"
                      moreStyle={[styles.inputStyleSmall, { marginBottom: touched.expiration_date && errors.expiration_date ? 0 : 20 }]}
                      onBlur={handleBlur('expiration_date')}
                    />
                    <ErrorMessage errorValue={touched.expiration_date && errors.expiration_date} />
                  </View>
                  <View>
                    <CustomInput
                      mask={maskCVC}
                      inputRef={securityCodeRef}
                      rightIcon={HELP}
                      rightIconStyle={styles.iconInput}
                      onPressRightIcon={onPressRightIcon}
                      description={`${translate('order.security_code_description')} (${
                        maskCardNumberInfo.code?.name == '' ? translate('order.security_code') : maskCardNumberInfo.code?.name
                      })*`}
                      onChangeText={(text: string) => {
                        setFieldValue('security_code', text);
                        securityCode.current = text;
                      }}
                      value={values.security_code}
                      placeholder={maskCardNumberInfo.code?.name == '' ? translate('order.security_code') : maskCardNumberInfo.code?.name}
                      onSubmitEditing={() => {
                        postalCodeRef.current.focus();
                      }}
                      returnKeyType="next"
                      keyboardType="number-pad"
                      moreStyle={[styles.inputStyleSmall, { marginBottom: touched.security_code && errors.security_code ? 0 : 20 }]}
                      onBlur={handleBlur('security_code')}
                    />
                    <ErrorMessage errorValue={touched.security_code && errors.security_code} />
                  </View>
                </View>
                <CustomInput
                  inputRef={postalCodeRef}
                  description={translate('order.postal_code')}
                  onChangeText={(text: string) => {
                    setFieldValue('postal_code', text);
                    postalCode.current = text;
                  }}
                  value={values.postal_code}
                  placeholder={translate('order.enter_postal_code')}
                  returnKeyType="done"
                  autoCapitalize="characters"
                  moreStyle={[styles.inputStyle, { marginBottom: touched.postal_code && errors.postal_code ? 0 : 20 }]}
                  onBlur={handleBlur('postal_code')}
                />
                <ErrorMessage errorValue={touched.postal_code && errors.postal_code} />
              </View>
              {renderBillingAddress()}
              {!isCheck ? (
                <View>
                  <CustomInput
                    inputRef={addressRef}
                    onChangeText={(text: string) => {
                      setFieldValue('address', text);
                      address.current = text;
                    }}
                    placeholder={translate('order.address')}
                    onSubmitEditing={() => {
                      cityRef.current.focus();
                    }}
                    returnKeyType="next"
                    value={values.address}
                    moreStyle={[styles.inputStyle, { marginBottom: touched.address && errors.address ? 0 : 20 }]}
                    onBlur={handleBlur('address')}
                  />
                  <ErrorMessage errorValue={touched.address && errors.address} />
                  <CustomInput
                    inputRef={cityRef}
                    onChangeText={(text: string) => {
                      setFieldValue('city', text);
                      city.current = text;
                    }}
                    placeholder={translate('order.city')}
                    returnKeyType="next"
                    value={values.city}
                    moreStyle={[styles.inputStyle, { marginBottom: touched.city && errors.city ? 0 : 20 }]}
                    onBlur={handleBlur('city')}
                  />
                  <ErrorMessage errorValue={touched.city && errors.city} />
                  <CustomTouchable onPress={onPressCountry}>
                    <CustomInput
                      onChangeText={(text: string) => {
                        setFieldValue('country', text);
                        country.current = text;
                      }}
                      placeholder={translate('order.country')}
                      editable={false}
                      pointerEvents="none"
                      returnKeyType="next"
                      value={values.country}
                      moreStyle={[styles.inputStyle, { marginBottom: touched.country && errors.country ? 0 : 20 }]}
                      onBlur={handleBlur('country')}
                    />
                  </CustomTouchable>
                  <ErrorMessage errorValue={touched.country && errors.country} />
                  <CustomInput
                    onChangeText={(text: string) => {
                      setFieldValue('region', text);
                      region.current = text;
                    }}
                    placeholder={translate('order.region')}
                    returnKeyType="done"
                    value={values.region}
                    moreStyle={[styles.inputStyle, { marginBottom: touched.region && errors.region ? 0 : 20 }]}
                    onBlur={handleBlur('region')}
                  />
                  <ErrorMessage errorValue={touched.region && errors.region} />
                </View>
              ) : null}
              <CustomButton onPress={handleSubmit} disabled={!isValid} style={styles.buttonCredit} text={translate('order.continue')} />
            </View>
          );
        }}
      </Formik>
    );
  };

  const renderBillingAddress = () => {
    return (
      <View style={styles.billingAddressContainer}>
        <CustomText style={styles.billingAddressTitle} text={translate('order.billing_address')} />
        <CustomTouchable style={styles.billingAddressSubContainer} onPress={onPressCheckBox}>
          <Image style={styles.checkBox} source={isCheck ? CHECKBOX : UNCHECKBOX} />
          <CustomText style={styles.billingAddressDetail} text={translate('order.billing_address_detail')} />
        </CustomTouchable>
      </View>
    );
  };

  const renderButton = () => {
    if (paymentMethod == ProviderEnum.PayPal) {
      return <CustomButton onPress={onButtonPaypalPress} style={styles.buttonPayPal} text={translate('order.continue')} />;
    } else {
      return null;
    }
  };

  const renderModal = () => (
    <CustomPopup loading={showTooltip} text={translate('order.tooltip_content')} onPressRedButton={onBackdropPress} />
  );

  return (
    <Container>
      <CountriesPopup visible={showCountriesPicker} data={countries} onBackdropPress={onBackdropPress} onItemPress={onCountriesItemPress} />
      <OrderPopup ref={popupRef} onPressGrayButton={onPressGrayButton} />
      {renderModal()}
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
          <View style={styles.subContainer}>
            <PaymentMethodItem
              isActive={paymentMethod == ProviderEnum.Stripe}
              paymentMethod={ProviderEnum.Stripe}
              onPress={onPressCreditCard}
            />
            <PaymentMethodItem
              isActive={paymentMethod == ProviderEnum.PayPal}
              paymentMethod={ProviderEnum.PayPal}
              onPress={onPressPayPal}
            />
            {paymentMethod == ProviderEnum.Stripe ? renderCreditCardInfo() : renderPayPalInfo()}
          </View>
        </KeyboardAwareScrollView>
        {renderButton()}
      </View>
    </Container>
  );
};

export default PaymentDetails;
