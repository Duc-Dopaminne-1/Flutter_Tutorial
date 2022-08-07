import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {deactiveSessionToken, login} from '../../api/authApi';
import {useGetUserStartupData} from '../../api/masterData/useGetUserStartupData';
import {useApiCall} from '../../api/restful/useApiCall';
import {AppContext} from '../../appData/appContext/useAppContext';
import {setAuthState} from '../../appData/authState';
import * as userActions from '../../appData/user/actions';
import {getUserName} from '../../appData/user/selectors';
import {ERROR_AUTH} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import CustomButton from '../../components/Button/CustomButton';
import ErrorText from '../../components/ErrorText';
import InputSection, {PasswordInputSection} from '../../components/InputSection';
import KeyboardAccessoryView from '../../components/KeyboardAccessoryView';
import KeyboardScrollView from '../../components/KeyboardScrollView';
import LinkTextButton from '../../components/LinkTextButton';
import SafeAreaScreenContainer from '../../components/SafeAreaScreenContainer';
import {isAllowedLoginRole, parseUserData} from '../../service/userData';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import {testProps} from '../../utils/testProps';
import ValidateInput from '../../utils/ValidateInput';
import {ids} from '../ids';
import {excuteCallbackLoginSuccess} from '../navigate';
import useGetUnReadNotification from '../Notification/useGetUnReadNotification';
import ScreenIds from '../ScreenIds';
import {
  AuthError,
  AuthScreenConstants,
  AuthScreenStyles,
} from './AuthComponents/AuthScreenContants';
import HeaderSignUp from './AuthComponents/HeaderSignUp';

const extraScrollHeight = Platform.OS === 'ios' ? 0 : 100;

export const LoginContainer = ({
  errorPassword,
  errorUserName,
  errorMessage,
  setPassword,
  setUserName,
  onPressToSignUp,
  onPressToForgotPassword,
  onPressButtonNext,
  username,
  password,
  canGoBack,
}) => {
  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea}>
      <HeaderSignUp canGoBack={canGoBack} />
      <KeyboardScrollView extraScrollHeight={extraScrollHeight}>
        <View style={AuthScreenStyles.viewContainer} testID={ScreenIds.Login}>
          <Text style={styles.title}>{translate('login.title')}</Text>
          <Text style={styles.subTitle}>{translate('login.subTitle')}</Text>
          <View style={styles.inputsArea}>
            <InputSection
              isRequired
              error={errorUserName}
              headerTitle={translate('login.field.userName')}
              placeholder={translate('login.placeholder.userName')}
              value={username}
              inputStyle={styles.textInput}
              onChangeText={setUserName}
            />

            <PasswordInputSection
              isRequired
              error={errorPassword}
              headerTitle={translate('login.field.password')}
              placeholder={translate('login.placeholder.password')}
              value={password}
              inputContainerStyle={styles.textInput}
              onChangeText={setPassword}
            />
            <View style={styles.viewBottom}>
              <View style={{...HELPERS.fill}} />
              <LinkTextButton
                {...testProps(ids.login.forgotButton)}
                style={styles.forgotPassword}
                onPress={onPressToForgotPassword}
                title={translate('login.forgotPassword')}
              />
            </View>
          </View>
        </View>
      </KeyboardScrollView>
      {!!errorMessage && (
        <KeyboardAccessoryView style={AuthScreenStyles.bottomView}>
          <View style={styles.errorContainer}>
            <ErrorText textStyle={styles.errorText} errorText={errorMessage} />
          </View>
        </KeyboardAccessoryView>
      )}
      <KeyboardAccessoryView inSafeAreaView style={AuthScreenStyles.bottomView}>
        {() => (
          <>
            <CustomButton
              {...testProps(ids.login.loginButton)}
              title={translate('common.login')}
              style={[AuthScreenStyles.buttonNext]}
              titleStyle={AuthScreenStyles.titleButtonNext}
              onPress={onPressButtonNext}
            />
            <View style={AuthScreenStyles.viewBottomText}>
              <Text style={{...FONTS.regular}}>{translate('login.notHaveAccount')} </Text>
              <LinkTextButton onPress={onPressToSignUp} title={translate('common.signUp')} />
            </View>
          </>
        )}
      </KeyboardAccessoryView>
    </SafeAreaScreenContainer>
  );
};

const useLimitSession = () => {
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);

  const {startApi} = useApiCall({
    onSuccess: () => {
      showAppSpinner(false);
    },
    onError: error => {
      showAppSpinner(false);
      showErrorAlert(error.message);
    },
  });

  const deactive = (token: String) => {
    showAppSpinner(true);
    startApi(async () => {
      const result = await deactiveSessionToken(token);
      return result;
    });
  };

  return {deactive};
};

const LoginScreen = ({navigation}) => {
  const {identify} = useAnalytics();
  const savedUsername = useSelector(getUserName);
  const [username, setUserName] = useState(savedUsername || '');
  const [password, setPassword] = useState('');
  const [errorUserName, setErrorUserName] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {showAppSpinner, showErrorAlert, setIsLoggedIn, showAppModal} = useContext(AppContext);
  const dispatch = useDispatch();
  const limitSessionHook = useLimitSession();
  const {getUnReadNotification} = useGetUnReadNotification();

  const onError = error => {
    showAppSpinner(false);
    if (error.message === ERROR_AUTH.LIMIT_SESSION) {
      setErrorMessage('');
      showAppModal({
        isVisible: true,
        message: translate('login.limitSession.message'),
        cancelText: translate('IGNORE'),
        okText: translate('CONTINUE'),
        onOkHandler: () => limitSessionHook.deactive(error.messageKey),
      });
    } else {
      if (String(error?.message).toLowerCase().includes(AuthError.INVALID_GRANT)) {
        setErrorMessage(translate('login.incorrectPassword'));
      } else {
        setErrorMessage('');
        showErrorAlert(error.message);
      }
    }
  };

  const onSuccessGetUserData = () => {
    showAppSpinner(false);
    setIsLoggedIn(true);
    getUnReadNotification();
    excuteCallbackLoginSuccess();
    navigation.navigate(ScreenIds.MainStack);
  };

  const {startGetUserData} = useGetUserStartupData({onSuccess: onSuccessGetUserData});

  const onSuccess = async data => {
    const {authState, user} = parseUserData(data);
    if (!isAllowedLoginRole(user?.role)) {
      onError({message: translate(Message.NTW_UNKNOWN_ERROR)});
      return;
    }

    await dispatch(setAuthState(authState));
    dispatch(userActions.update({username, ...user}));

    identify(user?.id, {
      email: user?.email,
      last_sign_in: new Date().toISOString(),
      signup_source: Platform.OS,
      optin_location: 'signin',
    });

    //get master data to use in the whole app
    startGetUserData(user?.id);
  };

  const {startApi} = useApiCall({onError, onSuccess});

  const onPressButtonNext = () => {
    const usernameTrim = username.trim();
    const errUsername = ValidateInput.checkRequiredField(usernameTrim);
    const errPassword = ValidateInput.checkRequiredField(password);
    setErrorUserName(errUsername);
    setErrorPassword(errPassword);
    if (errUsername || errPassword) {
      return;
    }
    //Call API Login
    showAppSpinner(true);
    startApi(async () => {
      const loginResponse = await login(usernameTrim, password);
      return loginResponse;
    });
  };
  const onPressToSignUp = () => {
    navigation.navigate(ScreenIds.InputMobile);
  };
  const onPressToForgotPassword = () => {
    navigation.navigate(ScreenIds.ForgotPassword);
  };

  return (
    <LoginContainer
      errorPassword={errorPassword}
      errorUserName={errorUserName}
      errorMessage={errorMessage}
      setPassword={setPassword}
      setUserName={setUserName}
      onPressToSignUp={onPressToSignUp}
      onPressToForgotPassword={onPressToForgotPassword}
      onPressButtonNext={onPressButtonNext}
      password={password}
      username={username}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    ...FONTS.bold,
    fontSize: 30,
    color: COLORS.TEXT_DARK_10,
    marginTop: 20,
  },
  subTitle: {
    ...FONTS.regular,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  inputsArea: {
    marginRight: AuthScreenConstants.INPUTS_MARGIN_RIGHT,
  },
  textInput: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    paddingLeft: 10,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  forgotPassword: {
    marginTop: 12,
  },
  viewBottom: {
    flex: 1,
    width: SCREEN_SIZE.WIDTH - 42,
    flexDirection: 'row',
  },
  errorText: {
    textAlign: 'center',
  },
});

export default LoginScreen;
