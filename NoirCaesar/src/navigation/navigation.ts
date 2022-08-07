import { Navigation, OptionsLayout } from 'react-native-navigation';
import { Keyboard, Platform } from 'react-native';
import {
  LOADING_PAGE,
  VIDEO_MEDIA_PLAYER,
  DRAWER,
  CUSTOM_POPUP,
  BOOKS,
  TELEVISION,
  LIBRARY_FEED,
  EXPLORE,
  SHOP,
  CHANNEL,
  MESSAGE,
} from '@src/constants/screenKeys';
import translate from '@src/localize';
import { IError } from '@src/modules/base';
import { PLATFORM } from '@src/constants/app';

export interface ICustomPopup {
  text: string;
  showLogo?: boolean;
  buttonRedTitle?: string;
  buttonGrayTitle?: string;
  onPressRedButton?: () => void;
  onPressGrayButton?: () => void;
}

class NavigationActionsService {
  private static stackNavigation: any[] = [];
  private static navigation: any;
  private static channelListScreen: string;
  private static messageChatScreen: string;
  private static instance: NavigationActionsService;
  public static screenName: string;
  public static defaultOptions = {
    topBar: {
      visible: false,
    },
    animations: {
      push: {
        waitForRender: true,
      },
    },
    statusBar: {
      drawBehind: true,
      visible: false,
    },
    layout: Platform.OS !== 'ios' ? { orientation: ['portrait'] } : {},
  };

  static initInstance(navigation: any): NavigationActionsService {
    if (!NavigationActionsService.instance) {
      NavigationActionsService.instance = new NavigationActionsService();
      Navigation.events().registerComponentDidAppearListener(({ componentId, componentName, passProps }) => {
        if (componentName != DRAWER && componentName != LOADING_PAGE && componentName != CUSTOM_POPUP) {
          NavigationActionsService.navigation = componentId;
        }

        if (componentName == CHANNEL) {
          NavigationActionsService.channelListScreen = componentId;
        }

        if(componentName == MESSAGE) {
          NavigationActionsService.messageChatScreen = componentId;
        }

        NavigationActionsService.screenName = componentName;
      });
    }
    NavigationActionsService.navigation = navigation;
    NavigationActionsService.stackNavigation.push(navigation);
    return NavigationActionsService.instance;
  }

  public static toggleDrawer = (bool: boolean) => {
    Navigation.mergeOptions(NavigationActionsService.navigation, {
      sideMenu: {
        left: {
          visible: bool,
        },
      },
    });
    setTimeout(() => {
      NavigationActionsService.popToRoot();
    }, 300);
  };

  static getTabIndexByName = (tabName: string) => {
    switch (tabName) {
      case BOOKS:
        return 0;
      case TELEVISION:
        return 1;
      case LIBRARY_FEED:
        return 2;
      case EXPLORE:
        return 3;
      case SHOP:
        return 4;
    }
  };

  public static mergeOptions = (tabName: string) => {
    Navigation.mergeOptions(NavigationActionsService.navigation, {
      bottomTabs: {
        currentTabIndex: NavigationActionsService.getTabIndexByName(tabName),
      },
    });
  };

  public static push = (screenName: string, passProps = {}, drawBehind = false, useAnimate = true) => {
    const drawerDrawBehind = drawBehind
      ? {
          visible: false,
          drawBehind: true,
        }
      : {};
    Navigation.push(NavigationActionsService.navigation, {
      component: {
        name: screenName,
        passProps,
        options: {
          topBar: {
            visible: false,
          },
          sideMenu: {
            left: {
              enabled: false,
              visible: false,
            },
          },
          animations: {
            push: {
              waitForRender: true,
              enabled: useAnimate,
            },
          },
          statusBar: {
            drawBehind: true,
            visible: false,
          },
          bottomTabs: drawerDrawBehind,
          popGesture: false,
        },
      },
    });
  };

  public static pop = () => {
    Keyboard.dismiss();
    Navigation.pop(NavigationActionsService.navigation);
  };

  public static popToRoot = () => {
    Keyboard.dismiss();
    Navigation.popToRoot(NavigationActionsService.navigation);
  };

  public static popToChannelScreen = () => {
    Keyboard.dismiss();
    Navigation.popTo(NavigationActionsService.channelListScreen);
  };

  public static popToMessageChatScreen = () => {
    Keyboard.dismiss();
    Navigation.popTo(NavigationActionsService.messageChatScreen);
  };

  public static destroyScreen = () => {
    NavigationActionsService.stackNavigation.pop();
    const maximumStackLength = NavigationActionsService.stackNavigation.length;
    NavigationActionsService.navigation = NavigationActionsService.stackNavigation[maximumStackLength - 1];
  };

  static layoutOption: any = (screenName: string) => {
    switch (screenName) {
      case VIDEO_MEDIA_PLAYER:
        return {
          orientation: ['landscape', 'portrait'],
        };
      default:
        return {};
    }
  };

  public static showModal = (screenName: string, passProps = {}) => {
    const layout: OptionsLayout = NavigationActionsService.layoutOption(screenName);
    Navigation.showModal({
      component: {
        name: screenName,
        passProps: passProps,
        options: {
          layout: layout,
          animations: {
            showModal: { waitForRender: true },
          },
          topBar: {
            visible: false,
          },
          statusBar: {
            drawBehind: true,
            visible: false,
          },
        },
      },
    });
  };

  public static dismissModal = () => {
    Navigation.dismissModal(NavigationActionsService.navigation);
  };

  public static dismissAllModal = () => {
    if (PLATFORM === 'ios') {
      Navigation.dismissAllModals({
        animations: {
          dismissModal: {
            enabled: false,
          },
        },
      });
    } else {
      Navigation.dismissAllModals();
    }
  };

  public static showErrorPopup = (error?: IError) => {
    if (error) {
      const text = error.message ?? translate('alert.message_error_default');
      NavigationActionsService.showCustomPopup({ text });
    }
  };

  public static showCustomPopup = (customPopup: ICustomPopup) => {
    const { onPressRedButton, onPressGrayButton } = customPopup;
    const { hideCustomPopup } = NavigationActionsService;
    const handlePressRedButton = onPressRedButton ?? hideCustomPopup;
    const handlePressGrayButton = onPressGrayButton ?? hideCustomPopup;

    Navigation.showOverlay({
      component: {
        id: 'customPopup',
        name: CUSTOM_POPUP,
        passProps: {
          loading: true,
          onPressRedButton: handlePressRedButton,
          onPressGrayButton: handlePressGrayButton,
          ...customPopup,
        },
        options: {
          overlay: {
            interceptTouchOutside: true,
          },
          layout: {
            componentBackgroundColor: 'transparent',
          },
          topBar: {
            visible: false,
          },
          statusBar: {
            drawBehind: true,
            visible: false,
          },
        },
      },
    });
  };

  public static hideCustomPopup = () => {
    Navigation.dismissOverlay('customPopup');
  };

  public static showLoading = () => {
    Navigation.showOverlay({
      component: {
        id: 'loading',
        name: LOADING_PAGE,
        options: {
          overlay: {
            interceptTouchOutside: true,
          },
          layout: {
            componentBackgroundColor: 'transparent',
          },
          topBar: {
            visible: false,
          },
          statusBar: {
            drawBehind: true,
            visible: false,
          },
        },
      },
    });
  };

  public static hideLoading = () => {
    Navigation.dismissOverlay('loading');
  };
}

export default NavigationActionsService;
