import React, { ReactElement } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import { SIGN_UP_PHONE_SCREEN } from '@/navigation/screenKeys';
import analytics from '@react-native-firebase/analytics';
import { appleLogin, googleLogin, logOutGoogleIfNeeded, onLoginFacebook } from '@/shared/Social';
import { useDispatch } from 'react-redux';
import { login, saveSocial } from '@/redux/auth/actions';
import { alertError } from '@/shared/alert';
import { ErrorCode } from '@/constants/codeError';
import { isIOS } from '@/shared/devices';
import { VERSION_DEVICE, VERSION_DEVICE_LOGIN_APPLE } from '@/constants/app';
import ButtonApple from '@/components/ButtonApple';
import NavigationActionsService from '@/navigation/navigation';
import DefaultText from '@/components/CustomText/DefaultText';
import FbSVG from '@/components/SVG/FbSVG';
import GGSVG from '@/components/SVG/GGSVG';

export function WelcomeSocial(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onLoginGg = (token = '', typeLogin = '') => {
    NavigationActionsService.showLoading();
    dispatch(
      login({
        token: token,
        provider: typeLogin,
        onSuccess: value => onSuccess(value, typeLogin, token, typeLogin),
        onFail: (error: string, code = 0) => onFail(error, code, token, typeLogin),
      }),
    );
  };

  const onFail = async (error: string, code: string | number, token: string, provider: string) => {
    NavigationActionsService.hideLoading();
    if (ErrorCode.NOT_FOUND === code) {
      // tracks analytics sign up by each social network provider
      await analytics().logEvent('sign_up', {
        method: provider,
      });

      dispatch(
        saveSocial({
          social: {
            accessToken: token,
            type: provider,
          },
        }),
      );
      navigation.navigate(SIGN_UP_PHONE_SCREEN, {
        isAutoLinkSocial: true,
      });
      return;
    }
    await logOutGoogleIfNeeded();
    alertError(error, language('error'), null);
  };

  const onSuccess = async (value: any, typeLogin: string, token, provider) => {
    // tracks analytics login by each social network provider
    NavigationActionsService.hideLoading();
    await analytics().logEvent('login', {
      method: typeLogin,
    });

    dispatch(
      saveSocial({
        social: {
          accessToken: token,
          type: provider,
        },
      }),
    );

    toApp(value, typeLogin);
  };

  const toApp = (value: any, typeLogin: string) => {
    NavigationActionsService.handleLogin({ userInfo: value, email: '', isAutoLinkSocial: false, typeLogin });
  };

  const onLoginFb = (token = '', typeLogin = '') => {
    NavigationActionsService.showLoading();
    dispatch(
      login({
        token: token,
        provider: typeLogin,
        onSuccess: value => onSuccess(value, typeLogin, token, typeLogin),
        onFail: (error: string, code = 0) => onFail(error, code, token, typeLogin),
      }),
    );
  };

  const onLoginApple = (token = '', typeLogin = '') => {
    NavigationActionsService.showLoading();
    dispatch(
      login({
        token: token,
        provider: typeLogin,
        onSuccess: value => onSuccess(value, typeLogin, token, typeLogin),
        onFail: (error: string, code = 0) => onFail(error, code, token, typeLogin),
      }),
    );
  };

  const onPressGg = async () => {
    await googleLogin(onLoginGg);
  };

  const onPressFb = async () => {
    await onLoginFacebook(onLoginFb);
  };

  const onLongPress = () => {
    // navigation.navigate(SET_DOMAIN_SCREEN);
  };

  const onPressApple = async () => {
    await appleLogin(onLoginApple);
  };

  return (
    <View style={styles.container}>
      <Pressable onLongPress={onLongPress}>
        <DefaultText {...{ style: styles.textNote }}>{language('signInWith')}</DefaultText>
      </Pressable>

      <View style={styles.wrapBtnSocial}>
        <CustomButton onPress={onPressFb} iconStyle={styles.icon} firstIcon={<FbSVG />} containerStyle={styles.wrapBtnFb} />

        {isIOS && VERSION_DEVICE >= VERSION_DEVICE_LOGIN_APPLE && <ButtonApple isLogin={true} onPress={onPressApple} />}

        <CustomButton onPress={onPressGg} iconStyle={styles.icon} firstIcon={<GGSVG />} containerStyle={styles.wrapBtnGg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 0,
    paddingHorizontal: 60,
  },
  textNote: {
    fontSize: fonts.size.s14,
    color: colors.gray_500,
  },
  wrapBtnSocial: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  icon: {
    height: 48,
    width: 48,
  },
  wrapBtnFb: {
    height: 48,
    width: 48,
    marginRight: 34,
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapBtnGg: {
    height: 48,
    width: 48,
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
