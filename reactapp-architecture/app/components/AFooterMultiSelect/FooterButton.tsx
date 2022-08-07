import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, fonts, metrics, normalize } from '@/vars'

type Props = Readonly<{
  icon: any
  title: string
  style?: object
  onPress?: () => void
}>

export class FooterButton extends React.PureComponent<Props> {
  render() {
    const { icon, title, style, onPress } = this.props
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={['#d97bff', '#45adff']}
          style={styles.gradientIcon}
        >
          <Image source={icon} style={styles.icon} />
        </LinearGradient>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: metrics.icon_action_button_container_width,
    height: metrics.icon_action_button_container_height,
  },
  gradientIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: metrics.icon_action_button_gradient_icon_width,
    height: metrics.icon_action_button_gradient_icon_height,
    borderRadius: metrics.icon_action_button_gradient_icon_border_radius,
    marginBottom: metrics.icon_action_button_gradient_icon_margin_bottom,
  },
  icon: {
    tintColor: colors.white,
    width: metrics.icon_action_button_icon_width,
    height: metrics.icon_action_button_icon_height,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
})
