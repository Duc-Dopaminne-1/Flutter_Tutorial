import { AppState, AppStateStatus, View, ImageBackground, StatusBar, StatusBarStyle, Platform } from 'react-native';
import { IChangeAppState, IChangeAppStateActionPayload } from '@modules/appState';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { changeAppState } from '@modules/appState/actions';
import { connect } from 'react-redux';
import styles from './styles';
// @ts-ignore
import StatusBarAlert from 'react-native-statusbar-alert';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import { colors, HEIGHT } from '@constants/vars';
import { INetworkStatus } from '@src/modules/network';
import { CustomHeader } from '../CustomHeader';
import { BACK, MENU, NOTIFICATION } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { NOTIFICATIONS, NOTIFICATIONS_TENANT } from '@src/constants/screenKeys';
import { isAndroid, isManagerApp } from '@src/utils';

interface Props {
  networkStatus: INetworkStatus;
  changeAppState: IChangeAppState;
  image?: any;
  children?: any;
  title?: string;
  isShowHeader?: boolean;
  barStyle?: StatusBarStyle;
  spaceBottom?: boolean;
  isDisplayBackButton?: boolean;
  isDisplayNotification?: boolean;
  isDisplayMenuButton?: boolean;
  notificationBadge?: number;
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

  onPressBack = () => {
    NavigationActionsService.pop();
  };

  onPressNotification = () => {
    if (isManagerApp()) {
      NavigationActionsService.push(NOTIFICATIONS)
    } else {
      NavigationActionsService.push(NOTIFICATIONS_TENANT)
    }
  };

  onPressMenu = () => {
    NavigationActionsService.openDrawer()
  }

  render() {
    const { children, image = undefined,
      isShowHeader = false, title = '',
      barStyle = 'dark-content', spaceBottom = false,
      isDisplayBackButton = true, isDisplayNotification = true, isDisplayMenuButton = true,
      notificationBadge
    } = this.props;

    if (image) {
      return (
        <ImageBackground source={image} style={[{ flex: 1 }, styles.container]}>
          {<StatusBar barStyle={barStyle} translucent backgroundColor='transparent' />}
          {children}
        </ImageBackground>
      );
    }
    return (
      <View style={[styles.container, spaceBottom ? { paddingBottom: !isAndroid() && HEIGHT >= 812 ? 34 : 0 } : {}]}>
        <StatusBar barStyle={barStyle} translucent backgroundColor='transparent' />
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
        {isShowHeader ? (
          <CustomHeader
            leftImage={isDisplayBackButton ? BACK : null}
            leftImageStyle={isDisplayBackButton ? styles.leftImageStyle : {}}
            leftAction={isDisplayBackButton ? this.onPressBack : () => { }}
            rightImage={isDisplayMenuButton ? MENU : null}
            rightAction={isDisplayMenuButton ? this.onPressMenu : () => { }}
            rightImage2={isDisplayNotification ? NOTIFICATION : null}
            rightAction2={isDisplayNotification ? this.onPressNotification : () => { }}
            rightImageStyle={styles.rightImageStyle}
            mainText={title ?? ''}
            notificationBadge={notificationBadge ? notificationBadge : 0}
          />
        ) : (
            undefined
          )}
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
  notificationBadge: state.notifications.notificationInfo.badge
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
