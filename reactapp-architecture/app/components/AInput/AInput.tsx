import { colors, devices, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { TextField, TextFieldProps } from 'react-native-material-textfield'

// init state
const initialState = {
  isFocus: false,
}

export type AInputProps = {
  iconLeft?: ImageSourcePropType
  iconRight?: ImageSourcePropType
  customRightIcon?: JSX.Element
  title?: string
  text?: string
  value?: string | number
  customInput?: JSX.Element
  prefix?: string

  forwardedRef?: any

  // Style
  containerStyle?: StyleProp<ViewStyle>
  iconLeftStyle?: StyleProp<ImageStyle>
  iconRightStyle?: StyleProp<ImageStyle>
  inputContainerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>

  // function
  onChangeText?: (value: string) => void
  onPress?: () => void
  onFocusTextInput?: () => void

  // check true : false
  useMaterial?: boolean
  modalIsOn?: boolean
  turnOnActiveTextInput?: boolean
  italicPlaceholder?: boolean

  // Props
  textFieldProps?: TextFieldProps
  textInputProps?: TextInputProps
} & TextInputProps

export class BaseAInput extends React.PureComponent<AInputProps> {
  static defaultProps = {
    value: '',
    useMaterial: true,
    onPress: () => {},
    onChangeText: () => {},
    onFocusTextInput: () => {},
    turnOnActiveTextInput: true,
    italicPlaceholder: false,
  }

  readonly state = initialState

  get renderIconLeft() {
    const { iconLeft, iconLeftStyle } = this.props

    if (!iconLeft) return null

    return <Image source={iconLeft} style={[styles.icon, iconLeftStyle]} />
  }

  get renderRightIcon() {
    const { iconRight, customRightIcon, iconRightStyle } = this.props

    if (customRightIcon) return customRightIcon

    if (!iconRight) return null

    return (
      <View style={styles.wrapIconRight}>
        <Image source={iconRight} style={[styles.icon, iconRightStyle]} />
      </View>
    )
  }

  get renderTitleInput() {
    const { title, titleStyle } = this.props

    if (!title) return null

    return <Text style={[styles.title, titleStyle]}>{title}</Text>
  }

  onFocus = () => {
    const { onFocusTextInput } = this.props

    this.setState({ isFocus: true })
    onFocusTextInput()
  }

  onBlur = () => {
    this.setState({ isFocus: false })
  }

  // TODO: ??? Don't duplicate
  get renderTextInputWithPrefix() {
    const {
      text,
      value,
      prefix,
      customInput,
      inputStyle,
      inputContainerStyle,
      onChangeText,
      forwardedRef,
      ...inputProps
    } = this.props

    if (customInput) {
      return (
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {this.renderTitleInput}
          {customInput}
        </View>
      )
    }

    return (
      <View style={[styles.wrapTextInputWithPrefix, inputContainerStyle]}>
        <View style={styles.wrapPrefix}>
          <Text style={styles.prefixText}>{prefix}</Text>
        </View>

        <TextInput
          placeholder={text}
          value={value ? value.toString() : ''}
          onChangeText={onChangeText}
          style={[styles.input, inputStyle]}
          autoCorrect={false}
          autoCapitalize={'words'}
          selectTextOnFocus={devices.isIOS}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={forwardedRef}
          {...inputProps}
        />
      </View>
    )
  }

  // TODO: ??? Don't duplicate
  get renderTextInput() {
    const {
      text,
      value,
      customInput,
      italicPlaceholder,
      inputStyle,
      inputContainerStyle,
      onChangeText,
      forwardedRef,
      ...inputProps
    } = this.props

    if (customInput) {
      return (
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {this.renderTitleInput}
          {customInput}
        </View>
      )
    }

    return (
      <View style={[styles.inputContainer, inputContainerStyle]}>
        {this.renderTitleInput}

        <TextInput
          placeholder={text}
          value={value ? value.toString() : ''}
          onChangeText={onChangeText}
          style={[
            styles.input,
            italicPlaceholder ? { fontFamily: fonts.family.SSPItalic } : {},
            inputStyle,
          ]}
          autoCorrect={false}
          autoCapitalize={'words'}
          selectTextOnFocus={devices.isIOS}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={forwardedRef}
          {...inputProps}
        />
      </View>
    )
  }

  get renderMaterial() {
    const {
      title,
      value,
      inputStyle,
      inputContainerStyle,
      onChangeText,
      modalIsOn,
      textFieldProps,
      forwardedRef,
      ...props
    } = this.props
    const { isFocus } = this.state

    return (
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <TextField
          style={[styles.input, inputStyle]}
          label={title}
          labelTextStyle={styles.labelMaterial}
          baseColor={
            modalIsOn || isFocus ? colors.primary_blue : colors.light_blue_grey
          }
          value={value ? value.toString() : ''}
          onChangeText={onChangeText}
          lineWidth={0}
          activeLineWidth={0}
          disabledLineWidth={0}
          autoCorrect={false}
          autoCapitalize={'words'}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          selectTextOnFocus={devices.isIOS}
          ref={forwardedRef}
          {...textFieldProps}
          {...props}
        />
      </View>
    )
  }

  get renderComponent() {
    const { useMaterial, prefix } = this.props

    if (useMaterial) {
      return this.renderMaterial
    }
    if (prefix) {
      return this.renderTextInputWithPrefix
    }
    return this.renderTextInput
  }

  get isFocus() {
    return this.state.isFocus
  }

  render() {
    const { containerStyle, onPress, modalIsOn } = this.props

    return (
      <View
        style={[
          styles.container,
          containerStyle,
          (this.isFocus || modalIsOn) && {
            borderBottomColor: colors.primary_blue,
          },
        ]}
      >
        {this.renderIconLeft}

        <TouchableOpacity
          style={styles.wrapInput}
          activeOpacity={1}
          onPress={onPress}
        >
          {this.renderComponent}
        </TouchableOpacity>

        {this.renderRightIcon}
      </View>
    )
  }

  clear() {}
}

export const AInput = React.forwardRef<null, AInputProps>((props, ref) => (
  <BaseAInput {...props} forwardedRef={ref} />
))

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    height: 59,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
  },
  icon: {
    height: metrics.input_icon_size,
    width: metrics.input_icon_size,
  },
  wrapIconRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: metrics.medium_base,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  wrapInput: {
    flex: 8,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
    padding: 0,
  },
  labelMaterial: {
    color: colors.light_blue_grey,
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapTextInputWithPrefix: {
    flex: 1,
    flexDirection: 'row',
  },
  wrapPrefix: {
    marginRight: 8,
    justifyContent: 'center',
  },
  prefixText: {
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
  },
})
