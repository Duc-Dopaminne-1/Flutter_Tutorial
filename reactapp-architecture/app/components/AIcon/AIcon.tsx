import { colors, metrics } from '@/vars'
import React from 'react'
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

export type AIconProps = {
  source: ImageSourcePropType
  color?: string
  spacer?: boolean
  spaceSize?: number
  iconStyle?: StyleProp<ImageStyle>
  size?: number
} & TouchableOpacityProps

export const AIcon: React.SFC<AIconProps> = ({
  source,
  color,
  spacer,
  spaceSize,
  iconStyle,
  size,
  ...rest
}) => {
  return (
    <TouchableOpacity {...rest}>
      <Image
        source={source}
        style={[
          styles.icon,
          {
            tintColor: color,
            marginLeft: spacer ? spaceSize : 0,
            height: size,
            width: size,
          },
          iconStyle,
        ]}
      />
    </TouchableOpacity>
  )
}

AIcon.defaultProps = {
  color: colors.primary_blue,
  spacer: false,
  spaceSize: metrics.modal_header_padding_btw_icon,
  size: 15,
}

const styles = StyleSheet.create<any>({
  icon: {
    height: metrics.modal_header_icon_size,
    width: metrics.modal_header_icon_size,
    tintColor: colors.accent,
  },
})
