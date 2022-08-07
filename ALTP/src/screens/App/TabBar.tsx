import I18n from '@/i18n'
import { isIphoneX } from '@/shared/devices'
import { colors, images, metrics, normalize } from '@/vars'
import * as React from 'react'
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { TabBarButton } from './TabBarButton'
import { Subscription } from 'rxjs'
import { isVisibleTabBar } from '@/shared/global'
import { ReactElement } from 'react'
import { AdminScreen } from '@/screens/Admin/AdminScreen'
import { NotificationScreen } from '@/screens/Admin/Notification/NotificationScreen'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
const Tab = createMaterialBottomTabNavigator()

type TabBarProps = {
  activeTintColor: string
  inactiveTintColor: string
  jumpTo(key: string): void
  navigation: any
}

type TabBarState = Readonly<{}>

export class TabBarAdmin extends React.PureComponent<TabBarProps, TabBarState> {
  _subscription: Subscription
  _isVisibleSubscription: Subscription
  _moveAnim = new Animated.Value(isIphoneX() ? normalize(62) : normalize(60))
  marginBottom = 62

  readonly state = {}

  TabBarIcon = (focused: boolean, image: any): ReactElement => {
    return (
      <Image
        style={{
          width: focused ? 27 : 18,
          height: focused ? 27 : 18
        }}
        source={image}
      />
    )
  }

  componentDidMount() {
    this._isVisibleSubscription = isVisibleTabBar.subscribe(data => {
      if (data) {
        Animated.timing(this._moveAnim, {
          toValue: isIphoneX() ? normalize(62) : normalize(60),
          duration: 400
        }).start()
      } else {
        Animated.timing(this._moveAnim, {
          toValue: 0,
          duration: 400
        }).start()
      }
    })
  }

  componentWillUnmount() {
    this._isVisibleSubscription && this._isVisibleSubscription.unsubscribe()
    this._subscription && this._subscription.unsubscribe()
  }

  render() {
    return (
      <Tab.Navigator
        barStyle={{ backgroundColor: 'white' }}
        screenOptions={{
          tabBarIcon: ({ focused }): ReactElement =>
            this.TabBarIcon(focused, images.icon_message_highlight)
        }}>
        <Tab.Screen
          name="QuestionScreen"
          component={AdminScreen}
          options={{
            tabBarLabel: 'Question',
            tabBarIcon: ({ focused }): ReactElement =>
              this.TabBarIcon(focused, images.icon_message_highlight)
          }}
        />
        <Tab.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            tabBarLabel: 'Notification',
            tabBarIcon: ({ focused }): ReactElement =>
              this.TabBarIcon(focused, images.icon_noti_fill)
          }}
        />
      </Tab.Navigator>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'red',
    borderTopWidth: 0.7,
    borderTopColor: colors.pale_grey
  }
})
