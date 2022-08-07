import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {forgotPassword} from '../../../api/authApi';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {KEY_BOARD_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import CustomButton from '../../../components/Button/CustomButton';
import InputSection from '../../../components/InputSection';
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import {Captcha} from '../../../components/RecaptchaV2/Captcha';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import ValidateInput from '../../../utils/ValidateInput';
import ScreenIds from '../../ScreenIds';
import {AuthScreenConstants, AuthScreenStyles} from '../AuthComponents/AuthScreenContants';
import HeaderSignUp from '../AuthComponents/HeaderSignUp';

const styles = StyleSheet.create({
  inputsArea: {
    marginTop: AuthScreenConstants.INPUTS_MARGIN_TOP,
    marginRight: AuthScreenConstants.INPUTS_MARGIN_RIGHT,
  },
  inputStyle: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    paddingLeft: 10,
    borderColor: COLORS.SEPARATOR_LINE,
  },
});

export const ForgotPassContainer = ({
  mobilePhone,
  errorMobile,
  setMobilePhone,
  canGoBack,
  onPressButtonNext,
}) => {
  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea} testID={ScreenIds.ForgotPassword}>
      <HeaderSignUp
        canGoBack={canGoBack}
        style={AuthScreenStyles.titleAreaWithButtonBack}
        title={translate('forgotPassword.title')}
        subTitle={translate('forgotPassword.subTitle')}
      />
      <KeyboardScrollView scrollEnabled={false}>
        <View style={AuthScreenStyles.viewContainer}>
          <View style={styles.inputsArea}>
            <InputSection
              isRequired
              headerTitle={translate(STRINGS.MOBILE_PHONE)}
              value={mobilePhone}
              inputStyle={styles.inputStyle}
              keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
              error={errorMobile}
              onChangeText={setMobilePhone}
              placeholder={translate('forgotPassword.placeholders.phoneNumber')}
            />
          </View>
        </View>
        <KeyboardAccessoryView androidAdjustResize>
          {() => (
            <CustomButton
              title={translate(STRINGS.NEXT)}
              style={[AuthScreenStyles.buttonNext]}
              titleStyle={AuthScreenStyles.titleButtonNext}
              onPress={onPressButtonNext}
            />
          )}
        </KeyboardAccessoryView>
      </KeyboardScrollView>
    </SafeAreaScreenContainer>
  );
};

const ForgotPasswordScreen = ({navigation}) => {
  const [mobilePhone, setMobilePhone] = useState('');
  const [errorMobile, setErrorMobile] = useState('');
  const captchaRef = useRef(null);
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);

  const onError = error => {
    showAppSpinner(false);
    const message = Message.hasOwnProperty(error.message)
      ? translate(error.message)
      : error.message;
    showErrorAlert(message);
  };

  const onSuccess = async () => {
    showAppSpinner(false);
    navigation.navigate(ScreenIds.ForgotPasswordConfirmOtp, {
      mobilePhone: mobilePhone,
      nextScreenId: ScreenIds.ResetPassword,
    });
  };

  const {startApi} = useApiCall({onError, onSuccess});

  const onPressButtonNext = () => {
    const errMobile = ValidateInput.checkMobilePhone(mobilePhone);
    setErrorMobile(errMobile);
    if (errMobile) {
      return;
    }
    // CallAPI
    captchaRef?.current?.show(captcha => {
      showAppSpinner(true);
      startApi(async () => {
        const forgotResponse = await forgotPassword(mobilePhone, captcha);
        return forgotResponse;
      });
    });
  };

  return (
    <Captcha ref={captchaRef}>
      <ForgotPassContainer
        mobilePhone={mobilePhone}
        errorMobile={errorMobile}
        setMobilePhone={setMobilePhone}
        onPressButtonNext={onPressButtonNext}
      />
    </Captcha>
  );
};

export default ForgotPasswordScreen;
