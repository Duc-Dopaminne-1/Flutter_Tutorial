import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {changePassword, handleUnAuthorizedRequest} from '../../../api/authApi';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import CustomButton from '../../../components/Button/CustomButton';
import {PasswordInputSection} from '../../../components/InputSection';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import ValidateInput from '../../../utils/ValidateInput';
import ScreenIds from '../../ScreenIds';
import {AuthScreenConstants, AuthScreenStyles} from '../AuthComponents/AuthScreenContants';
import HeaderSignUp from '../AuthComponents/HeaderSignUp';

const styles = StyleSheet.create({
  inputsAreas: {
    marginTop: AuthScreenConstants.INPUTS_MARGIN_TOP,
  },
  textInput: {
    marginRight: AuthScreenConstants.INPUTS_MARGIN_RIGHT,
  },
  subInputNewPassword: {
    fontSize: 12,
    color: COLORS.TEXT_DARK_40,
    marginBottom: 16,
  },
});

export const ChangePasswordContainer = ({
  errorCurrentPassword,
  currentPassword,
  setCurrentPassword,
  errorPassword,
  password,
  setPassword,
  errorConfirmPassword,
  confirmPassword,
  setConfirmPassword,
  onPressButtonNext,
  canGoBack,
}) => {
  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea} testID={ScreenIds.ChangePassword}>
      <HeaderSignUp
        canGoBack={canGoBack}
        style={AuthScreenStyles.titleAreaWithButtonBack}
        title={translate(STRINGS.CHANGE_PASSWORD)}
        subTitle={translate(STRINGS.CHANGE_PASSWORD_DESC)}
      />
      <KeyboardScrollView>
        <View style={AuthScreenStyles.viewContainer}>
          <View style={styles.inputsAreas}>
            <PasswordInputSection
              isRequired
              error={errorCurrentPassword}
              headerTitle={translate(STRINGS.CURRENT_PASSWORD)}
              value={currentPassword}
              inputContainerStyle={styles.textInput}
              onChangeText={setCurrentPassword}
              placeholder={translate('changePassword.placeholder.curPassword')}
            />
            <PasswordInputSection
              isRequired
              error={errorPassword}
              headerTitle={translate(STRINGS.FILL_PASSWORD)}
              value={password}
              inputContainerStyle={styles.textInput}
              onChangeText={setPassword}
              placeholder={translate('changePassword.placeholder.newPassword')}
            />
            <Text style={styles.subInputNewPassword}>
              {translate('resetPassword.subInput.newPassword')}
            </Text>
            <PasswordInputSection
              isRequired
              error={errorConfirmPassword}
              headerTitle={translate(STRINGS.FILL_NEW_PASSWORD_AGAIN)}
              value={confirmPassword}
              inputContainerStyle={styles.textInput}
              onChangeText={setConfirmPassword}
              placeholder={translate('changePassword.placeholder.reNewPassword')}
            />
          </View>
        </View>
      </KeyboardScrollView>
      <CustomButton
        title={translate(STRINGS.CONFIRM)}
        style={[AuthScreenStyles.buttonNext, AuthScreenStyles.buttonBottom]}
        titleStyle={AuthScreenStyles.titleButtonNext}
        onPress={onPressButtonNext}
      />
    </SafeAreaScreenContainer>
  );
};

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

  const {showAppSpinner, showAppModal, showErrorAlert, setIsLoggedIn} = useContext(AppContext);

  const onError = error => {
    showAppSpinner(false);
    showErrorAlert(error.message);
  };

  const onSuccess = () => {
    showAppSpinner(false);
    setIsLoggedIn(false);
    handleUnAuthorizedRequest();
    const title = translate(STRINGS.SUCCESS);
    const message = translate(STRINGS.CHANGE_PASSWORD_SUCCESS);
    showAppModal({
      isVisible: true,
      title,
      message,
    });
  };

  const {startApi} = useApiCall({
    onError,
    onSuccess,
  });

  const onPressButtonNext = () => {
    const errCurrentPassword = ValidateInput.checkRequiredField(currentPassword);
    setErrorCurrentPassword(errCurrentPassword);

    const errPassword = ValidateInput.checkPassword(password);
    setErrorPassword(errPassword);

    const errConfirmPass = ValidateInput.checkConfirmPassword(password, confirmPassword);
    setErrorConfirmPassword(errConfirmPass);

    if (errCurrentPassword || errPassword || errConfirmPass) {
      return;
    }

    //Call API Change password
    showAppSpinner(true);
    startApi(async () => {
      const response = await changePassword(currentPassword, password, confirmPassword);
      return response;
    });
  };

  return (
    <ChangePasswordContainer
      errorCurrentPassword={errorCurrentPassword}
      currentPassword={currentPassword}
      setCurrentPassword={setCurrentPassword}
      errorPassword={errorPassword}
      password={password}
      setPassword={setPassword}
      errorConfirmPassword={errorConfirmPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      onPressButtonNext={onPressButtonNext}
    />
  );
};

export default ChangePasswordScreen;
