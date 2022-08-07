import { Alert, View, Keyboard, ImageBackground, Platform } from 'react-native';
import { FirebaseWebClientId, VERSION_DEVICE, VERSION_DEVICE_SIGN_UP_APPLE } from '@src/constants/app';
import React, { useState } from 'react';
import { object, string, ref } from 'yup';
import Container from '@components/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import { signUp, loginApple } from '@modules/auth/actions';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
//@ts-ignore
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { loginGoogle, loginFacebook } from '@src/modules/auth/actions';
import styles from './styles';
import translate from '@src/localize';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '../../../../components/ErrorMessage';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomButton, GoogleButton, FacebookButton } from '@src/components/CustomButton';
import BG_SIGNIN from '@res/img/bg_signin.png';
import LOGO from '@res/Onboarding/icon-logo.png';
import { MAIN_SCREEN_TENANT, PERSONAL_INFO_TENANT, CONFIRMATION_TENANT } from '@src/constants/screenKeys';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import ButtonApple from '@src/components/ButtonApple';
import appleAuth, { AppleAuthRequestScope, AppleAuthRequestOperation, AppleAuthError } from '@invertase/react-native-apple-authentication';
import { checkInternet } from '@src/utils/internet';
import { isAndroid } from '@src/utils';
import { emailRegex } from '@src/constants/regex';

const SignUpTenant = () => {
  const dispatch = useDispatch();
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];

  const validateEmail = (email: string) => {
    return emailRegex.test(email)
  }

  const validateSchema = object().shape({
    email: string()
      .trim()
      .required(`${translate('error_validate_field.email')} ${translate('error_validate_field.input_is_require')}!`)
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
      .required(`${translate('error_validate_field.password')} ${translate('error_validate_field.input_is_require')}!`)
      .min(8, `${translate('authentication.short_password')}!`)
      .matches(
        /^(?=.*\d).+$/,
        `${translate('error_validate_field.password')} ${translate('error_validate_field.password_special_character')}!`,
      )
      .matches(
        /.*[!@#$%^&*(),.?":{}|<>].*$/,
        `${translate('error_validate_field.password')} ${translate('error_validate_field.password_special_character')}!`,
      ),
    confirmPassword: string()
      .trim()
      .required(`${translate('error_validate_field.retype_pwd')} ${translate('error_validate_field.input_is_require')}!`)
      .min(8, `${translate('authentication.short_confirm_password')}!`)
      .oneOf([ref('password'), null], `${translate('error_validate_field.retype_pwd')} ${translate('error_validate_field.not_match')}!`),
  });

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

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const detectNavigationSignUpSocial = (isUpdatedProfile: boolean, isInvited: boolean) => {
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
              Keyboard.dismiss();
              setTimeout(() => {
                // Hide loading
                NavigationActionsService.hideLoading();
                detectNavigationSignUpSocial(data.is_updated_profile, data.isInvited);
              }, 700);
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
        NavigationActionsService.showLoading();

        if (!data) {
          // handle this however suites the flow of your app
          Alert.alert(translate('alert.title_error'), translate('alert.message_error_default'));
          return;
        }

        // Call API
        dispatch(
          loginFacebook({
            accessToken: data.accessToken,
            onSuccess: (data: any) => {
              Keyboard.dismiss();
              setTimeout(() => {
                // Hide loading
                NavigationActionsService.hideLoading();
                detectNavigationSignUpSocial(data.is_updated_profile, data.isInvited);
              }, 700);
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
        Alert.alert(translate('alert.title_error'), e?.message ?? '');
      }, 700);
    }
  };

  const logOutFacebookIfNeeded = async () => {
    const data = await AccessToken.getCurrentAccessToken();
    if (data.accessToken) {
      LoginManager.logOut();
    }
  };

  const onSignup = (values: any, { resetForm }: any) => {
    NavigationActionsService.showLoading();
    dispatch(
      signUp({
        body: {
          email: values.email,
          password1: values.password,
          password2: values.confirmPassword,
        },
        onSuccess: () => {
          Keyboard.dismiss();
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            resetForm({ values: '' })
            NavigationActionsService.push(PERSONAL_INFO_TENANT);
          }, 700);
        },
        onFail: error => {
          Keyboard.dismiss();
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error &&
              Alert.alert(translate('alert.title_error'), error.message, [
                { text: translate('alert.ok'), onPress: () => getInputRef(0).focus() },
              ]);
          }, 700);
        },
      }),
    );
  };

  const onLogin = () => {
    NavigationActionsService.pop();
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

      // show loading
      NavigationActionsService.showLoading();
      if (user && authorizationCode) {
        dispatch(
          loginApple({
            data: {
              access_token: '',
              code: authorizationCode,
            },
            onSuccess: (data: any) => {
              Keyboard.dismiss();
              setTimeout(() => {
                NavigationActionsService.hideLoading();
                detectNavigationSignUpSocial(data.is_updated_profile, data.isInvited);
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

  const renderInputFields = () => {
    return (
      <Formik initialValues={{ email: '', password: '', confirmPassword: '' }} onSubmit={onSignup} validationSchema={validateSchema}>
        {({ handleSubmit, values, errors, handleChange, touched, isValid, handleBlur }) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              inputRef={(input: any) => putInputRef(input)}
              description={`${translate('authentication.email')}:`}
              onChangeText={handleChange('email')}
              onSubmitEditing={() => getInputRef(1).focus()}
              autoCapitalize="none"
              returnKeyType="next"
              keyboardType="email-address"
              value={values.email}
              onFocus={() => setCurrentInputIndex(0)}
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <CustomInput
              inputRef={(input: any) => putInputRef(input)}
              description={`${translate('authentication.password')}:`}
              onChangeText={handleChange('password')}
              onSubmitEditing={() => getInputRef(2).focus()}
              autoCapitalize="none"
              returnKeyType="next"
              secureTextEntry
              onFocus={() => setCurrentInputIndex(1)}
              value={values.password}
              onBlur={handleBlur('password')}
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            <CustomInput
              inputRef={(input: any) => putInputRef(input)}
              description={`${translate('authentication.retype_password')}:`}
              onChangeText={handleChange('confirmPassword')}
              onSubmitEditing={handleSubmit}
              autoCapitalize="none"
              returnKeyType="done"
              secureTextEntry
              value={values.confirmPassword}
              onFocus={() => setCurrentInputIndex(2)}
              onBlur={handleBlur('confirmPassword')}
            />
            <ErrorMessage errorValue={touched.confirmPassword && errors.confirmPassword} />
            <CustomButton
              onPress={() => checkInternet.processFunction(handleSubmit)}
              style={styles.buttonContainer}
              textStyle={styles.buttonTitle}
              text={translate('authentication.submit_button')}
            />
          </View>
        )}
      </Formik>
    );
  };

  const renderHaveAccount = () => {
    return (
      <View style={styles.haveAccountContainer}>
        <View style={styles.divider} />
        <View style={styles.haveAccountContent}>
          <CustomText style={styles.haveAccountText} text={translate('authentication.you_are_a_member')} />
          <CustomTouchable onPress={onLogin}>
            <CustomText style={styles.titleSmall} text={translate('authentication.signin')} />
          </CustomTouchable>
          <CustomText style={styles.haveAccountText} text={translate('authentication.now')} />
        </View>
      </View>
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
    < View style={styles.containerSocial} >
      <CustomText style={styles.textSocial} text={translate('authentication.signup_social')} />
      <View style={styles.containerButtonSocial}>
        <FacebookButton isLogin={false} style={styles.facebookButton} onPress={onPressFaceBookButton} />
        <GoogleButton isLogin={false} style={styles.googleButton} onPress={onPressGoogleButton} />
        {Platform.OS === 'ios' && VERSION_DEVICE >= VERSION_DEVICE_SIGN_UP_APPLE && <ButtonApple isLogin={false} onPress={onPressAppleButton} />}
      </View>
    </View >
  );

  return (
    <View style={{ flex: 1 }}>
      <Container barStyle={'light-content'}>
        <ImageBackground source={BG_SIGNIN} style={styles.logo} resizeMode={'stretch'}>
          <KeyboardAwareScrollView
            bounces={false}
            enableOnAndroid
            extraScrollHeight={isAndroid() ? 50 : 0}
            style={styles.container}
            contentContainerStyle={styles.contentContainerStyle}
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <FastImage resizeMode="contain" source={LOGO} style={[styles.logoReup]} />
              <CustomText style={styles.headerTitle} text={translate('authentication.signup_button')} />
              <CustomText style={styles.headerDescription} text={translate('authentication.fill_in_the_form_below_to_become_our_member')} />
              {renderInputFields()}
              {renderSocialButton()}
              {renderHaveAccount()}
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </Container>
      <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
        <CustomAccessory
          currentInputIndex={currentInputIndex}
          numberOfInput={3}
          onPressDown={nextInput}
          onPressUp={previousInput}
          onPressDone={doneTyping}
        />
      </KeyboardAccessoryView>
    </View>
  );
};

export default SignUpTenant;
