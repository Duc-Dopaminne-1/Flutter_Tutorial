import { ifIphoneX, isIpad } from '@/shared/devices'

import { colors, fonts, images } from '@/vars'
import React, { PureComponent } from 'react'
import {
  ImageRequireSource,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native'

export type AHeader4Props = {
  placeholder: string
  focusPlaceholder: string
  value: string
  icon: ImageRequireSource

  containerStyle?: StyleProp<ViewStyle>

  onPressIcon?: () => void
  onChangeText?: (text: string) => void
  onFocus?: (state: boolean) => void
}

const initialState = {
  isFocus: false,
  iconWidth: new Animated.Value(66),
}

export type AHeader4State = Partial<{}> & Readonly<typeof initialState>

export class AHeader4 extends PureComponent<AHeader4Props, AHeader4State> {
  static defaultProps = {
    turnOffIcon1: false,
    onFocus: () => {},
    onChangeText: () => {},
    onPressIcon: () => {},
  }

  readonly state: AHeader4State = initialState

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

  renderIcon = () => {
    const { icon, onPressIcon } = this.props

    return (
      <Animated.View style={[styles.wrapIcon]}>
        <TouchableOpacity onPress={onPressIcon}>
          <Image source={icon} style={styles.icon} resizeMode={'contain'} />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  render() {
    const { containerStyle } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderIcon()}
        {this.renderSearch()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.primary_blue,
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
    paddingRight: 24,
  },
  icon: {
    tintColor: colors.white,
    height: 24,
    width: 24,
  },
  cancelText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.white,
  },
})
