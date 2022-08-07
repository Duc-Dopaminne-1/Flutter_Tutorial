import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors, fonts, metrics, normalize } from '@/vars/index'
import LinearGradient from 'react-native-linear-gradient'
import { AIndicator } from '@/components/AIndicator/AIndicator'

export type props = {
  // containerStyle?: StyleProp<ViewStyle>
  // titleStyle?: StyleProp<TextStyle>
  title?: string
  onPress: () => void
  loading?: boolean
}

export class AButtonGradient extends React.PureComponent<props> {
  static defaultProps = {
    title: '',
    loading: false,
  }

  render() {
    const { title, onPress, loading } = this.props

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={!loading ? onPress : null}
        activeOpacity={loading ? 1 : 0.5}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.75, y: 0 }}
          colors={[
            colors.product_info_camera_btn_bottom,
            colors.product_info_camera_btn_top,
          ]}
          style={styles.linearGradient}
        >
          {loading ? (
            <AIndicator size={25} color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  linearGradient: {
    height: metrics.button_gradient_height,
    width: metrics.button_gradient_width,
    borderRadius: metrics.button_gradient_border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
})
