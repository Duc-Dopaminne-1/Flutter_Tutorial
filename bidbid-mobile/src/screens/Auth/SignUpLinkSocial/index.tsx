import React, { ReactElement, useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { appleLogin, googleLogin, onLoginFacebook } from '@/shared/Social';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';
import { VERSION_DEVICE, VERSION_DEVICE_LOGIN_APPLE } from '@/constants/app';
import ButtonApple from '@/components/ButtonApple';
import { useNavigation } from '@react-navigation/native';
import { CREATE_EMAIL_SCREEN } from '@/navigation/screenKeys';
import { GlobalProps } from '@/shared/Interface';
import { useDispatch } from 'react-redux';
import { alertError } from '@/shared/alert';
import { linkSocial } from '@/redux/auth/actions';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import NavigationActionsService from '@/navigation/navigation';
import DefaultText from '@/components/CustomText/DefaultText';
import FbSVG from '@/components/SVG/FbSVG';
import GGSVG from '@/components/SVG/GGSVG';

export function SignUpLinkSocialScreen(props: GlobalProps): ReactElement {
  const userId = props.route.params ? props.route.params?.userId : '';
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  const onSkip = () => {
    navigation.navigate(CREATE_EMAIL_SCREEN, {
      email: '',
    });
  };

  const onLinkSocialSuccess = (email: string) => {
    NavigationActionsService.hideLoading();
    navigation.navigate(CREATE_EMAIL_SCREEN, {
      email,
    });
  };

  const onLinkSocialFail = (error: any) => {
    NavigationActionsService.hideLoading();
    alertError(error);
  };

  const onLoginSuccess = (token = '', typeLogin = '') => {
    NavigationActionsService.showLoading();
    dispatch(
      linkSocial({
        userId,
        accessToken: token,
        type: typeLogin,
        onSuccess: onLinkSocialSuccess,
        onFail: onLinkSocialFail,
      }),
    );
  };

  const onPressGg = async () => {
    await googleLogin(onLoginSuccess);
  };

  const onPressFb = async () => {
    await onLoginFacebook(onLoginSuccess);
  };

  const onPressApple = async () => {
    await appleLogin(onLoginSuccess);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader isBack={false} note={language('linkingAccount')} title={language('connectAccount')} titleStyle={styles.txtTitle} />
      <View style={styles.wrapBody}>
        <View style={styles.wrapButtonSocial}>
          <View style={styles.wrapContinue}>
            <DefaultText {...{ style: styles.textContinue }}>{language('continueWith')}</DefaultText>
          </View>

          <View style={styles.wrapBtnSocial}>
            <CustomButton onPress={onPressFb} iconStyle={styles.icon} firstIcon={<FbSVG />} containerStyle={styles.wrapBtnFb} />

            {isIOS && VERSION_DEVICE >= VERSION_DEVICE_LOGIN_APPLE && <ButtonApple isLogin={true} onPress={onPressApple} />}

            <CustomButton onPress={onPressGg} iconStyle={styles.icon} firstIcon={<GGSVG />} containerStyle={styles.wrapBtnGg} />
          </View>
        </View>
      </View>

      <CustomButton
        onPress={onSkip}
        wrapBtn={styles.wrapBtnSkip}
        containerStyle={styles.containerBtnSkip}
        textStyle={styles.textBtn}
        text={language('skip')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapBtnSkip: {
    flex: null,
  },
  containerBtnSkip: {
    minHeight: null,
    width: null,
    height: null,
    marginTop: 64,
    paddingVertical: 7,
    borderRadius: 34,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: colors.gray_line_beta,
    alignSelf: 'center',
    flexDirection: 'column',
  },
  textBtn: {
    fontSize: 14,
    color: colors.gray_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: 'normal',
  },
  wrapBody: {
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  wrapButtonSocial: {
    marginTop: 64,
  },
  wrapContinue: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  textContinue: {
    fontSize: fonts.size.s14,
    color: colors.gray_500,
  },
  wrapBtnSocial: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    height: 48,
    width: 48,
  },
  wrapBtnFb: {
    height: 48,
    width: 48,
    backgroundColor: colors.bg_blue,
    borderRadius: 150,
    marginRight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapBtnGg: {
    height: 48,
    width: 48,
    backgroundColor: colors.bg_grey_light,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: fonts.size.s22,
  },
});
