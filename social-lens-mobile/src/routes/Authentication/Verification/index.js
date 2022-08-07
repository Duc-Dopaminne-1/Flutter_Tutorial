import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import I18n from 'app/i18n'
import { AppContext, Button } from 'app/components';
import { AuthController } from 'app/controllers';
import { alert } from 'app/utils/Alert';

import styles from './styles';
import {typeError} from "../../../constants/error";

class VerificationScreen extends React.Component {
  handleResendSubmit = async () => {
    try {
      this.context.showLoading();
      await AuthController.sendEmailVerification();
      this.context.hideLoading();
      alert(I18n.t('verificationSuccessfully'));
    } catch (error) {
      this.context.hideLoading();
      if(error.code === typeError.manyRequests) {
        alert(I18n.t('manyRequest'));
      } else {
        alert(error.message);
      }
    }
  };

  handleNext = async () => {
    let user = firebase.auth().currentUser;
    await user.reload();
    user = firebase.auth().currentUser;

    if ( !user || (user && !user.emailVerified) ) {
      alert(I18n.t('notVerifiedYet'));
      return;
    }
    this.props.navigation.navigate('setprofile');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('checkYourEmail')}</Text>
        <Button 
          containerStyle={ styles.resendBtn }
          textStyle={styles.resend}
          text={I18n.t('resendEmail')}
          onPress={this.handleResendSubmit}
        />
        <Button
          containerStyle={styles.nextBtn}
          textStyle={styles.next}
          text={I18n.t('next')}
          onPress={this.handleNext}
        />
      </View>
    );
  }
}

VerificationScreen.contextType = AppContext;

VerificationScreen.propTypes = {
  navigation: PropTypes.object
};

export default VerificationScreen;