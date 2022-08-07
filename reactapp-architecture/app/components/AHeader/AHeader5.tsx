import { ifIphoneX } from '@/shared/devices'

import { colors, fonts, images, metrics } from '@/vars'
import React, { PureComponent } from 'react'
import {
  ImageRequireSource,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native'
import I18n from '@/i18n'
import { Subscription } from 'rxjs'

export type AHeader3Props = {
  placeholder: string
  focusPlaceholder: string
  value: string
  hasBackIcon: boolean
  fromMultiSearch: boolean
  containerStyle?: StyleProp<ViewStyle>

  onPressBack?: () => void
  onPressCancel?: () => void
  onChangeText?: (text: string) => void
  onFocus?: (state: boolean) => void
}

const initialState = {
  isFocus: false,
  iconWidth: new Animated.Value(66),
}

export type AHeader3State = Partial<{}> & Readonly<typeof initialState>

export class AHeader5 extends PureComponent<AHeader3Props, AHeader3State> {
  static defaultProps = {
    turnOffIcon1: false,
    hasBackIcon: false,
    fromMultiSearch: false,
  }

  readonly state: AHeader3State = initialState

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
  }

  onFocus = () => {
    this.setState({ isFocus: true })
    this.props.onFocus(true)

    Animated.timing(this.state.iconWidth, {
      toValue: 87,
      duration: 150,
    }).start()
  }

  onBlur = () => {
    this.setState({ isFocus: false })
    this.props.onFocus(false)

    Animated.timing(this.state.iconWidth, {
      toValue: 66,
      duration: 150,
    }).start()
  }

  renderSearch = () => {
    const { placeholder, focusPlaceholder, value, onChangeText } = this.props
    const { isFocus } = this.state

    const textInputPlaceholder = isFocus ? focusPlaceholder : placeholder
    const placeholderColor = isFocus ? colors.white : colors.light_50

    return (
      <View style={styles.wrapSearch}>
        <Image
          source={images.search}
          style={styles.iconSearch}
          resizeMode={'contain'}
        />
        <TextInput
          placeholder={textInputPlaceholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          style={styles.searchTextInput}
        />
      </View>
    )
  }

  renderBackIcon = () => {
    const { onPressBack, hasBackIcon } = this.props

    if (!hasBackIcon) {
      return null
    }
    return (
      <TouchableOpacity style={styles.wrapIconback} onPress={onPressBack}>
        <Image
          source={images.backArrow}
          resizeMode={'contain'}
          style={styles.icon}
        />
      </TouchableOpacity>
    )
  }

  renderIcon = () => {
    const { onPressCancel, fromMultiSearch } = this.props
    const { isFocus, iconWidth } = this.state

    if (fromMultiSearch) {
      return <View style={{ width: 50 }} />
    }

    if (!isFocus) return <View style={styles.marginRight} />

    return (
      <Animated.View style={[styles.wrapIcon, { width: iconWidth }]}>
        <TouchableOpacity onPress={onPressCancel}>
          <Text style={styles.cancelText}>{I18n.t('cancel')}</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  render() {
    const { containerStyle } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderBackIcon()}
        {this.renderSearch()}
        {this.renderIcon()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary_blue,
    paddingLeft: 14,
    ...ifIphoneX(
      {
        height: 103,
        paddingTop: 30,
      },
      {
        height: 83,
        paddingTop: 20,
      }
    ),
  },
  wrapSearch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: colors.search_box_dark_blue,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  iconSearch: {
    tintColor: colors.white,
    marginVertical: 12,
    height: 16,
    width: 16,
    marginRight: 9,
  },
  searchTextInput: {
    flex: 1,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.white,
    padding: 0,
  },
  wrapIcon: {
    // width: 66,
    paddingRight: 24,
    alignItems: 'flex-end',
  },
  wrapIconback: {
    // flex: 1,
    paddingLeft: metrics.keylines_screen_sign_in_margin - 14,
    paddingRight: metrics.keylines_screen_sign_in_margin,
  },
  icon: {
    tintColor: colors.white,
    height: 24,
    width: 24,
  },
  iconBack: {
    height: metrics.header_one_icon_height,
    width: metrics.header_one_icon_width,
    backgroundColor: 'red',
  },
  cancelText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.white,
  },
  marginRight: {
    marginRight: metrics.keylines_screen_sign_in_margin,
  },
})
