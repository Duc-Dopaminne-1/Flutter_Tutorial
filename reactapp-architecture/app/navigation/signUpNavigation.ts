import { navigation } from '@/navigation/navigation'
import { devices } from '@/vars'
import { InteractionManager } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationParams } from 'react-navigation'
import { Direction } from '@/common/constants/Direction'

export enum SignUpNavigationData {}

export enum SignUpNavigationRef {
  FirstName,
  LastName,
  Email,
  Password,
}

export class SignUpNavigation {
  private _refs = new Map()
  private _data = new Map()
  private _current = -1

  private navigate = (routeName: string, params: NavigationParams) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  set current(value) {
    this._current = value
  }

  setData = (key, value) => {
    this._data.set(key, value)
  }

  setRef = (key, value) => {
    this._refs.set(key, value)
  }

  clear = () => {
    this._refs.clear()
    this._current = -1
  }

  nextIndex = (direction: Direction) => {
    const nextIndex =
      direction === Direction.Down ? this._current + 1 : this._current - 1

    if (nextIndex < 0) {
      return 0
    }

    return nextIndex
  }

  moveHandler = (direction: Direction) => {
    const nextIndex = this.nextIndex(direction)

    InteractionManager.runAfterInteractions(() => {
      this.open(nextIndex)
    })
  }

  open = (key: SignUpNavigationRef) => {
    switch (key) {
      default: {
        const currentRef = this._refs.get(key)
        if (this._refs.has(key) && currentRef && currentRef.focus()) {
          this._refs.get(key).focus()
        }
        break
      }
    }
  }
}

export const signUpNavigation = new SignUpNavigation()
