import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import { GlobalProps } from '@/shared/Interface';
import { VerifyEmailContext } from './VerifyEmailContext';
import { useDispatch, useSelector } from 'react-redux';
import { alertError } from '@/shared/alert';
import CustomHeader from '@/components/CustomHeader';
import CustomHeaderTitle from '@/components/CustomHeaderTitle';
import { colors, fonts } from '@/vars';
import VerifyEmailForMik from '@/screens/PublicProfile/VerifyEmail/component/VerifyEmailFormik';
import { IAuthState } from '@/redux/auth/reducer';
import { verifyEmail } from '@/redux/auth/actions';
import { CREATE_FIRST_NAME_SCREEN } from '@/navigation/screenKeys';
import { ErrorCode } from '@/constants/codeError';
import NavigationActionsService from '@/navigation/navigation';
import { isIOS } from '@/shared/devices';
import IconBack from '@/components/SVG/BackSvg';

let codeSms = '';
let token = '';

export function VerifyEmailScreen(prop: GlobalProps): ReactElement {
  const email = prop.route.params ? prop.route.params?.email : '';
  token = useSelector((state: IAuthState) => state.auth.emailToken);
  const dispatch = useDispatch();

  const setTokenResend = (tokenAPI: string) => {
    token = tokenAPI;
  };

  const onVerify = () => {
    if (!codeSms || codeSms.length !== 6) {
      alertError(language('invalidCode'));
      return;
    }

    dispatch(
      verifyEmail({
        token,
        code: codeSms,
        onSuccess: onVerifySuccess,
        onFail: onVerifyFail,
      }),
    );
  };

  const onVerifyFail = (err: string) => {
    if (err === ErrorCode.CODE_INVALID) {
      alertError(language('enterValidCode'));
      return;
    }
    alertError(err);
  };

  const onVerifySuccess = () => {
    NavigationActionsService.setRoot(CREATE_FIRST_NAME_SCREEN);
    // navigation.navigate(CREATE_FIRST_NAME_SCREEN);
  };

  const onSetCode = (code: string) => {
    codeSms = code;
  };

  return (
    <VerifyEmailContext.Provider
      value={{
        onSetCode: onSetCode,
        onVerify: onVerify,
        setTokenResend: setTokenResend,
      }}
    >
      <View style={styles.container}>
        <SafeArea />
        <CustomHeader leftIcon={<IconBack />} title={''} />
        <CustomHeaderTitle
          noteStyle={styles.textPhone}
          wrapContentStyle={styles.wrapTextPhone}
          container={styles.wrapHeader}
          titleStyle={styles.textTitle}
          title={language('sendEmail')}
          note={email}
        />
        <VerifyEmailForMik />
      </View>
    </VerifyEmailContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_green,
  },
  textPhone: {
    color: colors.title_black,
    fontSize: fonts.size.s21,
    fontWeight: isIOS ? '600' : 'bold',
  },
  wrapTextPhone: {
    marginTop: 4,
  },
  wrapHeader: {
    paddingHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 42,
  },
  textTitle: {
    color: colors.text_light_gray,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s17,
  },
});
