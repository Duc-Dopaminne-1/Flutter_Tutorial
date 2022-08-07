import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import I18n from 'app/i18n'
import FacebookIcon from 'app/assets/images/facebook.png';
import GoogleIcon from 'app/assets/images/google.png';
import LinkedinIcon from 'app/assets/images/linkedin.png';
import InstagramIcon from 'app/assets/images/instagram.png';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import {colors, fonts} from "../../constants";

class SocialMediaButton extends React.Component {
  render() {
    let { containerStyle, type, onPress } = this.props;
    let btnText = '', btnStyle = {}, icon;
    switch (type) {
      case 'facebook':
        btnText = I18n.t('signInFacebook');
        btnStyle = { backgroundColor: '#3c5a9a' };
        icon = FacebookIcon;
        break;
      case 'sign_up_facebook':
        btnText = I18n.t('signUpFacebook');
        btnStyle = { backgroundColor: '#3c5a9a' };
        icon = FacebookIcon;
        break;
      case 'google':
        btnText = I18n.t('signInGoogle');
        btnStyle = { backgroundColor: '#f53e39' };
        icon = GoogleIcon;
        break;
      case 'sign_up_google':
        btnText = I18n.t('signUpGoogle');
        btnStyle = { backgroundColor: '#f53e39' };
        icon = GoogleIcon;
        break;
      case 'linkedin':
        btnText = I18n.t('signUpLinkedin');
        btnStyle = { backgroundColor: '#006699' };
        icon = LinkedinIcon;
        break;
      case 'instagram':
        btnText = I18n.t('signUpInstagram');
        btnStyle = { backgroundColor: '#ff1493' };
        icon = InstagramIcon;
        break;
      default:
        break;
    }

    if (type === 'apple') {
      return (
        <AppleButton
          style={[containerStyle, {height: 40}]}
          cornerRadius={1}
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          onPress={onPress}
        />
      );
    } else if (type === 'sign_up_apple'){
        return (
            <AppleButton
                style={[containerStyle, {height: 40}]}
                cornerRadius={1}
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_UP}
                onPress={onPress}
            />
        );
    }

    return (
      <TouchableOpacity style={[styles.container, btnStyle, containerStyle]} onPress={onPress}>
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} resizeMode='contain' />
        </View>

          <Text style={styles.text}>
            {btnText}
          </Text>

      </TouchableOpacity>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.gray025
  },
  icon: {
    width: 20,
    height: 20
  },
  text: {
    paddingHorizontal: 10,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: fonts.family.HNLight,
    color: colors.white
  }
});

SocialMediaButton.propTypes = {
  containerStyle: PropTypes.object,
  type: PropTypes.string,
  onPress: PropTypes.func
};

export default SocialMediaButton;