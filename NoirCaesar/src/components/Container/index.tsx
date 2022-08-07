import { AppState, AppStateStatus, View, ImageBackground, StatusBar } from 'react-native';
import { IChangeAppState, IChangeAppStateActionPayload } from '@modules/appState';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { changeAppState } from '@modules/appState/actions';
import { connect } from 'react-redux';
import styles from './styles';
// @ts-ignore
import StatusBarAlert from 'react-native-statusbar-alert';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import { colors } from '@constants/vars';
import { INetworkStatus } from '@src/modules/network';

interface Props {
  networkStatus: INetworkStatus;
  changeAppState: IChangeAppState;
  image?: any;
  children?: any;
  hideStatusBar?: boolean;
}
type State = {};

class Container extends Component<Props, State> {
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    const appStateChange = this.props.changeAppState;
    const payload: IChangeAppStateActionPayload = {
      appState: nextAppState,
    };
    appStateChange(payload);
  };

  render() {
    const { children, image = undefined, hideStatusBar = false } = this.props;
    if (image) {
      return (
        <ImageBackground source={image} style={[{ flex: 1 }, styles.container]}>
          {<StatusBar barStyle='light-content' hidden={hideStatusBar} />}
          {children}
        </ImageBackground>
      );
    }
    return (
      <View style={[styles.container]}>
        <StatusBar barStyle='light-content' hidden={hideStatusBar} />
        {!this.props.networkStatus.isConnected && (
          <View
            style={{
              ...ifIphoneX(
                {
                  height: getStatusBarHeight() / 2,
                },
                {
                  height: 0,
                },
              ),
              backgroundColor: colors.RED,
            }}
          />
        )}
        <StatusBarAlert
          visible={!this.props.networkStatus.isConnected}
          backgroundColor={colors.RED}
          color="white"
          message={'Network unavailable'}
          pulse="background"
        />
        {children}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  changeAppState: (payload: IChangeAppStateActionPayload) => dispatch(changeAppState(payload)),
});

const mapStateToProps = (state: any) => ({
  networkStatus: state.networkStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
