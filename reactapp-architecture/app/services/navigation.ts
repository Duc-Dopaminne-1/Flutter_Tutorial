import { StatusBar, StatusBarStyle } from 'react-native'
import {
  NavigationActions,
  NavigationEventSubscription,
  NavigationParams,
  NavigationScreenProp,
  StackActions,
} from 'react-navigation'

export class NavigationService {
  _navListener: NavigationEventSubscription
  navigation: NavigationScreenProp<any, any>

  constructor(_navigation) {
    this.navigation = _navigation
  }

  setBarStyle = (barStyle: StatusBarStyle) => {
    this._navListener = this.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle(barStyle, true)
    })
  }

  didFocus = (callbackFn: Function) => {
    this._navListener = this.navigation.addListener('didFocus', () => {
      callbackFn()
    })
  }

  removeListener = () => {
    this._navListener.remove()
  }

  reset = (routeName: string) => {
    const action = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    })

    this.navigation.dispatch(action)
  }

  replace = (routeName: string, params: NavigationParams) => {
    const action = StackActions.replace({
      routeName,
      params,
    })

    this.navigation.dispatch(action)
  }
}
