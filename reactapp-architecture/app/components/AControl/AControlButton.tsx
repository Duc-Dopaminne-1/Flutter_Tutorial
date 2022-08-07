import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  Image,
  ImageRequireSource,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native'
import { selectPlatform } from '@/shared/devices'
import LinearGradient from 'react-native-linear-gradient'

export type AControlButtonProps = {
  title: string
  onPress?: () => void
  source: ImageURISource | ImageRequireSource
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  wrapperIconStyle?: StyleProp<ImageStyle>
  isGradient?: boolean
  gradientColors?: [string, string]
}

export const AControlButton: React.SFC<AControlButtonProps> = ({
  title,
  onPress,
  source,
  containerStyle,
  wrapperStyle,
  wrapperIconStyle,
  isGradient,
  gradientColors = ['#d97bff', '#45adff'],
}) => {
  if (isGradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, containerStyle]}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={gradientColors}
          style={styles.gradient}
        >
          <View style={[styles.wrapIcon, styles.transparent, wrapperStyle]}>
            <Image
              source={source}
              style={[styles.icon, wrapperIconStyle]}
              resizeMode={'contain'}
            />
          </View>
        </LinearGradient>
        <Text style={styles.text} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <View style={[styles.wrapIcon, wrapperStyle]}>
        <Image
          source={source}
          style={[styles.icon, wrapperIconStyle]}
          resizeMode={'contain'}
        />
      </View>
      <Text style={styles.text} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

AControlButton.defaultProps = {}

const styles = StyleSheet.create<any>({
  container: {
    alignItems: 'center',
    width: selectPlatform({
      iPad: 87,
      default: 80, // @duc-ant-tech edited
      // default: 72,
    }),
  },
  wrapIcon: {
    height: metrics.control_button_size,
    width: metrics.control_button_size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.control_button_size / 2,
    backgroundColor: colors.primary_blue,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  icon: {
    height: metrics.control_button_icon_size,
    width: metrics.control_button_icon_size,
    tintColor: colors.white,
  },
  text: {
    marginTop: metrics.control_margin_btw_title_and_button,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
    textAlign: 'center',
  },
  gradient: {
    height: metrics.control_button_size_large,
    width: metrics.control_button_size_large,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.control_button_size_large / 2,
  },
})
