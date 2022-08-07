import Modalize, { ModalizeProps } from '@/libs/Modalize'
import { navigation } from '@/navigation/navigation'
import { colors, devices, metrics } from '@/vars'
import React from 'react'
import { Keyboard, StatusBar, StyleSheet } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { Omit } from 'utility-types'
import { Subscription } from 'rxjs'
import { Dimension } from '@/services/dimension'

type AModal2Props = Readonly<{
  ref: React.Ref<any>
  modalProps?: Omit<ModalizeProps, 'children'>
}>

type AModal2State = Readonly<{
  dimension: any
}>

export class AModal2 extends React.PureComponent<AModal2Props, AModal2State> {
  _modal: React.RefObject<Modalize> = React.createRef()
  _subscriptionRotate: Subscription

  readonly state = {
    dimension: Dimension.currentMode,
  }

  componentDidMount() {
    this.handleRotate()
  }

  componentWillUnmount(): void {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustResize()
    this._subscriptionRotate && this._subscriptionRotate.unsubscribe()
  }

  handleRotate = () => {
    this._subscriptionRotate = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        this.setState(
          {
            dimension: value,
          },
          () => {
            Keyboard.dismiss()
            this.close()
          }
        )
      }
    })
  }

  open = () => {
    if (this._modal.current) {
      this._modal.current.open()
    }
  }

  close = () => {
    if (this._modal.current) {
      this._modal.current.close()
    }
  }

  onClose = () => {
    Keyboard.dismiss()
    navigation.goBack(null)
  }

  onClosed = () => {
    StatusBar.setBarStyle('dark-content', true)
  }

  render() {
    const { children, modalProps } = this.props
    return (
      <Modalize
        ref={this._modal}
        withHandle={false}
        handlePosition={'inside'}
        keyboardShouldPersistTaps={'always'}
        height={metrics.screen_height / 1.5}
        onClose={this.onClose}
        overlayStyle={{
          backgroundColor: colors.transparent,
        }}
        // onClosed={this.onClosed}
        {...modalProps}
      >
        {children}
      </Modalize>
    )
  }
}
