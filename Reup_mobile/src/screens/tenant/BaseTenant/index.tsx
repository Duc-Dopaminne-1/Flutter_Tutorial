// import { Navigation, Options } from 'react-native-navigation';
import { Linking } from 'react-native';
import React from 'react';

interface BaseProps {
  componentId: string;
}
class BaseTenant<Props, State> extends React.Component<BaseProps & Props, State> {
  constructor(props: BaseProps & Props) {
    super(props);
    // Navigation.events().bindComponent(this);
  }

  onNavigationButtonPressed?: (buttonId: string) => void;

  lock = false;

  onBack = () => {
    // Navigation.pop(this.props.componentId);
  };

  action(handle: () => void) {
    if (this.lock) return;
    this.lock = true;
    handle();
    setTimeout(() => (this.lock = false), 500);
  }

  configNavigation = (options: any) => {
    // Navigation.mergeOptions(this.props.componentId, options);
  };

  navigateTo = (name: string, passProps: any = {}, title = '') => {
    if (this.lock) return;
    this.lock = true;
    // Navigation.push(this.props.componentId, {
    //   component: {
    //     name,
    //     passProps,
    //     options: {
    //       topBar: {
    //         testID: 'TOP_BAR',
    //         title: {
    //           text: title,
    //         },
    //       },
    //     },
    //   },
    // });
    setTimeout(() => (this.lock = false), 500);
  };

  openPage = async (url: string) => {
    const available = await Linking.canOpenURL(url);
    if (available) {
      Linking.openURL(url);
    }
  };

  registerNavigationButtonPressed = (func: (buttonId: string) => void) => (this.onNavigationButtonPressed = func);

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (this.onNavigationButtonPressed) {
      this.onNavigationButtonPressed(buttonId);
    }
  }
}

export default BaseTenant;
