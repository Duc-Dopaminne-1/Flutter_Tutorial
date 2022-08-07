import React from 'react';
import { View, Image, TextInput, Text } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'app/i18n'
import { AppContext, Button } from 'app/components';
import { AuthController } from 'app/controllers';
import { alert, success } from 'app/utils/Alert';

import styles from './style';

import EmailIcon from 'app/assets/images/email_icon.png';
import {typeError} from "../../../constants/error";

const emailRegEx =
  // eslint-disable-next-line max-len
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class PasswordResetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  inputChanged = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleReset = async () => {
    if (!emailRegEx.test(this.state.email)) {
      alert(I18n.t('emailNotValid'));
      return;
    }
    try {
      this.context.showLoading();
      await AuthController.forgotPassword(this.state.email);
      this.context.hideLoading();
      success(I18n.t('resetEmail'));
      this.props.navigation.goBack();
    } catch (error) {
      if (error.code === typeError.userNotFound){
        alert(I18n.t('userNotFound'));
        this.context.hideLoading();
      } else {
        alert(error.message);
        this.context.hideLoading();
      }
    }
  };

  goToLogin = () => {
    this.props.navigation.goBack();
  };
  
  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Text style={ styles.title }>{I18n.t('resetPassword')}</Text>
        <View style={ styles.inputItem }>
          <Image source={EmailIcon} style={ styles.icon } resizeMode='contain' />
          <TextInput 
            style={ styles.input }
            placeholder={I18n.t('email')}
            value={this.state.email}
            keyboardType='email-address'
            autoCapitalize="none"
            onChangeText={value => this.inputChanged('email', value)}
          />
        </View>
        <Button
          containerStyle={styles.resetBtn}
          textStyle={styles.reset}
          text={I18n.t('resetPasswordUpper')}
          onPress={this.handleReset}
        />
        <View style={styles.linkContainer}>
          <Text style={styles.description}>
            {I18n.t('alreadyRegistered')}
            <Text style={ styles.here } onPress={this.goToLogin}>
              {I18n.t('here')}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

PasswordResetScreen.contextType = AppContext;

PasswordResetScreen.propTypes = {
  navigation: PropTypes.object
};

export default PasswordResetScreen;
