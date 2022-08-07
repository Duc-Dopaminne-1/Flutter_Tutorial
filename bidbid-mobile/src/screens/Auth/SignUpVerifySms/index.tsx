import React, { ReactElement, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import { GlobalProps } from '@/shared/Interface';
import SignUpVerifySmsForMik from '@/screens/Auth/SignUpVerifySms/component/SignUpVerifySmsFormik';
import { SignUpVerifySmsContext } from './SignUpVerifySmsContext';
import { linkSocial, login, logout } from '@/redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_SETTING_SCREEN, SIGN_UP_PHONE_SCREEN } from '@/navigation/screenKeys';
import CustomHeader from '@/components/CustomHeader';
import CustomHeaderTitle from '@/components/CustomHeaderTitle';
import { colors, fonts } from '@/vars';
import { IAuthState } from '@/redux/auth/reducer';
import Modal from 'react-native-modal';
import SignUpVerifySmsModal from '@/screens/Auth/SignUpVerifySms/component/SignUpVerifySmsModal';
import { RuleSocial } from '@/constants/app';
import NavigationActionsService from '@/navigation/navigation';
import { verifyCodeChangePhone } from '@/redux/auth/actions';
import SignUpVerifySmsModalError from '@/screens/Auth/SignUpVerifySms/component/SignUpVerifySmsModalError';
import { formatPhoneNumber } from '@/shared/processing';
import IconBack from '@/components/SVG/BackSvg';
import Spinner from '@/components/Spinner';

let codeSms = '';
let email = '';
let isLinkSuccess = true;
let valueUser: any = '';
let errorMessage: any = '';
let token: any = '';

export function SignUpVerifySmsScreen(prop: GlobalProps): ReactElement {
  const dispatch = useDispatch();
  const phone = prop.route.params ? prop.route.params?.phone : '';
  token = prop.route.params ? prop.route.params?.token : '';
  const isChangePhone = prop.route.params ? prop.route.params?.isChangePhone : false;
  const isAutoLinkSocial = prop.route.params ? prop.route.params?.isAutoLinkSocial : false;
  const { accessToken = '', type = '' } = useSelector((state: IAuthState) => state.auth.social);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalError, setIsShowModalError] = useState(false);

  const onShowModal = (isSuccess: boolean) => {
    isLinkSuccess = isSuccess;
    setIsLoading(false);
    setTimeout(() => {
      setIsShowModal(true);
    }, 400);
  };

  const onVerifySuccess = (value: any) => {
    valueUser = value;
    handleLogin();
  };

  const handleLogin = () => {
    // login by social, then app will auto link social with phone
    if (isAutoLinkSocial) {
      dispatch(
        linkSocial({
          userId: valueUser ? valueUser.user?.id : '',
          accessToken,
          type,
          onSuccess: (result: string) => {
            email = result;
            onShowModal(true);
          },
          onFail: () => {
            onShowModal(false);
          },
        }),
      );
      return;
    }
    // login by phone
    setIsLoading(false);
    onLoginSuccess();
  };

  const setTokenResend = (tokenAPI: string) => {
    token = tokenAPI;
  };

  const onVerify = () => {
    if (!codeSms || codeSms.length !== 6) {
      errorMessage = language('invalidCode');
      setIsShowModalError(true);
      return;
    }
    if (isChangePhone) {
      dispatch(
        verifyCodeChangePhone({
          token,
          code: codeSms,
          onSuccess: () => NavigationActionsService.push(ACCOUNT_SETTING_SCREEN),
          onFail: onFail,
        }),
      );
      return;
    }
    setIsLoading(true);
    dispatch(
      login({
        token,
        provider: RuleSocial.PhoneNumber,
        code: codeSms,
        onSuccess: onVerifySuccess,
        onFail: onFail,
      }),
    );
  };

  const onLoginSuccess = async () => {
    await NavigationActionsService.handleLogin({ userInfo: valueUser, email, isAutoLinkSocial });
  };

  const onContinue = useCallback(() => {
    if (isLinkSuccess) {
      setIsShowModal(false);
      onLoginSuccess();
    } else {
      NavigationActionsService.dispatchAction(logout({}));
      setIsShowModal(false);
      NavigationActionsService.push(SIGN_UP_PHONE_SCREEN);
    }
  }, []);

  const onFail = (_error: any) => {
    setIsLoading(false);
    setTimeout(() => {
      errorMessage = language('codeInvalidResend');
      setIsShowModalError(true);
    }, 500);
  };

  const onSetCode = (code: string) => {
    codeSms = code;
  };

  const onBackdropPress = () => {
    setIsShowModalError(false);
  };

  return (
    <SignUpVerifySmsContext.Provider
      value={{
        onSetCode: onSetCode,
        onVerify: onVerify,
        setTokenResend: setTokenResend,
        phoneNumber: phone,
        isChangePhone,
      }}
    >
      <View style={styles.container}>
        <SafeArea />
        <Spinner loading={isLoading} />
        <CustomHeader leftIcon={<IconBack />} title={language('otp')} />
        <CustomHeaderTitle
          wrapContentStyle={styles.wrapTextPhone}
          container={styles.wrapHeader}
          titleStyle={styles.textTitle}
          title={language('sendSms')}
          note={formatPhoneNumber(phone)}
          noteStyle={styles.textPhone}
        />
        <SignUpVerifySmsForMik />
        <Modal animationOutTiming={500} isVisible={isShowModal} useNativeDriver>
          <SignUpVerifySmsModal onContinue={onContinue} isSuccess={isLinkSuccess} />
        </Modal>

        <Modal
          onBackdropPress={onBackdropPress}
          onBackButtonPress={onBackdropPress}
          animationOutTiming={500}
          isVisible={isShowModalError}
          useNativeDriver
        >
          <SignUpVerifySmsModalError errorMessage={errorMessage} onBackdropPress={onBackdropPress} />
        </Modal>
      </View>
    </SignUpVerifySmsContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textPhone: {
    alignSelf: 'center',
    color: colors.gray_500,
    fontSize: fonts.size.s18,
    fontFamily: fonts.family.PoppinsRegular,
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
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s18,
  },
});
