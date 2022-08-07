import { APP_SCREEN, ROOT, UPLOAD_COLLECTION } from '@constants/screenKeys';
import { Navigation } from 'react-native-navigation';
import { registerAllScreens } from '@screens';
import init from '@services/init';
import toAuth from './authNav';
import toMain from './mainNav';
import NavigationActionsService from './navigation';

registerAllScreens();
init();
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: APP_SCREEN,
        options: {
          statusBar: {
            drawBehind: true,
            visible: false,
          },
        },
      },
    },
  });
});

const navigateToScreen = (screenName: string, passProps = {}) => {
  Navigation.setRoot({
    root: {
      stack: {
        options: {
          topBar: {
            visible: false,
          },
          animations: {
            setRoot: {
              waitForRender: true,
            },
          },
        },
        children: [
          {
            component: {
              name: screenName,
              passProps,
              options: {
                ...NavigationActionsService.defaultOptions,
              },
            },
          },
        ],
      },
    },
  });
};

const toggleDrawer = (bool = false) => {
  Navigation.mergeOptions(ROOT, {
    sideMenu: {
      left: {
        visible: bool,
      },
    },
  });
};

const toUploadCollection = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: UPLOAD_COLLECTION,
              options: {
                ...NavigationActionsService.defaultOptions,
              },
            },
          },
        ],
        options: {
          topBar: {
            visible: false,
          },
          animations: {
            setRoot: {
              waitForRender: true,
            },
          },
        },
      },
    },
  });
};

export { toMain, toAuth, navigateToScreen, toggleDrawer, toUploadCollection };
