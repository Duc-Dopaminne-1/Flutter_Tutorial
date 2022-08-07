import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import firebase from "react-native-firebase";
import AsyncStorage from "@react-native-community/async-storage";

import { AuthController } from "app/controllers";
import { AppContext } from "app/components";
import { alert } from "app/utils/Alert";

import styles from "./style";
import {languageUSer} from "../../i18n";

class LoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.unsubscriber = null;
  }

  async componentDidMount() {
    this.context.showLoading();
    // social media login configure
    try {
      await AuthController.configure();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }

    this.unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await AuthController.getUser();
          if (userData) {
            if (userData.provider) {
              // social media
              this.context.hideLoading();
              this.context.setUser(userData);
              if (!userData.ethnicity) {
                this.props.navigation.navigate("setprofile");
              } else {
                this.props.navigation.navigate("authenticated");
              }
            } else {
              // email & password
              if (user.emailVerified) {
                this.context.hideLoading();
                this.context.setUser(userData);
                if (!userData.ethnicity) {
                  this.props.navigation.navigate("setprofile");
                } else {
                  this.props.navigation.navigate("authenticated");
                }
              } else {
                this.context.hideLoading();
                this.props.navigation.navigate("verification");
              }
            }
          } else {
            // check if this is auto loading
            /*if (!this.context.authCheck) {
              // eslint-disable-next-line max-len
              throw new Error('There is a problem with authentication. Please contact administrator');
            }*/

            // added by Martin
            this.context.hideLoading();
            if (user.emailVerified) {
              this.props.navigation.navigate("setprofile");
            } else {
              this.props.navigation.navigate("verification");
            }
          }
        } catch (error) {
          this.context.hideLoading();
          await firebase.auth().signOut();
          this.props.navigation.navigate("unauthenticated");
        }
      } else {
        this.context.hideLoading();
        this.props.navigation.navigate("unauthenticated");
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    return <View style={styles.container} />;
  }
}

LoadingScreen.contextType = AppContext;

LoadingScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LoadingScreen;
