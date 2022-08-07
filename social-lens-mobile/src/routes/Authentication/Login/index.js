import React from "react";
import { View, Image, TextInput, Text, Platform } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OneSignal from "react-native-onesignal";
import I18n from 'app/i18n'
import { AuthController } from "app/controllers";
import { AppContext, Button, SocialMediaButton } from "app/components";
import { alert } from "app/utils/Alert";
import styles from "./style";
import EmailIcon from "app/assets/images/email_icon.png";
import PasswordIcon from "app/assets/images/password_icon.png";
import {typeError} from "../../../constants/error";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      device: null,
    };

    OneSignal.addEventListener("ids", this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onIds = (device) => {
    this.setState({ device });
  };

  inputChanged = (type, value) => {
    this.setState({
      [type]: value,
    });
  };

  goToSignUp = () => {
    const { device } = this.state;
    this.props.navigation.navigate("signup", { device });
  };

  goToForgotpswd = () => {
    this.props.navigation.navigate("reset");
  };

  checkInputValidation = () => {
    let { email, password } = this.state;
    if (!email) {
      throw new Error(I18n.t('emailCanNotEmpty'));
    }
    if (!password) {
      throw new Error(I18n.t('passwordCanNotEmpty'));
    }
    return true;
  };

  handleLogin = async () => {
    let { email, password, device } = this.state;
    const userId = device ? device.userId : null;

    const { showLoading, hideLoading, setAuthCheck, setUser } = this.context;

    try {
      if (!this.checkInputValidation()) {
        return;
      }

      showLoading();
      await setAuthCheck("login");

      let user = await AuthController.logIn({
        email,
        password,
      });
      if (!user.emailVerified) {
        await AuthController.sendEmailVerification();
        this.props.navigation.navigate("verification");
      } else {
        let user = await AuthController.getUser();
        if (!user || !user.ethnicity) {
          //Remove check required field birthdate, we change to required ethnicity
          this.props.navigation.navigate("setprofile");
        } else {
          setUser(user);
          // update user with the device id
          await AuthController.updateUser({ userId });
          this.props.navigation.navigate("authenticated");
        }
      }
      hideLoading();
    } catch (error) {
      hideLoading();
      if(error.code === typeError.wrongPassword) {
        alert(I18n.t('wrongPassword'));
      } else if (error.code === typeError.userNotFound){
        alert(I18n.t('userNotFound'));
      } else if (error.code === typeError.invalidEmail){
        alert(I18n.t('invalidEmail'));
      } else if (error.code === typeError.userDisable){
        alert(I18n.t('userDisable'));
      } else if (error.code === typeError.networkError) {
        alert(I18n.t('networkError'));
      } else if(error.code === typeError.manyRequests) {
        alert(I18n.t('manyRequest'));
      } else {
        alert(error.message);
      }
    }
  };

  handleSocialMediaLogin = (type) => async () => {
    const { showLoading, hideLoading, setAuthCheck, setUser } = this.context;

    showLoading();
    await setAuthCheck("login");
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
      console.log("SIGNIN / SOCIAL LOGIN ERROR: ", error);

      hideLoading();
      alert(error.message);
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{I18n.t('loginLensEngage')}</Text>
        <Text style={styles.details}>{I18n.t('buildBetterProduct')}</Text>
        <View style={styles.socialmediaContainer}>
          <SocialMediaButton
            containerStyle={styles.socialmedia}
            type="facebook"
            onPress={this.handleSocialMediaLogin("facebook")}
          />
          <SocialMediaButton
            containerStyle={styles.socialmedia}
            type="google"
            onPress={this.handleSocialMediaLogin("google")}
          />
          {Platform.OS === "ios" ? (
            <SocialMediaButton
              containerStyle={styles.socialmedia}
              type="apple"
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
        <Button
          containerStyle={styles.loginBtn}
          textStyle={styles.login}
          text={I18n.t('login')}
          onPress={this.handleLogin}
        />
        <View style={styles.linkContainer}>
          <Text style={styles.description}>
            {I18n.t('needToRegister')}
            <Text style={styles.here} onPress={this.goToSignUp}>{I18n.t('here')}</Text>
          </Text>
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.description}>{I18n.t('forgotPassword')}
            <Text style={styles.here} onPress={this.goToForgotpswd}>
              {I18n.t('here')}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
LoginScreen.contextType = AppContext;

LoginScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LoginScreen;
