import { colors, fonts, metrics } from '@/vars/index'
import React from 'react'
import {
  Image,
  ImageRequireSource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { AIndicator } from '@/components/AIndicator/AIndicator'

export type AButtonDoubleProps = {
  containerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  onPressLeft(): void
  titleLeft: string
  iconLeft: ImageRequireSource
  onPressRight(): void
  titleRight: string
  iconRight: ImageRequireSource
  loading: boolean
}

export const AButtonDouble: React.SFC<AButtonDoubleProps> = props => {
  const {
    containerStyle,
    titleStyle,
    onPressLeft,
    titleLeft,
    iconLeft,
    onPressRight,
    titleRight,
    iconRight,
    loading,
  } = props

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.wrapButtonLeft}
        onPress={onPressLeft}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <AIndicator size={25} color={colors.white} />
        ) : (
          <>
            <Image source={iconLeft} style={styles.icon} />
            <Text style={[styles.title, titleStyle]}>
              {titleLeft.toUpperCase()}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.line} />

      <TouchableOpacity
        style={styles.wrapButtonRight}
        onPress={onPressRight}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <AIndicator size={25} color={colors.white} />
        ) : (
          <>
            <Text style={[styles.title, titleStyle]}>
              {titleRight.toUpperCase()}
            </Text>
            <Image source={iconRight} style={styles.iconRight} />
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    margin: 12,
    overflow: 'hidden',
    borderRadius: 5,
    flexDirection: 'row',
    height: metrics.double_button_height,
  },
  title: {
    color: 'white',
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  icon: {
    height: metrics.double_button_icon_size,
    width: metrics.double_button_icon_size,
    tintColor: colors.white,
    marginRight: 8,
  },
  iconRight: {
    height: metrics.double_button_icon_size,
    width: metrics.double_button_icon_size,
    tintColor: colors.white,
    marginLeft: 4,
  },
  wrapButtonLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.button_medium_blue,
  },
  line: {
    width: 0.5,
    backgroundColor: colors.white,
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: metrics.screen_width / 2 - metrics.keylines_screen_edge_margin,
    zIndex: 99,
  },
  wrapButtonRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary_blue,
  },
})
