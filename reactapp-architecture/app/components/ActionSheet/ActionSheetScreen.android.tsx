import React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from '@/vars'

const WARN_COLOR = '#FF3B30'
const MAX_HEIGHT = Dimensions.get('window').height * 0.7

export type ActionSheetProps = {
  tintColor?: string
  buttonUnderlayColor?: string
  onPress?: (index: number) => void
  styles?: Object
  cancelButtonIndex?: number
  options?: any
  title?: any
  message?: string
  destructiveButtonIndex?: number
  lastItem?: number
  firstItem?: number
  styleItem?: Object
}

export type ActionSheetState = {
  visible: boolean
  sheetAnim: any
}

export class ActionSheet extends React.Component<
  ActionSheetProps,
  ActionSheetState
> {
  scrollEnabled = false
  translateY = 0

  static defaultProps = {
    tintColor: '#007AFF',
    buttonUnderlayColor: '#F4F4F4',
    onPress: () => {},
    styles: {},
  }

  constructor(props) {
    super(props)
    this.scrollEnabled = false
    this.translateY = this._calculateHeight(props)
    this.state = {
      visible: false,
      sheetAnim: new Animated.Value(this.translateY),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.translateY = this._calculateHeight(nextProps)
  }

  isset(prop) {
    return typeof prop !== 'undefined'
  }

  merge(target, source) {
    Object.keys(source).forEach(key => {
      if (Object.prototype.toString.call(source).slice(8, -1) === 'Object') {
        target[key] = this.merge(target[key] || {}, source[key])
      } else {
        target[key] = source[key]
      }
    })
    return target
  }

  get styles(): any {
    const { styles } = this.props
    const obj = {}
    Object.keys(styles2).forEach(key => {
      const arr = [styles2[key]]
      if (styles[key]) {
        arr.push(styles[key])
      }
      obj[key] = arr
    })
    return obj
  }

  show = () => {
    this.setState({ visible: true }, () => {
      this._showSheet()
    })
  }

  hide = index => {
    this._hideSheet(() => {
      this.setState({ visible: false }, () => {
        this.props.onPress(index)
      })
    })
  }

  _cancel = () => {
    const { cancelButtonIndex } = this.props
    if (this.isset(cancelButtonIndex)) {
      this.hide(cancelButtonIndex)
    }
  }

  _showSheet = () => {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
    }).start()
  }

  _hideSheet = callback => {
    Animated.timing(this.state.sheetAnim, {
      toValue: this.translateY,
      duration: 200,
    }).start(callback)
  }

  /**
   * elements: titleBox, messageBox, buttonBox, cancelButtonBox
   * box size: height, marginTop, marginBottom
   */
  _calculateHeight = props => {
    const styles = this.styles

    const getHeight = name => {
      const style = styles[name][styles[name].length - 1]
      let h = 0
      ;['height', 'marginTop', 'marginBottom'].forEach(attrName => {
        if (typeof style[attrName] !== 'undefined') {
          h += style[attrName]
        }
      })
      return h
    }

    let height = 0
    if (props.title) height += getHeight('titleBox')
    if (props.message) height += getHeight('messageBox')
    if (this.isset(props.cancelButtonIndex)) {
      height += getHeight('cancelButtonBox')
      height += (props.options.length - 1) * getHeight('buttonBox')
    } else {
      height += props.options.length * getHeight('buttonBox')
    }

    if (height > MAX_HEIGHT) {
      this.scrollEnabled = true
      height = MAX_HEIGHT
    } else {
      this.scrollEnabled = false
    }

    return height
  }

  _renderTitle = () => {
    const { title } = this.props
    const styles = this.styles
    if (!title) return null
    return (
      <View style={styles.titleBox}>
        {React.isValidElement(title) ? (
          title
        ) : (
          <Text style={styles.titleText}>{title}</Text>
        )}
      </View>
    )
  }

  _renderMessage = () => {
    const { message } = this.props
    const styles = this.styles
    if (!message) return null
    return (
      <View style={styles.messageBox}>
        {React.isValidElement(message) ? (
          message
        ) : (
          <Text style={styles.messageText}>{message}</Text>
        )}
      </View>
    )
  }

  _renderCancelButton = () => {
    const { options, cancelButtonIndex } = this.props
    if (!this.isset(cancelButtonIndex)) return null
    return this._createButton(options[cancelButtonIndex], cancelButtonIndex)
  }

  _createButton = (titles, index) => {
    const styles = this.styles
    const {
      buttonUnderlayColor,
      cancelButtonIndex,
      destructiveButtonIndex,
      tintColor,
      lastItem,
      title,
    } = this.props
    const fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor
    const buttonBoxStyle =
      cancelButtonIndex === index ? styles.cancelButtonBox : styles.buttonBox
    const textButtonBoxStyle =
      cancelButtonIndex === index ? styles.textButtonBoxStyle : {}

    const topBorder = index === 0 ? { borderTopWidth: 0.8 } : {}

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        style={[buttonBoxStyle, topBorder]}
        onPress={() => this.hide(index)}
      >
        <Text
          style={[styles.buttonText, { color: fontColor }, textButtonBoxStyle]}
        >
          {titles}
        </Text>
      </TouchableOpacity>
    )
  }

  // _renderOptions = () => {
  //  const { cancelButtonIndex } = this.props
  //  return this.props.options.map((title, index) => {
  //    return cancelButtonIndex === index
  //      ? null
  //      : this._createButton(title, index)
  //  })
  // }

  renderItem = ({ item, index }) => {
    const { cancelButtonIndex } = this.props

    if (cancelButtonIndex === index) return null

    return this._createButton(item, index)
  }

  renderFlatList = () => {
    const { options, title } = this.props

    return (
      <FlatList
        data={options}
        extraData={options}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        scrollEnabled={this.scrollEnabled}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: colors.white,
        }}
      />
    )
  }

  render() {
    const styles = this.styles
    const { visible, sheetAnim } = this.state
    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent
        onRequestClose={this._cancel}
      >
        <View style={[styles.wrapper]}>
          <Text style={[styles.overlay]} onPress={this._cancel} />
          <Animated.View
            style={[
              styles.body,
              {
                borderColor: '#fff',
                height: this.translateY,
                transform: [{ translateY: sheetAnim }],
              },
            ]}
          >
            {this._renderTitle()}
            {this._renderMessage()}
            {this.renderFlatList()}
            <View />

            <View style={styles.aboveCancel} />
            {this._renderCancelButton()}
          </Animated.View>
        </View>
      </Modal>
    )
  }
}

const styles2 = StyleSheet.create({
  aboveCancel: {
    height: 5,
    width: '100%',
    backgroundColor: colors.action_gray,
    marginVertical: -1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: colors.black,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  body: {
    flex: 1,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
  titleBox: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  titleText: {
    color: '#757575',
    fontSize: 14,
  },
  messageBox: {
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  messageText: {
    color: '#9a9a9a',
    fontSize: 12,
  },
  buttonBox: {
    height: 50,
    borderBottomWidth: 0.8,
    borderColor: colors.action_gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
  cancelButtonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  textButtonBoxStyle: {
    fontSize: 20,
    color: colors.back_button_ios_color,
    fontWeight: '600',
  },
  removeBorder: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
})
