import * as React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { colors, fonts, metrics, normalize } from '@/vars'

// init state
const initialState = {
  isFocus: false,
}

type AInputGradientProps = {
  title?: string
  value: string
  errorColor?: string
  errorText?: string

  // Style
  containerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>

  // function
  onChangeText: (value: string) => void
  onFocusTextInput?: () => void
  onBlurTextInput?: () => void

  // Props
  textInputProps?: TextInputProps

  // true false
  isError?: boolean

  textInputRef?: any
}

export class AInputOne extends React.PureComponent<AInputGradientProps> {
  static defaultProps = {
    isError: false,
    errorColor: colors.pink_red,
    errorText: '',
  }

  readonly state = initialState

  get renderTitleInput() {
    const { title, titleStyle, isError, errorColor } = this.props
    const { isFocus } = this.state

    if (!title) return null

    return (
      <Text
        style={[
          styles.title,
          titleStyle,
          isFocus && { color: colors.primary_blue },
          isError && { color: errorColor },
        ]}
      >
        {title}
      </Text>
    )
  }

  get renderErrorText() {
    const { errorText, errorColor, isError } = this.props

    if (!isError) return null

    return (
      <View style={styles.wrapErrorText}>
        <Text
          style={[styles.errorText, { color: errorColor }]}
          numberOfLines={1}
        >
          {errorText}
        </Text>
      </View>
    )
  }

  onFocus = () => {
    const { onFocusTextInput } = this.props

    this.setState({ isFocus: true })
    onFocusTextInput && onFocusTextInput()
  }

  onBlur = () => {
    const { onBlurTextInput } = this.props

    this.setState({ isFocus: false })
    onBlurTextInput && onBlurTextInput()
  }

  get renderTextInput() {
    const {
      value,
      inputStyle,
      onChangeText,
      textInputProps,
      isError,
      errorColor,
      textInputRef,
    } = this.props
    const { isFocus } = this.state

    return (
      <View
        style={[
          styles.wrapTextInput,
          isError && { backgroundColor: errorColor },
        ]}
      >
        <>
          <TextInput
            ref={textInputRef}
            value={value}
            onChangeText={onChangeText}
            style={[styles.input, inputStyle]}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType={'done'}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            {...textInputProps}
          />
          <View
            style={[
              styles.headerInput,
              isFocus && !isError && { backgroundColor: colors.primary_blue },
            ]}
          />
        </>
      </View>
    )
  }

  get hasTextError() {
    const { isError, errorText } = this.props

    return isError && errorText.length > 0
  }

  render() {
    const { containerStyle } = this.props

    return (
      <View
        style={[
          styles.container,
          this.hasTextError && { height: 99 },
          containerStyle,
        ]}
      >
        {this.renderTitleInput}
        {this.renderTextInput}
        {this.renderErrorText}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  headerInput: {
    width: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: metrics.wrap_text_input_border_radius - 1,
    borderBottomLeftRadius: metrics.wrap_text_input_border_radius - 1,
  },
  container: {
    height: metrics.container_height,
  },
  title: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    marginBottom: 8,
  },
  wrapTextInput: {
    height: metrics.wrap_text_input_height,
    padding: 1,
    borderWidth: 1,
    borderColor: colors.status_draft,
    borderRadius: metrics.wrap_text_input_border_radius,
  },
  input: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    flex: 1,
    backgroundColor: colors.white,
    marginLeft: normalize(4),
    marginRight: 4,
    paddingHorizontal: metrics.base,
    paddingVertical: 0,
  },
  wrapErrorText: {
    marginTop: 8,
  },
  errorText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
})
