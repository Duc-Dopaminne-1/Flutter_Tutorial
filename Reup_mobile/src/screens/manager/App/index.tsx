import * as actions from './actions';
import { AppState, AppStateStatus } from 'react-native';
import { AppStatus, IAppDispatch, IAppState } from '@models/app';
import { FirebaseWebClientId } from '@src/constants/app';
import { AUTH_REQUIRE } from '@constants/app';
import LAUNCH_SCREEN from '@res/img/splash.png';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import connect from '@utils/connect';
import { isAuthenticated, refreshToken } from '@modules/auth/actions';
import store from '@src/redux/store';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { changeConnectionStatus } from '@modules/network/actions';
import { addNotification as addLocalNotification } from '@modules/notifications/localNotification/actions';
import { getBadge } from '@src/modules/notifications/notification/actions';
import Container from '@src/components/Container';
import jwt_decode from 'jwt-decode';
import { api } from '@reup/reup-api-sdk';
import translate from '@src/localize';
import { GoogleSignin } from '@react-native-community/google-signin';
import NavigationActionsService from '@src/navigation/navigation';
import { ONBOARDING, MAIN_SCREEN, CONFIRMATION, PERSONAL_INFO, MAINTENANCE_REQUEST } from '@src/constants/screenKeys';
import { checkInternet } from '@src/utils/internet';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';

type Props = IAppState &
  IAppDispatch & {
    userData?: IUserProfile;
    isLogging: boolean;
    companyList?: any[],
    componentId: string;
    isAuthenticated: typeof isAuthenticated;
    refreshToken: typeof refreshToken;
    addLocalNotification: typeof addLocalNotification;
    changeConnectionStatus: typeof changeConnectionStatus;
    getBadge: typeof getBadge;
    navigation: any;
  };
interface State {
  isLoaded: boolean
}
class App extends React.Component<Props, State> {
  appState = AppState.currentState;
  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }
  componentDidMount() {
    NavigationActionsService.initInstance(this.props.navigation);
    SplashScreen.hide();
    NetInfo.fetch().then(state => {
      this.props.changeConnectionStatus({ isConnected: state.isConnected });
      setTimeout(() => this.handleAppStatus(this.props.status), 300);
    });

    AppState.addEventListener('change', this.handleAppStateChange);
    NetInfo.addEventListener(this.handleConnectionChange);
  }

  componentWillUpdate(nextProps: any) {
    if (nextProps.status === AppStatus.LOADED
      && !this.state.isLoaded) {
      this.setState({ isLoaded: true });
      this.handleAppStatus(nextProps.status);
      return;
    } else if (nextProps.status === AppStatus.LOADED
      && this.state.isLoaded) {
      return;
    }
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
        if (AUTH_REQUIRE) {
          this.toNav('auth');
          return;
        }
        this.loginGoogleSilently();
        this.toNav('main');
        break;
      default:
        break;
    }
  }

  loginGoogleSilently = async () => {
    try {
      GoogleSignin.configure({
        webClientId: FirebaseWebClientId,
      });
      await GoogleSignin.signInSilently();
    } catch (error) { }
  };

  handleConnectionChange = (state: NetInfoState) => {
    if (state.isInternetReachable === null) return;
    this.props.changeConnectionStatus({ isConnected: state.isInternetReachable });
    checkInternet.setStatus(state.isInternetReachable);
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

    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.props.getBadge({ callBack: () => { } });
      if (api.Auth.isAuthenticated()) {
        this.refreshToken(false, () => this.tryAuth());
      }
    }
    this.appState = nextAppState;
  };

  refreshToken = async (onAppLaunching: boolean, callback: any) => {
    const token = await api.Auth.getAuthToken();
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      if (!token) {
        this.toNav('auth');
        return;
      }
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
    const { userData, companyList, isLogging } = this.props;
    switch (type) {
      case 'auth': {
        NavigationActionsService.setRoot(ONBOARDING);
      }
        break;
      case 'main':
        if (userData && userData.is_updated_profile && isLogging) {
          if (companyList && companyList.length > 0) {
            NavigationActionsService.setRoot(MAIN_SCREEN);
          } else {
            NavigationActionsService.setRoot(CONFIRMATION);
          }
        } else {
          NavigationActionsService.setRoot(PERSONAL_INFO);
        }

        break;
    }
  };

  tryAuth = () => {
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
  state: (state: any) => ({
    ...state.app,
    userData: state.auth.userData,
    isLogging: state.auth.logging,
    companyList: state.company.listCompany.results
  }),
  actions: {
    ...actions,
    refreshToken,
    isAuthenticated,
    changeConnectionStatus,
    addLocalNotification,
    getBadge,
  },
})(App);
