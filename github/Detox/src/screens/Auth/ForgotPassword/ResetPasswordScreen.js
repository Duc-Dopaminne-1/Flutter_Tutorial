import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {resetPassword} from '../../../api/authApi';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import CustomButton from '../../../components/Button/CustomButton';
import {PasswordInputSection} from '../../../components/InputSection';
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import ValidateInput from '../../../utils/ValidateInput';
import {resetNavigatorToScreen} from '../../navigate';
import ScreenIds from '../../ScreenIds';
import {AuthScreenConstants, AuthScreenStyles} from '../AuthComponents/AuthScreenContants';
import HeaderSignUp from '../AuthComponents/HeaderSignUp';

const styles = StyleSheet.create({
  inputsAreas: {
    marginTop: AuthScreenConstants.INPUTS_MARGIN_TOP,
  },
  textInput: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.SEPARATOR_LINE,
  },
  subInputNewPassword: {
    fontSize: 12,
    color: COLORS.TEXT_DARK_40,
    marginBottom: 16,
  },
});

const ResetPasswordScreen = ({navigation, route}) => {
  const params = route?.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);

  const onError = error => {
    showAppSpinner(false);
    showErrorAlert(error.message);
  };

  const onSuccess = () => {
    showAppSpinner(false);
    resetNavigatorToScreen(navigation, ScreenIds.ResetPasswordComplete);
  };

  const {startApi} = useApiCall({
    onError,
    onSuccess,
  });

  const onPressButtonNext = () => {
    const errPassword = ValidateInput.checkPassword(password);
    setErrorPassword(errPassword);

    const errConfirmPass = ValidateInput.checkConfirmPassword(password, confirmPassword);
    setErrorConfirmPassword(errConfirmPass);

    if (errPassword || errConfirmPass) {
      return;
    }
    startApi(async () => {
      showAppSpinner(true);
      const resetResponse = await resetPassword(
        params.username,
        params.mobilePhone,
        password,
        params.otpKey,
      );
      return resetResponse;
    });
  };

  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea} testID={ScreenIds.ResetPassword}>
      <HeaderSignUp
        style={AuthScreenStyles.titleAreaWithButtonBack}
        title={translate('resetPassword.title')}
        subTitle={translate('resetPassword.subtitle')}
      />
      <KeyboardScrollView scrollEnabled={false}>
        <View style={AuthScreenStyles.viewContainer}>
          <View style={styles.inputsAreas}>
            <PasswordInputSection
              isRequired
              headerTitle={translate('resetPassword.titleInput.newPassword')}
              value={password}
              inputContainerStyle={styles.textInput}
              error={errorPassword}
              onChangeText={setPassword}
              placeholder={translate('resetPassword.placeHolder.newPassword')}
            />
            <Text style={styles.subInputNewPassword}>
              {translate('resetPassword.subInput.newPassword')}
            </Text>
            <PasswordInputSection
              isRequired
              headerTitle={translate('resetPassword.titleInput.reNewPassword')}
              value={confirmPassword}
              inputContainerStyle={styles.textInput}
              error={errorConfirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={translate('resetPassword.placeHolder.reNewPassword')}
            />
          </View>
        </View>
        <KeyboardAccessoryView style={AuthScreenStyles.bottomView} androidAdjustResize>
          {() => (
            <CustomButton
              title={translate(STRINGS.CONFIRM)}
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

export default ResetPasswordScreen;
