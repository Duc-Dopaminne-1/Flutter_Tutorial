import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import LineTextInput from '../../../components/LineTextInput';
import RoundButtonNext from '../../../components/RoundButtonNext';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import ValidateInput from '../../../utils/ValidateInput';
import ScreenIds from '../../ScreenIds';
import {AuthScreenStyles} from '../AuthComponents/AuthScreenContants';
import HeaderSignUp from '../AuthComponents/HeaderSignUp';

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
  },
  titleArea: {
    marginTop: 30,
  },
  textInput: {
    paddingTop: 30,
    marginRight: 100,
  },
  buttonBack: {
    marginTop: 20,
    width: 20,
  },
  imageBackground: {
    width: 99,
    height: 443.1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    resizeMode: 'center',
  },
  footerView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

const SetPasswordScreen = ({navigation}) => {
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPass, setErrorConfirmPass] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onPressBack = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  const onPressButtonNext = () => {
    setErrorConfirmPass('');
    const errPass = ValidateInput.checkPassword(password);
    setErrorPassword(errPass);
    if (errPass) {
      return;
    }

    if (password !== confirmPassword) {
      setErrorConfirmPass(Message.MRG_ERR_007);
    }
    //CALLING API

    navigation.navigate(ScreenIds.Welcome);
  };
  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea} testID={ScreenIds.SetPassword}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={AuthScreenStyles.viewContainer}>
          <TouchableOpacity style={styles.buttonBack} onPress={onPressBack}>
            <Image source={IMAGES.IC_SIGNUP_BACK} />
          </TouchableOpacity>
          <HeaderSignUp
            style={styles.titleArea}
            title={translate(STRINGS.SET_PASSWORD)}
            subTitle={translate(STRINGS.SET_PASSWORD_SUBTITLE)}
          />
          <LineTextInput
            error={errorPassword}
            style={styles.textInput}
            placeholder={translate(STRINGS.PASSWORD)}
            isRequired={true}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <LineTextInput
            error={errorConfirmPass}
            style={styles.textInput}
            placeholder={translate(STRINGS.CONFIRM_PASSWORD)}
            isRequired={true}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />

          <View style={styles.footerView}>
            <RoundButtonNext onPress={onPressButtonNext} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Image style={styles.imageBackground} source={IMAGES.SIGNUP_BG} />
    </SafeAreaScreenContainer>
  );
};

export default SetPasswordScreen;
