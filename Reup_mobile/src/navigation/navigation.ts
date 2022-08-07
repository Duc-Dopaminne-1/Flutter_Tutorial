
import { Keyboard } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { MODAL_LOADING, MODAL_LOADING_TENANT } from '@src/constants/screenKeys';
import { isManagerApp } from '@src/utils';

class NavigationActionsService {
  private static stackNavigation: any[] = [];
  private static navigation: any;
  private static instance: NavigationActionsService;
  static initInstance(navigation: any): NavigationActionsService {
    if (!NavigationActionsService.instance) {
      NavigationActionsService.instance = new NavigationActionsService();
    }
    NavigationActionsService.navigation = navigation;
    NavigationActionsService.stackNavigation.push(navigation);
    return NavigationActionsService.instance;
  }

  public static openDrawer = () => (
    NavigationActionsService.navigation.openDrawer()
  );

  public static closeDrawer = () => (
    NavigationActionsService.navigation.closeDrawer()
  );

  public static push = (screenName: string, passProps = {}) => {
    NavigationActionsService.navigation.navigate(screenName, passProps);
  };

  public static setRoot = (screenName: string, passProps = {}) => {
    NavigationActionsService.navigation.dispatch(
      StackActions.replace(screenName, passProps)
    );
  };

  public static pop = () => {
    Keyboard.dismiss();
    NavigationActionsService.navigation.pop(1);
  };
  public static popTo = (screenPosition: number) => {
    Keyboard.dismiss();
    NavigationActionsService.navigation.pop(screenPosition);
  };

  public static popToRoot = () => {
    Keyboard.dismiss();
    NavigationActionsService.navigation.popToTop();
  }

  public static showLoading = () => {
    if (isManagerApp()) {
      NavigationActionsService.navigation.navigate(MODAL_LOADING);
    } else {
      NavigationActionsService.navigation.navigate(MODAL_LOADING_TENANT);
    }
  };

  public static hideLoading = () => {
    const { index, routes } = NavigationActionsService.navigation.dangerouslyGetState();
    const currentRoute = routes[index].name;
    if (currentRoute === MODAL_LOADING || currentRoute === MODAL_LOADING_TENANT) {
      NavigationActionsService.pop();
    }
  };

  public static destroyScreen = () => {
    NavigationActionsService.stackNavigation.pop();
    const maximumStackLength = NavigationActionsService.stackNavigation.length;
    NavigationActionsService.navigation = NavigationActionsService.stackNavigation[maximumStackLength - 1];
  };
}

export default NavigationActionsService;
