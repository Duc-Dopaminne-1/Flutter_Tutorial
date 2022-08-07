import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {KEY_BOARD_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import CustomButton from '../../../components/Button/CustomButton';
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import LinkTextButton from '../../../components/LinkTextButton';
import OTPTextView from '../../../components/OTPTextView';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import ValidateInput from '../../../utils/ValidateInput';
import ScreenIds from '../../ScreenIds';
import {AuthScreenConstants, AuthScreenStyles} from './AuthScreenContants';
import HeaderSignUp from './HeaderSignUp';

export const ConfirmOTPContainer = ({
  setTextOTP,
  errorOtp,
  onPressSendAgain,
  onPressButtonNext,
  canGoBack,
  autoFocus = true,
}) => {
  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea} testID={ScreenIds.ConfirmOTP}>
      <HeaderSignUp
        canGoBack={canGoBack}
        title={translate(STRINGS.CONFIRM_OTP)}
        subTitle={translate('signup.otp.subTitle')}
      />
      <KeyboardScrollView scrollEnabled={false}>
        <View style={AuthScreenStyles.viewContainer}>
          <OTPTextView
            autoFocus={autoFocus}
            containerStyle={styles.textInputContainer}
            handleTextChange={setTextOTP}
            inputCount={6}
            keyboardType={KEY_BOARD_TYPE.OTP}
          />
          {errorOtp ? <Text style={styles.textError}>{translate(errorOtp)}</Text> : null}
          <View style={styles.viewFooterText}>
            <Text style={styles.textNotReceiveOTP}>{translate(STRINGS.NOT_RECEIVE_OTP)}</Text>
            <LinkTextButton title={translate(STRINGS.SEND_AGAIN)} onPress={onPressSendAgain} />
          </View>
        </View>
        <KeyboardAccessoryView androidAdjustResize>
          {() => (
            <CustomButton
              title={translate('common.confirm')}
              style={AuthScreenStyles.buttonNext}
              titleStyle={AuthScreenStyles.titleButtonNext}
              onPress={onPressButtonNext}
            />
          )}
        </KeyboardAccessoryView>
      </KeyboardScrollView>
    </SafeAreaScreenContainer>
  );
};

const ConfirmOTPComponent = ({mobilePhone, confirmOtpApi, sendAgainApi, successCallback}) => {
  const [textOTP, setTextOTP] = useState('');
  const [errorOtp, setErrorOtp] = useState('');
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);

  const onErrorConfirmOtp = error => {
    showAppSpinner(false);
    Message.hasOwnProperty(error?.message)
      ? setErrorOtp(error?.message)
      : showErrorAlert(error?.message);
  };

  const onSuccessConfirmOtp = data => {
    showAppSpinner(false);
    successCallback && successCallback(data);
  };

  const {startApi: startApiConfirmOtp} = useApiCall({
    onError: onErrorConfirmOtp,
    onSuccess: onSuccessConfirmOtp,
  });

  const onErrorResendOtp = error => {
    showAppSpinner(false);
    showErrorAlert(error?.message);
  };

  const onSuccessResendOtp = () => {
    showAppSpinner(false);
  };

  const {startApi: startApiResendOtp} = useApiCall({
    onError: onErrorResendOtp,
    onSuccess: onSuccessResendOtp,
  });

  const onPressSendAgain = () => {
    showAppSpinner(true);
    startApiResendOtp(async () => {
      const sendAgainResponse = await sendAgainApi(mobilePhone);
      return sendAgainResponse;
    });
  };

  const onPressButtonNext = () => {
    const errOtp = ValidateInput.checkOtp(textOTP);
    setErrorOtp(errOtp);
    if (errOtp) {
      return;
    }
    showAppSpinner(true);
    startApiConfirmOtp(async () => {
      const confirmResponse = await confirmOtpApi(mobilePhone, textOTP);
      return confirmResponse;
    });
  };

  return (
    <ConfirmOTPContainer
      setTextOTP={setTextOTP}
      errorOtp={errorOtp}
      onPressSendAgain={onPressSendAgain}
      onPressButtonNext={onPressButtonNext}
    />
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    marginTop: AuthScreenConstants.INPUTS_MARGIN_TOP,
    marginRight: AuthScreenConstants.INPUTS_MARGIN_RIGHT,
  },
  textError: {
    marginTop: 10,
    ...AuthScreenConstants.TEXT_FONT,
    fontSize: AuthScreenConstants.TEXT_FONT_SIZE,
    color: COLORS.STATE_ERROR,
  },
  textNotReceiveOTP: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
  viewFooterText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: AuthScreenConstants.INPUTS_MARGIN_TOP,
  },
});

export default ConfirmOTPComponent;
