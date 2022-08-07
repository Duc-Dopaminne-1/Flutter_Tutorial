import { AIndicator } from '@/components/AIndicator/AIndicator'
import { colors, fonts, metrics } from '@/vars/index'
import React from 'react'
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

export type AButtonProps = {
  containerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  onPress(): void
  title: string
  leftIcon?: ImageRequireSource
  rightIcon?: ImageRequireSource
  imageStyle?: StyleProp<ImageStyle>
  loading?: boolean
  disabled?: boolean
}

export class AButton extends React.PureComponent<AButtonProps> {
  renderButtonContent = () => {
    const { titleStyle, title, leftIcon, imageStyle, rightIcon } = this.props

    return (
      <>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.iconLeft, imageStyle]}
            resizeMode={'contain'}
          />
        )}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {rightIcon && (
          <Image
            source={rightIcon}
            style={[styles.iconRight, imageStyle]}
            resizeMode={'contain'}
          />
        )}
      </>
    )
  }

  render() {
    const { containerStyle, onPress, loading, disabled } = this.props

    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={onPress}
        disabled={loading || disabled}
        activeOpacity={0.8}
      >
        {loading ? (
          <AIndicator size={25} color={colors.white} />
        ) : (
          this.renderButtonContent()
        )}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: metrics.button_margin_base,
    backgroundColor: colors.primary_blue,
  },
  title: {
    color: 'white',
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
  },
  iconLeft: {
    height: 20,
    width: 20,
    marginRight: metrics.small_base,
  },
  iconRight: {
    height: metrics.double_button_icon_size,
    width: metrics.double_button_icon_size,
    marginLeft: metrics.small_base,
    tintColor: colors.white,
  },
})
