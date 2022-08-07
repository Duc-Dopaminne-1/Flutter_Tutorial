import React from "react";
import PropTypes from "prop-types";
import { View, Alert } from "react-native";
import I18n from 'app/i18n'
import { AuthController } from "app/controllers";
import { AppContext } from "app/components";
import ViewProfile from "./ViewProfile";
import SetProfile from "./SetProfile";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    let edit = false;
    if (
      props.navigation.state.params &&
      props.navigation.state.params.mode === "edit"
    ) {
      edit = true;
    }
    this.state = {
      edit,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", async (payload) => {
      await this.checkMode(payload);
    });
  }

  checkMode = (_) => {
    let edit = false;
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.mode === "edit"
    ) {
      edit = true;
    }
    this.setState({
      edit,
    });
  };

  switchView = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };

  logOut = async () => {
    Alert.alert(
      I18n.t('lensEngage'),
        I18n.t('logOut'),
      [
        {
          text: I18n.t('cancel'),
          style: "cancel",
        },
        {
          text: I18n.t('ok'),
          onPress: async () => {
            try {
              this.context.showLoading();
              await AuthController.logOut(this.context.user.provider);
              this.context.setUser(null);
              this.context.hideLoading();
              this.props.navigation.navigate("unauthenticated");
            } catch (error) {
              this.context.hideLoading();
              alert(error.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    let { navigation } = this.props;

    if (!this.context.user) {
      return <View />;
    }

    return this.state.edit ? (
      <SetProfile
        navigation={navigation}
        switchView={this.switchView}
        user={this.context.user}
      />
    ) : (
      <ViewProfile
        navigation={navigation}
        switchView={this.switchView}
        logOut={this.logOut}
        user={this.context.user}
      />
    );
  }
}

ProfileScreen.contextType = AppContext;

ProfileScreen.propTypes = {
  navigation: PropTypes.object,
};

export default ProfileScreen;
