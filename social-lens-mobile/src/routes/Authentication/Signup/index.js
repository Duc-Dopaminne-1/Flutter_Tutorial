import React from "react";
import {
  View,
  Image,
  TextInput,
  Text,
  Linking,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppContext, Button, SocialMediaButton } from "app/components";
import { AuthController } from "app/controllers";
import { alert } from "app/utils/Alert";
import styles from "./style";
import EmailIcon from "app/assets/images/email_icon.png";
import PasswordIcon from "app/assets/images/password_icon.png";
import CheckedIcon from "app/assets/images/checked_icon.png";
import UncheckedIcon from "app/assets/images/unchecked_icon.png";
import I18n from 'app/i18n'
import {typeError} from "../../../constants/error";

const emailRegEx =
  // eslint-disable-next-line max-len
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      agreeTerms: false,
      device: props.navigation.state.params.device,
    };
  }

  inputChanged = (type, value) => {
    this.setState({
      [type]: value,
    });
  };

  checkValidation = () => {
    let { email, password } = this.state;
    if (!email) {
      throw new Error(I18n.t('emailCanNotEmptySignUp'));
    }
    if (!emailRegEx.test(email)) {
      throw new Error(I18n.t('emailNotValid'));
    }
    if (!password) {
      throw new Error(I18n.t('passwordCanNotEmptySignUp'));
    }
    if (password.length < 6) {
      throw new Error(I18n.t('passwordLongerThan'));
    }
    return true;
  };

  goToLogin = () => {
    this.props.navigation.goBack();
  };

  goToTerms = () => {
    let url = "https://www.sociallensresearch.com/privacy-policy";
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("SIGNUP / PRIVACY ERROR: Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  handleSocialMediaLogin = (type) => async () => {
    const { showLoading, hideLoading, setAuthCheck, setUser } = this.context;

    await setAuthCheck("signup");
    showLoading();

    let res = null;

    try {
      switch (type) {
        case "facebook":
          res = await AuthController.loginWithFacebook(this.state.device);
          break;
        case "google":
          res = await AuthController.loginWithGoogle(this.state.device);
          break;
        case "apple":
          res = await AuthController.loginWithApple(this.state.device);
          break;
        default:
          break;
      }

      if (!res) {
        hideLoading();
        return;
      }
      if (res.isNew) {
        hideLoading();
        this.props.navigation.navigate("setprofile", {
          userInfo: res.userInfo,
        });
      } else {
        let user = await AuthController.getUser();
        if (!user) {
          hideLoading();
          this.props.navigation.navigate("setprofile", {
            userInfo: res.userInfo,
          });
        } else {
          setUser(user);
          hideLoading();
          this.props.navigation.navigate("authenticated");
        }
      }
    } catch (error) {
      console.log("SIGNUP / SOCIAL LOGIN ERROR: ", error);

      hideLoading();
      alert(error.message);
    }
  };

  handleRegister = async () => {
    let { email, password, device } = this.state;
    const { showLoading, hideLoading, setAuthCheck } = this.context;

    try {
      if (!this.checkValidation()) {
        return;
      }

      await setAuthCheck("signup");
      showLoading();

      await AuthController.signUp({
        email,
        password,
        device,
      });
      hideLoading();
      this.props.navigation.navigate("verification");
    } catch (error) {
      hideLoading();
      if(error.code === typeError.emailAlreadyUse) {
        alert(I18n.t('useByAnotherAccount'));
      } else {
        alert(error.message);
      }
    }
  };

  handleAgreeTerms = () => {
    this.setState({
      agreeTerms: !this.state.agreeTerms,
    });
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{I18n.t('joinLensEngage')}</Text>
        <Text style={styles.details}>{I18n.t('buildBetterProduct')}</Text>
        <View style={styles.socialmediaContainer}>
          <SocialMediaButton
            containerStyle={styles.socialmedia}
            type="sign_up_facebook"
            onPress={this.handleSocialMediaLogin("facebook")}
          />
          <SocialMediaButton
            containerStyle={styles.socialmedia}
            type="sign_up_google"
            onPress={this.handleSocialMediaLogin("google")}
          />
          {Platform.OS === "ios" ? (
            <SocialMediaButton
              containerStyle={styles.socialmedia}
              type="sign_up_apple"
              onPress={this.handleSocialMediaLogin("apple")}
            />
          ) : null}
        </View>
        <View style={styles.orContainer}>
          <View style={styles.separator} />
          <Text style={styles.orText}>{I18n.t('or')}</Text>
          <View style={styles.separator} />
        </View>
        <View style={styles.inputItem}>
          <Image source={EmailIcon} style={styles.icon} resizeMode="contain" />
          <TextInput
            style={styles.input}
            placeholder={I18n.t('email')}
            value={this.state.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => this.inputChanged("email", value)}
          />
        </View>
        <View style={styles.inputItem}>
          <Image
            source={PasswordIcon}
            style={styles.icon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder={I18n.t('password')}
            value={this.state.password}
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={(value) => this.inputChanged("password", value)}
          />
        </View>
        <View style={styles.termsContainer}>
          <TouchableOpacity
              hitSlop={{top: 15, bottom: 30, left: 30, right: 10}}
              activeOpacity={1} onPress={this.handleAgreeTerms}>
            <Image
              source={this.state.agreeTerms ? CheckedIcon : UncheckedIcon}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.terms} onPress={this.handleAgreeTerms}>{I18n.t('agreeWithLensEngage')}<Text style={styles.here} onPress={this.goToTerms}>{I18n.t('conditions')}</Text>
          </Text>
        </View>
        <Button
          disabled={!this.state.agreeTerms}
          containerStyle={
            this.state.agreeTerms
              ? styles.registerBtn
              : styles.registerBtnDisabled
          }
          textStyle={styles.registerText}
          text={I18n.t('register')}
          onPress={this.handleRegister}
        />
        <View style={styles.linkContainer}>
          <Text style={styles.description}>
            {I18n.t('alreadyRegistered')}
            <Text style={styles.here} onPress={this.goToLogin}>
              {I18n.t('here')}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

SignupScreen.contextType = AppContext;

SignupScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SignupScreen;
