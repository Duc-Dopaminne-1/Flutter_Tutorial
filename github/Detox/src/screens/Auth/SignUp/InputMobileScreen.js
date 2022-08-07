import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {postMobilePhone} from '../../../api/authApi';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {KEY_BOARD_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import CustomButton from '../../../components/Button/CustomButton';
import InputSection from '../../../components/InputSection';
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import LinkTextButton from '../../../components/LinkTextButton';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import ValidateInput from '../../../utils/ValidateInput';
import ScreenIds from '../../ScreenIds';
import {AuthScreenStyles} from '../AuthComponents/AuthScreenContants';
import HeaderSignUp from '../AuthComponents/HeaderSignUp';

const InputMobileScreen = ({navigation, route}) => {
  const [errorMobile, setErrorMobile] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);

  const onError = error => {
    showAppSpinner(false);

    Message.hasOwnProperty(error.message)
      ? setErrorMobile(error.message)
      : showErrorAlert(error.message);
  };

  const onSuccess = () => {
    showAppSpinner(false);
    navigation.navigate(ScreenIds.ConfirmOTP, {
      mobilePhone: mobilePhone,
      nextScreenId: ScreenIds.InfoAccount,
      inviteCode: route?.params?.inviteCode,
    });
  };

  const {startApi} = useApiCall({
    onError,
    onSuccess,
  });

  const onPressButtonNext = () => {
    const errMobile = ValidateInput.checkMobilePhone(mobilePhone);
    setErrorMobile(errMobile);
    if (errMobile) {
      return;
    }
    showAppSpinner(true);
    startApi(async () => {
      const postResponse = await postMobilePhone(mobilePhone);
      return postResponse;
    });
  };

  const onPressToLogin = async () => {
    navigation.navigate(ScreenIds.Login);
  };

  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea} testID={ScreenIds.InputMobile}>
      <HeaderSignUp />
      <KeyboardScrollView scrollEnabled={false}>
        <View style={AuthScreenStyles.viewContainer}>
          <Text style={styles.title}>{translate('signup.phone.title')}</Text>
          <Text style={styles.subTitle}>{translate('signup.phone.subTitle')}</Text>
          <InputSection
            isRequired
            headerTitle={translate(STRINGS.PHONE_NUMBER)}
            value={mobilePhone}
            autoFocus={true}
            inputStyle={styles.textInput}
            error={errorMobile}
            keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
            onChangeText={setMobilePhone}
            placeholder={translate('signup.mobile.placeholders.phoneNumber')}
          />
        </View>
        <KeyboardAccessoryView style={AuthScreenStyles.bottomView} androidAdjustResize>
          {() => (
            <>
              <CustomButton
                title={translate(STRINGS.SIGNUP)}
                style={[AuthScreenStyles.buttonNext, styles.buttonSignup]}
                titleStyle={AuthScreenStyles.titleButtonNext}
                onPress={onPressButtonNext}
              />
              <View style={AuthScreenStyles.viewBottomText}>
                <Text style={{...FONTS.regular}}>{translate('signup.phone.alreadyAccount')} </Text>
                <LinkTextButton
                  style={styles.linkTextButton}
                  onPress={onPressToLogin}
                  title={translate(STRINGS.LOGIN)}
                />
              </View>
            </>
          )}
        </KeyboardAccessoryView>
      </KeyboardScrollView>
    </SafeAreaScreenContainer>
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
  textInput: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    paddingLeft: 10,
    borderColor: COLORS.SEPARATOR_LINE,
  },
  buttonSignup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTextButton: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default InputMobileScreen;
