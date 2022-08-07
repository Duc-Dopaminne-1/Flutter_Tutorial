import {
  AActionBarAvoidKeyboard,
  AActionBarAvoidKeyboardProps,
} from '@/components/AActionBar/AActionBarAvoidKeyboard'
import { AHeader, AHeaderProps } from '@/components/AHeader/AHeader'
import { AInput, AInputProps } from '@/components/AInput/AInput'
import { AInputTag, AInputTagProps } from '@/components/AInput/AInputTag'
import I18n from '@/i18n'
import Modalize, { ModalizeProps } from '@/libs/Modalize'
import { navigation } from '@/navigation/navigation'
import { colors, devices, fonts, images, metrics } from '@/vars'
import React from 'react'
import {
  Dimensions,
  Keyboard,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { Omit } from 'utility-types'
import { Dimension, Orientation } from '@/services/dimension'
import { Subscription } from 'rxjs'

type AModal3Props = Readonly<{
  ref: React.Ref<any>
  showToast?: () => void
  updateMulti?: () => void
  isDescription?: boolean
  selectPriceShowModal?: (currency: string) => void
  textInputType?: 'multiple' | 'single' | 'none'
  clearTextStyle?: StyleProp<TextStyle>
  textInputProps?: AInputProps
  tagsInputProps?: AInputTagProps
  selectPriceMultiCurrency?: string
  headerProps?: { key?: number } & AHeaderProps
  modalProps?: Omit<ModalizeProps, 'children'>
  hideActionBar?: boolean
  onHeightChange?: (height: number) => void
  renderKey?: number
  tagColor?: string
  tagTextColor?: string
  hideUpDownClear?: boolean
  withoutNavigation?: boolean
  isWriting?: boolean
}> &
  AActionBarAvoidKeyboardProps

type AModal3State = Readonly<{
  textInputHeight: number
  dimension: Orientation
}>

export class AModal3 extends React.PureComponent<AModal3Props, AModal3State> {
  _modal: React.RefObject<Modalize> = React.createRef()
  _textInput: React.RefObject<any> = React.createRef()
  _subscriptionRotate: Subscription
  donotClickOutsideModal = true

  readonly state = {
    textInputHeight: metrics.multi_select_text_input,
    dimension: Dimension.currentMode,
  }

  static readonly defaultProps = {
    showToast: () => {},
    updateMulti: () => {},
    selectPriceShowModal: (_currency?: string) => {},
    textInputType: 'single',
    hideActionBar: false,
    isDescription: false,
    renderKey: 0,
    tagColor: colors.tag_color,
    tagTextColor: colors.tag_text_color,
  }

  componentDidMount() {
    this.handleRotate()
  }

  componentWillUnmount() {
    // devices.isAndroid && AndroidKeyboardAdjust.setAdjustResize()
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

    setTimeout(() => {
      this._textInput.current && this._textInput.current.focus()
    }, 400)
  }

  close = () => {
    if (this._modal.current) {
      this.donotClickOutsideModal = false
      this._modal.current.close()
    }
  }

  onClose = () => {
    const {
      selectPriceShowModal,
      selectPriceMultiCurrency,
      showToast,
      updateMulti,
    } = this.props

    if (this.donotClickOutsideModal) {
      selectPriceShowModal(selectPriceMultiCurrency)
    }
    showToast()
    updateMulti()
    Keyboard.dismiss()
    navigation.goBack(null)
  }

  onClosed = () => {
    setTimeout(() => {
      StatusBar.setBarStyle('dark-content', true)
    }, 50)
  }

  private onHeightChange = (height: number) => {
    this.setState({
      textInputHeight: height,
    })

    this.props.onHeightChange && this.props.onHeightChange(height)
  }

  private onComplete = () => {
    const { headerProps } = this.props
    if (this.props.isDescription) {
      headerProps.onPressIconLeft()
    } else {
      headerProps.onPressIconRight()
    }
    // Keyboard.dismiss()
  }

  private onClear = () => {
    if (this._textInput.current) {
      if (this._textInput.current.clearText) {
        this._textInput.current.clearText()
      }

      if (this._textInput.current.clear) {
        this._textInput.current.clear()
      }
    }
    this.props.onClear && this.props.onClear()
  }

  private renderTextInput = () => {
    const { textInputHeight } = this.state
    const {
      textInputType,
      textInputProps,
      tagsInputProps,
      renderKey,
      tagColor,
      tagTextColor,
    } = this.props

    if (textInputType === 'multiple') {
      return (
        <View style={[styles.wrapSearchBox, { height: textInputHeight }]}>
          <AInputTag
            key={devices.isAndroid ? renderKey : 69}
            ref={this._textInput}
            tagColor={tagColor}
            tagTextColor={tagTextColor}
            // @ts-ignore
            iconCloseStyle={{ tintColor: tagTextColor }}
            scrollViewProps={{
              style: styles.tagInputScrollView,
            }}
            placeholder={I18n.t('enterTagName')}
            inputColor={colors.black}
            labelExtractor={value => value.name}
            onHeightChange={this.onHeightChange}
            inputProps={{
              placeholderTextColor: colors.text_light_grey,
            }}
            {...tagsInputProps}
          />
        </View>
      )
    }

    if (textInputType === 'single') {
      return (
        <View style={styles.wrapSearchBox}>
          <AInput
            ref={this._textInput}
            key={devices.isAndroid ? renderKey : 69}
            useMaterial={false}
            containerStyle={styles.inputContainer}
            autoFocus={false}
            placeholderTextColor={colors.text_light_grey}
            returnKeyType={'next'}
            {...textInputProps}
          />
        </View>
      )
    }

    return null
  }

  renderHeader = () => {
    const { headerProps } = this.props

    return (
      <>
        <AHeader
          titleStyle={styles.headerTitle}
          containerStyle={styles.headerContainer}
          iconRight={images.closeThickIcon}
          iconRightStyle={styles.headerIconRight}
          {...headerProps}
        />
        {this.renderTextInput()}
      </>
    )
  }

  renderFooter = () => {
    const {
      onMove,
      clearTextStyle,
      hideActionBar,
      hideUpDownClear,
      withoutNavigation,
    } = this.props

    if (hideActionBar) return null

    return (
      <AActionBarAvoidKeyboard
        useAndroid={true}
        onMove={onMove}
        onComplete={this.onComplete}
        onClear={this.onClear}
        clearTextStyle={clearTextStyle}
        useFromModal={true}
        hideUpDownClear={hideUpDownClear}
        withoutNavigation={withoutNavigation}
      />
    )
  }

  render(): React.ReactNode {
    const { children, modalProps, isWriting } = this.props
    const layoutHeight = Dimensions.get('screen').height / 1.125

    return (
      <View
        style={{
          backgroundColor: colors.transparent,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Modalize
          // key={this.state.dimension}
          ref={this._modal}
          withHandle={false}
          handlePosition={'inside'}
          keyboardShouldPersistTaps={'always'}
          header={{
            component: this.renderHeader,
            isAbsolute: true,
          }}
          footer={{
            component: this.renderFooter,
            isAbsolute: true,
          }}
          height={layoutHeight}
          onClose={this.onClose}
          isWriting={isWriting}
          // onClosed={this.onClosed}
          // overlayStyle={{
          //   backgroundColor: colors.transparent,
          // }}
          {...modalProps}
        >
          {children}
        </Modalize>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  tagInputScrollView: {
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    paddingRight: 30,
  },

  modalCustom: {
    paddingTop: metrics.screen_height - metrics.modal_height,
  },
  headerContainer: {
    paddingTop: 0,
    height: 50,
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerTitle: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.black_blue_text,
  },
  headerIconRight: {
    tintColor: colors.close_icon_gray,
    height: metrics.modal_header_icon,
    width: metrics.modal_header_icon,
  },

  wrapSearchBox: {
    height: 50,
    borderBottomColor: colors.primary_blue,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
  },
  inputContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
})
