import { View, Alert, Keyboard, ImageBackground, Platform } from 'react-native';
import { FirebaseWebClientId, VERSION_DEVICE, VERSION_DEVICE_LOGIN_APPLE } from '@src/constants/app';
import { MAIN_SCREEN_TENANT, CONFIRMATION_TENANT, PERSONAL_INFO_TENANT, SIGN_UP_TENANT, FORGOT_PASSWORD_TENANT } from '@constants/screenKeys';
import React, { useState } from 'react';
import LOGO from '@res/Onboarding/icon-logo.png';
import BG_SIGNIN from '@res/img/bg_signin.png';
import Container from '@components/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import translate from '@src/localize';
import CustomInput from '@src/components/CustomInput';
import { Formik } from 'formik';
import { object, string } from 'yup';
import ErrorMessage from '../../../../components/ErrorMessage';
import { login, loginGoogle, loginFacebook, loginApple } from '@src/modules/auth/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomButton, GoogleButton, FacebookButton } from '@src/components/CustomButton';
import FastImage from 'react-native-fast-image';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
//@ts-ignore
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import CustomAccessory from '@src/components/CustomAccessory';
//@ts-ignore
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import ButtonApple from '@src/components/ButtonApple';
import appleAuth, { AppleAuthRequestScope, AppleAuthRequestOperation, AppleAuthError } from '@invertase/react-native-apple-authentication';
import { checkInternet } from '@src/utils/internet';
import { isAndroid } from '@src/utils';
import { emailRegex } from '@src/constants/regex';

const LoginTenant = (props: any) => {
  const dispatch = useDispatch();
  /*Keyboard Accessory define */
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  /*========================== */

  const detectNavigationLoginScreen = (isUpdatedProfile: boolean, isInvited: boolean) => {
    Keyboard.dismiss();
    if (isUpdatedProfile) {
      if (isInvited) {
        NavigationActionsService.setRoot(MAIN_SCREEN_TENANT);
      } else {
        NavigationActionsService.push(CONFIRMATION_TENANT)
      }
    } else {
      NavigationActionsService.push(PERSONAL_INFO_TENANT);
    }
  }

  const validateEmail = (email: string) => {
    return emailRegex.test(email)
  }

  const validationSchema = object().shape({
    email: string()
      .trim()
      .required(translate('authentication.registered_email'))
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true
          }
          return false
        }
      ),
    password: string()
      .trim()
      .required(translate('authentication.password_required'))
      .min(8, translate('authentication.short_password')),
  });

  const googleLogin = async () => {
    try {
      GoogleSignin.configure({
        webClientId: FirebaseWebClientId,
      });

      const data = await GoogleSignin.signIn();
      // Only apply for android, clear cache while token was expired
      await GoogleSignin.clearCachedToken(data.idToken ?? '');
      // Get token
      const tokens = await GoogleSignin.getTokens();
      // Show loading here
      setTimeout(() => {
        NavigationActionsService.showLoading();
        dispatch(
          loginGoogle({
            accessToken: tokens.accessToken,
            onSuccess: (data: any) => {
              // Hide loading
              NavigationActionsService.hideLoading();
              detectNavigationLoginScreen(data.is_updated_profile, data.isInvited);
            },

            onFail: (error: any) => {
              // Hide loading
              NavigationActionsService.hideLoading();
              setTimeout(() => {
                // Logout if needed
                logOutGoogleIfNeeded();
                error && Alert.alert(translate('alert.title_error'), error.message);
              }, 700);
            },
          }),
        );
      }, 500);
    } catch (error) {
      // hide show
      NavigationActionsService.hideLoading();
      setTimeout(() => {
        // Logout if needed
        logOutGoogleIfNeeded();
        if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
          Alert.alert(translate('alert.title_error'), error.message);
        }
      }, 700);
    }
  };

  const logOutGoogleIfNeeded = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
    }
  };

  const facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (!result.isCancelled) {
        // get the access token
        const data = await AccessToken.getCurrentAccessToken();
        // Show loading here


        if (!data) {
          // handle this however suites the flow of your app
          Alert.alert(translate('alert.title_error'), translate('alert.message_error_default'));
          return;
        }
        NavigationActionsService.showLoading();
        // Call API
        dispatch(
          loginFacebook({
            accessToken: data.accessToken,
            onSuccess: (data: any) => {
              // Hide loading
              NavigationActionsService.hideLoading();
              detectNavigationLoginScreen(data.is_updated_profile, data.isInvited);
            },

            onFail: (error: any) => {
              // Hide loading
              NavigationActionsService.hideLoading();
              setTimeout(() => {
                // Logout if needed
                logOutGoogleIfNeeded();
                error && Alert.alert(translate('alert.title_error'), error.message);
              }, 700);
            },
          }),
        );
      }
    } catch (e) {
      // hide show
      NavigationActionsService.hideLoading();

      // Logout Facebook If needed
      await logOutFacebookIfNeeded();

      setTimeout(() => {
        e && Alert.alert(translate('alert.title_error'), e.message ? e.message : '');
      }, 700);
    }
  };

  const logOutFacebookIfNeeded = async () => {
    const data = await AccessToken.getCurrentAccessToken();
    if (data.accessToken) {
      LoginManager.logOut();
    }
  };

  const appleLogin = async () => {
    console.log('Beginning Apple Authentication');

    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const { user, email, nonce, identityToken, fullName, realUserStatus, authorizationCode /* etc */ } = appleAuthRequestResponse;

      // showloading
      NavigationActionsService.showLoading();
      if (user && authorizationCode) {
        dispatch(
          loginApple({
            data: {
              access_token: '',
              code: authorizationCode,
            },
            onSuccess: (data) => {
              Keyboard.dismiss();
              setTimeout(() => {
                NavigationActionsService.hideLoading();
                detectNavigationLoginScreen(data.is_updated_profile, data.isInvited);
              }, 700);
            },
            onFail: error => {
              Keyboard.dismiss();
              NavigationActionsService.hideLoading();
              setTimeout(() => {
                error && Alert.alert(translate('alert.title_error'), error.message, [{ text: translate('alert.ok') }]);
              }, 700);
            },
          }),
        );
      }
    } catch (error) {
      // hide loading
      NavigationActionsService.hideLoading();
      setTimeout(() => {
        if (error.code !== AppleAuthError.CANCELED) {
          Alert.alert(translate('alert.title_error'), error.message);
        }
      }, 700);
    }
  };

  const onCreateAccount = () => {
    NavigationActionsService.push(SIGN_UP_TENANT);
  };

  const onForgotPassword = () => {
    NavigationActionsService.push(FORGOT_PASSWORD_TENANT);
  };

  const onLogin = (values: any) => {
    if (values.password.trim() != '') {
      NavigationActionsService.showLoading();
      dispatch(
        login({
          email: values.email,
          password: values.password,
          onSuccess: (data) => {
            Keyboard.dismiss();
            setTimeout(() => {
              NavigationActionsService.hideLoading();
              detectNavigationLoginScreen(data.is_updated_profile, data.isInvited);
            }, 700);
          },
          onFail: error => {
            Keyboard.dismiss();
            NavigationActionsService.hideLoading();
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          },
        }),
      );
    } else {
      Alert.alert(translate('alert.title_error'), translate('alert.message_login_error'));
    }
  };

  const renderDontHaveAccount = () => {
    return (
      <View style={styles.haveAccountContainer}>
        <View style={styles.divider} />
        <View style={styles.dontHaveAccountContainer}>
          <CustomTouchable onPress={onCreateAccount}>
            <CustomText style={styles.titleSmall} text={translate('authentication.signup')} />
          </CustomTouchable>
          <CustomText style={styles.dontHaveAccountText} text={translate('authentication.dont_have_account')} />
        </View>
      </View>
    );
  };

  const renderForgotPassword = () => {
    return (
      <CustomTouchable onPress={onForgotPassword}>
        <CustomText style={styles.titleSmall} text={translate('authentication.forgot_password')} />
      </CustomTouchable>
    );
  };

  const onPressGoogleButton = () => {
    googleLogin();
  };

  const onPressFaceBookButton = () => {
    facebookLogin();
  };

  const onPressAppleButton = () => {
    appleLogin();
  };

  const renderSocialButton = () => (
    <View style={styles.containerSocial}>
      <CustomText style={styles.textSocial} text={translate('authentication.signin_social')} />
      <View style={styles.containerButtonSocial}>
        <FacebookButton style={styles.facebookButton} onPress={onPressFaceBookButton} />
        <GoogleButton style={styles.googleButton} onPress={onPressGoogleButton} />
        {Platform.OS === 'ios' && VERSION_DEVICE >= VERSION_DEVICE_LOGIN_APPLE && <ButtonApple isLogin={true} onPress={onPressAppleButton} />}
      </View>
    </View>
  );

  /* KeyBoard Accessory Handle*/
  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    return getInputRef(currentInputIndex + 1).focus();
  };
  const previousInput = () => {
    return getInputRef(currentInputIndex - 1).focus();
  };
  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  /*=============== */

  const renderInputFields = () => {
    return (
      <Formik initialValues={{ email: '', password: '' }} onSubmit={onLogin} validationSchema={validationSchema}>
        {({ handleSubmit, values, errors, handleChange, touched, handleBlur }) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              inputRef={(input: any) => putInputRef(input)}
              description={`${translate('authentication.email')}:`}
              onChangeText={handleChange('email')}
              autoCapitalize="none"
              onSubmitEditing={() => getInputRef(1).focus()}
              returnKeyType="next"
              value={values.email}
              keyboardType="email-address"
              onFocus={() => setCurrentInputIndex(0)}
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <CustomInput
              inputRef={(input: any) => putInputRef(input)}
              description={`${translate('authentication.password')}:`}
              onChangeText={handleChange('password')}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              secureTextEntry
              value={values.password}
              onFocus={() => setCurrentInputIndex(1)}
              onBlur={handleBlur('password')}
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            {<View style={styles.containerRememberAndForgot}>{renderForgotPassword()}</View>}
            <CustomButton
              onPress={() => checkInternet.processFunction(handleSubmit)}
              textStyle={styles.buttonTextLogin}
              text={translate('authentication.login_button')}
              style={styles.buttonLogin}
            />
          </View>
        )}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Container barStyle={'light-content'}>
        <ImageBackground source={BG_SIGNIN} style={styles.logo} resizeMode={'stretch'}>
          <KeyboardAwareScrollView
            enableOnAndroid
            bounces={false}
            style={styles.container}
            extraScrollHeight={isAndroid() ? 50 : 0}
            contentContainerStyle={styles.contentContainerStyle}
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <FastImage resizeMode={'contain'} style={styles.logoReup} source={LOGO} />
              <CustomText style={styles.headerTitle} text={translate('authentication.signin_label')} />
              {renderInputFields()}
              {renderSocialButton()}
              {renderDontHaveAccount()}
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </Container>
      <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
        <CustomAccessory
          currentInputIndex={currentInputIndex}
          numberOfInput={2}
          onPressDown={nextInput}
          onPressUp={previousInput}
          onPressDone={doneTyping}
        />
      </KeyboardAccessoryView>
    </View>
  );
};

export default LoginTenant;
