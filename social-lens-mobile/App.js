import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import OneSignal from 'react-native-onesignal';

import AppNavigator from 'app/routes/Navigator';
import { AppContext, LoadingView } from 'app/components';
import { ONESIGNAL_APP_ID } from 'app/config';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.showLoading = () => {
      this.setState({
        loading: true
      });
    };
    this.hideLoading = () => {
      this.setState({
        loading: false
      });
    };
    this.setUser = (user) => {
      this.setState({
        user
      });
    };
    this.setAuthCheck = (authCheck) => new Promise((resolve, _) => {
      this.setState({ authCheck }, () => {
        resolve();
      });
    });

    this.state = {
      loading: false,
      user: null,
      authCheck: '',
      showLoading: this.showLoading,
      hideLoading: this.hideLoading,
      setUser: this.setUser,
      setAuthCheck: this.setAuthCheck
    };
    OneSignal.init(ONESIGNAL_APP_ID, { kOSSettingsKeyAutoPrompt : true });
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
        <LoadingView />
      </AppContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
