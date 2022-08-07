import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { useDispatch, useSelector } from 'react-redux';
import { sendCodeEmail } from '@/redux/auth/actions';
import { alertError } from '@/shared/alert';
import { CreateProfileInit } from '@/redux/createProfile/reducer';
import { VerifyEmailContext } from '@/screens/PublicProfile/VerifyEmail/VerifyEmailContext';
import { TIME_VERIFY_SMS } from '@/constants/app';

let interval = null;

function VerifyEmailForMikTimer() {
  const { setTokenResend } = useContext(VerifyEmailContext);
  const [timer, setTimer] = useState(TIME_VERIFY_SMS);
  const [isResend, setIsResend] = useState(false);
  const dispatch = useDispatch();
  const email = useSelector((state: CreateProfileInit) => state.createProfile.email);

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

  const onEmailFail = (error: string) => {
    alertError(error);
  };

  const onEmailSuccess = (resultApi: { token: string }) => {
    setTokenResend(resultApi.token);
  };

  const onResend = () => {
    dispatch(
      sendCodeEmail({
        email,
        onSuccess: resultApi => onEmailSuccess(resultApi),
        onFail: onEmailFail,
      }),
    );
    setIsResend(false);
  };

  const renderResend = () => {
    return (
      <CustomButton
        onPress={onResend}
        wrapBtn={styles.wrapBtnSkip}
        containerStyle={styles.containerBtnSkip}
        textStyle={styles.textBtn}
        text={language('resend')}
      />
    );
  };

  const renderTimer = () => {
    return <Text style={{ color: colors.text_blue }}>Resend in {timer}s</Text>;
  };

  return <View style={styles.container}>{!isResend ? renderTimer() : renderResend()}</View>;
}

export default React.memo(VerifyEmailForMikTimer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  wrapBtnSkip: {
    flex: null,
  },
  containerBtnSkip: {
    width: null,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: colors.transparent,
  },
  textBtn: {
    color: colors.black,
    fontFamily: fonts.family.SSPSemiBold,
    letterSpacing: 0,
  },
});
