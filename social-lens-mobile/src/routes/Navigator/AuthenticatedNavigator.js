import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Image, Text } from 'react-native';

import ProfileScreen from 'app/routes/Profile';
import TodoesScreen from 'app/routes/ToDoes/Index';
import TodoDetailsScreen from 'app/routes/ToDoes/Details';
import QuestionDetailsScreen from 'app/routes/ToDoes/QuestionDetails';
import ConversationScreen from 'app/routes/ToDoes/Conversation';
import RewardScreen from 'app/routes/Reward';

import TodoIcon from 'app/assets/images/todo_icon.png';
import RewardsIcon from 'app/assets/images/rewards_icon.png';
import ProfileIcon from 'app/assets/images/profile_icon.png';
import I18n from 'app/i18n'

const MainTabNavigator = createBottomTabNavigator(
  {
    todoes: TodoesScreen,
    rewards: RewardScreen,
    profile: ProfileScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/display-name
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let icon;
        switch (routeName) {
          case 'todoes':
            icon = TodoIcon;
            break;
          case 'rewards':
            icon = RewardsIcon;
            break;
          case 'profile':
            icon = ProfileIcon;
            break;
          default:
            break;
        }

        let iconStyle = {
          width: 20,
          height: 20,
          tintColor
        };
        return <Image source={icon} style={iconStyle} resizeMode='contain' />;
      },
      // eslint-disable-next-line react/display-name
      tabBarLabel: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let tabLabel, fontSize = 12;
        switch (routeName) {
          case 'todoes':
            tabLabel = I18n.t('toDoes');
            break;
          case 'rewards':
            tabLabel = I18n.t('rewards');
            break;
          case 'profile':
            tabLabel = I18n.t('profile');
            break;
          default:
            break;
        }
        let textStyle = {
          color: tintColor,
          fontSize,
          fontFamily: 'HelveticaNeue-Light',
          textAlign: 'center'
        };
        return <Text style={textStyle}>{tabLabel}</Text>;
      }
    }),
    tabBarOptions: {
      activeTintColor: '#41444b',
      inactiveTintColor: '#aeaeae',
      safeAreaInset: { bottom: 'never' },
      activeBackgroundColor: '#fff',
      inactiveBackgroundColor: '#fff'
    }
  }
);

export default createStackNavigator(
  {
    mainroot: MainTabNavigator,
    tododetails: {
      screen: TodoDetailsScreen,
      navigationOptions: {
        gestureEnabled: false,
      }
    },
    questiondetails: {
      screen: QuestionDetailsScreen,
      navigationOptions: {
        gestureEnabled: false,
      }
    },
    conversation: {
      screen: ConversationScreen,
      navigationOptions: {
        gestureEnabled: false,
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'mainroot'
  }
);