import * as React from 'react'
import { Keyboard, Platform, View, ViewProps } from 'react-native'

type AKeyboardListenerProps = {
  keyboardWillShow?: (value) => void
  keyboardWillHide?: () => void
} & ViewProps

export class AKeyboardListener extends React.PureComponent<
  AKeyboardListenerProps
> {
  keyboardWillShowSub: any
  keyboardWillHideSub: any

  componentDidMount() {
    this.keyboardTrigger()
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardTrigger = () => {
    if (Platform.OS === 'android') {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', e => {
        this.props.keyboardWillShow(e)
      })

      this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', () => {
        this.props.keyboardWillHide()
      })
    } else {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', e => {
        this.props.keyboardWillShow(e)
      })

      this.keyboardWillHideSub = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          this.props.keyboardWillHide()
        }
      )
    }
  }

  render() {
    const { children, ...viewProps } = this.props
    return <View {...viewProps}>{children}</View>
  }
}
