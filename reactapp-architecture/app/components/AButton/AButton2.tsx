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
  title: string
  iconLeft: ImageRequireSource
  onPress: () => void

  iconStyle?: StyleProp<ImageStyle>
  textStyle?: StyleProp<TextStyle>
}

export class AButton2 extends React.PureComponent<AButtonProps> {
  render() {
    const { onPress, iconLeft, title, iconStyle, textStyle } = this.props

    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image source={iconLeft} style={[styles.icon, iconStyle]} />

        <Text style={[styles.text, textStyle]} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    paddingVertical: metrics.padding_horizontal,
    alignItems: 'center',
  },
  icon: {
    height: metrics.icon_size,
    width: metrics.icon_size,
    tintColor: colors.blue_light_grey,
  },
  text: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
    marginLeft: metrics.keylines_screen_profile_title_margin,
  },
})
