import { Keyboard } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import {
  BID_SCREEN,
  CREATE_EMAIL_SCREEN,
  CREATE_FIRST_NAME_SCREEN,
  HOME_SCREEN,
  MESSAGE_SCREEN,
  MODAL_LOADING,
  MODAL_PAYMENT,
  NOTIFICATION_SCREEN,
  SETTING_SCREEN,
  SIGN_UP_LINK_SOCIAL_SCREEN,
  SIGN_UP_PHONE_SCREEN,
  TABS_SCREEN,
  WELCOME_SCREEN,
} from '@/navigation/screenKeys';
import * as Sentry from '@sentry/react-native';
import { FILTER_GLOBAL, LOAD_PROFILE_DISCOVERY, StatusProfile, TIME_LOAD_SPLASH_SCREEN } from '@/constants/app';
import { createCity, getCareerStrengths, getLanguages, getUser, getUserProfile, updateAppLanguage } from '@/redux/user/actions';
import { SocketManager } from '@/shared/socket/socket-manager';
import { notificationService } from '@/shared/notification';
import { notificationWorker } from '@/shared/notification/NotificationWoker';
import { getTotalUnRead } from '@/redux/notification/actions';
import { getFiltersGeneral } from '@/redux/filters/actions';
import { saveProfile } from '@/redux/createProfile/actions';
import { getListRoom, getTotalUnread } from '@/redux/messages/actions';
import analytics from '@react-native-firebase/analytics';
import { changeLocale, getSetting } from '@/redux/app/actions';
import { languageApp } from '@/i18n';
import { getFilterGenders, getFilterInterests, getFilterSexualOrientation } from '@/redux/filters/actions';
import { getCategories } from '@/redux/auction/actions';
import { userShared } from '@/shared/user';
import { getDiscovery } from '@/redux/discovery/actions';
import { get } from '@/services/storage';
import { getCityCreateProfile } from '@/redux/createProfile/selector';

class NavigationActionsService {
  private static stackNavigation: any[] = [];
  private static navigation: any;
  private static dispatch: any;
  static startTime = 0;
  private static endTime = 0;
  private static instance: NavigationActionsService;
  static initInstance(navigation: any, dispatch: any): NavigationActionsService {
    if (!NavigationActionsService.instance) {
      NavigationActionsService.instance = new NavigationActionsService();
    }
    NavigationActionsService.navigation = navigation;
    NavigationActionsService.dispatch = dispatch;
    NavigationActionsService.stackNavigation.push(navigation);
    return NavigationActionsService.instance;
  }

  static openDrawer = () => NavigationActionsService.navigation.openDrawer();

  static closeDrawer = () => NavigationActionsService.navigation.closeDrawer();

  static push = (screenName: string, passProps = {}) => {
    NavigationActionsService.navigation.navigate(screenName, passProps);
  };

  static goBack = () => {
    NavigationActionsService.navigation.goBack();
  };

  static getNavigation = () => {
    return NavigationActionsService.navigation;
  };

  static dispatchAction = (action: any) => {
    NavigationActionsService && NavigationActionsService.dispatch && NavigationActionsService.dispatch(action);
  };

  static setRoot = (screenName: string, passProps = {}) => {
    NavigationActionsService.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: screenName,
            params: passProps,
          },
        ],
      }),
    );
  };

  static pop = () => {
    Keyboard.dismiss();
    NavigationActionsService.navigation.pop(1);
  };

  static popTo = (screenPosition: number) => {
    Keyboard.dismiss();
    NavigationActionsService.navigation.pop(screenPosition);
  };

  static popToRoot = () => {
    NavigationActionsService.navigation.popToTop();
  };

  static showLoading = () => {
    NavigationActionsService.navigation.navigate(MODAL_LOADING);
  };

  static getState = () => {
    return NavigationActionsService?.navigation?.dangerouslyGetState();
  };

  static hideLoading = () => {
    const { index, routes } = NavigationActionsService.navigation.dangerouslyGetState();
    const currentRoute = routes[index].name;
    if (currentRoute === MODAL_LOADING) {
      NavigationActionsService.pop();
    }
  };

  static deepLinkTab = (initScreen: string, deepScreen: string, passProps = {}) => {
    NavigationActionsService.navigation.reset({
      index: 1,
      routes: [
        {
          name: initScreen,
        },
        {
          name: deepScreen,
          params: passProps,
        },
      ],
    });
  };

  static deepLinkTabMyBid = (deepScreen: string, passProps = {}) => {
    NavigationActionsService.navigation.reset({
      index: 1,
      routes: [
        {
          name: TABS_SCREEN,
          state: {
            index: 1,
            routes: [
              {
                name: HOME_SCREEN,
              },
              {
                name: BID_SCREEN,
                params: {
                  isToMyAuction: true,
                },
              },
              {
                name: NOTIFICATION_SCREEN,
              },
              {
                name: MESSAGE_SCREEN,
              },
              {
                name: SETTING_SCREEN,
              },
            ],
          },
        },
        {
          name: deepScreen,
          params: passProps,
        },
      ],
    });
  };

  static deepLinkTabNotification = () => {
    NavigationActionsService.navigation.reset({
      index: 0,
      routes: [
        {
          name: TABS_SCREEN,
          state: {
            index: 2,
            routes: [
              {
                name: HOME_SCREEN,
              },
              {
                name: BID_SCREEN,
              },
              {
                name: NOTIFICATION_SCREEN,
              },
              {
                name: MESSAGE_SCREEN,
              },
              {
                name: SETTING_SCREEN,
              },
            ],
          },
        },
      ],
    });
  };

  static deepLinkHome = (deepScreen: string, passProps = {}) => {
    NavigationActionsService.navigation.reset({
      index: 1,
      routes: [
        {
          name: TABS_SCREEN,
          state: {
            index: 0,
            routes: [
              {
                name: HOME_SCREEN,
              },
              {
                name: BID_SCREEN,
              },
              {
                name: NOTIFICATION_SCREEN,
              },
              {
                name: MESSAGE_SCREEN,
              },
              {
                name: SETTING_SCREEN,
              },
            ],
          },
        },
        {
          name: deepScreen,
          params: passProps,
        },
      ],
    });
  };

  static deepLinkChat = (deepScreen: string, passProps = {}) => {
    NavigationActionsService.navigation.reset({
      index: 1,
      routes: [
        {
          name: TABS_SCREEN,
          state: {
            index: 3,
            routes: [
              {
                name: HOME_SCREEN,
              },
              {
                name: BID_SCREEN,
              },
              {
                name: NOTIFICATION_SCREEN,
              },
              {
                name: MESSAGE_SCREEN,
              },
              {
                name: SETTING_SCREEN,
              },
            ],
          },
        },
        {
          name: deepScreen,
          params: passProps,
        },
      ],
    });
  };

  static deepLinkTabMyAuction = () => {
    NavigationActionsService.navigation.reset({
      index: 0,
      routes: [
        {
          name: TABS_SCREEN,
          state: {
            index: 1,
            routes: [
              {
                name: HOME_SCREEN,
              },
              {
                name: BID_SCREEN,
                params: {
                  isToMyAuction: true,
                },
              },
              {
                name: NOTIFICATION_SCREEN,
              },
              {
                name: MESSAGE_SCREEN,
              },
              {
                name: SETTING_SCREEN,
              },
            ],
          },
        },
      ],
    });
  };

  static destroyScreen = () => {
    NavigationActionsService.stackNavigation.pop();
    const maximumStackLength = NavigationActionsService.stackNavigation.length;
    NavigationActionsService.navigation = NavigationActionsService.stackNavigation[maximumStackLength - 1];
  };

  static toApp = () => {
    NavigationActionsService.setRoot(TABS_SCREEN);
    NavigationActionsService.push(HOME_SCREEN);
  };

  static tryLogin = () => {
    NavigationActionsService.setRoot(WELCOME_SCREEN);
  };

  static checkPaymentIssue = data => {
    if (data && data.length > 0) {
      const { amount, id } = data[0];
      NavigationActionsService.push(MODAL_PAYMENT, { amount, id, isFromPaymentDebt: true });
    }
  };

  static loadInitAppFail = () => {
    setTimeout(() => {
      NavigationActionsService.setRoot(WELCOME_SCREEN);
      NavigationActionsService.dispatchAction(getSetting());
      NavigationActionsService.dispatchAction(changeLocale(languageApp()));
    }, TIME_LOAD_SPLASH_SCREEN);
  };

  static loadAppData = () => {
    NavigationActionsService.dispatchAction(getFilterGenders({}));
    NavigationActionsService.dispatchAction(getFilterSexualOrientation({}));
    NavigationActionsService.dispatchAction(getFilterInterests({}));
    NavigationActionsService.dispatchAction(getCategories({}));
    NavigationActionsService.dispatchAction(getLanguages({}));
    NavigationActionsService.dispatchAction(getCareerStrengths({}));
  };

  static gotoApp = () => {
    if (!notificationWorker.getStatus()) {
      NavigationActionsService.toApp();
      NavigationActionsService.push(HOME_SCREEN);
    }
  };

  static getDiscovery = async isFromRegister => {
    const dataFilter = await get(FILTER_GLOBAL);
    const filterGlobal = dataFilter === 'true' || dataFilter === null;
    NavigationActionsService.dispatchAction(
      getDiscovery({
        perPage: LOAD_PROFILE_DISCOVERY,
        filterGlobal,
        latitude: userShared.getLocation().lat,
        longitude: userShared.getLocation().lng,
        onSuccess: () => {
          NavigationActionsService.loadInitAppSuccess(isFromRegister);
        },
        onFail: () => NavigationActionsService.loadInitAppFail(),
      }),
    );
  };

  static loadInitAppSuccess = (isFromRegister = false) => {
    // If click notification code below will not run.
    NavigationActionsService.endTime = performance.now();
    if ((NavigationActionsService.endTime - NavigationActionsService.startTime) / 1000 < 2.5) {
      setTimeout(() => {
        NavigationActionsService.gotoApp();
      }, 1500);
    } else {
      NavigationActionsService.gotoApp();
    }

    NavigationActionsService.dispatchAction(
      getUser({
        onSuccess: user => {
          if (isFromRegister) {
            NavigationActionsService.dispatchAction(updateAppLanguage({ appLanguage: languageApp(), userId: user.id }));
            NavigationActionsService.dispatchAction(createCity(getCityCreateProfile()));
            NavigationActionsService.dispatchAction(changeLocale(languageApp()));
          } else {
            NavigationActionsService.dispatchAction(changeLocale(user.appLanguage));
          }
          // tracks user info in Firebase analytics
          analytics().setUserId(user.id);
          analytics().setUserProperty('firstname', user.firstName);

          Sentry.setUser({
            id: user.id,
          });
        },
      }),
    );
    NavigationActionsService.dispatchAction(getUserProfile({}));
    NavigationActionsService.dispatchAction(getTotalUnread());
    NavigationActionsService.dispatchAction(getSetting());
    NavigationActionsService.dispatchAction(getFiltersGeneral({}));
    NavigationActionsService.dispatchAction(getTotalUnRead({}));
    NavigationActionsService.dispatchAction(getListRoom({}));

    // Open app normal.
    notificationService.createNotificationListeners();
    SocketManager.close();
    SocketManager.connect();
  };

  static getInitApp = (isFromRegister = false) => {
    userShared
      .localCurrentPosition(
        () => {
          NavigationActionsService.getDiscovery(isFromRegister).then(_r => {});
        },
        () => {
          NavigationActionsService.getDiscovery(isFromRegister).then(_r => {});
        },
      )
      .then(() => {});
  };

  static handleLogin = async (param: any) => {
    const { userInfo, email, isAutoLinkSocial, typeLogin = '' } = param;
    if (userInfo && !userInfo.user && userInfo.provider) {
      await analytics().logEvent('sign_up', {
        method: typeLogin,
      });

      NavigationActionsService.dispatchAction(
        saveProfile({
          providerId: userInfo.provider.id,
          email: userInfo.provider.email,
        }),
      );

      NavigationActionsService.push(SIGN_UP_PHONE_SCREEN, {
        isAutoLinkSocial: true,
      });
    } else if (
      (userInfo && userInfo.user.status === StatusProfile.COMPLETED) ||
      userInfo.user.status === StatusProfile.VERIFIED ||
      userInfo.user.status === StatusProfile.INVALID ||
      userInfo.user.status === StatusProfile.PENDING_VERIFY
    ) {
      // completed
      await NavigationActionsService.getInitApp();

      // tracks analytics login by phone
      await analytics().logEvent('login', {
        method: 'Phone',
      });
    } else if (userInfo && isAutoLinkSocial) {
      // login by social
      if (email === '') {
        NavigationActionsService.push(CREATE_EMAIL_SCREEN, {
          email,
        });
        return;
      }
      NavigationActionsService.dispatchAction(
        saveProfile({
          email,
        }),
      );
      NavigationActionsService.hideLoading();
      NavigationActionsService.push(CREATE_FIRST_NAME_SCREEN);
    } else if (userInfo && userInfo.user.hasOwnProperty('authProviders') && userInfo.user.authProviders.length > 0) {
      // linked but not yet sign up for an account
      const data = userInfo.user.authProviders.filter(item => item.type === typeLogin);

      NavigationActionsService.hideLoading();
      if (!typeLogin) {
        NavigationActionsService.dispatchAction(
          saveProfile({
            email: userInfo.user.authProviders[0].email,
          }),
        );
        NavigationActionsService.push(CREATE_FIRST_NAME_SCREEN);
        return;
      } else if (data[0].email === '') {
        NavigationActionsService.push(CREATE_EMAIL_SCREEN, {
          email,
        });
        return;
      }

      NavigationActionsService.dispatchAction(
        saveProfile({
          email: data[0].email,
        }),
      );
      NavigationActionsService.push(CREATE_FIRST_NAME_SCREEN);
    } else if (userInfo && !userInfo.user.email && userInfo.user.status === StatusProfile.COMPLETING) {
      // just finish verify sms
      NavigationActionsService.setRoot(SIGN_UP_LINK_SOCIAL_SCREEN, {
        userId: userInfo?.user?.id,
      });

      // tracks analytics sign up by phone
      await analytics().logEvent('sign_up', {
        method: 'Phone',
      });
    }
  };
}

export default NavigationActionsService;
