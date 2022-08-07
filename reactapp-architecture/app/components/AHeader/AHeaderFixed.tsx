import AnimatedGradientTransition from '@/components/ALinearGradient/AnimatedGradientTransition'
import I18n from '@/i18n'
import {
  ifIphoneX,
  isIpad,
  selectPlatform,
  statusBarHeight,
} from '@/shared/devices'
import { colors, fonts, images, metrics } from '@/vars'
import React, { PureComponent } from 'react'
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

interface HeaderFixedProps {
  // icon
  iconLeft?: ImageRequireSource
  iconRight?: ImageRequireSource

  // render
  renderIconLeft?: any

  // onPress
  onPressIconLeft?: () => void
  onPressIconRight?: () => void

  // Text
  title?: string
  iconLeftText?: string
  iconRightText?: string

  // style
  iconLeftStyle?: StyleProp<ImageStyle>
  iconRightStyle?: StyleProp<ImageStyle>
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  animatedStyle?: StyleProp<ViewStyle>
  wrapIconLeftStyle?: StyleProp<ViewStyle>
  wrapIconRightStyle?: StyleProp<ViewStyle>
  wrapTitleStyle?: StyleProp<ViewStyle>
  iconLeftTextStyle?: StyleProp<TextStyle>
  color?: any

  // other function
  removeTitle?: boolean
}

export class AHeaderFixed extends PureComponent<HeaderFixedProps> {
  static defaultProps = {
    // icon left
    iconLeft: images.leftChevron,
    iconLeftText: I18n.t('back'),

    // title
    removeTitle: false,
  }

  get renderLeftIcon() {
    const {
      iconLeft,
      iconLeftText,
      onPressIconLeft,
      wrapIconLeftStyle,
      iconLeftStyle,
      iconLeftTextStyle,
      renderIconLeft,
    } = this.props

    if (!iconLeft) return <View style={{ width: 80 }} />

    if (renderIconLeft) {
      return (
        <TouchableOpacity
          style={[styles.wrapIconLeft, wrapIconLeftStyle]}
          activeOpacity={0.8}
          onPress={onPressIconLeft}
        >
          {renderIconLeft()}
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={[styles.wrapIconLeft, wrapIconLeftStyle]}
        activeOpacity={0.8}
        onPress={onPressIconLeft}
      >
        <Image
          source={iconLeft}
          resizeMode={'contain'}
          style={[styles.icon, iconLeftStyle]}
        />
        <Text style={[styles.text, iconLeftTextStyle]}>{iconLeftText}</Text>
      </TouchableOpacity>
    )
  }

  get renderTitle() {
    const { removeTitle, title, wrapTitleStyle, titleStyle } = this.props

    if (removeTitle) return null

    if (!title) return <View style={styles.wrapTitle} />

    return (
      <View style={[styles.wrapTitle, wrapTitleStyle]}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    )
  }

  get renderIconRight() {
    const {
      iconRight,
      iconRightText,
      onPressIconRight,
      wrapIconRightStyle,
      iconRightStyle,
    } = this.props

    if (!iconRightText && !iconRight) {
      return <View style={styles.wrapIconRight} />
    }

    if (iconRight) {
      return (
        <TouchableOpacity
          style={[styles.wrapIconRight, wrapIconRightStyle]}
          activeOpacity={0.8}
          onPress={onPressIconRight}
        >
          <Image
            source={iconRight}
            resizeMode={'contain'}
            style={[styles.icon, iconRightStyle]}
          />
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={[styles.wrapIconRight, wrapIconRightStyle]}
        activeOpacity={0.8}
        onPress={onPressIconRight}
      >
        <Text style={styles.text}>{iconRightText}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { containerStyle, animatedStyle, color } = this.props

    return (
      <AnimatedGradientTransition
        colors={color}
        style={[styles.container, animatedStyle]}
      >
        <View style={[styles.container, containerStyle]}>
          {this.renderLeftIcon}

          {this.renderTitle}

          {this.renderIconRight}
        </View>
      </AnimatedGradientTransition>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.transparent,
    zIndex: 99,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: selectPlatform({
      android: 80,
      ios: 60,
      iPad: 70,
    }),
    paddingTop: statusBarHeight(),
    ...ifIphoneX(
      {
        height: 80,
        paddingTop: statusBarHeight(),
      },
      {}
    ),
  },
  wrapIconLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 12,
  },
  wrapTitle: {
    flex: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapIconRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 12,
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: colors.white,
  },
  text: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.family.SSPSemiBold,
  },
  title: {
    fontSize: fonts.size.xl,
    marginHorizontal: metrics.base,
    fontWeight: '600',
    color: colors.white,
  },
})
