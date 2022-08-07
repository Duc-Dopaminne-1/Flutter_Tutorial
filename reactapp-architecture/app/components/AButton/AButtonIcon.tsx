import React from 'react'
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { colors } from '@/vars'

export type AButtonProps = {
  containerStyle?: StyleProp<ViewStyle>
  onPress(): void
  icon: ImageRequireSource
  iconStyle?: StyleProp<ImageStyle>
}

export class AButtonIcon extends React.PureComponent<AButtonProps> {
  render() {
    const { containerStyle, onPress, icon, iconStyle } = this.props

    return (
      <TouchableOpacity style={containerStyle} onPress={onPress}>
        <Image
          source={icon}
          resizeMode={'contain'}
          style={[styles.icon, iconStyle]}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create<any>({
  icon: {
    height: 24,
    width: 24,
    tintColor: colors.primary_blue,
  },
})
