import { LOGIN } from '@constants/screenKeys';
import { Navigation } from 'react-native-navigation';
import NavigationActionsService from './navigation';

const toAuth = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: LOGIN,
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

export default toAuth;
