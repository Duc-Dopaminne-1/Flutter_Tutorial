import React, { ReactElement, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native';
import { Formik, FormikValues } from 'formik';
import ErrorMessage from '@/components/ErrorMessage';
import CustomPhoneInput from '@/components/CustomPhoneInput';
import { object, string } from 'yup';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import { CONFIRM_USER_SCREEN, SIGN_UP_VERIFY_SMS_SCREEN } from '@/navigation/screenKeys';
import { useDispatch } from 'react-redux';
import { changePhoneNumber, signUpPhone, validateUser } from '@/redux/auth/actions';
import { useAlertMessage } from '@/constants/messageConstants';
import { ErrorCode } from '@/constants/codeError';
import { CCA2, PHONE_CODE } from '@/constants/app';
import { DevENV, formatPhoneNumber, Log, replaceAt } from '@/shared/processing';
import { alertError } from '@/shared/alert';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PNF = require('google-libphonenumber').PhoneNumberFormat;

const initialValues = {
  phone: '',
  phoneMain: '',
  phoneCode: PHONE_CODE,
  cca2: CCA2,
};

let cca2Formik = '';
let setFieldErrorGlobal: (field: string, message: string | undefined) => void;

type Props = {
  isAutoLinkSocial?: boolean;
  wrapButton?: ViewStyle;
  isFocusInput?: boolean;
  isChangePhone?: boolean;
};

export function SignUpPhoneFormik(props: Props): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isAutoLinkSocial = false, wrapButton = {}, isFocusInput = true, isChangePhone } = props;
  const [signInProcessing, setSignInProcessing] = useState<boolean>(false);
  const alertMessage = useAlertMessage();
  const textButton = useMemo(() => {
    if (isChangePhone) {
      return language('updatePhone');
    }
    if (isAutoLinkSocial) {
      return language('continue');
    }
    return language('signIn');
  }, []);

  const validationSchema = object().shape({
    phone: string()
      .trim()
      .required(alertMessage.EMPTY_FIELD)
      .test('phone', language('phone_number_not_valid'), value => {
        if (value === undefined || value === '' || value.length < 2 || value.indexOf('+') > -1) {
          return false;
        }
        const number = phoneUtil.parseAndKeepRawInput(value, cca2Formik);
        return phoneUtil.isValidNumberForRegion(number, cca2Formik);
      }),
  });

  const getOtp = (values, resultApi) => {
    alert(resultApi.code);
    Log('resultApi.code', resultApi.code);

    setTimeout(() => {
      navigation.navigate(SIGN_UP_VERIFY_SMS_SCREEN, {
        phone: formatPhoneNumber(values.phoneMain),
        token: resultApi.token,
        isChangePhone: false,
        isAutoLinkSocial,
      });
    }, 200);
  };

  const onPhoneSuccess = (values: FormikValues, resultApi: any) => {
    setSignInProcessing(false);
    Keyboard.dismiss();

    if (DevENV()) {
      getOtp(values, resultApi);
      return;
    }

    if (resultApi?.error) {
      alert(language('errorMessage.canNotSendCode'));
      return;
    }

    setTimeout(() => {
      navigation.navigate(SIGN_UP_VERIFY_SMS_SCREEN, {
        phone: formatPhoneNumber(values.phoneMain),
        token: resultApi.token,
        isChangePhone: false,
        isAutoLinkSocial,
      });
    }, 200);
  };

  const onPhoneFail = (error: any) => {
    setSignInProcessing(false);
    if (ErrorCode.PHONE_NUMBER_INVALID === error) {
      setFieldErrorGlobal('phone', language('phone_number_not_valid'));
      return;
    } else if (ErrorCode.PHONE_NUMBER_EXISTED === error) {
      setFieldErrorGlobal('phone', language('phoneExists'));
      return;
    }
    alertError(error, language('error'), null);
  };

  const formatPhone = (phoneNumber: string) => {
    phoneNumber = phoneNumber.replace(/-/g, '');
    phoneNumber = phoneNumber.replace(/ /g, '');
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, cca2Formik);
    return (phoneNumber = phoneUtil.format(number, PNF.E164));
  };

  const dispatchPhone = (phoneNumber: string, values: FormikValues) => {
    dispatch(
      signUpPhone({
        param: {
          phoneNumber,
        },
        onSuccess: resultApi => onPhoneSuccess(values, resultApi),
        onFail: onPhoneFail,
      }),
    );
  };

  const onValidateUserSuccess = (values: FormikValues, isExitsUser: boolean, phone: string) => {
    if (isExitsUser) {
      navigation.navigate(CONFIRM_USER_SCREEN);
    } else {
      dispatchPhone(phone, values);
    }
  };

  const onChangePhoneSuccess = (phoneNumber: string, data) => {
    Keyboard.dismiss();
    const { token } = data;
    setTimeout(() => {
      navigation.navigate(SIGN_UP_VERIFY_SMS_SCREEN, {
        phone: phoneNumber,
        token: token,
        isChangePhone,
      });
    }, 200);
  };

  const onContinue = async (values: any) => {
    let { phoneMain } = values;
    if (values.phoneMain[values.phoneCode.length] === '0') {
      phoneMain = replaceAt(values.phoneMain, values.phoneCode.length, '');
    }

    let phoneNumber = phoneMain.trim();
    phoneNumber = formatPhone(phoneNumber);

    if (isAutoLinkSocial) {
      // login by social, then app will auto link social with phone
      dispatch(
        validateUser({
          phoneNumber,
          onSuccess: isExitsUser => onValidateUserSuccess(values, isExitsUser, phoneNumber),
          onFail: onPhoneFail,
        }),
      );
    } else if (isChangePhone) {
      // change phone
      dispatch(
        changePhoneNumber({
          phoneNumber,
          onSuccess: data => {
            onChangePhoneSuccess(phoneNumber, data);
          },
          onFail: onPhoneFail,
        }),
      );
    } else {
      // login by phone
      setSignInProcessing(true);
      dispatchPhone(phoneNumber, values);
    }
  };

  return (
    <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={validationSchema}>
      {({ handleSubmit, errors, setFieldValue, values, setFieldError }) => {
        cca2Formik = values.cca2;
        setFieldErrorGlobal = setFieldError;
        return (
          <View>
            <CustomPhoneInput
              isFocusInput={isFocusInput}
              handleSubmit={handleSubmit}
              setFieldError={setFieldError}
              values={values}
              setFieldValue={setFieldValue}
              errors={errors.phone}
            />

            <ErrorMessage errorValue={errors.phone} />
            <CustomButton
              loading={signInProcessing}
              onPress={handleSubmit}
              containerStyle={[styles.btnContinue, wrapButton]}
              text={textButton}
            />
          </View>
        );
      }}
    </Formik>
  );
}

const styles = StyleSheet.create({
  btnContinue: {
    alignSelf: 'center',
    marginTop: 40,
    width: null,
    paddingVertical: 13,
    paddingHorizontal: 5,
  },
});
