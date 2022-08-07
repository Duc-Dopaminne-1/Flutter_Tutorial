import { AActionBar, AActionBarProps } from '@/components/AActionBar/AActionBar'
import React from 'react'
import {
  Animated,
  EmitterSubscription,
  Keyboard,
  NativeModules,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native'
import { devices } from '@/vars'

export type AActionBarAvoidKeyboardProps = Readonly<{
  enable?: boolean
  useAndroid?: boolean
  clearTextStyle?: StyleProp<TextStyle>
  keyboardIsShowUp?: (state: boolean) => void
  useFromModal?: boolean
  withoutNavigation?: boolean
  hideUpDownClear?: boolean
}> &
  AActionBarProps

const { StatusBarManager } = NativeModules

export class AActionBarAvoidKeyboard extends React.PureComponent<
  AActionBarAvoidKeyboardProps
> {
  _animatedHeight = new Animated.Value(-60)
  _keyboardWillShowSub: EmitterSubscription
  _keyboardWillHideSub: EmitterSubscription

  readonly state = {
    hideActionBar: true,
  }

  static readonly defaultProps = {
    enable: true,
    useFromModal: false,
  }

  componentDidMount(): void {
    if (Platform.OS === 'android') {
      this._keyboardWillShowSub = Keyboard.addListener(
        'keyboardDidShow',
        this.keyboardWillShow
      )
      this._keyboardWillHideSub = Keyboard.addListener(
        'keyboardDidHide',
        this.keyboardWillHide
      )
    } else {
      this._keyboardWillShowSub = Keyboard.addListener(
        'keyboardWillShow',
        this.keyboardWillShow
      )
      this._keyboardWillHideSub = Keyboard.addListener(
        'keyboardWillHide',
        this.keyboardWillHide
      )
    }
  }

  componentWillUnmount(): void {
    this._keyboardWillShowSub && this._keyboardWillShowSub.remove()
    this._keyboardWillHideSub && this._keyboardWillHideSub.remove()
  }

  private keyboardWillShow = event => {
    let statusBarAndroid = 0
    const statusBarHeight = StatusBarManager.HEIGHT

    if (devices.isAndroid && statusBarHeight > 25) {
      statusBarAndroid = StatusBarManager.HEIGHT
    }

    this.setState({ hideActionBar: false })
    this.props.keyboardIsShowUp && this.props.keyboardIsShowUp(true)
    Animated.timing(this._animatedHeight, {
      toValue: event.endCoordinates.height + statusBarAndroid,
      duration: 200,
    }).start()
  }

  private keyboardWillHide = () => {
    Animated.timing(this._animatedHeight, {
      toValue: 0,
      duration: 200,
    }).start()

    this.setState({ hideActionBar: true })
    this.props.keyboardIsShowUp && this.props.keyboardIsShowUp(false)
  }

  render(): React.ReactNode {
    const {
      hideClearButton,
      hideUpDownClear,
      onMove,
      onComplete,
      onClear,
      enable,
      useAndroid,
      clearTextStyle,
      withoutNavigation,
      useFromModal,
    } = this.props

    if (!enable) {
      return null
    }

    if (this.state.hideActionBar) {
      return null
    }

    return (
      <Animated.View
        style={Platform.select({
          ios: [styles.wrapActionBar, { bottom: this._animatedHeight }],
          android: useAndroid
            ? [styles.wrapActionBar, { bottom: this._animatedHeight }]
            : {},
        })}
      >
        <AActionBar
          hideUpDownClear={hideUpDownClear}
          hideClearButton={hideClearButton}
          onMove={onMove}
          onComplete={onComplete}
          onClear={onClear}
          clearTextStyle={clearTextStyle}
          useFromModal={useFromModal}
          withoutNavigation={withoutNavigation}
        />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapActionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
})
