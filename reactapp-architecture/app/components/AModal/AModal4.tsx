import { AActionBar } from '@/components/AActionBar/AActionBar'
import Modalize, { ModalizeProps } from '@/libs/Modalize'
import { navigation } from '@/navigation/navigation'
import { colors, devices, metrics } from '@/vars'
import React from 'react'
import { Animated, Keyboard, StatusBar, StyleSheet } from 'react-native'
import { Omit } from 'utility-types'
import { Subscription } from 'rxjs'
import { Dimension } from '@/services/dimension'
import { Direction } from '@/common/constants/Direction'
import { Toast } from '@/services/global'
import I18n from '@/i18n'

type AModal3Props = Readonly<{
  ref: React.Ref<any>
  showToast?: () => void
  modalProps?: Omit<ModalizeProps, 'children'>
  hideClearButton?: boolean
  hideActionBar?: boolean
  hideUpDownClear?: boolean
  selectPriceShowModal?: () => void

  onMove?: (direction: Direction) => void
  onComplete?: () => void
  onClear?: () => void
  changeColorPicker?: () => void

  modalHeight?: number
  useFromModal?: boolean
}>

type AModal3State = Readonly<{}>

export class AModal4 extends React.PureComponent<AModal3Props, AModal3State> {
  _modal: React.RefObject<Modalize> = React.createRef()
  _subscriptionRotate: Subscription
  donotClickOutsideModal = true

  static defaultProps = {
    modalHeight: metrics.unit_modal_height + 50,
    showToast: () => {},
    selectPriceShowModal: () => {},
    useFromModal: true,
  }

  readonly state = {
    dimension: Dimension.currentMode,
  }

  componentDidMount() {
    this.handleRotate()
  }

  componentWillUnmount(): void {
    this._subscriptionRotate && this._subscriptionRotate.unsubscribe()
  }

  handleRotate = () => {
    this._subscriptionRotate = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        // @ts-ignore
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
      this.donotClickOutsideModal = true
      this._modal.current.open()
    }
  }

  close = () => {
    if (this._modal.current) {
      this.donotClickOutsideModal = false
      this._modal.current.close()
    }
  }

  onClose = () => {
    if (this.donotClickOutsideModal) {
      this.props.selectPriceShowModal()
    }
    this.props.showToast()
    Keyboard.dismiss()
    navigation.goBack(null)
    this.props.changeColorPicker && this.props.changeColorPicker()
  }

  onClosed = () => {
    StatusBar.setBarStyle('dark-content', true)
  }

  private onComplete = () => {
    Keyboard.dismiss()
    this.props.onComplete && this.props.onComplete()
  }

  private onClear = () => {
    const { onClear } = this.props
    onClear && onClear()
  }

  renderHeader = () => {
    const {
      onMove,
      hideClearButton,
      useFromModal,
      hideActionBar,
      hideUpDownClear,
    } = this.props

    if (hideActionBar) return null

    return (
      <Animated.View style={devices.isIOS ? [styles.wrapActionBar] : {}}>
        <AActionBar
          hideClearButton={hideClearButton}
          onMove={onMove}
          onComplete={this.onComplete}
          onClear={this.onClear}
          useFromModal={useFromModal}
          hideUpDownClear={hideUpDownClear}
        />
      </Animated.View>
    )
  }

  render(): React.ReactNode {
    const { children, modalProps, modalHeight } = this.props

    return (
      <Modalize
        ref={this._modal}
        withHandle={false}
        handlePosition={'inside'}
        keyboardShouldPersistTaps={'always'}
        header={{
          component: this.renderHeader,
          isAbsolute: false,
        }}
        height={modalHeight}
        onClose={this.onClose}
        overlayStyle={{
          backgroundColor: colors.transparent,
        }}
        //        onClosed={this.onClosed}
        {...modalProps}
      >
        {children}
      </Modalize>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapActionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
})
