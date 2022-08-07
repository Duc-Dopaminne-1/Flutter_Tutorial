import * as React from 'react'
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native'
import I18n from '@/i18n'
import { colors, fonts, images, devices } from '@/vars'

type Props = {
  comment: Comment
  onSend: (text: string, cb: (clear: boolean) => void) => void
  onFocus: (isFocuse: boolean) => void
  value?: string
  style?: ViewStyle
  visible?: boolean
}

type State = {
  showSendButton: boolean
  contentSize: number
}

export class ACommentInput extends React.PureComponent<Props, State> {
  _inputRef: React.RefObject<TextInput> = React.createRef()
  _inputValue?: string

  static readonly defaultProps = {
    comment: {},
  }

  readonly state: State = {
    showSendButton: false,
    contentSize: 42,
  }

  /**
   * Focus input
   */
  focus = () => {
    setTimeout(() => {
      this._inputRef && this._inputRef.current.focus()
    }, 500)
  }

  /**
   * Blur input
   */
  blur = () => {
    this._inputRef && this._inputRef.current.blur()
  }

  onFocus = (isFocused: boolean) => {
    this.props.onFocus(isFocused)
  }

  onChange = (text: string) => {
    this._inputValue = text

    if (this._inputValue.trim().length > 0) {
      this.setState({ showSendButton: true })
    } else {
      this.setState({ showSendButton: false })
    }
  }

  onSendButtonPress = () => {
    if (!this._inputValue) {
      return
    }
    this.props.onSend(this._inputValue.trim(), clear => {
      if (clear && this._inputRef) {
        this._inputRef.current.clear()
        this.blur()
        this.onChange('')
      }
    })
  }

  onContentSizeChange = ({ nativeEvent }) => {
    const {
      contentSize: { height },
    } = nativeEvent
    this.setState({ contentSize: height })
  }

  render() {
    const { visible, style } = this.props
    const { contentSize } = this.state
    const pointerEvents = visible ? 'auto' : 'none'
    const opacity = visible ? 1 : 0
    const height = visible ? undefined : 0
    const behavior = devices.isIOS ? 'position' : null
    const inputHeight = devices.isIOS
      ? Math.min(Math.max(35, contentSize), 100)
      : Math.min(Math.max(35, contentSize), 85)
    return (
      <KeyboardAvoidingView
        pointerEvents={pointerEvents}
        style={[{ height, opacity }, styles.shadow, style]}
        behavior={behavior}
      >
        <View style={[styles.row]}>
          <View style={[styles.inputContainer, { height: inputHeight }]}>
            <TextInput
              ref={this._inputRef}
              onChangeText={this.onChange}
              onFocus={() => this.onFocus(true)}
              onBlur={() => this.onFocus(false)}
              placeholder={I18n.t('commentEnter')}
              placeholderStyle={styles.placeholderText}
              placeholderTextColor="#a3afc6"
              style={styles.input}
              multiline={true}
              numberOfLines={5}
              onContentSizeChange={this.onContentSizeChange}
            />
          </View>
          <TouchableOpacity
            onPress={this.onSendButtonPress}
            disabled={!this.state.showSendButton}
            style={styles.button}
          >
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={images.send} />
              {!this.state.showSendButton && (
                <View style={styles.iconDisabled} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginLeft: 12,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: colors.background_gray,
    paddingHorizontal: 24,
    borderRadius: 21,
    height: 42,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    alignSelf: 'center',
    width: '100%',
    padding: 0,
    paddingTop: 0,
    maxHeight: 130,
  },
  shadow: {
    shadowColor: 'rgba(163, 175, 198, 1)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  iconDisabled: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.gray_product,
    opacity: 0.8,
  },
  iconContainer: {
    backgroundColor: colors.primary_blue,
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  button: {
    alignSelf: 'flex-end',
    marginLeft: 12,
  },
  placeholderText: {
    fontFamily: fonts.family.SSPItalic,
    fontSize: fonts.size.m,
    color: colors.text_light_grey,
  },
})
