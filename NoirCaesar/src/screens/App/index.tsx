import * as actions from './actions';
import { AppState, AppStateStatus } from 'react-native';
import { AppStatus, IAppDispatch, IAppState } from '@models/app';
import { toAuth, toMain } from '@navigation';
import { AUTH_REQUIRE } from '@constants/app';
import LAUNCH_SCREEN from '@res/images/launch-screen.png';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import connect from '@utils/connect';
import { isAuthenticated, refreshToken, getAuthToken } from '@modules/auth/actions';
import store from '@src/redux/store';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { changeConnectionStatus } from '@modules/network/actions';
import { addNotification as addLocalNotification } from '@modules/notifications/localNotification/actions';
import Container from '@src/components/Container';
import jwt_decode from 'jwt-decode';
import { api } from '@goldfishcode/noir-caesar-api-sdk';
import translate from '@src/localize';
import { IUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import NotificationsService from '@src/modules/notifications/service';
import { SocketService } from '@src/modules/chat/socket/service';

type Props = IAppState &
  IAppDispatch & {
    user?: IUser;
    componentId: string;
    isAuthenticated: typeof isAuthenticated;
    refreshToken: typeof refreshToken;
    addLocalNotification: typeof addLocalNotification;
    changeConnectionStatus: typeof changeConnectionStatus;
    getAuthToken: typeof getAuthToken;
  };

class App extends React.Component<Props> {
  appState = AppState.currentState;

  componentDidMount() {
    SplashScreen.hide();

    NetInfo.fetch().then(state => {
      this.props.changeConnectionStatus({ isConnected: state.isConnected });
      setTimeout(() => this.handleAppStatus(this.props.status), 300);
    });

    AppState.addEventListener('change', this.handleAppStateChange);
    NetInfo.addEventListener(this.handleConnectionChange);
  }

  componentWillUpdate(nextProps: any) {
    this.handleAppStatus(nextProps.status);
  }

  render() {
    return <Container image={LAUNCH_SCREEN} />;
  }

  onTryAuthSuccess = () => {
    this.props.tryAuthDone();
  };

  onTryAuthFail = () => {
    api.Auth.setAuthToken(null);
    this.toNav('auth');
  };

  handleAppStatus(status: AppStatus): void {
    switch (status) {
      case AppStatus.MOUNTED:
        this.props.init();
        return;
      case AppStatus.INITED:
        this.props.loadData();
        return;
      case AppStatus.LOADED:
        this.refreshToken(true, () => this.tryAuth());
        return;
      case AppStatus.TRY_AUTH_DONE:
      case AppStatus.READY:
        if (AUTH_REQUIRE && !this.props.user) {
          this.toNav('auth');
          return;
        }
        this.toNav('main');
        break;
      default:
        break;
    }
  }

  handleConnectionChange = (state: NetInfoState) => {
    if (state.isInternetReachable === null) return;
    this.props.changeConnectionStatus({ isConnected: state.isInternetReachable });
    state.isInternetReachable === false &&
      this.props.addLocalNotification({
        title: translate('alert.title_error'),
        message: translate('alert.message_error_network'),
      });
  };

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      return;
    }

    const isAuth = await api.Auth.isAuthenticated();

    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isAuth) {
        this.refreshToken(false, () => this.tryAuth());
      }
    }
    if (isAuth) {
      NotificationsService.getInstance().onAppStateChange(nextAppState);
      SocketService.getInstance().onAppStateChange(nextAppState);
    }
    this.appState = nextAppState;
  };

  refreshToken = async (onAppLaunching: boolean, callback: any) => {
    const token = await api.Auth.getAuthToken();
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      if (token) {
        this.toNav('main');
      } else {
        this.toNav('auth');
      }
      return;
    }
    const { isTokenRefreshing } = store.getState().auth;
    if (isTokenRefreshing) return;
    if (token) {
      if (onAppLaunching) {
        this.props.refreshToken({
          onSuccess: callback,
          onFail: callback,
        });
      } else {
        const decoded = jwt_decode<{ exp: number }>(token.access_token);
        const expireTime = decoded.exp - Date.now() / 1000;
        if (expireTime < 0) {
          this.props.refreshToken({
            onSuccess: callback,
            onFail: callback,
          });
        } else {
          callback();
        }
      }
    } else {
      const { status: appStatus } = store.getState().app;
      onAppLaunching || appStatus === AppStatus.RELOADED ? callback() : this.props.notAuth();
    }
  };

  toNav = (type: string) => {
    switch (type) {
      case 'auth':
        return toAuth();
      case 'main':
        return toMain();
    }
  };

  tryAuth = () => {
    this.props.getAuthToken();
    this.props.isAuthenticated({
      onSuccess: this.props.tryAuthDone,
      onFail: () => {
        api.Auth.setAuthToken(null);
        this.toNav('auth');
      },
    });
  };
}

export default connect({
  state: (state: any) => ({ ...state.app, user: state.user }),
  actions: {
    ...actions,
    refreshToken,
    isAuthenticated,
    changeConnectionStatus,
    addLocalNotification,
    getAuthToken,
  },
})(App);
