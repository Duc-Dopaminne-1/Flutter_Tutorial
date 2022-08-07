import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { useDispatch, useSelector } from 'react-redux';
import { changePhoneNumber, signUpPhone } from '@/redux/auth/actions';
import { alertError } from '@/shared/alert';
import { IAuthState } from '@/redux/auth/reducer';
import { SignUpVerifySmsContext } from '@/screens/Auth/SignUpVerifySms/SignUpVerifySmsContext';
import { TIME_VERIFY_SMS } from '@/constants/app';
import DefaultText from '@/components/CustomText/DefaultText';
import { DevENV } from '@/shared/processing';

let interval = null;

function SignUpVerifySmsForMikTimer(): ReactElement {
  const { setTokenResend, isChangePhone, phoneNumber } = useContext(SignUpVerifySmsContext);
  const [timer, setTimer] = useState(TIME_VERIFY_SMS);
  const [isResend, setIsResend] = useState(false);
  const dispatch = useDispatch();
  const phone = useSelector((state: IAuthState) => state.auth.phone);

  useEffect(() => {
    if (!isResend) {
      interval = setInterval(() => {
        setTimer(state => state - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isResend]);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(interval);
      setTimer(TIME_VERIFY_SMS);
      setIsResend(true);
    }
  }, [timer]);

  const onPhoneFail = (error: any) => {
    alertError(error, language('error'), null);
  };

  const onPhoneSuccess = (resultApi: { token: string; code: string }) => {
    if (DevENV()) {
      alert(resultApi.code);
    }
    setTokenResend(resultApi.token);
  };

  const onResend = () => {
    if (isChangePhone) {
      dispatch(
        changePhoneNumber({
          phoneNumber,
          onSuccess: resultApi => onPhoneSuccess(resultApi),
          onFail: onPhoneFail,
        }),
      );
      setIsResend(false);
      return;
    }

    dispatch(
      signUpPhone({
        param: {
          phoneNumber: phone,
        },
        onSuccess: resultApi => onPhoneSuccess(resultApi),
        onFail: onPhoneFail,
      }),
    );
    setIsResend(false);
  };

  const renderResend = () => {
    return (
      <DefaultText {...{ style: styles.txtDidNotReceiveOtp }}>
        {language('did_not_receive_otp')}{' '}
        <DefaultText {...{ onPress: onResend, style: styles.txtResend }}>{language('resend')}</DefaultText>
      </DefaultText>
    );
  };

  const renderTimer = () => {
    return <DefaultText {...{ style: styles.txtSecondRemaining }}>{language('resend_in_s', { secondRemaining: timer })}</DefaultText>;
  };

  return <View style={styles.container}>{!isResend ? renderTimer() : renderResend()}</View>;
}

export default React.memo(SignUpVerifySmsForMikTimer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  txtSecondRemaining: {
    color: colors.blue_700,
    fontSize: fonts.size.s14,
  },
  txtResend: {
    color: colors.blue_700,
    fontSize: fonts.size.s14,
    textDecorationLine: 'underline',
  },
  txtDidNotReceiveOtp: {
    color: colors.gray_500,
    fontSize: fonts.size.s14,
  },
});
