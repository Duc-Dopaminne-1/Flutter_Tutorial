import { BOOK_ICON, TV_ICON, NOIR_ICON, EXPLORE_ICON, SHOP_ICON } from '@constants/icons';
import { ROOT, DRAWER, BOOKS, TELEVISION, LIBRARY_FEED, EXPLORE, SHOP } from '@constants/screenKeys';
import { ImageRequireSource, Platform } from 'react-native';
import { Layout, Navigation } from 'react-native-navigation';
import { colors, fonts, WIDTH } from '@constants/vars';
import translate from '@src/localize';
import NavigationActionsService from './navigation';

if (Platform.OS !== 'ios') {
  Navigation.setDefaultOptions({
    layout: { orientation: ['portrait'] },
  });
}

const initTab = (id: string, label: string, icon: ImageRequireSource, tabbarVisible = true, isFromSignUp = false): Layout => ({
  stack: {
    id: `TAB-${id}`,
    children: [
      {
        component: {
          id,
          name: id,
          passProps: {
            isFromSignUp: isFromSignUp,
          },
          options: {
            ...(!tabbarVisible
              ? {
                bottomTabs: {
                  visible: false,
                  drawBehind: true,
                },
              }
              : {}),
            ...NavigationActionsService.defaultOptions,
          },
        },
      },
    ],
    options: {
      bottomTab: {
        text: label,
        icon,
        iconColor: '#676877',
        textColor: '#676877',
        selectedIconColor: '#FF0000',
        selectedTextColor: '#FF0000',
        fontFamily: fonts.AvenirLTStdRoman,
        fontSize: 10,
      },
      topBar: {
        visible: false,
      },
    },
  },
});

const toMain = (isFromSignUp = false) => {
  Navigation.setRoot({
    root: {
      sideMenu: {
        id: ROOT,
        left: {
          component: {
            name: DRAWER,
            options: {
              statusBar: {
                drawBehind: true,
                visible: false,
              },
            },
          },
        },
        options: {
          sideMenu: {
            left: {
              width: WIDTH,
              enabled: false,
            },
            right: {
              enabled: false,
            },
          },
        },
        center: {
          bottomTabs: {
            children: [
              initTab(BOOKS, translate('navigation.books'), BOOK_ICON, true, isFromSignUp),
              initTab(TELEVISION, translate('navigation.tv'), TV_ICON, true),
              initTab(LIBRARY_FEED, translate('navigation.library_feed'), NOIR_ICON, true),
              initTab(EXPLORE, translate('navigation.explore'), EXPLORE_ICON, true),
              initTab(SHOP, translate('navigation.shop'), SHOP_ICON, true),
            ],
            options: {
              bottomTabs: {
                drawBehind: false,
                currentTabIndex: 0,
                backgroundColor: colors.SECONDARY,
                ...Platform.select({
                  android: {
                    titleDisplayMode: 'alwaysShow',
                  },
                }),
              },
              layout: { orientation: ['portrait'] },
              sideMenu: {
                left: {
                  enabled: false,
                },
                right: {
                  enabled: false,
                },
              },
              animations: {
                setRoot: {
                  waitForRender: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export default toMain;
