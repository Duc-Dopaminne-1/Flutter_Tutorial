import I18n from '@/i18n'
import { ifIphoneX, statusBarHeight } from '@/shared/devices'
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
import { NavigationScreenProp } from 'react-navigation'

export type AHeaderProps = {
  // icon
  iconLeft?: ImageRequireSource
  iconRight?: ImageRequireSource
  iconRight2?: ImageRequireSource

  // onPress
  onPressIconLeft?: () => void
  onPressIconRight?: () => void
  onPressIconRight2?: () => void

  // Text
  title?: string
  placeholder?: string
  value?: string
  backButtonIOSTitle?: string

  // style
  iconLeftStyle?: StyleProp<ImageStyle>
  backButtonIOSStyle?: StyleProp<ViewStyle>
  backButtonIOSTextStyle?: StyleProp<TextStyle>
  iconRightStyle?: StyleProp<ImageStyle>
  iconRightStyle2?: StyleProp<ImageStyle>
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  wrapIconLeftStyle?: StyleProp<ViewStyle>
  wrapIconRightStyle?: StyleProp<ViewStyle>
  wrapIconRightStyle2?: StyleProp<ViewStyle>
  wrapTitleStyle?: StyleProp<ViewStyle>

  // custom
  renderLeft?: any
  renderTitle?: any
  renderRight?: any

  // other function
  removeIconRight?: boolean
  removeTitle?: boolean
  navigation?: NavigationScreenProp<any, any>
  isShowSearch?: boolean

  // True False
  renderBackButtonIOS?: boolean
  isGallery?: boolean
}

export class AHeader extends PureComponent<AHeaderProps> {
  static defaultProps = {
    removeTitle: false,
    renderBackButtonIOS: false,
  }

  get renderLeftIcon() {
    const {
      iconLeft,
      onPressIconLeft,
      renderLeft,
      iconLeftStyle,
      wrapIconLeftStyle,
    } = this.props

    if (renderLeft) return renderLeft()

    if (!iconLeft) return <View style={styles.wrapIconLeft} />

    return (
      <TouchableOpacity
        style={[styles.wrapIconLeft, wrapIconLeftStyle]}
        onPress={onPressIconLeft}
      >
        <Image
          source={iconLeft}
          resizeMode={'contain'}
          style={[styles.icon, iconLeftStyle]}
        />
      </TouchableOpacity>
    )
  }

  get renderBackIconIOS() {
    const {
      onPressIconLeft,
      backButtonIOSTitle,
      backButtonIOSStyle,
      backButtonIOSTextStyle,
    } = this.props
    if (backButtonIOSTitle) {
      return (
        <TouchableOpacity
          style={[styles.wrapBackButtonIOS, backButtonIOSStyle]}
          activeOpacity={0.8}
          onPress={onPressIconLeft}
        >
          <Text style={[styles.backButtonIOSText, backButtonIOSTextStyle]}>
            {backButtonIOSTitle}
          </Text>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={[styles.wrapBackButtonIOS, backButtonIOSStyle]}
        activeOpacity={0.8}
        onPress={onPressIconLeft}
      >
        <Image
          source={images.leftChevron}
          resizeMode={'contain'}
          style={styles.backButtonIOSIcon}
        />
        <Text style={styles.backButtonIOSText}>{I18n.t('back')}</Text>
      </TouchableOpacity>
    )
  }

  get renderTitle() {
    const {
      title,
      renderTitle,
      wrapTitleStyle,
      titleStyle,
      removeTitle,
    } = this.props

    if (renderTitle) return renderTitle

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

  get renderRightIcon() {
    const {
      iconRight,
      onPressIconRight,
      renderRight,
      wrapIconRightStyle,
      iconRightStyle,
      removeIconRight,
    } = this.props

    if (renderRight) return renderRight()

    if (removeIconRight) return null

    if (!iconRight) return <View style={styles.wrapIconRight} />

    return (
      <TouchableOpacity
        style={[styles.wrapIconRight, wrapIconRightStyle]}
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

  get renderRightIcon2() {
    const {
      renderRight,
      wrapIconRightStyle2,
      removeIconRight,
      iconRight2,
      onPressIconRight2,
      iconRightStyle2,
    } = this.props

    if (renderRight) return renderRight()

    if (removeIconRight) return null

    if (!iconRight2) return <View style={styles.wrapIconRight} />

    return (
      <TouchableOpacity
        style={[styles.wrapIconRight, wrapIconRightStyle2]}
        onPress={onPressIconRight2}
      >
        <Image
          source={iconRight2}
          resizeMode={'contain'}
          style={[styles.icon, iconRightStyle2]}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { containerStyle, renderBackButtonIOS, isGallery } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {renderBackButtonIOS ? this.renderBackIconIOS : this.renderLeftIcon}

        {this.renderTitle}

        {this.renderRightIcon}

        {isGallery ? this.renderRightIcon2 : null}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    height: Platform.select({
      ios: 60,
      android: 77, // @Duc-ant-tech edited
      // android: 100,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  wrapBackButtonIOS: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButtonIOSIcon: {
    tintColor: colors.back_button_ios_color,
    width: metrics.aheader_backButtonIOSText_height,
    height: metrics.aheader_backButtonIOSText_width,
  },
  backButtonIOSText: {
    color: colors.back_button_ios_color,
    fontSize: metrics.aheader_backButtonIOSText_fontSize,
    fontFamily: fonts.family.SSPRegular,
  },
  wrapTitle: {
    flex: 3.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapIconRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    width: metrics.aheader_icon_width,
    height: metrics.aheader_icon_height,
  },
  title: {
    fontFamily: fonts.family.SSPRegular,
    marginHorizontal: metrics.base,
    fontSize: metrics.aheader_title_fontsize,
  },
})
